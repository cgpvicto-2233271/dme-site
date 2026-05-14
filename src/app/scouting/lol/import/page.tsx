import { Suspense } from "react";
import { ImportPlayerForm } from "../_components/actions";
import { ScoutCard, ScoutShell } from "../_components/scout-ui";

export default function ImportPage() {
  return (
    <ScoutShell>
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-300/75">Import Riot</p>
        <h1 className="mt-2 text-3xl font-black text-white">Importer un joueur</h1>
        <p className="mt-2 text-sm text-white/40">Le profil n&apos;est créé qu&apos;après résolution Account-V1 et PUUID valide.</p>
      </div>
      <ScoutCard className="p-5">
        <Suspense>
          <ImportPlayerForm />
        </Suspense>
      </ScoutCard>
    </ScoutShell>
  );
}
