import { fetchRecentRosterChanges, TIER1_LEAGUES, TIER2_LEAGUES } from "./leaguepedia";
import { upsertNews } from "./db";

const RSS_SOURCES = [
  { url: "https://dotesports.com/league-of-legends/feed", source: "Dot Esports", region: null },
  { url: "https://dotesports.com/feed",                   source: "Dot Esports", region: null },
];

interface RSSItem {
  title: string; link: string; pubDate: string;
  description: string; author?: string;
}

function parseRSSXML(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const re = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const b = m[1];
    const extract = (tag: string) => {
      const r = b.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\/${tag}>`));
      return ((r?.[1] ?? r?.[2]) || "").trim();
    };
    const title = extract("title").replace(/<[^>]*>/g, "").trim();
    const linkAttr = (b.match(/<link href="([^"]+)"/) ?? [])[1] ?? "";
    const link  = extract("link") || linkAttr;
    const pub   = extract("pubDate") || extract("published") || extract("updated");
    const desc  = extract("description") || extract("summary") || (extract("content:encoded") || extract("content"));
    const auth  = extract("author") || extract("dc:creator");
    if (title || link) items.push({
      title,
      link:        link.trim(),
      pubDate:     pub,
      description: desc.replace(/<[^>]*>/g, "").slice(0, 600),
      author:      auth || undefined,
    });
  }
  return items;
}

async function fetchRSS(url: string): Promise<RSSItem[]> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "DME-Scout/1.0" }, next: { revalidate: 0 } });
    if (!r.ok) return [];
    return parseRSSXML(await r.text());
  } catch { return []; }
}

async function fetchTwitterTimeline(): Promise<{ title: string; link: string; pubDate: string; description: string; author: string }[]> {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) return [];
  // Scout accounts: Brieuc Seeger, Travis Gafford, Wooxy, league accounts
  const accounts = ["brieucseeger","TravisGafford","Wooxy_","lolesports","LCK","LEC","NaEsports","LPL_English"];
  const results: { title: string; link: string; pubDate: string; description: string; author: string }[] = [];
  for (const handle of accounts.slice(0, 4)) { // limit to avoid rate limits
    try {
      const r = await fetch(
        `https://api.twitter.com/2/tweets/search/recent?query=from:${handle}+league+esport&max_results=10&tweet.fields=created_at,text`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!r.ok) continue;
      const json = await r.json() as { data?: { id: string; text: string; created_at?: string }[] };
      for (const t of json.data ?? []) {
        results.push({
          title:       t.text.slice(0, 100),
          link:        `https://twitter.com/${handle}/status/${t.id}`,
          pubDate:     t.created_at ?? new Date().toISOString(),
          description: t.text,
          author:      handle,
        });
      }
    } catch {}
  }
  return results;
}

const ALL_LEAGUES = [...TIER1_LEAGUES, ...TIER2_LEAGUES];
const TYPE_KEYWORDS: [string, string[]][] = [
  ["transfer",    ["signs","joins","acquired","transfers","moves to","picked up","released","parts ways","farewell"]],
  ["contract",    ["contract","extension","renewal","deal","retained","signed for"]],
  ["injury",      ["injury","injured","health","medical","surgery","rehab","recovery"]],
  ["performance", ["performance","mvp","best","rookie","award","all-pro","player of"]],
];

function classifyArticle(title: string, desc: string): string {
  const text = (title + " " + desc).toLowerCase();
  for (const [type, kws] of TYPE_KEYWORDS) {
    if (kws.some((k) => text.includes(k))) return type;
  }
  return "general";
}

function extractTags(title: string, desc: string, proPlayerIds: string[]) {
  const text = title + " " + desc;
  const player_tags = proPlayerIds.filter((id) => text.includes(id)).slice(0, 5);
  const league_tags = ALL_LEAGUES.filter((l) => text.toUpperCase().includes(l)).slice(0, 3);
  return { player_tags, team_tags: [] as string[], league_tags };
}

export async function fetchAllNews(proPlayerIds: string[] = []): Promise<{ added: number }> {
  let added = 0;

  // RSS feeds
  for (const feed of RSS_SOURCES) {
    const items = await fetchRSS(feed.url);
    for (const item of items) {
      if (!item.title || !item.link) continue;
      const tags = extractTags(item.title, item.description, proPlayerIds);
      upsertNews({
        title:       item.title,
        content:     item.description || null,
        url:         item.link,
        source:      feed.source,
        author:      item.author ?? null,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        ...tags,
        article_type: classifyArticle(item.title, item.description),
        region:       feed.region,
      });
      added++;
    }
  }

  // Leaguepedia roster changes as news
  try {
    const changes = await fetchRecentRosterChanges(80);
    for (const c of changes) {
      if (!c.player || !c.date) continue;
      const dir = c.direction?.toLowerCase();
      const title = dir === "joins"
        ? `${c.player} joins ${c.team2 || c.team}`
        : dir === "leaves"
        ? `${c.player} leaves ${c.team}`
        : `${c.player} roster change — ${c.team}`;
      const url = `https://lol.fandom.com/wiki/${encodeURIComponent(c.player)}`;
      const tags = extractTags(title, "", proPlayerIds);
      upsertNews({
        title,
        content:     `Roster change: ${c.player} (${c.role || "?"}) | ${c.team} → ${c.team2 || "Free Agent"}`,
        url,
        source:      "Leaguepedia",
        author:      null,
        published_at: c.date ? new Date(c.date).toISOString() : null,
        ...tags,
        player_tags: [c.player, ...tags.player_tags].filter(Boolean).slice(0, 5),
        article_type: "transfer",
        region:      null,
      });
      added++;
    }
  } catch (e) { console.error("[news] roster changes error:", e); }

  // Twitter (optional)
  try {
    const tweets = await fetchTwitterTimeline();
    for (const t of tweets) {
      const tags = extractTags(t.title, t.description, proPlayerIds);
      upsertNews({
        title:       t.title,
        content:     t.description,
        url:         t.link,
        source:      `Twitter/${t.author}`,
        author:      t.author,
        published_at: t.pubDate,
        ...tags,
        article_type: classifyArticle(t.title, t.description),
        region:      null,
      });
      added++;
    }
  } catch {}

  return { added };
}
