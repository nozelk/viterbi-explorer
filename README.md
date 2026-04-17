# Viterbi Explorer

[![CI](https://github.com/nozelk/viterbi-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/nozelk/viterbi-explorer/actions/workflows/ci.yml)

Interaktivna Flask aplikacija za vizualizacijo **skritih Markovskih modelov (HMM)** in **Viterbijevega algoritma**. Projekt je nastal kot seminarska naloga pri predmetu Računalništvo 2.

## Kaj aplikacija vsebuje

- uvodno razlago: markovske verige → HMM → Viterbi
- interaktivni prikaz trellis mreže s koraki algoritma
- urejanje začetnih, prehodnih in emisijskih verjetnosti
- pripravljene scenarije: vreme, sladoled, razpoloženje in borza
- Flask API endpoint `/api/viterbi` za izračun algoritma

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

V repozitoriju je nastavljen GitHub Actions workflow v `.github/workflows/ci.yml`, ki ob vsakem `push` in `pull request`:

- namesti odvisnosti
- zažene osnovne teste za Flask poti in Viterbijev algoritem

## Pomembna opomba o gostovanju

GitHub lahko hrani kodo in poganja CI, ne more pa neposredno gostiti Flask strežnika kot dinamične backend aplikacije. Zato je trenutno na GitHubu pripravljen:

- repozitorij
- CI workflow
- testno ogrodje

Če boš hotel aplikacijo javno zagnati kot pravi strežnik, je naslednji korak deploy na Render, Railway ali podoben servis.

## Struktura projekta

```text
aplikacija/
├── .github/workflows/ci.yml
├── app.py
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
