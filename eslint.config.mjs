import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/* Flat config natif (ESLint 9+, pret pour ESLint 10). Plus de FlatCompat :
   eslint-config-next 16 exporte directement des configs plates. */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /* Le projet est strict : `any` est une erreur, pas un avertissement. */
      "@typescript-eslint/no-explicit-any": "error",
      /* Les apostrophes francaises dans le JSX sont legitimes. */
      "react/no-unescaped-entities": "off",
      /* Regles du React Compiler (react-hooks v7). Passees en avertissement,
         pas en erreur : un composant non conforme est simplement ignore par
         le compilateur (il n'est pas casse), et les 19 occurrences sont le
         motif « etat client au montage » (localStorage, curseur, intro) que
         la refonte reecrit en useSyncExternalStore. A repasser en "error"
         une fois la reconstruction terminee. */
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    ".next-verify/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "inspirations/**",
    "docs/reference/**",
    "src/generated/**",
    "scripts/**",
    /* Skills installees : des .cjs tiers, pas du code du site. */
    ".claude/**",
  ]),
]);
