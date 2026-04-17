import { en } from "./en";
import { de } from "./de";
import { sl } from "./sl";

export type Locale = "en" | "de" | "sl";

export const LOCALES: readonly Locale[] = ["en", "de", "sl"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  sl: "SL",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  sl: "Slovenščina",
};

export interface NavEntry {
  key: string;
  label: string;
  href: string;
}

export interface HomeCard {
  num: string;
  title: string;
  body: string;
  href: string;
  external?: boolean;
}

export interface UsageItem {
  title: string;
  body: string;
}

export interface LocaleStrings {
  htmlLang: string;
  nav: {
    home: string;
    markov: string;
    hmm: string;
    viterbi: string;
    demo: string;
    primeri: string;
    github: string;
  };
  common: {
    brand: string;
    subtitle: string;
    footerProject: string;
    langLabel: string;
    back: string;
    next: string;
  };
  home: {
    title: string;
    heroBadge: string;
    heroHeadStart: string;
    heroHeadHighlight: string;
    heroHeadEnd: string;
    heroLead: string;
    btnStart: string;
    btnDemo: string;
    btnGithub: string;
    hiddenLabel: string;
    obsLabel: string;
    emissionLabel: string;
    sectionContentEyebrow: string;
    sectionContentTitle: string;
    sectionContentHint: string;
    sectionContentLead: string;
    cards: HomeCard[];
    formulaEyebrow: string;
    formulaTitle: string;
    formulaCaption: string;
    usageEyebrow: string;
    usageTitle: string;
    usageItems: UsageItem[];
  };
  theory: {
    markov: { title: string; eyebrow: string; heading: string; lead: string; bodyHtml: string; nextLabel: string; prevLabel: string };
    hmm: { title: string; eyebrow: string; heading: string; lead: string; bodyHtml: string; nextLabel: string; prevLabel: string };
    viterbi: { title: string; eyebrow: string; heading: string; lead: string; bodyHtml: string; nextLabel: string; prevLabel: string };
  };
  demo: {
    title: string;
    eyebrow: string;
    heading: string;
    lead: string;
    scenarioLabel: string;
    paramsLabel: string;
    obsSeqLabel: string;
    obsEmptyHint: string;
    clickToRemove: string;
    clear: string;
    transLabel: string;
    emitLabel: string;
    startLabel: string;
    runBtn: string;
    trellisLabel: string;
    back: string;
    forward: string;
    playAll: string;
    stop: string;
    reset: string;
    matrixLabel: string;
    resultLabel: string;
    explanationLabel: string;
    explainIntro: string;
    explainStart: string;
    matrixEmpty: string;
    resultEmpty: string;
    resultPath: string;
    resultProb: string;
    errEmptyObs: string;
    errComputeFailed: string;
    stateNames: Record<string, string>;
    obsNames: Record<string, string>;
    initMessage: (t: number, obs: string) => string;
    initFormula: (state: string, obs: string, pi: string, b: string, value: string) => string;
    recursionMessage: (t: number, obs: string) => string;
    recursionFormula: (
      t: number,
      state: string,
      obs: string,
      from: string,
      value: string,
    ) => string;
    terminateMessage: (bestProb: string, finalState: string, path: string) => string;
  };
  primeri: {
    title: string;
    eyebrow: string;
    heading: string;
    lead: string;
    statesCount: (n: number) => string;
    symbolsCount: (n: number) => string;
    seqLen: (n: number) => string;
    statesLabel: string;
    seqLabel: string;
  };
  examples: Record<
    string,
    { name: string; description: string }
  >;
}

const MESSAGES: Record<Locale, LocaleStrings> = { en, de, sl };

const STORAGE_KEY = "viterbi-explorer-locale";
const DEFAULT_LOCALE: Locale = "en";

export function detectLocale(): Locale {
  const urlParam = new URLSearchParams(window.location.search).get("lang");
  if (urlParam && isLocale(urlParam)) return urlParam;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && isLocale(saved)) return saved;

  const nav = navigator.language.slice(0, 2).toLowerCase();
  if (isLocale(nav)) return nav;

  return DEFAULT_LOCALE;
}

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

let currentLocale: Locale = DEFAULT_LOCALE;

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.setAttribute("lang", MESSAGES[locale].htmlLang);
  document.documentElement.setAttribute("data-lang", locale);
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(): LocaleStrings {
  return MESSAGES[currentLocale];
}

export function translateStateName(state: string): string {
  return t().demo.stateNames[state] ?? state;
}

export function translateObsName(obs: string): string {
  return t().demo.obsNames[obs] ?? obs;
}
