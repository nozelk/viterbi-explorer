import { defineConfig } from "vite";
import { resolve } from "node:path";

// Repository name on GitHub Pages; served at https://nozelk.github.io/viterbi-explorer/
const REPO_BASE = "/viterbi-explorer/";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? REPO_BASE : "/",
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        demo: resolve(__dirname, "demo.html"),
        primeri: resolve(__dirname, "primeri.html"),
        markov: resolve(__dirname, "teorija/markovske-verige.html"),
        hmm: resolve(__dirname, "teorija/hmm.html"),
        viterbi: resolve(__dirname, "teorija/viterbi.html"),
      },
    },
  },
});
