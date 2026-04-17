import type { LocaleStrings } from "./index";
import { PATHS } from "../paths";

export const de: LocaleStrings = {
  htmlLang: "de",
  nav: {
    home: "Startseite",
    markov: "Markov-Ketten",
    hmm: "Versteckte Modelle",
    viterbi: "Viterbi-Algorithmus",
    demo: "Interaktive Demo",
    primeri: "Beispiele",
    github: "GitHub",
  },
  common: {
    brand: "Viterbi Explorer",
    subtitle:
      "Seminararbeit · Informatik 2 · Hidden-Markov-Modelle und der Viterbi-Algorithmus",
    footerProject: "Interaktive Erklärung, in TypeScript geschrieben.",
    langLabel: "Sprache",
    back: "Zurück",
    next: "Weiter",
  },
  home: {
    title: "Viterbi Explorer — Startseite",
    heroBadge: "Seminararbeit · Informatik 2",
    heroHeadStart: "Willkommen bei ",
    heroHeadHighlight: "Viterbi Explorer",
    heroHeadEnd: ".",
    heroLead:
      "Eine interaktive Erklärung von <strong>Hidden-Markov-Modellen</strong> und dem <strong>Viterbi-Algorithmus</strong> — von einfachen Markov-Ketten bis zum animierten Trellis mit numerischen Beispielen.",
    btnStart: "Mit der Theorie beginnen →",
    btnDemo: "Demo öffnen",
    btnGithub: "GitHub-Repo ↗",
    hiddenLabel: "versteckter Zustand",
    obsLabel: "Beobachtung",
    emissionLabel: "Emissionswahrscheinlichkeit",
    sectionContentEyebrow: "01 · Inhalt",
    sectionContentTitle: "Folge der natürlichen Reihenfolge",
    sectionContentHint: "empfohlener Ablauf →",
    sectionContentLead:
      "Viterbi baut auf Hidden-Markov-Modellen auf, und diese auf gewöhnlichen Markov-Ketten. Der Pfad unten führt dich von den Grundlagen zur Live-Demo.",
    cards: [
      { num: "01", title: "Markov-Ketten", body: "Zustände, Übergänge und die Gedächtnislosigkeit. Der Baustein für alles Weitere.", href: PATHS.markov },
      { num: "02", title: "Versteckte Modelle", body: "Wenn wir die Zustände nicht sehen, nur ihre Folgen. HMMs und die drei Probleme.", href: PATHS.hmm },
      { num: "03", title: "Viterbi-Algorithmus", body: "Dynamische Programmierung, Trellis und Backtracking. Das Herzstück der Arbeit.", href: PATHS.viterbi },
      { num: "04", title: "Interaktive Demo", body: "Animierter Trellis. Ändere Wahrscheinlichkeiten und Beobachtungen — der Algorithmus läuft live.", href: PATHS.demo },
      { num: "05", title: "Beispiele", body: "Fertige Szenarien: Wetter, Stimmung, Jurafskys Eiscreme, Aktienmarkt.", href: PATHS.primeri },
      { num: "06", title: "Weiterführend", body: "Jurafsky & Martin, Rabiners Tutorial, Wikipedia und mehr.", href: "https://de.wikipedia.org/wiki/Hidden_Markov_Model", external: true },
    ],
    formulaEyebrow: "02 · Zentrale Formel",
    formulaTitle: "Viterbi-Rekursion",
    formulaCaption:
      "Die beste Wahrscheinlichkeit eines Pfades, der zur Zeit <code>t</code> im Zustand <code>j</code> endet, ist das Maximum über alle möglichen Vorgängerzustände <code>i</code>, multipliziert mit der Übergangswahrscheinlichkeit <code>a<sub>ij</sub></code> und der Emissionswahrscheinlichkeit <code>b<sub>j</sub>(o<sub>t</sub>)</code>.",
    usageEyebrow: "03 · Anwendungen",
    usageTitle: "Viterbi in der realen Welt",
    usageItems: [
      { title: "Spracherkennung.", body: "Phoneme als versteckte Zustände, das akustische Signal als Beobachtung." },
      { title: "Bioinformatik.", body: "Markierung codierender Regionen in DNA-Sequenzen." },
      { title: "POS-Tagging.", body: "Bestimmung der Wortarten in der Computerlinguistik." },
      { title: "Telekommunikation.", body: "Decodierung von Faltungscodes (Viterbi, 1967)." },
    ],
  },
  theory: {
    markov: {
      title: "Markov-Ketten",
      eyebrow: "01 · Grundlagen",
      heading: "Markov-Ketten",
      lead: "Ein mathematisches Modell eines Systems, das zwischen Zuständen springt — bei dem der <strong>nächste Zustand nur vom aktuellen abhängt</strong>.",
      nextLabel: "02 · Weiter → Hidden-Markov-Modelle",
      prevLabel: "← Startseite",
      bodyHtml: `
<h2>Idee: ein gedächtnisloses System</h2>
<p>Stell dir das Wetter vor, das täglich zwischen <em>sonnig</em> und <em>regnerisch</em> wechselt. Um das morgige Wetter vorherzusagen, interessiert uns nicht, wie es vor einem Monat war — es genügt, das <strong>heutige</strong> Wetter zu kennen. Das ist der Kern der Markov-Eigenschaft:</p>
<div class="formula-box">P(X<sub>t+1</sub> | X<sub>t</sub>, X<sub>t−1</sub>, …, X<sub>0</sub>) = P(X<sub>t+1</sub> | X<sub>t</sub>)</div>
<p>Das System <strong>hat kein Gedächtnis</strong>: die ganze Geschichte ist im aktuellen Zustand zusammengefasst. Das nennt man die <em>Markov-Eigenschaft erster Ordnung</em>.</p>
<h2>Zustände und Übergänge</h2>
<p>Eine Markov-Kette wird durch zwei Dinge definiert:</p>
<ul><li><strong>Menge der Zustände</strong> S = {s₁, s₂, …, s<sub>N</sub>}.</li>
<li><strong>Übergangsmatrix</strong> A mit <code>a<sub>ij</sub> = P(X<sub>t+1</sub>=s<sub>j</sub> | X<sub>t</sub>=s<sub>i</sub>)</code>.</li></ul>
<p>Jede Zeilensumme muss <code>1</code> sein — aus jedem Zustand muss man irgendwohin übergehen.</p>
<div class="callout"><div class="eyebrow">Konkret</div>Wetter mit den Zuständen <strong>Sonnig</strong> und <strong>Regnerisch</strong>: wenn es heute sonnig ist, ist es morgen mit 70 % wieder sonnig und mit 30 % regnerisch. Wenn es heute regnet, regnet es morgen mit 60 % und ist sonnig mit 40 %.</div>
<h3>Visualisierung</h3>
<div class="card p-4 my-3">
  <svg viewBox="0 0 500 220" class="w-100" aria-hidden="true">
    <defs><marker id="m-arr" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="var(--accent)"/></marker></defs>
    <circle cx="140" cy="110" r="46" class="node-hidden"/><text x="140" y="105" text-anchor="middle" class="node-text">Sonnig</text><text x="140" y="123" text-anchor="middle" class="small-muted">S</text>
    <circle cx="360" cy="110" r="46" class="node-hidden"/><text x="360" y="105" text-anchor="middle" class="node-text">Regen</text><text x="360" y="123" text-anchor="middle" class="small-muted">R</text>
    <path d="M184 92 Q250 40 316 92" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="250" y="50" text-anchor="middle" class="small-muted">0.30</text>
    <path d="M316 128 Q250 180 184 128" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="250" y="195" text-anchor="middle" class="small-muted">0.40</text>
    <path d="M100 85 C 70 55, 70 140, 100 130" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="55" y="112" text-anchor="middle" class="small-muted">0.70</text>
    <path d="M400 85 C 430 55, 430 140, 400 130" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="455" y="112" text-anchor="middle" class="small-muted">0.60</text>
  </svg>
</div>
<h3>Übergangsmatrix</h3>
<pre>       S       R
S    0.70    0.30
R    0.40    0.60</pre>
<h2>Anfangsverteilung π</h2>
<p>Zusätzlich zu den Übergängen brauchen wir eine <strong>Anfangsverteilung</strong> <code>π</code>, die die Wahrscheinlichkeit angibt, zur Zeit <code>t=0</code> in jedem Zustand zu sein. Z. B. <code>π = (0.6, 0.4)</code> heißt, wir starten zu 60 % sonnig.</p>
<h2>Was können wir mit einer Markov-Kette tun?</h2>
<ul><li><strong>Simulieren</strong> von Systemverläufen.</li><li><strong>Wahrscheinlichkeiten berechnen</strong>, z. B. <code>P(S→S→R→R)</code>.</li><li>Die <strong>stationäre Verteilung</strong> finden (Langzeitverhältnis).</li></ul>
<div class="callout"><div class="eyebrow">Merke</div>In einer reinen Markov-Kette <strong>sehen wir die Zustände direkt</strong>. Im nächsten Schritt verstecken wir sie — und damit wird es spannend.</div>`,
    },
    hmm: {
      title: "Hidden-Markov-Modelle",
      eyebrow: "02 · Versteckte Modelle",
      heading: "Hidden-Markov-Modelle (HMM)",
      lead: "Eine Erweiterung der Markov-Kette: die Zustände <strong>sehen wir nicht</strong> direkt. Wir sehen nur ihre Konsequenzen — Beobachtungen.",
      nextLabel: "03 · Weiter → Viterbi-Algorithmus",
      prevLabel: "← 01 · Markov-Ketten",
      bodyHtml: `
<h2>Was bedeutet „versteckt"?</h2>
<p>In einer reinen Markov-Kette sehen wir die Zustände. In der realen Welt sehen wir oft <em>nicht</em>, was uns interessiert — wir sehen nur die <strong>Symptome</strong>:</p>
<ul><li>Wir sehen nicht das <em>Wetter an einer entfernten Station</em>, aber wir sehen, <em>ob der Nachbar einen Regenschirm trägt</em>.</li>
<li>Wir sehen nicht die <em>Stimmung einer Person</em>, aber wir sehen ihre <em>Social-Media-Beiträge</em>.</li>
<li>Wir sehen nicht die <em>Phoneme</em>, die jemand ausspricht, aber wir hören das <em>akustische Signal</em>.</li>
<li>Wir sehen nicht die <em>Wortart</em> eines Wortes, aber wir sehen das <em>Wort</em>.</li></ul>
<div class="callout"><div class="eyebrow">Kernidee</div>Ein verstecktes System (Markov-Kette) erzeugt eine Folge von Beobachtungen. Unsere Aufgabe ist es, aus den Beobachtungen <em>rückwärts</em> auf den versteckten Zustand zu schließen.</div>
<h2>Formal: die fünf HMM-Komponenten</h2>
<ol><li><strong>Zustände</strong> S = {s₁, …, s<sub>N</sub>} — versteckt, nicht beobachtbar.</li>
<li><strong>Beobachtungsalphabet</strong> O = {o₁, …, o<sub>M</sub>} — was wir tatsächlich sehen.</li>
<li><strong>Übergangsmatrix</strong> A (wie bei der Markov-Kette).</li>
<li><strong>Emissionsmatrix</strong> B mit <code>b<sub>j</sub>(o) = P(o | s<sub>j</sub>)</code>.</li>
<li><strong>Anfangsverteilung</strong> π.</li></ol>
<h3>Modellschema</h3>
<div class="card p-4 my-3">
  <svg viewBox="0 0 620 260" class="w-100" aria-hidden="true">
    <defs>
      <marker id="h-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--accent)"/></marker>
      <marker id="h-arrM" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--muted)"/></marker>
    </defs>
    <text x="30" y="30" class="small-muted">versteckte Zustände (unsichtbar)</text>
    <circle cx="110" cy="80" r="30" class="node-hidden"/><text x="110" y="85" text-anchor="middle" class="node-text">S₁</text>
    <circle cx="280" cy="80" r="30" class="node-hidden"/><text x="280" y="85" text-anchor="middle" class="node-text">S₂</text>
    <circle cx="450" cy="80" r="30" class="node-hidden"/><text x="450" y="85" text-anchor="middle" class="node-text">S₃</text>
    <path d="M140 80 L250 80" stroke="var(--accent)" stroke-width="1.5" fill="none" marker-end="url(#h-arr)"/>
    <path d="M310 80 L420 80" stroke="var(--accent)" stroke-width="1.5" fill="none" marker-end="url(#h-arr)"/>
    <text x="30" y="205" class="small-muted">Beobachtungen (sichtbar)</text>
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
<h2>Die drei klassischen HMM-Probleme</h2>
<div class="row g-3 my-3">
  <div class="col-md-4"><div class="card p-3 h-100"><div class="step-num">1</div><h3 class="h6 mt-3 mb-1">Evaluation</h3><p class="small text-secondary mb-0">Wie wahrscheinlich ist es, dass ein gegebenes HMM eine bestimmte Beobachtungsfolge erzeugt hat?<br><span class="mono-small text-muted-2">→ Forward-Algorithmus</span></p></div></div>
  <div class="col-md-4"><div class="card p-3 h-100" style="border-color: var(--accent-ring);"><div class="step-num">2</div><h3 class="h6 mt-3 mb-1" style="color: var(--accent);">Decodierung</h3><p class="small text-secondary mb-0">Welche Folge versteckter Zustände hat die Beobachtungen <strong>am wahrscheinlichsten</strong> erzeugt?<br><span class="mono-small text-muted-2">→ <strong style="color: var(--accent);">Viterbi-Algorithmus</strong></span></p></div></div>
  <div class="col-md-4"><div class="card p-3 h-100"><div class="step-num">3</div><h3 class="h6 mt-3 mb-1">Lernen</h3><p class="small text-secondary mb-0">Wie schätzen wir die Modellparameter (A, B, π) aus Beobachtungen?<br><span class="mono-small text-muted-2">→ Baum-Welch</span></p></div></div>
</div>
<div class="callout"><div class="eyebrow">Unser Fokus</div>In dieser Arbeit konzentrieren wir uns auf die <strong>Decodierung</strong>. Der Viterbi-Algorithmus ist genau die Antwort darauf.</div>
<h2>HMM-Annahmen</h2>
<ul><li><strong>Markov-Annahme:</strong> der Zustand zur Zeit t+1 hängt nur vom Zustand zur Zeit t ab.</li>
<li><strong>Ausgabeunabhängigkeit:</strong> die Beobachtung zur Zeit t hängt nur vom Zustand zur Zeit t ab, nicht von anderen Zuständen oder Beobachtungen.</li></ul>
<p>Das sind starke Vereinfachungen — gerade dank ihnen ist das Modell berechenbar.</p>`,
    },
    viterbi: {
      title: "Viterbi-Algorithmus",
      eyebrow: "03 · Algorithmus",
      heading: "Der Viterbi-Algorithmus",
      lead: "Finde aus einer Beobachtungsfolge die <strong>wahrscheinlichste Folge versteckter Zustände</strong> — in polynomieller Zeit mittels dynamischer Programmierung.",
      nextLabel: "04 · Weiter → Interaktive Demo",
      prevLabel: "← 02 · Hidden-Markov-Modelle",
      bodyHtml: `
<h2>Warum nicht naiv?</h2>
<p>Mit N Zuständen und einer Folge der Länge T gibt es <strong>N<sup>T</sup></strong> mögliche Pfade. Bei N=5 und T=20 sind das über 95 Milliarden. Die rohe Aufzählung aller Pfade kommt also nicht in Frage.</p>
<div class="callout"><div class="eyebrow">Kernidee</div>Ein suboptimaler <em>Teilpfad</em>, der zur Zeit t im Zustand s endet, wird nie benötigt — was danach kommt, lässt sich immer besser an einen besseren Teilpfad zum selben Zustand anhängen. Für jedes Paar (t, s) behalten wir also nur den <strong>besten Teilpfad</strong>.</div>
<h2>Kernidee: der Trellis</h2>
<p>Wir bauen ein 2-D-Gitter (<em>Trellis</em>): Zeilen sind Zustände, Spalten sind Zeitschritte. Für jede Zelle berechnen wir <code>v<sub>t</sub>(s)</code> — die beste Pfadwahrscheinlichkeit, die zur Zeit t in s endet. Gleichzeitig merken wir uns einen <strong>Backpointer</strong> — aus welchem Zustand wir gekommen sind.</p>
<h3>Rekursion</h3>
<div class="formula-box">v<sub>t</sub>(j) = max<sub>i</sub> &nbsp; v<sub>t−1</sub>(i) · a<sub>ij</sub> · b<sub>j</sub>(o<sub>t</sub>)</div>
<p>In Worten: die beste Wahrscheinlichkeit eines Pfades bis (t, j) ist die beste Wahrscheinlichkeit zu einem beliebigen Vorgänger (t−1, i), multipliziert mit der Übergangswahrscheinlichkeit <code>a<sub>ij</sub></code> und der Emissionswahrscheinlichkeit <code>b<sub>j</sub>(o<sub>t</sub>)</code>.</p>
<h2>Drei Schritte</h2>
<h3>1. Initialisierung (t = 0)</h3>
<div class="formula-box">v<sub>0</sub>(s) = π(s) · b<sub>s</sub>(o<sub>0</sub>)</div>
<h3>2. Rekursion (t = 1, 2, …, T−1)</h3>
<div class="formula-box">v<sub>t</sub>(j) = max<sub>i</sub> v<sub>t−1</sub>(i) · a<sub>ij</sub> · b<sub>j</sub>(o<sub>t</sub>)<br>bp<sub>t</sub>(j) = arg max<sub>i</sub> v<sub>t−1</sub>(i) · a<sub>ij</sub> · b<sub>j</sub>(o<sub>t</sub>)</div>
<h3>3. Terminierung und Backtracking</h3>
<p>Die beste Endwahrscheinlichkeit:</p>
<div class="formula-box">P* = max<sub>s</sub> v<sub>T−1</sub>(s)<br>s*<sub>T−1</sub> = arg max<sub>s</sub> v<sub>T−1</sub>(s)</div>
<p>Den Backpointern folgen wir rückwärts: s*<sub>t−1</sub> = bp<sub>t</sub>(s*<sub>t</sub>).</p>
<h2>Pseudocode</h2>
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
<h2>Komplexität</h2>
<ul><li>Zeit: <code>O(N² · T)</code> — für jeden der T Schritte gehen wir jedes Paar (i, j) von Zuständen durch.</li><li>Platz: <code>O(N · T)</code> für die Tabellen V und bp.</li></ul>
<p>Verglichen mit der naiven <code>O(N<sup>T</sup>)</code>-Variante ist das ein enormer Gewinn.</p>
<div class="callout"><div class="eyebrow">Praktischer Trick</div>Bei langen Folgen rutschen die Wahrscheinlichkeiten gegen null (numerisches Underflow). In der Praxis ersetzt man die Multiplikation durch die <strong>Addition von Logarithmen</strong>: <code>log v<sub>t</sub>(j) = max<sub>i</sub> [ log v<sub>t−1</sub>(i) + log a<sub>ij</sub> + log b<sub>j</sub>(o<sub>t</sub>) ]</code>.</div>
<h2>Geschichte und Anwendungen</h2>
<p>Der Algorithmus wurde <strong>1967</strong> von Andrew Viterbi im Kontext der Decodierung von Faltungscodes in der digitalen Kommunikation veröffentlicht. Später verbreitete er sich in der Spracherkennung, Bioinformatik, Computerlinguistik (POS-Tagging) und in vielen anderen Gebieten.</p>
<div class="callout"><div class="eyebrow">Nächster Schritt</div>Genug Theorie — Zeit, den Algorithmus live laufen zu lassen. In der Demo siehst du, wie sich der Trellis Spalte für Spalte füllt und wie das Backtracking den endgültigen Pfad zeichnet.</div>`,
    },
  },
  demo: {
    title: "Interaktiver Viterbi",
    eyebrow: "04 · Interaktive Demo",
    heading: "Interaktiver Viterbi",
    lead: "Wähle ein Szenario, passe die Beobachtungen an und gehe Schritt für Schritt durch den Algorithmus.",
    scenarioLabel: "Szenario",
    paramsLabel: "Parameter",
    obsSeqLabel: "Beobachtungsfolge",
    obsEmptyHint: "Wähle Beobachtungen unten aus.",
    clickToRemove: "Klicken zum Entfernen",
    clear: "Leeren",
    transLabel: "Übergangswahrscheinlichkeiten A",
    emitLabel: "Emissionswahrscheinlichkeiten B",
    startLabel: "Anfangswahrscheinlichkeiten π",
    runBtn: "Neu berechnen",
    trellisLabel: "Trellis-Gitter",
    back: "← Zurück",
    forward: "Weiter →",
    playAll: "Alles abspielen",
    stop: "Stopp",
    reset: "Zurücksetzen",
    matrixLabel: "Viterbi-Matrix V",
    resultLabel: "Ergebnis",
    explanationLabel: "Erklärung des aktuellen Schritts",
    explainIntro: "Drücke <strong>Weiter →</strong>, um durch den Algorithmus zu gehen.",
    explainStart: "<strong>Bereit.</strong> Drücke <em>Weiter →</em> für die Initialisierung (t=0).",
    matrixEmpty: "Die Matrix erscheint nach der Berechnung.",
    resultEmpty: "Schließe die Schritte ab, um das Backtracking zu sehen.",
    resultPath: "Bester Pfad:",
    resultProb: "Wahrscheinlichkeit:",
    errEmptyObs: "Füge zuerst mindestens eine Beobachtung hinzu.",
    errComputeFailed: "Die Berechnung ist fehlgeschlagen. Bitte erneut versuchen.",
    stateNames: {
      Sunny: "Sonnig",
      Rainy: "Regnerisch",
      Hot: "Heiß",
      Cold: "Kalt",
      Happy: "Fröhlich",
      Sad: "Traurig",
      Bull: "Bullenmarkt",
      Bear: "Bärenmarkt",
      Tired: "Müde",
      Alert: "Wach",
      Free: "Flüssig",
      Congested: "Stau",
    },
    obsNames: {
      Umbrella: "Regenschirm",
      NoUmbrella: "Kein Schirm",
      "1": "1",
      "2": "2",
      "3": "3",
      Meme: "Meme",
      Selfie: "Selfie",
      Quote: "Zitat",
      Up: "Hoch",
      Down: "Runter",
      Flat: "Flach",
      Espresso: "Espresso",
      Water: "Wasser",
      Tea: "Tee",
      SlowCar: "Langsames Auto",
      FastCar: "Schnelles Auto",
      Bus: "Bus",
    },
    initMessage: (t, obs) =>
      `Initialisierung (t=${t}, Beobachtung = '${obs}'): V[0][s] = π(s) · b_s(${obs}) für jeden Zustand s.`,
    initFormula: (state, obs, pi, b, value) =>
      `π(${state})·b_${state}(${obs}) = ${pi}·${b} = ${value}`,
    recursionMessage: (t, obs) =>
      `Schritt t=${t}, Beobachtung = '${obs}': für jeden Zustand s berechnen wir max_sp V[${t - 1}][sp]·a(sp→s)·b_s(${obs}) und speichern den besten Vorgänger.`,
    recursionFormula: (_t, _state, _obs, from, value) =>
      `max → aus '${from}', Wert = ${value}`,
    terminateMessage: (bestProb, finalState, path) =>
      `Backtracking: die beste Endwahrscheinlichkeit ist ${bestProb} im Zustand '${finalState}'. Den Backpointern folgend → Pfad: ${path}.`,
  },
  primeri: {
    title: "Beispiele",
    eyebrow: "05 · Szenarien",
    heading: "Fertige Beispiele",
    lead: "Lade die Parameter mit einem Klick in die Demo und fang an zu spielen.",
    statesCount: (n) => `${n} Zustände`,
    symbolsCount: (n) => `${n} Symbole`,
    seqLen: (n) => `T=${n}`,
    statesLabel: "Zustände:",
    seqLabel: "Folge:",
  },
  examples: {
    vreme: {
      name: "Wetter → Regenschirm",
      description:
        "Klassisches Einführungsbeispiel. Versteckte Zustände sind das Wetter (sonnig/regnerisch), beobachtet wird, ob der Nachbar einen Regenschirm trägt. Aus der Schirmfolge erraten wir das Wetter.",
    },
    sladoled: {
      name: "Eiscreme (Jurafsky)",
      description:
        "Beispiel aus Jurafsky & Martin. Versteckte Zustände: heißer oder kalter Tag. Beobachtungen: Anzahl gegessener Eis (1, 2 oder 3).",
    },
    razpolozenje: {
      name: "Stimmung → Posts",
      description:
        "Versteckte Zustände sind die Stimmung einer Person (fröhlich/traurig); Beobachtungen sind der Posttyp im sozialen Netzwerk.",
    },
    borza: {
      name: "Aktienmarkt → Regime",
      description:
        "Klassischer HMM-Einsatz in der Finanzwelt (Regime-Switching-Modell). Versteckte Zustände: Bullenmarkt (steigend) oder Bärenmarkt (fallend). Beobachtungen: tägliche Indexbewegungen — Hoch, Runter, Flach. Aus den Tagesbewegungen schließen wir auf das Marktregime.",
    },
    kava: {
      name: "Kaffeepause → Fokus",
      description:
        "Versteckte Zustände sind dein Fokus (müde / wach). Beobachtungen sind das Getränk in der Pause — Espresso, Wasser oder Tee. Aus der Getränkefolge raten wir, wann du müde warst.",
    },
    promet: {
      name: "Autobahn → Verkehr",
      description:
        "Versteckte Zustände sind der Verkehrszustand auf einem Autobahnabschnitt (flüssig oder Stau). Beobachtungen sind, was die Kamera vorbeifahren sieht — langsames Auto, schnelles Auto oder Bus.",
    },
  },
};
