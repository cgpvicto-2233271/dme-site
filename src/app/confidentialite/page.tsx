"use client";

import { Liste, PageLegale, Tableau, type SectionLegale } from "@/components/PageLegale";
import { EMAIL_CONTACT } from "@/lib/marque";

const Courriel = () => (
  <a href={`mailto:${EMAIL_CONTACT}`} className="font-semibold text-white underline underline-offset-4">
    {EMAIL_CONTACT}
  </a>
);

/* Politique redigee d'apres ce que le site fait reellement (audit du code,
   septembre 2026) et les exigences de la Loi 25 (Quebec) et de la LPRPDE. */
const SECTIONS: SectionLegale[] = [
  {
    titre: { fr: "Qui est responsable", en: "Who is responsible" },
    contenu: (lang) =>
      lang === "en" ? (
        <>
          <p>DME is an esports organisation based in Québec, Canada. This policy explains which personal information we collect through this site, why, and what you can do about it.</p>
          <p>The person in charge of the protection of personal information is DME&apos;s leadership (co-owners). You can reach them at <Courriel />.</p>
        </>
      ) : (
        <>
          <p>DME est une organisation esport basée au Québec, Canada. Cette politique explique quels renseignements personnels nous recueillons par ce site, pourquoi, et ce que vous pouvez faire à ce sujet.</p>
          <p>La personne responsable de la protection des renseignements personnels est la direction de DME (copropriétaires). Vous pouvez la joindre à <Courriel />.</p>
        </>
      ),
  },
  {
    titre: { fr: "Ce que nous recueillons, et pourquoi", en: "What we collect, and why" },
    contenu: (lang) => (
      <Tableau
        entetes={lang === "en" ? ["When", "Information", "Purpose"] : ["Quand", "Renseignements", "Finalité"]}
        lignes={
          lang === "en"
            ? [
                ["Member or staff sign-in", "Email address, access role", "Give access to internal areas"],
                ["LFT registration", "Riot ID, region, roles, availability, languages, social handles (optional), bio", "Show your profile in the LFT list; public game stats are fetched from the Riot API"],
                ["Player or staff application", "The message you send us on Discord (username, rank, role, availability, profile links)", "Evaluate applications; the message stays in Discord"],
                ["Internal scouting (staff only)", "Public game data of players (Riot ID, rank, match history), staff notes", "Scout players for our rosters"],
                ["Any visit", "Technical logs from our host (IP address, browser)", "Security and proper operation of the site"],
              ]
            : [
                ["Connexion membre ou staff", "Adresse courriel, rôle d'accès", "Donner accès aux espaces internes"],
                ["Inscription LFT", "Riot ID, région, rôles, disponibilités, langues, réseaux (facultatifs), bio", "Afficher votre profil dans la liste LFT ; les statistiques publiques de jeu sont récupérées via l'API Riot"],
                ["Candidature joueur ou staff", "Le message que vous nous envoyez sur Discord (pseudo, rang, rôle, disponibilités, liens de profil)", "Évaluer les candidatures ; le message reste dans Discord"],
                ["Scouting interne (staff seulement)", "Données de jeu publiques de joueurs (Riot ID, rang, historique), notes du staff", "Repérer des joueurs pour nos rosters"],
                ["Toute visite", "Journaux techniques de l'hébergeur (adresse IP, navigateur)", "Sécurité et bon fonctionnement du site"],
              ]
        }
      />
    ),
  },
  {
    titre: { fr: "Témoins (cookies) et stockage local", en: "Cookies and local storage" },
    contenu: (lang) => (
      <>
        <p>
          {lang === "en"
            ? "We use no advertising or analytics cookies, and no tracking pixels. Only what the site needs to work:"
            : "Nous n'utilisons aucun témoin publicitaire ou analytique, ni aucun pixel de suivi. Seulement ce dont le site a besoin pour fonctionner :"}
        </p>
        <Tableau
          entetes={lang === "en" ? ["Name", "Type", "Purpose", "Duration"] : ["Nom", "Type", "Finalité", "Durée"]}
          lignes={
            lang === "en"
              ? [
                  ["dme_access", "Essential cookie (signed, httpOnly)", "Keeps you signed in", "30 days"],
                  ["next-auth.*", "Essential cookies", "Discord sign-in, if used", "Session"],
                  ["dme-lang", "Local storage", "Remembers your language", "Until deleted"],
                  ["dme_avis_temoins", "Local storage", "Remembers that you closed this notice", "Until deleted"],
                  ["dme_intro", "Session storage", "Plays the intro once per visit", "Tab closed"],
                ]
              : [
                  ["dme_access", "Témoin essentiel (signé, httpOnly)", "Garder votre session ouverte", "30 jours"],
                  ["next-auth.*", "Témoins essentiels", "Connexion Discord, si utilisée", "Session"],
                  ["dme-lang", "Stockage local", "Retenir votre langue", "Jusqu'à suppression"],
                  ["dme_avis_temoins", "Stockage local", "Retenir que vous avez fermé l'avis", "Jusqu'à suppression"],
                  ["dme_intro", "Stockage de session", "Jouer l'intro une fois par visite", "Fermeture de l'onglet"],
                ]
          }
        />
        <p>
          {lang === "en"
            ? "Staff tools also keep working notes in the browser's local storage; they never leave the device. Video thumbnails are loaded from YouTube (i.ytimg.com), and videos open on YouTube, which applies its own policy."
            : "Les outils du staff conservent aussi des notes de travail dans le stockage local du navigateur ; elles ne quittent jamais l'appareil. Les vignettes vidéo sont chargées depuis YouTube (i.ytimg.com), et les vidéos s'ouvrent sur YouTube, qui applique sa propre politique."}
        </p>
      </>
    ),
  },
  {
    titre: { fr: "Partage et fournisseurs", en: "Sharing and service providers" },
    contenu: (lang) => (
      <>
        <p>
          {lang === "en"
            ? "We never sell or rent your personal information. We only share it with the providers the site needs, which may process it outside Québec (mainly in the United States):"
            : "Nous ne vendons ni ne louons jamais vos renseignements personnels. Nous les partageons seulement avec les fournisseurs dont le site a besoin, qui peuvent les traiter hors du Québec (principalement aux États-Unis) :"}
        </p>
        <Liste
          items={
            lang === "en"
              ? [
                  "Vercel: hosting and technical logs",
                  "Our database provider: storage of LFT profiles and scouting data",
                  "Riot Games: public game data through the official API",
                  "Discord: sign-in if you choose it, and applications sent by direct message",
                ]
              : [
                  "Vercel : hébergement et journaux techniques",
                  "Notre fournisseur de base de données : conservation des profils LFT et des données de scouting",
                  "Riot Games : données de jeu publiques via l'API officielle",
                  "Discord : connexion si vous la choisissez, et candidatures envoyées en message privé",
                ]
          }
        />
        <p>
          {lang === "en"
            ? "Before any transfer outside Québec, we make sure the information receives adequate protection, as required by Law 25. We may also disclose information when the law requires it."
            : "Avant tout transfert hors du Québec, nous nous assurons que les renseignements bénéficient d'une protection adéquate, comme l'exige la Loi 25. Nous pouvons aussi communiquer des renseignements lorsque la loi l'exige."}
        </p>
      </>
    ),
  },
  {
    titre: { fr: "Conservation", en: "Retention" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "We keep personal information only as long as needed for the purpose it was collected for, then delete or anonymise it. You can ask us at any time to delete your LFT profile."
          : "Nous conservons les renseignements personnels seulement le temps nécessaire à la finalité pour laquelle ils ont été recueillis, puis nous les supprimons ou les anonymisons. Vous pouvez nous demander en tout temps de supprimer votre profil LFT."}
      </p>
    ),
  },
  {
    titre: { fr: "Sécurité", en: "Security" },
    contenu: (lang) => (
      <Liste
        items={
          lang === "en"
            ? [
                "Encrypted connection (HTTPS) enforced on every page",
                "Signed, httpOnly session cookie that cannot be forged or read by scripts",
                "Staff access protected by a password verified on the server, and internal tools closed to the public",
                "Security headers (content policy, anti-clickjacking) and no third-party trackers",
                "Access to personal information limited to the staff who need it",
              ]
            : [
                "Connexion chiffrée (HTTPS) imposée sur toutes les pages",
                "Témoin de session signé et httpOnly, impossible à falsifier ou à lire par un script",
                "Accès staff protégé par un mot de passe vérifié côté serveur, et outils internes fermés au public",
                "En-têtes de sécurité (politique de contenu, anti-clickjacking) et aucun traceur tiers",
                "Accès aux renseignements personnels limité au staff qui en a besoin",
              ]
        }
      />
    ),
  },
  {
    titre: { fr: "Vos droits", en: "Your rights" },
    contenu: (lang) =>
      lang === "en" ? (
        <>
          <p>Under Québec&apos;s Law 25 and Canadian law, you may at any time:</p>
          <Liste items={["access the information we hold about you", "have it corrected", "withdraw your consent", "ask for it to be deleted or de-indexed", "receive it in a structured, commonly used format"]} />
          <p>Write to <Courriel />. We answer within 30 days. If you are not satisfied, you can file a complaint with the Commission d&apos;accès à l&apos;information du Québec.</p>
        </>
      ) : (
        <>
          <p>En vertu de la Loi 25 et des lois canadiennes, vous pouvez en tout temps :</p>
          <Liste items={["accéder aux renseignements que nous détenons à votre sujet", "les faire rectifier", "retirer votre consentement", "demander leur suppression ou leur désindexation", "les recevoir dans un format structuré et couramment utilisé"]} />
          <p>Écrivez à <Courriel />. Nous répondons dans un délai de 30 jours. Si la réponse ne vous satisfait pas, vous pouvez porter plainte auprès de la Commission d&apos;accès à l&apos;information du Québec.</p>
        </>
      ),
  },
  {
    titre: { fr: "Mineurs", en: "Minors" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "Many players in our community are young. Information about a person under 14 is only collected with the consent of a parent or guardian. If you believe we hold such information without consent, contact us and we will delete it."
          : "Plusieurs joueurs de notre communauté sont jeunes. Les renseignements d'une personne de moins de 14 ans ne sont recueillis qu'avec le consentement d'un parent ou tuteur. Si vous croyez que nous détenons de tels renseignements sans consentement, écrivez-nous et nous les supprimerons."}
      </p>
    ),
  },
  {
    titre: { fr: "Incidents de confidentialité", en: "Privacy incidents" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "If an incident presents a risk of serious harm, we notify the people concerned and the Commission d'accès à l'information, and we keep a register of incidents, as required by law."
          : "Si un incident présente un risque de préjudice sérieux, nous avisons les personnes concernées et la Commission d'accès à l'information, et nous tenons un registre des incidents, comme l'exige la loi."}
      </p>
    ),
  },
  {
    titre: { fr: "Modifications", en: "Changes" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "We may update this policy. The date at the top of the page shows the latest version; significant changes are announced on our Discord."
          : "Nous pouvons mettre cette politique à jour. La date en haut de page indique la version en vigueur ; les changements importants sont annoncés sur notre Discord."}
      </p>
    ),
  },
];

export default function Confidentialite() {
  return (
    <PageLegale
      titre={{ fr: "Politique de confidentialité.", en: "Privacy policy." }}
      intro={{
        fr: "Ce que nous recueillons, pourquoi, avec qui c'est partagé, et comment exercer vos droits. Sans jargon.",
        en: "What we collect, why, who it is shared with, and how to exercise your rights. No jargon.",
      }}
      miseAJour={{ fr: "Mise à jour : 29 septembre 2026", en: "Updated: September 29, 2026" }}
      sections={SECTIONS}
    />
  );
}
