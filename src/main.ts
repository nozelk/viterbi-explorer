import { detectLocale, setLocale } from "./i18n/index";
import { mountLayout } from "./components/layout";
import { renderHome } from "./pages/home";
import { renderDemo } from "./pages/demo";
import { renderPrimeri } from "./pages/primeri";
import { renderTheory } from "./pages/theory";
import "./styles/style.css";

type PageKind =
  | "index"
  | "demo"
  | "primeri"
  | "markov"
  | "hmm"
  | "viterbi";

const PAGE_RENDERERS: Record<PageKind, () => void> = {
  index: renderHome,
  demo: renderDemo,
  primeri: renderPrimeri,
  markov: () => renderTheory("markov"),
  hmm: () => renderTheory("hmm"),
  viterbi: () => renderTheory("viterbi"),
};

function currentPage(): PageKind {
  const raw = document.body.dataset.page ?? "index";
  if (raw in PAGE_RENDERERS) return raw as PageKind;
  return "index";
}

export function bootstrap(): void {
  setLocale(detectLocale());
  const page = currentPage();
  const activeKey: "index" | "markov" | "hmm" | "viterbi" | "demo" | "primeri" = page;

  const renderAll = (): void => {
    mountLayout(activeKey, renderAll);
    PAGE_RENDERERS[page]();
  };

  renderAll();
}

function attachSpotlight(): void {
  document.addEventListener("pointermove", (ev) => {
    const target = ev.target;
    if (!(target instanceof Element)) return;
    const card = target.closest<HTMLElement>(".card-hover");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${ev.clientX - rect.left}px`);
    card.style.setProperty("--my", `${ev.clientY - rect.top}px`);
  }, { passive: true });
}

bootstrap();
attachSpotlight();
