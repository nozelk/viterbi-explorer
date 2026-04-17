// Centralized URL builders. Vite rewrites import.meta.env.BASE_URL at build time
// based on vite.config.ts `base` (either "/" for dev or "/viterbi-explorer/" for Pages).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "") + "/";

export const PATHS = {
  home: BASE,
  demo: BASE + "demo.html",
  primeri: BASE + "primeri.html",
  markov: BASE + "teorija/markovske-verige.html",
  hmm: BASE + "teorija/hmm.html",
  viterbi: BASE + "teorija/viterbi.html",
  github: "https://github.com/nozelk/viterbi-explorer",
} as const;
