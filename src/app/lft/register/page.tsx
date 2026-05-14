"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, AlertCircle, CheckCircle, Loader2, ChevronDown } from "lucide-react";
import type { Region, Role } from "@prisma/client";

const REGIONS: Region[] = ["NA", "EUW", "EUNE", "KR", "BR", "LAN", "LAS", "OCE", "JP", "TR", "RU"];
const ROLES: Role[] = ["TOP", "JUNGLE", "MID", "BOT", "SUPPORT"];
const ROLE_LABELS: Record<Role, string> = { TOP: "Top", JUNGLE: "Jungle", MID: "Mid", BOT: "ADC", SUPPORT: "Support" };
const AVAIL_OPTIONS = [
  { value: "immediate", label: "Disponible maintenant" },
  { value: "2_weeks", label: "Dans 2 semaines" },
  { value: "1_month", label: "Dans 1 mois" },
  { value: "flexible", label: "Flexible" },
];
const EXP_OPTIONS = [
  { value: "amateur", label: "Amateur" },
  { value: "semi_pro", label: "Semi-professionnel" },
  { value: "pro", label: "Professionnel" },
];

function Field({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        {label}{required && <span className="text-[#dc2626] ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-600">{hint}</p>}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#dc2626]/50 transition-colors ${props.className ?? ""}`}
    />
  );
}

function Select({ value, onChange, children }: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-[#dc2626]/50 cursor-pointer">
        {children}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
    </div>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#dc2626]/50 resize-none transition-colors"
    />
  );
}

export default function LftRegisterPage() {
  const router = useRouter();

  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [region, setRegion] = useState<Region>("NA");
  const [role, setRole] = useState<Role | "">("");
  const [secondaryRole, setSecondaryRole] = useState<Role | "">("");
  const [availability, setAvailability] = useState("");
  const [experience, setExperience] = useState("");
  const [languages, setLanguages] = useState<string[]>(["Français"]);
  const [discord, setDiscord] = useState("");
  const [twitter, setTwitter] = useState("");
  const [twitch, setTwitch] = useState("");
  const [bio, setBio] = useState("");
  const [lookingFor, setLookingFor] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName || !tagLine || !region) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/lft/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: gameName.trim(),
          tagLine: tagLine.trim().replace(/^#/, ""),
          region,
          role: role || undefined,
          secondaryRole: secondaryRole || undefined,
          availability: availability || undefined,
          experience: experience || undefined,
          languages,
          discord: discord.trim() || undefined,
          twitter: twitter.trim() || undefined,
          twitch: twitch.trim() || undefined,
          bio: bio.trim() || undefined,
          lookingFor: lookingFor.trim() || undefined,
        }),
      });

      const data = await res.json() as { ok?: boolean; error?: string };

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Erreur inconnue");
      }

      setSuccess(true);
      setTimeout(() => router.push("/lft"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <CheckCircle size={48} className="text-[#22c55e] mx-auto mb-4" />
        <h2 className="text-xl font-black text-white mb-2">Profil enregistré !</h2>
        <p className="text-gray-500 text-sm">Ton Riot ID a été vérifié. Tu apparais maintenant sur le LFT Board.</p>
        <p className="text-gray-600 text-xs mt-2">Redirection en cours…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#dc2626] flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-black text-white">Je suis LFT</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Enregistre ton profil League of Legends. Ton Riot ID sera validé en temps réel.
        </p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        {/* Riot ID */}
        <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Riot ID</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Game Name" required>
              <Input
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="GameName"
                maxLength={16}
                required
              />
            </Field>
            <Field label="Tag" required hint="Sans le #">
              <Input
                value={tagLine}
                onChange={(e) => setTagLine(e.target.value.replace(/^#/, ""))}
                placeholder="EUW"
                maxLength={5}
                required
              />
            </Field>
          </div>
          <Field label="Région" required>
            <Select value={region} onChange={(v) => setRegion(v as Region)}>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </Select>
          </Field>
          <p className="text-[11px] text-gray-600 flex items-center gap-1.5">
            <Shield size={10} className="text-[#dc2626]" />
            Ton Riot ID sera validé via l&apos;API Riot officielle. Seules les données publiques sont récupérées.
          </p>
        </div>

        {/* Rôles */}
        <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Poste</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Rôle principal">
              <Select value={role} onChange={(v) => setRole(v as Role | "")}>
                <option value="">— Sélectionner —</option>
                {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </Select>
            </Field>
            <Field label="Rôle secondaire">
              <Select value={secondaryRole} onChange={(v) => setSecondaryRole(v as Role | "")}>
                <option value="">— Aucun —</option>
                {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </Select>
            </Field>
          </div>
        </div>

        {/* Disponibilité */}
        <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Disponibilité & Expérience</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Disponibilité">
              <Select value={availability} onChange={setAvailability}>
                <option value="">— Sélectionner —</option>
                {AVAIL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
            <Field label="Niveau">
              <Select value={experience} onChange={setExperience}>
                <option value="">— Sélectionner —</option>
                {EXP_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Langues" hint="Sépare par des virgules (ex: Français, English)">
            <Input
              value={languages.join(", ")}
              onChange={(e) => setLanguages(e.target.value.split(",").map((l) => l.trim()).filter(Boolean))}
              placeholder="Français, English"
            />
          </Field>
        </div>

        {/* Contact */}
        <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Contact</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Discord" hint="pseudo#1234 ou @pseudo">
              <Input value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="pseudo" />
            </Field>
            <Field label="Twitter / X">
              <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@pseudo" />
            </Field>
          </div>
          <Field label="Twitch">
            <Input value={twitch} onChange={(e) => setTwitch(e.target.value)} placeholder="pseudotwitch" />
          </Field>
        </div>

        {/* Bio */}
        <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Présentation</h2>
          <Field label="À propos de toi" hint="Max 500 caractères">
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={500} placeholder="Décris ton style de jeu, tes points forts, ton parcours…" />
          </Field>
          <Field label="Ce que je recherche" hint="Type d'équipe, objectifs, schedule…">
            <Textarea value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} rows={3} maxLength={500} placeholder="Je cherche une team sérieuse pour des ligues amateures, disponible le soir en semaine…" />
          </Field>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            <AlertCircle size={14} className="text-red-400 shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !gameName || !tagLine || !region}
          className="w-full py-3 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-40 text-white font-black text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Validation Riot ID en cours…
            </>
          ) : (
            <>
              <Shield size={14} />
              Valider et publier mon profil
            </>
          )}
        </button>
      </form>
    </div>
  );
}
