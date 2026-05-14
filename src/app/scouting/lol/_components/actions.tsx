"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2, RefreshCw, Upload } from "lucide-react";
import { ErrorBanner } from "./scout-ui";

type ApiResponse<T> = { ok: boolean; data?: T; error?: string };

export function ImportPlayerForm({ defaultRiotId }: { defaultRiotId?: string } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRiotId = defaultRiotId ?? searchParams.get("riotId") ?? "Karsiak#AURA";
  const [riotId, setRiotId] = useState(initialRiotId);
  const [region, setRegion] = useState("NA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/staff/scouting/lol/import-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riotId, region }),
      });
      const json = (await response.json()) as ApiResponse<{ playerId: string }>;
      if (!json.ok || !json.data) throw new Error(json.error ?? "Import impossible");
      router.push(`/scouting/lol/players/${json.data.playerId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur import");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_8rem_auto]">
        <input value={riotId} onChange={(event) => setRiotId(event.target.value)} className="rounded-md border border-white/[0.08] bg-black/35 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500/45" placeholder="Karsiak#AURA" />
        <select value={region} onChange={(event) => setRegion(event.target.value)} className="rounded-md border border-white/[0.08] bg-black/35 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500/45">
          {["NA", "EUW", "EUNE", "KR", "BR"].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button disabled={loading || !riotId.includes("#")} className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-45">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Importer
        </button>
      </div>
      {error && <ErrorBanner message={error} />}
    </form>
  );
}

export function ResyncButton({ playerId }: { playerId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resync() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/staff/scouting/lol/players/${playerId}/resync`, { method: "POST" });
      const json = (await response.json()) as ApiResponse<unknown>;
      if (!json.ok) throw new Error(json.error ?? "Resync impossible");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur resync");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={resync} disabled={loading} className="inline-flex items-center gap-2 rounded-md border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/65 transition hover:bg-white/[0.08] disabled:opacity-50">
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        Resync
      </button>
      {error && <div className="mt-3"><ErrorBanner message={error} /></div>}
    </div>
  );
}

export function LadderSyncForm() {
  const router = useRouter();
  const [region, setRegion] = useState("NA");
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/staff/scouting/lol/sync-ladder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, limit }),
      });
      const json = (await response.json()) as ApiResponse<{ saved: number; requested: number; region: string }>;
      if (!json.ok || !json.data) throw new Error(json.error ?? "Sync impossible");
      setResult(`${json.data.saved}/${json.data.requested} joueurs synchronisés sur ${json.data.region}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur sync");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[8rem_8rem_auto]">
        <select value={region} onChange={(event) => setRegion(event.target.value)} className="rounded-md border border-white/[0.08] bg-black/35 px-3 py-2.5 text-sm text-white outline-none">
          {["NA", "EUW", "EUNE", "KR", "BR"].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <input type="number" min={1} max={300} value={limit} onChange={(event) => setLimit(Number(event.target.value))} className="rounded-md border border-white/[0.08] bg-black/35 px-3 py-2.5 text-sm text-white outline-none" />
        <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-500 disabled:opacity-45">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Sync ladder
        </button>
      </div>
      {result && <div className="rounded-lg border border-emerald-500/25 bg-emerald-950/20 p-3 text-sm text-emerald-200">{result}</div>}
      {error && <ErrorBanner message={error} />}
    </form>
  );
}
