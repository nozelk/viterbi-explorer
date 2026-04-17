import { t, LOCALES, LOCALE_LABELS, LOCALE_NAMES, setLocale, getLocale, type Locale } from "../i18n/index";
import { PATHS } from "../paths";

type ActiveKey = "index" | "markov" | "hmm" | "viterbi" | "demo" | "primeri";

const BRAND_MARK = `
<svg class="brand-mark" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="vx-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4338ca"/>
      <stop offset="1" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#vx-bg)"/>
  <g stroke="#ffffff" stroke-opacity="0.22" stroke-width="1" stroke-linecap="round">
    <line x1="8" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="10" x2="16" y2="22"/>
    <line x1="8" y1="22" x2="16" y2="10"/>
    <line x1="8" y1="22" x2="16" y2="22"/>
    <line x1="16" y1="10" x2="24" y2="22"/>
    <line x1="16" y1="22" x2="24" y2="10"/>
    <line x1="16" y1="22" x2="24" y2="22"/>
  </g>
  <g stroke="#fde68a" stroke-width="1.9" stroke-linecap="round">
    <line x1="8" y1="10" x2="16" y2="22"/>
    <line x1="16" y1="22" x2="24" y2="10"/>
  </g>
  <g fill="#ffffff">
    <circle cx="8"  cy="10" r="2"/>
    <circle cx="8"  cy="22" r="2"/>
    <circle cx="16" cy="10" r="2"/>
    <circle cx="16" cy="22" r="2"/>
    <circle cx="24" cy="10" r="2"/>
    <circle cx="24" cy="22" r="2"/>
  </g>
  <g fill="#fde68a">
    <circle cx="8"  cy="10" r="2.4"/>
    <circle cx="16" cy="22" r="2.4"/>
    <circle cx="24" cy="10" r="2.4"/>
  </g>
</svg>`.trim();

const FAVICON_SVG = encodeURIComponent(BRAND_MARK);

export function mountLayout(active: ActiveKey, onLocaleChange: () => void): void {
  mountFavicon();
  renderNav(active);
  renderFooter();
  renderLanguageSwitcher(onLocaleChange);
}

function mountFavicon(): void {
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = `data:image/svg+xml,${FAVICON_SVG}`;
}

function renderNav(active: ActiveKey): void {
  const slot = document.getElementById("app-nav");
  if (!slot) return;

  const i18n = t();
  const items: Array<{ key: ActiveKey | "github"; label: string; href: string; external?: boolean }> = [
    { key: "index", label: i18n.nav.home, href: PATHS.home },
    { key: "markov", label: i18n.nav.markov, href: PATHS.markov },
    { key: "hmm", label: i18n.nav.hmm, href: PATHS.hmm },
    { key: "viterbi", label: i18n.nav.viterbi, href: PATHS.viterbi },
    { key: "demo", label: i18n.nav.demo, href: PATHS.demo },
    { key: "primeri", label: i18n.nav.primeri, href: PATHS.primeri },
  ];

  slot.innerHTML = `
    <nav class="navbar navbar-expand-lg sticky-top">
      <div class="container-fluid app-container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="${PATHS.home}">
          <span class="brand-logo">${BRAND_MARK}</span>
          <span>${i18n.common.brand}</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav">
          <ul class="navbar-nav ms-auto gap-lg-1 align-items-lg-center">
            ${items
              .map(
                (it) => `
              <li class="nav-item">
                <a class="nav-link ${active === it.key ? "is-active" : ""}" href="${it.href}">${it.label}</a>
              </li>`,
              )
              .join("")}
            <li class="nav-item ms-lg-2">
              <a class="nav-link" href="${PATHS.github}" target="_blank" rel="noopener">
                <span style="color: var(--accent)">${i18n.nav.github}</span>
                <span style="color: var(--muted)">↗</span>
              </a>
            </li>
            <li class="nav-item ms-lg-2">
              <div id="lang-switcher" class="lang-switcher" role="group" aria-label="${i18n.common.langLabel}"></div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;
}

function renderFooter(): void {
  const slot = document.getElementById("app-footer");
  if (!slot) return;
  const i18n = t();
  slot.innerHTML = `
    <footer class="mt-5 py-4">
      <div class="container-fluid app-container d-flex justify-content-between flex-wrap gap-2">
        <span>${i18n.common.subtitle}</span>
        <span class="mono-small" style="color: var(--muted)">
          <a href="${PATHS.github}" target="_blank" rel="noopener">GitHub</a> · TypeScript · Vite · Bootstrap 5
        </span>
      </div>
    </footer>
  `;
}

function renderLanguageSwitcher(onLocaleChange: () => void): void {
  const host = document.getElementById("lang-switcher");
  if (!host) return;
  const current = getLocale();
  host.innerHTML = LOCALES
    .map(
      (loc: Locale) => `
    <button type="button"
            class="lang-btn ${current === loc ? "is-active" : ""}"
            data-locale="${loc}"
            title="${LOCALE_NAMES[loc]}"
            aria-pressed="${current === loc}">${LOCALE_LABELS[loc]}</button>`,
    )
    .join("");

  host.addEventListener("click", (ev) => {
    const target = ev.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest<HTMLButtonElement>("button[data-locale]");
    if (!btn) return;
    const locale = btn.dataset.locale as Locale;
    if (locale === getLocale()) return;
    setLocale(locale);
    onLocaleChange();
  });
}
