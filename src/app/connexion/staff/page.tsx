import Link from "next/link";

export default function StaffPendingPage() {
  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL ?? "https://discord.gg/";

  return (
    <main className="min-h-screen text-white pt-24 pb-24">
      <div className="w-full max-w-xl mx-auto px-4">
        <section className="rounded-3xl border border-red-600/25 bg-white/5 backdrop-blur p-8">
          <h1 className="font-display text-3xl uppercase">
            Acces staff <span className="text-red-500">en attente</span>
          </h1>

          <p className="mt-3 text-white/70">
            Pour avoir le scouting complet (stats, notes, tracking interne), ouvre un ticket sur le Discord DME.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-xl border border-red-600/45 bg-black/25 hover:border-red-500 hover:text-red-300 transition"
            >
              Ouvrir le Discord DME
            </a>

            <Link
              href="/scouting"
              className="px-5 py-2 rounded-xl border border-white/15 bg-black/20 hover:border-white/25 transition"
            >
              Voir scouting simple
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-white/70 text-sm">
            Instruction: ouvre un ticket dans le salon support / access et indique ton email.
          </div>
        </section>
      </div>
    </main>
  );
}