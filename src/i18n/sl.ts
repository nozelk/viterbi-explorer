import type { LocaleStrings } from "./index";
import { PATHS } from "../paths";

export const sl: LocaleStrings = {
  htmlLang: "sl",
  nav: {
    home: "Domov",
    markov: "Markovske verige",
    hmm: "Skriti modeli",
    viterbi: "Viterbi algoritem",
    demo: "Interaktivni prikaz",
    primeri: "Primeri",
    github: "GitHub",
  },
  common: {
    brand: "Viterbi Explorer",
    subtitle:
      "Seminarska naloga · Računalništvo 2 · Skriti Markovski modeli in Viterbijev algoritem",
    footerProject: "Interaktivna razlaga, napisana v TypeScriptu.",
    langLabel: "Jezik",
    back: "Nazaj",
    next: "Naprej",
  },
  home: {
    title: "Viterbi Explorer — Dobrodošli",
    heroBadge: "Seminarska naloga · Računalništvo 2",
    heroHeadStart: "Dobrodošli v ",
    heroHeadHighlight: "Viterbi Explorer",
    heroHeadEnd: ".",
    heroLead:
      "Interaktivna razlaga <strong>skritih Markovskih modelov</strong> in <strong>Viterbijevega algoritma</strong> — od osnovnih Markovskih verig do animiranega trellis diagrama z numeričnimi primeri.",
    btnStart: "Začni s teorijo →",
    btnDemo: "Odpri prikaz",
    btnGithub: "GitHub repo ↗",
    hiddenLabel: "skrito stanje",
    obsLabel: "opazovanje",
    emissionLabel: "emisijska verjetnost",
    sectionContentEyebrow: "01 · Vsebina",
    sectionContentTitle: "Sledi naravnemu vrstnemu redu",
    sectionContentHint: "priporočen tok →",
    sectionContentLead:
      "Viterbi sloni na skritih Markovskih modelih, ti pa na običajnih Markovskih verigah. Spodnji tok te vodi od osnov do interaktivnega prikaza.",
    cards: [
      { num: "01", title: "Markovske verige", body: "Stanja, prehodi in lastnost brez spomina. Osnovni gradnik vsega, kar sledi.", href: PATHS.markov },
      { num: "02", title: "Skriti modeli", body: "Ko stanj ne vidimo neposredno, temveč samo posledice. HMM in trije problemi.", href: PATHS.hmm },
      { num: "03", title: "Viterbi algoritem", body: "Dinamično programiranje, trellis in backtracking. Srce seminarske.", href: PATHS.viterbi },
      { num: "04", title: "Interaktivni demo", body: "Animirani trellis. Spreminjaj verjetnosti in opazovanja, algoritem teče v živo.", href: PATHS.demo },
      { num: "05", title: "Primeri", body: "Pripravljeni scenariji: vreme, razpoloženje, Jurafskyjev sladoled, borza.", href: PATHS.primeri },
      { num: "06", title: "Zunanji viri", body: "Jurafsky & Martin, Rabinerjev tutorial, Wikipedia članki in več.", href: "https://en.wikipedia.org/wiki/Hidden_Markov_model", external: true },
    ],
    formulaEyebrow: "02 · Osrednja formula",
    formulaTitle: "Viterbijeva rekurzija",
    formulaCaption:
      "Najboljša verjetnost poti, ki se konča v stanju <code>j</code> ob času <code>t</code>, je maksimum po vseh možnih predhodnih stanjih <code>i</code>, pomnožen s prehodno verjetnostjo <code>a<sub>ij</sub></code> in emisijsko <code>b<sub>j</sub>(o<sub>t</sub>)</code>.",
    usageEyebrow: "03 · Kje se to uporablja",
    usageTitle: "Viterbi v realnem svetu",
    usageItems: [
      { title: "Prepoznavanje govora.", body: "Fonemi kot skrita stanja, akustični signal kot opazovanja." },
      { title: "Bioinformatika.", body: "Označevanje kodirajočih regij v DNA zaporedjih." },
      { title: "POS-tagging.", body: "Določanje besednih vrst v računalniški lingvistiki." },
      { title: "Telekomunikacije.", body: "Dekodiranje konvolucijskih kod (Viterbi, 1967)." },
    ],
  },
  theory: {
    markov: {
      title: "Markovske verige",
      eyebrow: "01 · Osnove",
      heading: "Markovske verige",
      lead: "Matematični model sistema, ki skače med stanji — in kjer je <strong>naslednje stanje odvisno samo od trenutnega</strong>.",
      nextLabel: "02 · Naprej → Skriti Markovski modeli",
      prevLabel: "← Domov",
      bodyHtml: `
<h2>Ideja: sistem brez spomina</h2>
<p>Predstavljaj si vreme, ki se dnevno spreminja med <em>sončno</em> in <em>deževno</em>. Za napoved jutrišnjega vremena nas ne zanima, kakšno je bilo pred mesecem — zadostuje, da poznamo <strong>današnje</strong> vreme. To je bistvo markovske lastnosti:</p>
<div class="formula-box">P(X<sub>t+1</sub> | X<sub>t</sub>, X<sub>t−1</sub>, …, X<sub>0</sub>) = P(X<sub>t+1</sub> | X<sub>t</sub>)</div>
<p>Sistem <strong>nima spomina</strong>: vsa zgodovina je stisnjena v trenutno stanje. Pravi se, da je to <em>markovska lastnost prvega reda</em>.</p>
<h2>Stanja in prehodi</h2>
<p>Markovsko verigo definirata dve stvari:</p>
<ul><li><strong>Množica stanj</strong> S = {s₁, s₂, …, s<sub>N</sub>}.</li>
<li><strong>Prehodna matrika</strong> A, kjer je <code>a<sub>ij</sub> = P(X<sub>t+1</sub>=s<sub>j</sub> | X<sub>t</sub>=s<sub>i</sub>)</code>.</li></ul>
<p>Vsota vsake vrstice mora biti <code>1</code> — iz danega stanja moramo nekam preiti.</p>
<div class="callout"><div class="eyebrow">Konkretno</div>Vreme s stanjema <strong>Sončno</strong> in <strong>Deževno</strong>: če je danes sončno, je jutri s 70 % verjetnostjo spet sončno, s 30 % deževno. Če je danes deževno, je jutri s 60 % deževno, s 40 % sončno.</div>
<h3>Vizualizacija</h3>
<div class="card p-4 my-3">
  <svg viewBox="0 0 500 220" class="w-100" aria-hidden="true">
    <defs><marker id="m-arr" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="var(--accent)"/></marker></defs>
    <circle cx="140" cy="110" r="46" class="node-hidden"/><text x="140" y="105" text-anchor="middle" class="node-text">Sončno</text><text x="140" y="123" text-anchor="middle" class="small-muted">S</text>
    <circle cx="360" cy="110" r="46" class="node-hidden"/><text x="360" y="105" text-anchor="middle" class="node-text">Deževno</text><text x="360" y="123" text-anchor="middle" class="small-muted">D</text>
    <path d="M184 92 Q250 40 316 92" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="250" y="50" text-anchor="middle" class="small-muted">0.30</text>
    <path d="M316 128 Q250 180 184 128" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="250" y="195" text-anchor="middle" class="small-muted">0.40</text>
    <path d="M100 85 C 70 55, 70 140, 100 130" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="55" y="112" text-anchor="middle" class="small-muted">0.70</text>
    <path d="M400 85 C 430 55, 430 140, 400 130" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="455" y="112" text-anchor="middle" class="small-muted">0.60</text>
  </svg>
</div>
<h3>Prehodna matrika</h3>
<pre>       S       D
S    0.70    0.30
D    0.40    0.60</pre>
<h2>Začetna porazdelitev π</h2>
<p>Poleg prehodov potrebujemo še <strong>začetno porazdelitev</strong> <code>π</code>, ki pove, s kolikšno verjetnostjo smo v vsakem stanju ob času <code>t=0</code>. Npr. <code>π = (0.6, 0.4)</code> pomeni 60 % da začnemo sončno.</p>
<h2>Kaj lahko počnemo z markovsko verigo?</h2>
<ul><li><strong>Simuliramo</strong> poteke sistema.</li><li><strong>Računamo verjetnosti</strong> poti, npr. <code>P(S→S→D→D)</code>.</li><li>Najdemo <strong>stacionarno porazdelitev</strong> (dolgoročno razmerje).</li></ul>
<div class="callout"><div class="eyebrow">Pomni</div>V čisti markovski verigi <strong>vidimo stanja neposredno</strong>. V naslednjem koraku jih bomo skrili — in to je začetek zanimivega dela.</div>`,
    },
    hmm: {
      title: "Skriti Markovski modeli",
      eyebrow: "02 · Skriti modeli",
      heading: "Skriti Markovski modeli (HMM)",
      lead: "Nadgradnja markovske verige: stanj <strong>ne vidimo</strong> neposredno. Vidimo samo njihove posledice — opazovanja.",
      nextLabel: "03 · Naprej → Viterbijev algoritem",
      prevLabel: "← 01 · Markovske verige",
      bodyHtml: `
<h2>Kaj pomeni "skrito"?</h2>
<p>V čisti markovski verigi vidimo stanja. Toda v resničnem svetu pogosto <em>ne vidimo</em> tega, kar nas zanima. Vidimo le <strong>simptome</strong>:</p>
<ul><li>Ne vidimo <em>vremena na oddaljeni postaji</em>, vidimo pa <em>ali sosed prinese dežnik</em>.</li>
<li>Ne vidimo <em>razpoloženja osebe</em>, vidimo pa <em>objave na socialnih omrežjih</em>.</li>
<li>Ne vidimo <em>fonemov</em>, ki jih človek izgovori, vidimo pa <em>zvočni signal</em>.</li>
<li>Ne vidimo <em>besedne vrste</em> besede, vidimo pa <em>besedo samo</em>.</li></ul>
<div class="callout"><div class="eyebrow">Ključna ideja</div>Skriti sistem (markovska veriga) generira zaporedje opazovanj. Naša naloga je iz opazovanj <em>sklepati nazaj</em> na skrito stanje.</div>
<h2>Formalno: pet komponent HMM</h2>
<ol><li><strong>Stanja</strong> S = {s₁, …, s<sub>N</sub>} — skrita, ne opazljiva.</li>
<li><strong>Abeceda opazovanj</strong> O = {o₁, …, o<sub>M</sub>} — to kar dejansko vidimo.</li>
<li><strong>Prehodna matrika</strong> A (kot pri markovski verigi).</li>
<li><strong>Emisijska matrika</strong> B, kjer je <code>b<sub>j</sub>(o) = P(o | s<sub>j</sub>)</code>.</li>
<li><strong>Začetna porazdelitev</strong> π.</li></ol>
<h3>Shema modela</h3>
<div class="card p-4 my-3">
  <svg viewBox="0 0 620 260" class="w-100" aria-hidden="true">
    <defs>
      <marker id="h-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--accent)"/></marker>
      <marker id="h-arrM" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--muted)"/></marker>
    </defs>
    <text x="30" y="30" class="small-muted">skrita stanja (nevidna)</text>
    <circle cx="110" cy="80" r="30" class="node-hidden"/><text x="110" y="85" text-anchor="middle" class="node-text">S₁</text>
    <circle cx="280" cy="80" r="30" class="node-hidden"/><text x="280" y="85" text-anchor="middle" class="node-text">S₂</text>
    <circle cx="450" cy="80" r="30" class="node-hidden"/><text x="450" y="85" text-anchor="middle" class="node-text">S₃</text>
    <path d="M140 80 L250 80" stroke="var(--accent)" stroke-width="1.5" fill="none" marker-end="url(#h-arr)"/>
    <path d="M310 80 L420 80" stroke="var(--accent)" stroke-width="1.5" fill="none" marker-end="url(#h-arr)"/>
    <text x="30" y="205" class="small-muted">opazovanja (vidna)</text>
    <rect x="82" y="170" width="56" height="34" rx="6" class="node-obs"/><text x="110" y="192" text-anchor="middle" class="node-text">o₁</text>
    <rect x="252" y="170" width="56" height="34" rx="6" class="node-obs"/><text x="280" y="192" text-anchor="middle" class="node-text">o₂</text>
    <rect x="422" y="170" width="56" height="34" rx="6" class="node-obs"/><text x="450" y="192" text-anchor="middle" class="node-text">o₃</text>
    <line x1="110" y1="110" x2="110" y2="168" stroke="var(--muted)" stroke-dasharray="3 4" marker-end="url(#h-arrM)"/>
    <line x1="280" y1="110" x2="280" y2="168" stroke="var(--muted)" stroke-dasharray="3 4" marker-end="url(#h-arrM)"/>
    <line x1="450" y1="110" x2="450" y2="168" stroke="var(--muted)" stroke-dasharray="3 4" marker-end="url(#h-arrM)"/>
    <line x1="60" y1="245" x2="560" y2="245" stroke="var(--border-strong)" stroke-width="1"/>
    <text x="110" y="258" text-anchor="middle" class="small-muted">t = 1</text>
    <text x="280" y="258" text-anchor="middle" class="small-muted">t = 2</text>
    <text x="450" y="258" text-anchor="middle" class="small-muted">t = 3</text>
  </svg>
</div>
<h2>Trije osnovni problemi HMM</h2>
<div class="row g-3 my-3">
  <div class="col-md-4"><div class="card p-3 h-100"><div class="step-num">1</div><h3 class="h6 mt-3 mb-1">Evalvacija</h3><p class="small text-secondary mb-0">Kolikšna je verjetnost, da je dani HMM proizvedel dano zaporedje opazovanj?<br><span class="mono-small text-muted-2">→ forward algoritem</span></p></div></div>
  <div class="col-md-4"><div class="card p-3 h-100" style="border-color: var(--accent-ring);"><div class="step-num">2</div><h3 class="h6 mt-3 mb-1" style="color: var(--accent);">Dekodiranje</h3><p class="small text-secondary mb-0">Katero zaporedje skritih stanj je <strong>najbolj verjetno</strong> proizvedlo opazovanja?<br><span class="mono-small text-muted-2">→ <strong style="color: var(--accent);">Viterbijev algoritem</strong></span></p></div></div>
  <div class="col-md-4"><div class="card p-3 h-100"><div class="step-num">3</div><h3 class="h6 mt-3 mb-1">Učenje</h3><p class="small text-secondary mb-0">Kako iz zaporedja opazovanj ocenimo parametre modela (A, B, π)?<br><span class="mono-small text-muted-2">→ Baum-Welch</span></p></div></div>
</div>
<div class="callout"><div class="eyebrow">Naš fokus</div>V seminarski se osredotočamo na <strong>dekodiranje</strong>. Viterbijev algoritem je natanko odgovor na to vprašanje.</div>
<h2>Predpostavke HMM</h2>
<ul><li><strong>Markovska predpostavka:</strong> stanje ob času t+1 je odvisno samo od stanja ob času t.</li>
<li><strong>Neodvisnost opazovanj:</strong> opazovanje ob času t je odvisno samo od stanja ob času t, ne od drugih stanj ali opazovanj.</li></ul>
<p>To sta močni poenostavitvi — prav zaradi njiju je model računsko obvladljiv.</p>`,
    },
    viterbi: {
      title: "Viterbijev algoritem",
      eyebrow: "03 · Algoritem",
      heading: "Viterbijev algoritem",
      lead: "Iz zaporedja opazovanj poišči <strong>najbolj verjetno zaporedje skritih stanj</strong> — v polinomskem času z dinamičnim programiranjem.",
      nextLabel: "04 · Naprej → Interaktivni demo",
      prevLabel: "← 02 · Skriti Markovski modeli",
      bodyHtml: `
<h2>Zakaj ne naivno?</h2>
<p>Z N stanji in zaporedjem dolžine T obstaja <strong>N<sup>T</sup></strong> možnih poti skozi skrita stanja. Pri N=5 in T=20 je to več kot 95 milijard. Očitno brutalno preverjanje vsake poti ne pride v poštev.</p>
<div class="callout"><div class="eyebrow">Ključni vpogled</div>Če je <em>delna pot</em> do stanja s ob času t suboptimalna, je ne bomo nikoli potrebovali — karkoli pride za njo, bo bolje skozi boljšo delno pot do istega stanja. Torej za vsako (t, s) hranimo <strong>le najboljšo delno pot</strong>.</div>
<h2>Osnovna ideja: trellis</h2>
<p>Gradimo 2D mrežo (rešetko, <em>trellis</em>): vrstice so stanja, stolpci so časi. Za vsako celico izračunamo <code>v<sub>t</sub>(s)</code> — najboljšo verjetnost poti, ki konča v s ob t. Hkrati si zapomnimo <strong>backpointer</strong> — iz katerega stanja smo prišli.</p>
<h3>Rekurzija</h3>
<div class="formula-box">v<sub>t</sub>(j) = max<sub>i</sub> &nbsp; v<sub>t−1</sub>(i) · a<sub>ij</sub> · b<sub>j</sub>(o<sub>t</sub>)</div>
<p>V besedah: najboljša verjetnost poti do (t, j) je najboljša verjetnost poti do kateregakoli predhodnika (t−1, i), pomnožena s prehodno verjetnostjo iz i v j in emisijsko verjetnostjo, da iz j generiramo opazovanje o<sub>t</sub>.</p>
<h2>Trije koraki</h2>
<h3>1. Inicializacija (t = 0)</h3>
<div class="formula-box">v<sub>0</sub>(s) = π(s) · b<sub>s</sub>(o<sub>0</sub>)</div>
<h3>2. Rekurzija (t = 1, 2, …, T−1)</h3>
<div class="formula-box">v<sub>t</sub>(j) = max<sub>i</sub> v<sub>t−1</sub>(i) · a<sub>ij</sub> · b<sub>j</sub>(o<sub>t</sub>)<br>bp<sub>t</sub>(j) = arg max<sub>i</sub> v<sub>t−1</sub>(i) · a<sub>ij</sub> · b<sub>j</sub>(o<sub>t</sub>)</div>
<h3>3. Terminacija in backtracking</h3>
<p>Najboljša končna verjetnost:</p>
<div class="formula-box">P* = max<sub>s</sub> v<sub>T−1</sub>(s)<br>s*<sub>T−1</sub> = arg max<sub>s</sub> v<sub>T−1</sub>(s)</div>
<p>Po backpointerjih se sprehodimo nazaj: s*<sub>t−1</sub> = bp<sub>t</sub>(s*<sub>t</sub>).</p>
<h2>Psevdokoda</h2>
<pre>function VITERBI(O = o₀…o_{T−1}, S, A, B, π):
    for s in S:
        V[0][s] = π[s] · B[s][o₀]
        bp[0][s] = None
    for t = 1 .. T−1:
        for j in S:
            V[t][j]  = max over i of V[t−1][i] · A[i][j] · B[j][o_t]
            bp[t][j] = argmax over i of V[t−1][i] · A[i][j] · B[j][o_t]
    s* = argmax over s of V[T−1][s]
    path = [s*]
    for t = T−1 .. 1:
        s* = bp[t][s*]
        path.prepend(s*)
    return path, V[T−1][path[T−1]]</pre>
<h2>Kompleksnost</h2>
<ul><li>Čas: <code>O(N² · T)</code> — za vsakega od T časov gremo skozi vsak par (i, j) stanj.</li><li>Prostor: <code>O(N · T)</code> za matriki V in bp.</li></ul>
<p>V primerjavi z naivnim <code>O(N<sup>T</sup>)</code> je to ogromen skok.</p>
<div class="callout"><div class="eyebrow">Praktičen trik</div>Verjetnosti pri dolgih zaporedjih zdrsnejo proti nič (numerical underflow). Zato se množenje v praksi zamenja s <strong>seštevanjem logaritmov</strong>: <code>log v<sub>t</sub>(j) = max<sub>i</sub> [ log v<sub>t−1</sub>(i) + log a<sub>ij</sub> + log b<sub>j</sub>(o<sub>t</sub>) ]</code>.</div>
<h2>Zgodovina in uporaba</h2>
<p>Algoritem je leta <strong>1967</strong> objavil Andrew Viterbi v kontekstu dekodiranja konvolucijskih kod v digitalnih komunikacijah. Kasneje se je razširil na razpoznavanje govora, bioinformatiko, računalniško jezikoslovje (POS-tagging) in marsikaj drugega.</p>
<div class="callout"><div class="eyebrow">Naslednji korak</div>Dovolj teorije — čas je, da algoritem zaženeš v živo. V demoju vidiš, kako se trellis polni stolpec po stolpec, in kako backtracking izriše končno pot.</div>`,
    },
  },
  demo: {
    title: "Interaktivni Viterbi",
    eyebrow: "04 · Interaktivni prikaz",
    heading: "Interaktivni Viterbi",
    lead: "Izberi primer, prilagodi opazovanja in se sprehodi skozi korake algoritma.",
    scenarioLabel: "Scenarij",
    paramsLabel: "Parametri",
    obsSeqLabel: "Zaporedje opazovanj",
    obsEmptyHint: "Izberi opazovanja spodaj.",
    clickToRemove: "Klikni za odstranitev",
    clear: "Počisti",
    transLabel: "Prehodne verjetnosti A",
    emitLabel: "Emisijske verjetnosti B",
    startLabel: "Začetne verjetnosti π",
    runBtn: "Ponovno izračunaj",
    trellisLabel: "Trellis mreža",
    back: "← Nazaj",
    forward: "Naprej →",
    playAll: "Predvajaj vse",
    stop: "Ustavi",
    reset: "Ponastavi",
    matrixLabel: "Viterbijeva matrika V",
    resultLabel: "Rezultat",
    explanationLabel: "Razlaga trenutnega koraka",
    explainIntro: "Pritisni <strong>Naprej →</strong> za sprehod skozi algoritem.",
    explainStart: "<strong>Pripravljen.</strong> Pritisni <em>Naprej →</em> za inicializacijo (t=0).",
    matrixEmpty: "Matrika se bo prikazala ob izračunu.",
    resultEmpty: "Dokončaj korake za backtracking.",
    resultPath: "Najboljša pot:",
    resultProb: "Verjetnost:",
    errEmptyObs: "Najprej dodaj vsaj eno opazovanje.",
    errComputeFailed: "Pri izračunu je prišlo do napake. Poskusi ponovno.",
    stateNames: {
      Sunny: "Sončno",
      Rainy: "Deževno",
      Hot: "Vroče",
      Cold: "Hladno",
      Happy: "Veselo",
      Sad: "Žalostno",
      Bull: "Bikov",
      Bear: "Medvedji",
      Tired: "Utrujen",
      Alert: "Buden",
      Free: "Tekoče",
      Congested: "Zastoj",
    },
    obsNames: {
      Umbrella: "Dežnik",
      NoUmbrella: "Brez dežnika",
      "1": "1",
      "2": "2",
      "3": "3",
      Meme: "Meme",
      Selfie: "Selfie",
      Quote: "Citat",
      Up: "Gor",
      Down: "Dol",
      Flat: "Mir",
      Espresso: "Espresso",
      Water: "Voda",
      Tea: "Čaj",
      SlowCar: "Počasni avto",
      FastCar: "Hitri avto",
      Bus: "Avtobus",
    },
    initMessage: (t, obs) =>
      `Inicializacija (t=${t}, opazovanje = '${obs}'): V[0][s] = π(s) · b_s(${obs}) za vsako stanje s.`,
    initFormula: (state, obs, pi, b, value) =>
      `π(${state})·b_${state}(${obs}) = ${pi}·${b} = ${value}`,
    recursionMessage: (t, obs) =>
      `Korak t=${t}, opazovanje = '${obs}': za vsako stanje s izračunamo max_sp V[${t - 1}][sp]·a(sp→s)·b_s(${obs}) in shranimo najboljšega predhodnika.`,
    recursionFormula: (_t, _state, _obs, from, value) =>
      `max → prihaja iz '${from}', vrednost = ${value}`,
    terminateMessage: (bestProb, finalState, path) =>
      `Backtracking: najboljša končna verjetnost je ${bestProb} v stanju '${finalState}'. Po backpointerjih sledimo nazaj → pot: ${path}.`,
  },
  primeri: {
    title: "Primeri",
    eyebrow: "05 · Scenariji",
    heading: "Pripravljeni primeri",
    lead: "Hitro naloži parametre v demo in se igraj.",
    statesCount: (n) => `${n} stanj`,
    symbolsCount: (n) => `${n} simbolov`,
    seqLen: (n) => `T=${n}`,
    statesLabel: "Stanja:",
    seqLabel: "Zaporedje:",
  },
  examples: {
    vreme: {
      name: "Vreme → Dežnik",
      description:
        "Klasičen uvodni primer. Skrita stanja so vreme (sončno/deževno), opazovanja pa ali soseda opaziš z dežnikom. Iz zaporedja dežnikov ugibamo vreme.",
    },
    sladoled: {
      name: "Sladoled (Jurafsky)",
      description:
        "Primer iz knjige Jurafsky & Martin. Skrita stanja: HOT/COLD dan. Opazovanja: število pojedenih sladoledov (1, 2 ali 3).",
    },
    razpolozenje: {
      name: "Razpoloženje → Objave",
      description:
        "Skrita stanja so razpoloženje osebe (veselo/žalostno), opazovanja pa tip objave na socialnem omrežju.",
    },
    borza: {
      name: "Borza → Tržni režim",
      description:
        "Klasična uporaba HMM v financah (regime-switching model). Skrita stanja so tržni režim: Bikov trg (rast) ali Medvedji trg (padec). Opazovanja so dnevni premiki indeksa: Gor, Dol ali Mir. Iz zaporedja dnevnih gibov skušamo ugotoviti, kakšno je bilo ozadje trga.",
    },
    kava: {
      name: "Kavna pavza → Fokus",
      description:
        "Skrita stanja so zbranost (utrujen / buden). Opazovanja so pijača, ki jo izbereš na pavzi — espresso, voda ali čaj. Iz zaporedja pijač ugibamo, kdaj si bil utrujen.",
    },
    promet: {
      name: "Avtocesta → Promet",
      description:
        "Skrita stanja so stanje prometa na odseku avtoceste (tekoče ali zastoj). Opazovanja so vozila, ki jih kamera vidi mimo — počasni avto, hitri avto ali avtobus.",
    },
  },
};
