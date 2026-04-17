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
