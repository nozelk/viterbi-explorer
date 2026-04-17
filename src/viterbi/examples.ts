import type { Example } from "./types";

export const EXAMPLE_KEYS = [
  "vreme",
  "sladoled",
  "razpolozenje",
  "borza",
] as const;

export type ExampleKey = (typeof EXAMPLE_KEYS)[number];

export const EXAMPLES: Record<ExampleKey, Example> = {
  vreme: {
    key: "vreme",
    states: ["Sunny", "Rainy"],
    obsAlphabet: ["Umbrella", "NoUmbrella"],
    startP: { Sunny: 0.6, Rainy: 0.4 },
    transP: {
      Sunny: { Sunny: 0.7, Rainy: 0.3 },
      Rainy: { Sunny: 0.4, Rainy: 0.6 },
    },
    emitP: {
      Sunny: { Umbrella: 0.1, NoUmbrella: 0.9 },
      Rainy: { Umbrella: 0.8, NoUmbrella: 0.2 },
    },
    obsSeq: ["NoUmbrella", "Umbrella", "Umbrella", "NoUmbrella"],
  },
  sladoled: {
    key: "sladoled",
    states: ["Hot", "Cold"],
    obsAlphabet: ["1", "2", "3"],
    startP: { Hot: 0.8, Cold: 0.2 },
    transP: {
      Hot: { Hot: 0.7, Cold: 0.3 },
      Cold: { Hot: 0.4, Cold: 0.6 },
    },
    emitP: {
      Hot: { "1": 0.2, "2": 0.4, "3": 0.4 },
      Cold: { "1": 0.5, "2": 0.4, "3": 0.1 },
    },
    obsSeq: ["3", "1", "3"],
  },
  razpolozenje: {
    key: "razpolozenje",
    states: ["Happy", "Sad"],
    obsAlphabet: ["Meme", "Selfie", "Quote"],
    startP: { Happy: 0.5, Sad: 0.5 },
    transP: {
      Happy: { Happy: 0.8, Sad: 0.2 },
      Sad: { Happy: 0.3, Sad: 0.7 },
    },
    emitP: {
      Happy: { Meme: 0.5, Selfie: 0.4, Quote: 0.1 },
      Sad: { Meme: 0.1, Selfie: 0.2, Quote: 0.7 },
    },
    obsSeq: ["Meme", "Quote", "Quote", "Selfie", "Meme"],
  },
  borza: {
    key: "borza",
    states: ["Bull", "Bear"],
    obsAlphabet: ["Up", "Down", "Flat"],
    startP: { Bull: 0.6, Bear: 0.4 },
    transP: {
      Bull: { Bull: 0.85, Bear: 0.15 },
      Bear: { Bull: 0.2, Bear: 0.8 },
    },
    emitP: {
      Bull: { Up: 0.6, Down: 0.2, Flat: 0.2 },
      Bear: { Up: 0.2, Down: 0.6, Flat: 0.2 },
    },
    obsSeq: ["Up", "Up", "Down", "Down", "Down", "Up"],
  },
};
