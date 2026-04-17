<div align="center">

# Viterbi Explorer

**Interaktivni razlagalnik skritih Markovskih modelov in Viterbijevega algoritma.**

[![Deploy](https://github.com/nozelk/viterbi-explorer/actions/workflows/deploy.yml/badge.svg)](https://github.com/nozelk/viterbi-explorer/actions/workflows/deploy.yml)
[![Pages](https://img.shields.io/badge/demo-live-818cf8?style=flat&logo=github)](https://nozelk.github.io/viterbi-explorer/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20DE%20%7C%20SL-2a2a30?style=flat)](#večjezičnost)

### [→ Zaženi demo](https://nozelk.github.io/viterbi-explorer/)

</div>

---

Seminarska naloga pri predmetu **Računalništvo 2**. Aplikacija razloži, kako Viterbijev algoritem iz opazovanega zaporedja rekonstruira najverjetnejšo skrito pot v skritem Markovskem modelu — **brez strežnika, povsem v brskalniku**.

Lahko urejaš začetne, prehodne in emisijske verjetnosti v živo, sestaviš poljubno zaporedje opazovanj in se korak za korakom sprehodiš skozi trellis mrežo, da vidiš, od kod pridejo posamezne vrednosti `V[t][s]` in kako backtracking poveže zmagovalno pot.

## Kaj aplikacija ponuja

- 📖 **Teoretični del** v treh stopnjah: Markovske verige → HMM → Viterbi
- 🎛️ **Interaktivni demo** z urejljivimi verjetnostnimi tabelami
- 🎬 **Animirana trellis mreža** s koraki *init / rekurzija / zaključek*
- 📊 **Sinhronizirana matrika `V`** in tekstovna razlaga vsakega koraka
- 🌐 **Trije jeziki**: angleščina, nemščina, slovenščina (s samodejnim zaznavanjem)
- 🧪 **Štirje pripravljeni scenariji**: vreme, sladoled, razpoloženje, borza

## Tehnološki sklad

| Sloj              | Izbira                                             |
| ----------------- | -------------------------------------------------- |
| Jezik             | TypeScript (strict mode)                           |
| Build             | Vite 5 (multi-page)                                |
| UI                | Bootstrap 5 (prek CDN) + prilagojen CSS            |
| i18n              | lasten — ločeni moduli `en.ts`, `de.ts`, `sl.ts`   |
| Algoritem         | čisto TypeScript, brez odvisnosti                  |
| Gostovanje        | GitHub Pages prek `actions/deploy-pages`           |

Runtime nima nobene `npm` odvisnosti — vse, kar stran potrebuje, je statični bundle iz mape `dist/`.

## Struktura projekta

```text
aplikacija/
├── index.html                      # domača stran
├── demo.html                       # interaktivni demo
├── primeri.html                    # galerija scenarijev
├── teorija/
│   ├── markovske-verige.html
│   ├── hmm.html
│   └── viterbi.html
├── src/
│   ├── main.ts                     # edina vstopna točka, dispatch prek body[data-page]
│   ├── paths.ts                    # URL-ji, zavedni BASE-a za GitHub Pages
│   ├── styles/style.css
│   ├── components/layout.ts        # navbar, footer, language switcher
│   ├── pages/                      # home, demo, primeri, theory
│   ├── viterbi/
│   │   ├── algorithm.ts            # runViterbi()
│   │   ├── examples.ts             # 4 pripravljeni HMM modeli
│   │   └── types.ts
│   └── i18n/
│       ├── index.ts                # t(), setLocale(), detectLocale()
│       ├── en.ts
│       ├── de.ts
│       └── sl.ts
├── .github/workflows/deploy.yml
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Lokalni razvoj

Potrebuješ **Node.js 20+**.

```powershell
cd aplikacija
npm install
npm run dev          # dev strežnik z vročim nalaganjem
```

Drugi ukazi:

```powershell
npm run typecheck    # tsc --noEmit
npm run build        # typecheck + vite build → dist/
npm run preview      # servira zgrajeno dist/ lokalno
```

## Uvajanje (deployment)

Ob vsakem `push` na `main` se sproži [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), ki:

1. namesti odvisnosti z `npm ci`,
2. zgradi stran z `GITHUB_PAGES=true npm run build` (Vite takrat uporabi `/viterbi-explorer/` kot `base`),
3. naloži `dist/` kot Pages artefakt in
4. objavi prek uradne `actions/deploy-pages@v4` akcije.

V nastavitvah repozitorija je **Pages → Source** nastavljen na **GitHub Actions** (ne več klasični *branch + /docs*).

## Večjezičnost

Trenutni jezik se izbere po tem vrstnem redu:

1. parameter `?lang=en|de|sl` v URL-ju
2. `localStorage["viterbi-explorer-locale"]`
3. `navigator.language`
4. privzeto: angleščina

Vsi nizi — vključno s celotnim HTML-jem teoretičnih strani — so v `src/i18n/{en,de,sl}.ts`. Algoritem in primeri uporabljajo **kanonična angleška imena** stanj in opazovanj (npr. `Sunny`, `Rainy`, `Umbrella`), prikazna imena pa se pri izrisu prevedejo prek `translateStateName()` oziroma `translateObsName()`.

## Viterbijev algoritem — povzetek

Za skrit Markovski model $\lambda = (A, B, \pi)$ in opazovano zaporedje $O = O_1 O_2 \ldots O_T$ iščemo

$$Q^* = \arg\max_{Q} P(Q \mid O, \lambda).$$

Algoritem to doseže v treh korakih:

$$V_1(i) = \pi_i \cdot b_i(O_1)$$

$$V_t(j) = \max_{i} \big[ V_{t-1}(i) \cdot a_{ij} \big] \cdot b_j(O_t)$$

$$P^* = \max_{i} V_T(i), \qquad q_T^* = \arg\max_{i} V_T(i)$$

Backtracking nato prek zapisanih predhodnikov zgradi celotno pot $Q^*$. Implementacija živi v [`src/viterbi/algorithm.ts`](src/viterbi/algorithm.ts) in za vsak korak shrani tudi surove člene formule, tako da jih demo lahko dobesedno izpiše v izbranem jeziku.

## Licenca

Koda je objavljena v študijske namene kot del seminarske naloge.
# Viterbi Explorer

Interactive, client-side explainer for **Hidden Markov Models** and the **Viterbi algorithm**.

**Live demo:** https://nozelk.github.io/viterbi-explorer/

Built as a TypeScript single-page app served from GitHub Pages — no backend. You can tweak the transition, emission and initial probabilities directly in the browser, build any observation sequence, and step through the trellis cell by cell to see exactly how Viterbi picks the most likely hidden path.

## Features

- **Step-by-step trellis** with init / recursion / termination phases
- **Editable probability tables** — re-run the algorithm live on your own model
- **Four ready-made scenarios** (weather, ice cream, mood, stock market)
- **Three languages**: English, Deutsch, Slovenščina (auto-detected, switchable)
- **Theory pages** covering Markov chains, HMMs and the Viterbi recurrence
- Zero runtime dependencies apart from Bootstrap (via CDN)

## Tech stack

- [Vite](https://vitejs.dev/) with multi-page build
- [TypeScript](https://www.typescriptlang.org/) in strict mode
- Bootstrap 5 for layout primitives
- Custom i18n layer (no external library)

## Project layout

```
aplikacija/
├── index.html              # home
├── demo.html               # interactive demo
├── primeri.html            # scenario gallery
├── teorija/
│   ├── markovske-verige.html
│   ├── hmm.html
│   └── viterbi.html
├── src/
│   ├── main.ts             # single entry, dispatches on body[data-page]
│   ├── paths.ts            # BASE-aware URL helpers
│   ├── styles/style.css
│   ├── i18n/               # en.ts, de.ts, sl.ts + index
│   ├── viterbi/            # algorithm.ts, examples.ts, types.ts
│   ├── components/layout.ts
│   └── pages/              # home, demo, primeri, theory
├── .github/workflows/deploy.yml
├── vite.config.ts
└── tsconfig.json
```

## Local development

```powershell
npm install
npm run dev        # vite dev server
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + vite build -> dist/
npm run preview    # serve built dist/
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site with `GITHUB_PAGES=true` (so Vite uses `/viterbi-explorer/` as its base path) and publishes `dist/` through `actions/deploy-pages`.

## i18n

The current locale is resolved in this order:

1. `?lang=en|de|sl` query parameter
2. `localStorage["viterbi-explorer-locale"]`
3. `navigator.language`
4. fallback: English

Locale strings (including full theory HTML) live in `src/i18n/{en,de,sl}.ts`. The language switcher in the navbar persists the choice across pages.
# Viterbi Explorer

[![CI](https://github.com/nozelk/viterbi-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/nozelk/viterbi-explorer/actions/workflows/ci.yml)

Interaktivna Flask aplikacija za vizualizacijo **skritih Markovskih modelov (HMM)** in **Viterbijevega algoritma**. Projekt je nastal kot seminarska naloga pri predmetu Računalništvo 2.

## Javna stran

- GitHub Pages: https://nozelk.github.io/viterbi-explorer/
- GitHub repo: https://github.com/nozelk/viterbi-explorer

## Kaj aplikacija vsebuje

- uvodno razlago: markovske verige → HMM → Viterbi
- interaktivni prikaz trellis mreže s koraki algoritma
- urejanje začetnih, prehodnih in emisijskih verjetnosti
- pripravljene scenarije: vreme, sladoled, razpoloženje in borza
- Flask API endpoint `/api/viterbi` za izračun algoritma
- statična GitHub Pages različica, ki teče brez backend strežnika

## Lokalni zagon

```powershell
cd aplikacija
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Nato odpri `http://127.0.0.1:5000`.

## Glavne poti

- `/` : uvod in navigacija skozi teorijo
- `/teorija/markovske-verige` : Markovske verige
- `/teorija/hmm` : skriti Markovski modeli
- `/teorija/viterbi` : Viterbijev algoritem
- `/demo` : interaktivni prikaz z matriko in backtrackingom
- `/primeri` : hitri vstop v pripravljene scenarije
- `/api/viterbi` : POST endpoint za izračun poti

## GitHub in CI

Repozitorij je objavljen na GitHubu:

- https://github.com/nozelk/viterbi-explorer
- https://nozelk.github.io/viterbi-explorer/

V repozitoriju je nastavljen GitHub Actions workflow v `.github/workflows/ci.yml`, ki ob vsakem `push` in `pull request`:

- namesti odvisnosti
- zažene osnovne teste za Flask poti in Viterbijev algoritem
- preveri, da se statična stran uspešno zgradi z `build_static_site.py`

## Pomembna opomba o gostovanju

GitHub lahko hrani kodo in poganja CI, ne more pa neposredno gostiti Flask strežnika kot dinamične backend aplikacije. Zato je trenutno na GitHubu pripravljen:

- repozitorij
- CI workflow
- testno ogrodje
- statična GitHub Pages verzija v mapi `docs/`

Če boš hotel aplikacijo javno zagnati kot pravi strežnik, je naslednji korak deploy na Render, Railway ali podoben servis.

## Struktura projekta

```text
aplikacija/
├── .github/workflows/ci.yml
├── app.py
├── build_static_site.py
├── docs/
├── viterbi.py
├── requirements.txt
├── tests/
│   ├── test_app.py
│   └── test_viterbi.py
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── demo.html
│   ├── primeri.html
│   └── teorija/
│       ├── markov.html
│       ├── hmm.html
│       └── viterbi.html
└── static/
    ├── style.css
    └── demo.js
```

## Demo funkcije

- hitri gumbi za preklop med scenariji
- gradnja zaporedja opazovanj s klikom
- kontrole za korak naprej, nazaj, samodejno predvajanje, ustavitev in ponastavitev
- animiran trellis z označeno zmagovalno potjo
- sinhronizirana Viterbijeva matrika `V`
- tekstovna razlaga vsakega koraka
