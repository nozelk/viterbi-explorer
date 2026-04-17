import type { LocaleStrings } from "./index";
import { PATHS } from "../paths";

export const en: LocaleStrings = {
  htmlLang: "en",
  nav: {
    home: "Home",
    markov: "Markov chains",
    hmm: "Hidden models",
    viterbi: "Viterbi algorithm",
    demo: "Interactive demo",
    primeri: "Examples",
    github: "GitHub",
  },
  common: {
    brand: "Viterbi Explorer",
    subtitle: "Term project · Computer Science 2 · Hidden Markov Models and the Viterbi algorithm",
    footerProject: "Interactive explainer, written in TypeScript.",
    langLabel: "Language",
    back: "Back",
    next: "Next",
  },
  home: {
    title: "Viterbi Explorer — Home",
    heroBadge: "Term project · Computer Science 2",
    heroHeadStart: "",
    heroHeadHighlight: "Viterbi Explorer",
    heroHeadEnd: "",
    heroTagline: "A visual handbook for Hidden Markov Models.",
    heroLead:
      "An interactive walk-through of <strong>Hidden Markov Models</strong> and the <strong>Viterbi algorithm</strong> — from basic Markov chains to an animated trellis with worked numeric examples.",
    btnStart: "Start with theory →",
    btnDemo: "Open the demo",
    btnGithub: "GitHub repo ↗",
    hiddenLabel: "hidden state",
    obsLabel: "observation",
    emissionLabel: "emission probability",
    sectionContentEyebrow: "01 · Contents",
    sectionContentTitle: "Follow the natural order",
    sectionContentHint: "recommended flow →",
    sectionContentLead:
      "Viterbi sits on top of hidden Markov models, which in turn sit on top of plain Markov chains. The path below takes you from the basics to a live demo.",
    cards: [
      { num: "01", title: "Markov chains", body: "States, transitions and the memoryless property. The building block of everything that follows.", href: PATHS.markov },
      { num: "02", title: "Hidden models", body: "When the states are invisible and we only see their consequences. HMMs and the three problems.", href: PATHS.hmm },
      { num: "03", title: "Viterbi algorithm", body: "Dynamic programming, trellis and backtracking. The heart of the project.", href: PATHS.viterbi },
      { num: "04", title: "Interactive demo", body: "Animated trellis. Tweak probabilities and observations — the algorithm reruns live.", href: PATHS.demo },
      { num: "05", title: "Examples", body: "Ready-made scenarios: weather, mood, Jurafsky's ice-cream, stock market regimes.", href: PATHS.primeri },
      { num: "06", title: "External reading", body: "Jurafsky & Martin, Rabiner's tutorial, Wikipedia and more.", href: "https://en.wikipedia.org/wiki/Hidden_Markov_model", external: true },
    ],
    formulaEyebrow: "02 · Core formula",
    formulaTitle: "Viterbi recursion",
    formulaCaption:
      "The best probability of a path ending in state <code>j</code> at time <code>t</code> is the maximum over all possible predecessors <code>i</code>, multiplied by the transition probability <code>a<sub>ij</sub></code> and the emission probability <code>b<sub>j</sub>(o<sub>t</sub>)</code>.",
    usageEyebrow: "03 · Where this is used",
    usageTitle: "Viterbi in the real world",
    usageItems: [
      { title: "Speech recognition.", body: "Phonemes as hidden states, the acoustic signal as observations." },
      { title: "Bioinformatics.", body: "Labelling coding regions inside DNA sequences." },
      { title: "POS tagging.", body: "Assigning parts of speech in computational linguistics." },
      { title: "Telecommunications.", body: "Decoding convolutional codes (Viterbi, 1967)." },
    ],
  },
  theory: {
    markov: {
      title: "Markov chains",
      eyebrow: "01 · Basics",
      heading: "Markov chains",
      lead: "A mathematical model of a system that hops between states — where the <strong>next state depends only on the current one</strong>.",
      nextLabel: "02 · Next → Hidden Markov Models",
      prevLabel: "← Home",
      bodyHtml: `
<h2>Idea: a memoryless system</h2>
<p>Imagine the weather switching day-to-day between <em>sunny</em> and <em>rainy</em>. To predict tomorrow, we do not care what the weather was a month ago — knowing <strong>today</strong> is enough. That is the Markov property:</p>
<div class="formula-box">P(X<sub>t+1</sub> | X<sub>t</sub>, X<sub>t−1</sub>, …, X<sub>0</sub>) = P(X<sub>t+1</sub> | X<sub>t</sub>)</div>
<p>The system has <strong>no memory</strong>: the whole history is compressed into the current state. This is called the <em>first-order</em> Markov property.</p>
<h2>States and transitions</h2>
<p>A Markov chain is defined by two things:</p>
<ul><li><strong>A set of states</strong> S = {s₁, s₂, …, s<sub>N</sub>}.</li>
<li><strong>A transition matrix</strong> A, where <code>a<sub>ij</sub> = P(X<sub>t+1</sub>=s<sub>j</sub> | X<sub>t</sub>=s<sub>i</sub>)</code>.</li></ul>
<p>Each row must sum to <code>1</code> — from any state we have to go somewhere.</p>
<div class="callout"><div class="eyebrow">Concretely</div>Weather with states <strong>Sunny</strong> and <strong>Rainy</strong>: if today is sunny, tomorrow is sunny with probability 70% and rainy with 30%. If today is rainy, tomorrow is rainy with 60% and sunny with 40%.</div>
<h3>Visualization</h3>
<div class="card p-4 my-3">
  <svg viewBox="0 0 500 220" class="w-100" aria-hidden="true">
    <defs><marker id="m-arr" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="var(--accent)"/></marker></defs>
    <circle cx="140" cy="110" r="46" class="node-hidden"/><text x="140" y="105" text-anchor="middle" class="node-text">Sunny</text><text x="140" y="123" text-anchor="middle" class="small-muted">S</text>
    <circle cx="360" cy="110" r="46" class="node-hidden"/><text x="360" y="105" text-anchor="middle" class="node-text">Rainy</text><text x="360" y="123" text-anchor="middle" class="small-muted">R</text>
    <path d="M184 92 Q250 40 316 92" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="250" y="50" text-anchor="middle" class="small-muted">0.30</text>
    <path d="M316 128 Q250 180 184 128" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="250" y="195" text-anchor="middle" class="small-muted">0.40</text>
    <path d="M100 85 C 70 55, 70 140, 100 130" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="55" y="112" text-anchor="middle" class="small-muted">0.70</text>
    <path d="M400 85 C 430 55, 430 140, 400 130" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#m-arr)"/><text x="455" y="112" text-anchor="middle" class="small-muted">0.60</text>
  </svg>
</div>
<h3>Transition matrix</h3>
<pre>       S       R
S    0.70    0.30
R    0.40    0.60</pre>
<h2>Initial distribution π</h2>
<p>On top of the transitions, we need an <strong>initial distribution</strong> <code>π</code>, telling us the probability of starting in each state at <code>t=0</code>. For example <code>π = (0.6, 0.4)</code> means we start sunny with probability 60%.</p>
<h2>What can we do with a Markov chain?</h2>
<ul><li><strong>Simulate</strong> trajectories.</li><li><strong>Compute probabilities</strong> of paths, e.g. <code>P(S→S→R→R)</code>.</li><li>Find the <strong>stationary distribution</strong> (long-term ratios).</li></ul>
<div class="callout"><div class="eyebrow">Remember</div>In a pure Markov chain the states are <strong>observed directly</strong>. Next we will hide them — and that is where the story gets interesting.</div>`,
    },
    hmm: {
      title: "Hidden Markov Models",
      eyebrow: "02 · Hidden models",
      heading: "Hidden Markov Models (HMM)",
      lead: "An extension of Markov chains: we <strong>do not see</strong> the states directly. We only see their consequences — observations.",
      nextLabel: "03 · Next → Viterbi algorithm",
      prevLabel: "← 01 · Markov chains",
      bodyHtml: `
<h2>What does "hidden" mean?</h2>
<p>In a plain Markov chain we see the states. In the real world we often do <em>not</em> see what we care about — we only see the <strong>symptoms</strong>:</p>
<ul><li>We do not see the <em>weather at a remote station</em>, but we do see <em>whether a neighbour carries an umbrella</em>.</li>
<li>We do not see a person's <em>mood</em>, but we do see their <em>social-media posts</em>.</li>
<li>We do not see the <em>phonemes</em> someone utters, but we do see the <em>audio signal</em>.</li>
<li>We do not see the <em>part of speech</em> of a word, but we do see the <em>word itself</em>.</li></ul>
<div class="callout"><div class="eyebrow">Key idea</div>A hidden system (Markov chain) generates a sequence of observations. Our task is to infer <em>backwards</em> from the observations to the hidden states.</div>
<h2>Formally: the five components of an HMM</h2>
<ol><li><strong>States</strong> S = {s₁, …, s<sub>N</sub>} — hidden, not observable.</li>
<li><strong>Observation alphabet</strong> O = {o₁, …, o<sub>M</sub>} — what we actually see.</li>
<li><strong>Transition matrix</strong> A (same as a Markov chain).</li>
<li><strong>Emission matrix</strong> B, where <code>b<sub>j</sub>(o) = P(o | s<sub>j</sub>)</code>.</li>
<li><strong>Initial distribution</strong> π.</li></ol>
<h3>Model diagram</h3>
<div class="card p-4 my-3">
  <svg viewBox="0 0 620 260" class="w-100" aria-hidden="true">
    <defs>
      <marker id="h-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--accent)"/></marker>
      <marker id="h-arrM" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--muted)"/></marker>
    </defs>
    <text x="30" y="30" class="small-muted">hidden states (invisible)</text>
    <circle cx="110" cy="80" r="30" class="node-hidden"/><text x="110" y="85" text-anchor="middle" class="node-text">S₁</text>
    <circle cx="280" cy="80" r="30" class="node-hidden"/><text x="280" y="85" text-anchor="middle" class="node-text">S₂</text>
    <circle cx="450" cy="80" r="30" class="node-hidden"/><text x="450" y="85" text-anchor="middle" class="node-text">S₃</text>
    <path d="M140 80 L250 80" stroke="var(--accent)" stroke-width="1.5" fill="none" marker-end="url(#h-arr)"/>
    <path d="M310 80 L420 80" stroke="var(--accent)" stroke-width="1.5" fill="none" marker-end="url(#h-arr)"/>
    <text x="30" y="205" class="small-muted">observations (visible)</text>
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
<h2>The three classical HMM problems</h2>
<div class="row g-3 my-3">
  <div class="col-md-4"><div class="card p-3 h-100"><div class="step-num">1</div><h3 class="h6 mt-3 mb-1">Evaluation</h3><p class="small text-secondary mb-0">What is the probability that a given HMM produced a given observation sequence?<br><span class="mono-small text-muted-2">→ forward algorithm</span></p></div></div>
  <div class="col-md-4"><div class="card p-3 h-100" style="border-color: var(--accent-ring);"><div class="step-num">2</div><h3 class="h6 mt-3 mb-1" style="color: var(--accent);">Decoding</h3><p class="small text-secondary mb-0">Which hidden state sequence <strong>most likely</strong> produced the observations?<br><span class="mono-small text-muted-2">→ <strong style="color: var(--accent);">Viterbi algorithm</strong></span></p></div></div>
  <div class="col-md-4"><div class="card p-3 h-100"><div class="step-num">3</div><h3 class="h6 mt-3 mb-1">Learning</h3><p class="small text-secondary mb-0">How do we estimate model parameters (A, B, π) from observations?<br><span class="mono-small text-muted-2">→ Baum-Welch</span></p></div></div>
</div>
<div class="callout"><div class="eyebrow">Our focus</div>In this project we concentrate on <strong>decoding</strong>. The Viterbi algorithm is exactly the answer to that problem.</div>
<h2>HMM assumptions</h2>
<ul><li><strong>Markov assumption:</strong> the state at time t+1 depends only on the state at time t.</li>
<li><strong>Output independence:</strong> the observation at time t depends only on the state at time t, and not on other states or observations.</li></ul>
<p>These are strong simplifications — and it is precisely thanks to them that the model is tractable.</p>`,
    },
    viterbi: {
      title: "Viterbi algorithm",
      eyebrow: "03 · Algorithm",
      heading: "The Viterbi algorithm",
      lead: "Given a sequence of observations, find the <strong>most likely sequence of hidden states</strong> — in polynomial time, using dynamic programming.",
      nextLabel: "04 · Next → Interactive demo",
      prevLabel: "← 02 · Hidden Markov Models",
      bodyHtml: `
<h2>Why not brute force?</h2>
<p>With N states and a sequence of length T, there are <strong>N<sup>T</sup></strong> possible paths through the hidden states. For N=5 and T=20 that is over 95 billion. Clearly we cannot enumerate them.</p>
<div class="callout"><div class="eyebrow">Key insight</div>If a <em>partial path</em> ending in state s at time t is suboptimal, we will never need it — whatever comes afterwards will be better through a better partial path ending in the same state. So for every (t, s) we only keep <strong>the best partial path</strong>.</div>
<h2>Core idea: the trellis</h2>
<p>We build a 2-D grid (a <em>trellis</em>): rows are states, columns are time steps. For every cell we compute <code>v<sub>t</sub>(s)</code> — the best probability of a path ending in s at time t. In parallel we store a <strong>back-pointer</strong> — which state we came from.</p>
<h3>Recursion</h3>
<div class="formula-box">v<sub>t</sub>(j) = max<sub>i</sub> &nbsp; v<sub>t−1</sub>(i) · a<sub>ij</sub> · b<sub>j</sub>(o<sub>t</sub>)</div>
<p>In words: the best probability of a path reaching (t, j) is the best probability of a path reaching any predecessor (t−1, i), multiplied by the transition <code>a<sub>ij</sub></code> and the emission <code>b<sub>j</sub>(o<sub>t</sub>)</code>.</p>
<h2>Three steps</h2>
<h3>1. Initialisation (t = 0)</h3>
<div class="formula-box">v<sub>0</sub>(s) = π(s) · b<sub>s</sub>(o<sub>0</sub>)</div>
<h3>2. Recursion (t = 1, 2, …, T−1)</h3>
<div class="formula-box">v<sub>t</sub>(j) = max<sub>i</sub> v<sub>t−1</sub>(i) · a<sub>ij</sub> · b<sub>j</sub>(o<sub>t</sub>)<br>bp<sub>t</sub>(j) = arg max<sub>i</sub> v<sub>t−1</sub>(i) · a<sub>ij</sub> · b<sub>j</sub>(o<sub>t</sub>)</div>
<h3>3. Termination and backtracking</h3>
<p>The best final probability is:</p>
<div class="formula-box">P* = max<sub>s</sub> v<sub>T−1</sub>(s)<br>s*<sub>T−1</sub> = arg max<sub>s</sub> v<sub>T−1</sub>(s)</div>
<p>We follow the back-pointers backwards: s*<sub>t−1</sub> = bp<sub>t</sub>(s*<sub>t</sub>).</p>
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
<h2>Complexity</h2>
<ul><li>Time: <code>O(N² · T)</code> — for each of T steps we visit every pair (i, j) of states.</li><li>Space: <code>O(N · T)</code> for the V and bp tables.</li></ul>
<p>Compared to the naive <code>O(N<sup>T</sup>)</code> this is a huge improvement.</p>
<div class="callout"><div class="eyebrow">Practical trick</div>For long sequences, probabilities underflow towards zero. In practice multiplication is replaced by addition of logarithms: <code>log v<sub>t</sub>(j) = max<sub>i</sub> [ log v<sub>t−1</sub>(i) + log a<sub>ij</sub> + log b<sub>j</sub>(o<sub>t</sub>) ]</code>.</div>
<h2>History and applications</h2>
<p>The algorithm was published in <strong>1967</strong> by Andrew Viterbi in the context of decoding convolutional codes in digital communications. It later spread to speech recognition, bioinformatics, computational linguistics (POS tagging) and many other fields.</p>
<div class="callout"><div class="eyebrow">Next step</div>Enough theory — it is time to run the algorithm live. In the demo you will see the trellis fill column by column, and the back-tracking draw the final path.</div>`,
    },
  },
  demo: {
    title: "Interactive Viterbi",
    eyebrow: "04 · Interactive demo",
    heading: "Interactive Viterbi",
    lead: "Pick a scenario, tweak the observations and step through the algorithm.",
    scenarioLabel: "Scenario",
    paramsLabel: "Parameters",
    obsSeqLabel: "Observation sequence",
    obsEmptyHint: "Pick observations below.",
    clickToRemove: "Click to remove",
    clear: "Clear",
    transLabel: "Transition probabilities A",
    emitLabel: "Emission probabilities B",
    startLabel: "Initial probabilities π",
    runBtn: "Recompute",
    trellisLabel: "Trellis grid",
    back: "← Back",
    forward: "Forward →",
    playAll: "Play all",
    stop: "Stop",
    reset: "Reset",
    matrixLabel: "Viterbi matrix V",
    resultLabel: "Result",
    explanationLabel: "Explanation of current step",
    explainIntro: "Press <strong>Forward →</strong> to step through the algorithm.",
    explainStart: "<strong>Ready.</strong> Press <em>Forward →</em> for initialisation (t=0).",
    matrixEmpty: "The matrix appears once you compute.",
    resultEmpty: "Finish the steps to see the back-trace.",
    resultPath: "Best path:",
    resultProb: "Probability:",
    errEmptyObs: "Add at least one observation first.",
    errComputeFailed: "Computation failed. Please try again.",
    stateNames: {
      Sunny: "Sunny",
      Rainy: "Rainy",
      Hot: "Hot",
      Cold: "Cold",
      Happy: "Happy",
      Sad: "Sad",
      Bull: "Bull",
      Bear: "Bear",
      Tired: "Tired",
      Alert: "Alert",
      Free: "Free-flow",
      Congested: "Congested",
    },
    obsNames: {
      Umbrella: "Umbrella",
      NoUmbrella: "No umbrella",
      "1": "1",
      "2": "2",
      "3": "3",
      Meme: "Meme",
      Selfie: "Selfie",
      Quote: "Quote",
      Up: "Up",
      Down: "Down",
      Flat: "Flat",
      Espresso: "Espresso",
      Water: "Water",
      Tea: "Tea",
      SlowCar: "Slow car",
      FastCar: "Fast car",
      Bus: "Bus",
    },
    initMessage: (t, obs) =>
      `Initialisation (t=${t}, observation = '${obs}'): V[0][s] = π(s) · b_s(${obs}) for every state s.`,
    initFormula: (state, obs, pi, b, value) =>
      `π(${state})·b_${state}(${obs}) = ${pi}·${b} = ${value}`,
    recursionMessage: (t, obs) =>
      `Step t=${t}, observation = '${obs}': for every state s we take max_sp V[${t - 1}][sp]·a(sp→s)·b_s(${obs}) and store the best predecessor.`,
    recursionFormula: (_t, _state, _obs, from, value) =>
      `max → from '${from}', value = ${value}`,
    terminateMessage: (bestProb, finalState, path) =>
      `Back-trace: the best final probability is ${bestProb} in state '${finalState}'. Following back-pointers → path: ${path}.`,
  },
  primeri: {
    title: "Examples",
    eyebrow: "05 · Scenarios",
    heading: "Ready-made examples",
    lead: "Prebuilt HMM scenarios. Each card opens the interactive demo pre-loaded with the model, ready for exploration.",
    statesCount: (n) => `${n} states`,
    symbolsCount: (n) => `${n} symbols`,
    seqLen: (n) => `T=${n}`,
    statesLabel: "States:",
    seqLabel: "Sequence:",
  },
  examples: {
    vreme: {
      name: "Weather → Umbrella",
      description:
        "Classic intro example. Hidden states are the weather (sunny/rainy), observations are whether you spot your neighbour carrying an umbrella. From the umbrella sequence we guess the weather.",
    },
    sladoled: {
      name: "Ice cream (Jurafsky)",
      description:
        "Example from the Jurafsky & Martin textbook. Hidden states: HOT / COLD day. Observations: how many ice creams were eaten (1, 2 or 3).",
    },
    razpolozenje: {
      name: "Mood → Posts",
      description:
        "Hidden states are a person's mood (happy/sad); observations are the type of post on social media.",
    },
    borza: {
      name: "Stock market → Regime",
      description:
        "Classic HMM use in finance (regime-switching model). Hidden states: bull (up-market) or bear (down-market). Observations: daily index moves — Up, Down, Flat. From daily movements we try to infer the underlying market regime.",
    },
    kava: {
      name: "Coffee break → Focus",
      description:
        "Hidden states are your focus level (tired / alert). Observations are what you drink at break time — espresso, water or tea. From the drink sequence we guess when you were tired.",
    },
    promet: {
      name: "Highway → Traffic flow",
      description:
        "Hidden states are the traffic regime on a highway segment (free-flowing or congested). Observations are what the speed camera sees passing by — a slow car, a fast car or a bus.",
    },
  },
};
