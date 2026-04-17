import { t, translateObsName, translateStateName } from "../i18n/index";
import { EXAMPLES, EXAMPLE_KEYS } from "../viterbi/examples";
import { PATHS } from "../paths";

export function renderPrimeri(): void {
  const i18n = t();
  document.title = `${i18n.primeri.title} — ${i18n.common.brand}`;

  const slot = document.getElementById("page-content");
  if (!slot) return;

  const p = i18n.primeri;
  slot.innerHTML = `
  <div class="mb-4">
    <div class="eyebrow">${p.eyebrow}</div>
    <h1 class="h2 mt-2 mb-1">${p.heading}</h1>
    <p class="text-secondary mb-0">${p.lead}</p>
  </div>
  <div class="row g-3">
    ${EXAMPLE_KEYS.map((key) => {
      const ex = EXAMPLES[key];
      const meta = i18n.examples[key];
      const statesDisplay = ex.states.map(translateStateName).join(", ");
      const seqDisplay = ex.obsSeq.map(translateObsName).join(" → ");
      return `
      <div class="col-md-6 col-lg-4">
        <a href="${PATHS.demo}?ex=${key}" class="card card-hover nav-card h-100">
          <span class="badge-soft mb-2">${p.statesCount(ex.states.length)} · ${p.symbolsCount(ex.obsAlphabet.length)} · ${p.seqLen(ex.obsSeq.length)}</span>
          <h3>${meta.name} <span class="arrow">→</span></h3>
          <p>${meta.description}</p>
          <div class="divider" style="margin: 1rem 0 0.75rem;"></div>
          <div class="mono-small" style="color: var(--muted); line-height: 1.7;">
            <div><span style="color: var(--text-2);">${p.statesLabel}</span> ${statesDisplay}</div>
            <div><span style="color: var(--text-2);">${p.seqLabel}</span>
              <span style="color: var(--accent);">${seqDisplay}</span>
            </div>
          </div>
        </a>
      </div>`;
    }).join("")}
  </div>`;
}
