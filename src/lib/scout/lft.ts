import { fetchFreeAgents, parseSoloqueueIds, guessLeagueFromResidency } from "./leaguepedia";
import { upsertLFTSignal, clearOldLFTSignals } from "./db";

interface RedditPost {
  title: string;
  selftext: string;
  permalink: string;
  author: string;
  created_utc: number;
  subreddit: string;
}

const LFT_KEYWORDS = /\b(lft|looking for team|free agent|available|open to offers)\b/i;
const PLAYER_NAME_HINT = /\b([A-Za-z][A-Za-z0-9]{2,14})\b/g;

async function fetchRedditLFT(subreddit: string): Promise<RedditPost[]> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/search.json?q=LFT+esport+league+of+legends&sort=new&t=month&limit=25&restrict_sr=1`;
    const r = await fetch(url, { headers: { "User-Agent": "DME-Scout/1.0" }, next: { revalidate: 0 } });
    if (!r.ok) return [];
    const json = await r.json() as { data?: { children?: { data: RedditPost }[] } };
    return json.data?.children?.map((c) => c.data) ?? [];
  } catch {
    return [];
  }
}

async function fetchTwitterLFT(): Promise<{ player_name: string; content: string; url: string; confidence: string }[]> {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) return [];
  try {
    const query = encodeURIComponent('("LFT" OR "looking for team" OR "free agent") (league esport OR lol esport) lang:en -is:retweet');
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=50&tweet.fields=created_at,author_id,text&expansions=author_id&user.fields=username,name`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 0 } });
    if (!r.ok) return [];
    const json = await r.json() as {
      data?: { id: string; text: string; author_id: string }[];
      includes?: { users?: { id: string; username: string; name: string }[] };
    };
    const users = new Map((json.includes?.users ?? []).map((u) => [u.id, u]));
    return (json.data ?? []).map((t) => {
      const user = users.get(t.author_id);
      const namesInText = t.text.match(PLAYER_NAME_HINT) ?? [];
      return {
        player_name: namesInText[0] ?? user?.name ?? user?.username ?? "Unknown",
        content: t.text.slice(0, 500),
        url: `https://twitter.com/${user?.username ?? "i"}/status/${t.id}`,
        confidence: "rumor" as const,
      };
    });
  } catch {
    return [];
  }
}

export async function aggregateLFTSignals(): Promise<{ added: number; sources: Record<string, number> }> {
  const counts: Record<string, number> = {};

  // 1. Leaguepedia free agents — highest confidence
  try {
    const fas = await fetchFreeAgents();
    for (const p of fas) {
      if (!p.player_id) continue;
      const { league } = guessLeagueFromResidency(p.residency, p.team);
      upsertLFTSignal({
        player_name: p.player_id,
        player_id:   p.player_id,
        source:      "leaguepedia",
        source_url:  `https://lol.fandom.com/wiki/${encodeURIComponent(p.player_id)}`,
        content:     `${p.player_id} (ex: ${p.team_last || "N/A"}) appears as free agent on Leaguepedia`,
        confidence:  "verified",
        role:        p.role || null,
        region:      p.residency || null,
        league:      league || null,
      });
      counts["leaguepedia"] = (counts["leaguepedia"] ?? 0) + 1;
    }
  } catch (e) {
    console.error("[LFT] Leaguepedia error:", e);
  }

  // 2. Reddit — medium confidence
  const redditSubs = ["leagueoflegends", "lolesports", "lolpro"];
  for (const sub of redditSubs) {
    try {
      const posts = await fetchRedditLFT(sub);
      for (const post of posts) {
        const combined = (post.title + " " + post.selftext).toLowerCase();
        if (!LFT_KEYWORDS.test(combined)) continue;
        const names = post.title.match(PLAYER_NAME_HINT) ?? [];
        const playerName = names.find((n) => n.length > 2) ?? post.author;
        upsertLFTSignal({
          player_name: playerName,
          player_id:   null,
          source:      "reddit",
          source_url:  `https://reddit.com${post.permalink}`,
          content:     (post.title + " — " + post.selftext).slice(0, 500),
          confidence:  "rumor",
          role:        null,
          region:      null,
          league:      null,
        });
        counts["reddit"] = (counts["reddit"] ?? 0) + 1;
      }
    } catch {}
  }

  // 3. Twitter (optional)
  try {
    const tweets = await fetchTwitterLFT();
    for (const t of tweets) {
      upsertLFTSignal({ player_name: t.player_name, source: 'twitter', source_url: t.url, content: t.content, confidence: t.confidence, player_id: null, role: null, region: null, league: null });
      counts["twitter"] = (counts["twitter"] ?? 0) + 1;
    }
  } catch {}

  clearOldLFTSignals(60);
  const added = Object.values(counts).reduce((a, b) => a + b, 0);
  return { added, sources: counts };
}
