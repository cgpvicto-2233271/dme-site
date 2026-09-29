import type { NextConfig } from "next";

const enDev = process.env.NODE_ENV !== "production";

/* En-tetes de securite, appliques a toutes les pages.
   La CSP n'autorise que les origines reellement utilisees : vignettes YouTube,
   icones Data Dragon (scouting), lecteur YouTube (VODs coaching). Next a
   besoin de scripts inline pour s'amorcer ; `unsafe-eval` et les websockets
   ne servent qu'au rechargement a chaud en developpement. */
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${enDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com https://ddragon.leagueoflegends.com",
  "font-src 'self' data:",
  `connect-src 'self'${enDev ? " ws: wss:" : ""}`,
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://discord.com",
  "frame-ancestors 'none'",
  ...(enDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const ENTETES_SECURITE = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  /* Ne pas annoncer la techno du serveur. */
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: ENTETES_SECURITE }];
  },

  /* Prisma, pg et better-sqlite3 restent des modules Node natifs cote serveur. */
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg", "better-sqlite3"],

  /* React Compiler, voie stable (Babel). Memoisation automatique : les pages
     d'affiches remontent beaucoup d'etat (feuille active, maintien, recadrage)
     et le compilateur evite les re-rendus en cascade sans useMemo manuel.
     Le port Rust (experimental.turbopackRustReactCompiler) est plus rapide
     mais annonce « pas recommande en production » — pas pour une fondation. */
  reactCompiler: true,

  /* Liens types : un href vers une route inexistante est une erreur de build,
     pas une 404 decouverte en prod. Utile pendant la reconstruction. */
  typedRoutes: true,

  images: {
    /* AVIF d'abord (~30 % plus leger que WebP), WebP en repli. */
    formats: ["image/avif", "image/webp"],
    /* Les affiches demandent une qualite plus haute que le 75 par defaut
       pour le duotone (les aplats rouges banding vite) ; le 60 sert aux
       vignettes de VOD. */
    qualities: [60, 75, 88],
    /* Tailles de device alignees sur les points de rupture de la direction :
       une affiche plein cadre en portrait, puis desktop. */
    deviceSizes: [390, 640, 828, 1080, 1200, 1440, 1920, 2560],
    remotePatterns: [
      /* Vignettes YouTube des VODs. */
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },

  /* Le site desactive lui-meme le lissage de defilement pendant les
     transitions de feuilles ; on garde le comportement Next 16 (pas de
     surcharge de scroll-behavior). */

  /* Programmes fermes (Rocket League, Marvel Rivals, 6Mans) : les anciennes
     adresses renvoient vers la page generale plutot que vers une 404. */
  async redirects() {
    return [
      { source: "/equipes/rocket-league/:path*", destination: "/equipes", permanent: true },
      { source: "/equipes/marvel-rivals/:path*", destination: "/equipes", permanent: true },
      { source: "/hall-of-fame/rocket-league", destination: "/hall-of-fame", permanent: true },
      { source: "/hall-of-fame/marvel-rivals", destination: "/hall-of-fame", permanent: true },
      { source: "/hall-of-fame/lol", destination: "/hall-of-fame", permanent: false },
      { source: "/hall-of-fame/valorant", destination: "/hall-of-fame", permanent: false },
      { source: "/6mans", destination: "/", permanent: true },
      /* Ancien systeme de scouting, remplace par /scouting/lol. */
      { source: "/scouting/database", destination: "/scouting/lol/players", permanent: false },
      { source: "/scouting/players/:path*", destination: "/scouting/lol/players", permanent: false },
      { source: "/scouting/joueur/:path*", destination: "/scouting/lol/players", permanent: false },
      { source: "/scouting/watchlist", destination: "/scouting/lol/watchlist", permanent: false },
      { source: "/scouting/pipeline", destination: "/scouting/lol/pipeline", permanent: false },
      { source: "/scouting/sources", destination: "/scouting/lol/sources", permanent: false },
      { source: "/scouting/comparer", destination: "/scouting/lol", permanent: false },
      { source: "/scouting/intel", destination: "/scouting/lol", permanent: false },
      { source: "/scouting/market", destination: "/scouting/lol", permanent: false },
      { source: "/scouting/lft", destination: "/scouting/lol", permanent: false },
      /* Doublon du coaching dans le scouting. */
      { source: "/scouting/lol/coaching/:path*", destination: "/coaching", permanent: false },
      { source: "/scouting/lol/coaching", destination: "/coaching", permanent: false },
      { source: "/coaching/analyst", destination: "/coaching/analysis", permanent: false },
      /* Coaching individuel retire du site. */
      { source: "/coach", destination: "/", permanent: false },
      { source: "/coach/:path*", destination: "/", permanent: false },
      /* Anciennes etapes d'acces, remplacees par /connexion. */
      { source: "/connexion/role", destination: "/connexion", permanent: false },
      { source: "/onboarding", destination: "/connexion", permanent: false },
      /* Un roster principal par jeu : les pages academie ne sont plus publiees. */
      { source: "/equipes/league-of-legends/academie", destination: "/equipes/league-of-legends", permanent: false },
      { source: "/equipes/league-of-legends/nacl", destination: "/equipes/league-of-legends", permanent: false },
      { source: "/equipes/valorant/academie", destination: "/equipes/valorant", permanent: false },
    ];
  },

  /* Les 3 imports lucide par page n'ont pas a tirer 1 500 icones. */
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;
