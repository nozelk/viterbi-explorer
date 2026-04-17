# Viterbi Explorer

Interaktivna spletna aplikacija za vizualizacijo **skritih Markovskih modelov (HMM)** in **Viterbijevega algoritma**. Seminarska naloga, Računalništvo 2.

## Zagon

```powershell
cd aplikacija
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Odpri http://127.0.0.1:5000

## Strani

- **`/`** — uvodna razlaga (markovska veriga → HMM → Viterbi)
- **`/demo`** — interaktivni Viterbi s trellis diagramom, matriko in korak-za-korakom razlago
- **`/primeri`** — trije pripravljeni scenariji (vreme/dežnik, sladoled Jurafsky, razpoloženje/objave)

## Struktura

```
aplikacija/
├── app.py              # Flask routes + /api/viterbi
├── viterbi.py          # algoritem + predpripravljeni primeri
├── requirements.txt
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── demo.html
│   └── primeri.html
└── static/
    ├── style.css       # dark theme, akcent cyan
    └── demo.js         # trellis SVG + matrika + korak-animacija
```

## Funkcije demo strani

- Urejanje prehodnih, emisijskih in začetnih verjetnosti v stranski vrstici
- Gradnja zaporedja opazovanj s klikom
- Kontrole ▶ korak / ⏭ vse / ◀ nazaj / ↺ reset
- Animiran trellis: trenutni stolpec je osvetljen, zmagovite poti označene, končna Viterbijeva pot obarvana oranžno
- Viterbijeva matrika $V$ se polni sinhronizirano s trellisom
- Razlaga vsakega koraka v obliki formul
