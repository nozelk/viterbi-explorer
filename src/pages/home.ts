import { t } from "../i18n/index";

export function renderHome(): void {
  const i18n = t();
  document.title = i18n.home.title;

  const slot = document.getElementById("page-content");
  if (!slot) return;

  const h = i18n.home;
  slot.innerHTML = `
  <section class="hero">
    <div class="row align-items-center g-5">
      <div class="col-lg-7">
        <span class="badge-accent mb-4"><span class="dot"></span>${h.heroBadge}</span>
        <h1>${h.heroHeadStart}<span class="gradient-text">${h.heroHeadHighlight}</span>${h.heroHeadEnd}</h1>
        <p class="lead mt-3">${h.heroLead}</p>
        <div class="d-flex gap-2 flex-wrap mt-4">
          <a href="${h.cards[0].href}" class="btn btn-accent btn-lg">${h.btnStart}</a>
          <a href="${h.cards[3].href}" class="btn btn-ghost btn-lg">${h.btnDemo}</a>
          <a href="https://github.com/nozelk/viterbi-explorer" target="_blank" rel="noopener" class="btn btn-outline-light btn-lg">${h.btnGithub}</a>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="card p-4">
          <svg viewBox="0 0 340 240" class="w-100" aria-hidden="true">
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--accent)"/></marker>
              <marker id="arrMuted" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--muted)"/></marker>
            </defs>
            <text x="20" y="26" class="small-muted">${h.hiddenLabel}</text>
            <circle cx="90" cy="70" r="26" class="node-hidden"/><text x="90" y="74" text-anchor="middle" class="node-text">S₁</text>
            <circle cx="250" cy="70" r="26" class="node-hidden"/><text x="250" y="74" text-anchor="middle" class="node-text">S₂</text>
            <path d="M116 70 Q170 30 224 70" stroke="var(--accent)" fill="none" stroke-width="1.5" marker-end="url(#arr)"/>
            <path d="M224 70 Q170 110 116 70" stroke="var(--accent)" fill="none" stroke-width="1.5" marker-end="url(#arr)"/>
            <text x="20" y="154" class="small-muted">${h.obsLabel}</text>
            <rect x="62" y="168" width="56" height="36" rx="8" class="node-obs"/><text x="90" y="191" text-anchor="middle" class="node-text">o₁</text>
            <rect x="222" y="168" width="56" height="36" rx="8" class="node-obs"/><text x="250" y="191" text-anchor="middle" class="node-text">o₂</text>
            <line x1="90" y1="98" x2="90" y2="166" stroke="var(--muted)" stroke-dasharray="3 4" marker-end="url(#arrMuted)"/>
            <line x1="250" y1="98" x2="250" y2="166" stroke="var(--muted)" stroke-dasharray="3 4" marker-end="url(#arrMuted)"/>
            <text x="170" y="230" text-anchor="middle" class="small-muted">${h.emissionLabel}</text>
          </svg>
        </div>
      </div>
    </div>
  </section>

  <section class="mt-5 pt-4">
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <div class="eyebrow">${h.sectionContentEyebrow}</div>
        <h2 class="h3 mt-2 mb-0">${h.sectionContentTitle}</h2>
      </div>
      <span class="mono-small" style="color: var(--muted)">${h.sectionContentHint}</span>
    </div>
    <p class="text-secondary" style="max-width: 640px;">${h.sectionContentLead}</p>
    <div class="row g-3 mt-3">
      ${h.cards
        .map(
          (c) => `
      <div class="col-md-6 col-xl-4">
        <a href="${c.href}"${c.external ? ' target="_blank" rel="noopener"' : ""} class="card card-hover nav-card">
          <span class="nc-num">${c.num}</span>
          <h3>${c.title} <span class="arrow">${c.external ? "↗" : "→"}</span></h3>
          <p>${c.body}</p>
        </a>
      </div>`,
        )
        .join("")}
    </div>
  </section>

  <section class="mt-5 pt-4">
    <div class="row g-4 align-items-stretch">
      <div class="col-lg-6">
        <div class="eyebrow">${h.formulaEyebrow}</div>
        <h2 class="h3 mt-2 mb-3">${h.formulaTitle}</h2>
        <div class="formula-box">
          v<sub>t</sub>(j) = max<sub>i</sub> &nbsp; v<sub>t−1</sub>(i) · a<sub>ij</sub> · b<sub>j</sub>(o<sub>t</sub>)
        </div>
        <p class="mb-0">${h.formulaCaption}</p>
      </div>
      <div class="col-lg-6">
        <div class="eyebrow">${h.usageEyebrow}</div>
        <h2 class="h3 mt-2 mb-3">${h.usageTitle}</h2>
        <div class="d-grid gap-2">
          ${h.usageItems
            .map((u) => `<div class="card p-3"><strong>${u.title}</strong> <span class="text-secondary">${u.body}</span></div>`)
            .join("")}
        </div>
      </div>
    </div>
  </section>`;
}
