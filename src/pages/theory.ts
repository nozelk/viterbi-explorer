import { t } from "../i18n/index";
import { PATHS } from "../paths";

type TheoryKey = "markov" | "hmm" | "viterbi";

const PREV_NEXT: Record<TheoryKey, { prev: string; next: string }> = {
  markov: { prev: PATHS.home, next: PATHS.hmm },
  hmm: { prev: PATHS.markov, next: PATHS.viterbi },
  viterbi: { prev: PATHS.hmm, next: PATHS.demo },
};

export function renderTheory(key: TheoryKey): void {
  const i18n = t();
  const page = i18n.theory[key];
  document.title = `${page.title} — ${i18n.common.brand}`;
  const slot = document.getElementById("page-content");
  if (!slot) return;

  const nav = PREV_NEXT[key];

  slot.innerHTML = `
  <div class="prose mx-auto">
    <div class="eyebrow">${page.eyebrow}</div>
    <h1 class="mt-2 mb-3">${page.heading}</h1>
    <p class="lead" style="color: var(--text-2); font-size: 1.08rem;">${page.lead}</p>
    ${page.bodyHtml}
    <div class="page-nav">
      <a href="${nav.prev}">
        <span class="eyebrow">${i18n.common.back}</span>
        <strong>${page.prevLabel}</strong>
      </a>
      <a href="${nav.next}" class="next">
        <span class="eyebrow">${i18n.common.next}</span>
        <strong>${page.nextLabel}</strong>
      </a>
    </div>
  </div>`;
}
