import { t, translateObsName, translateStateName } from "../i18n/index";
import { EXAMPLES, EXAMPLE_KEYS, type ExampleKey } from "../viterbi/examples";
import { runViterbi } from "../viterbi/algorithm";
import type { Example, ViterbiResult, ViterbiStep } from "../viterbi/types";

interface DemoState {
  key: ExampleKey;
  model: Example & { obsSeq: string[] };
  result: ViterbiResult | null;
  stepIdx: number;
  timer: ReturnType<typeof setInterval> | null;
}

const SUP: Record<string, string> = {
  "-": "⁻",
  "+": "",
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

const toSup = (str: string): string =>
  [...str].map((c) => SUP[c] ?? c).join("");

const fmtProb = (x: number, digits = 2): string => {
  if (!isFinite(x)) return "—";
  if (x === 0) return "0";
  if (x >= 0.01 && x < 10) return x.toFixed(digits + 1);
  const exp = Math.floor(Math.log10(Math.abs(x)));
  const mant = x / Math.pow(10, exp);
  return `${mant.toFixed(digits)}·10${toSup(String(exp))}`;
};

const $ = <T extends HTMLElement = HTMLElement>(id: string): T =>
  document.getElementById(id) as T;

const svgEl = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] => {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
};

const demo: DemoState = {
  key: EXAMPLE_KEYS[0],
  model: cloneExample(EXAMPLE_KEYS[0]),
  result: null,
  stepIdx: -1,
  timer: null,
};

function cloneExample(key: ExampleKey): Example & { obsSeq: string[] } {
  const src = EXAMPLES[key];
  return {
    ...src,
    states: [...src.states],
    obsAlphabet: [...src.obsAlphabet],
    startP: { ...src.startP },
    transP: Object.fromEntries(
      Object.entries(src.transP).map(([k, v]) => [k, { ...v }]),
    ),
    emitP: Object.fromEntries(
      Object.entries(src.emitP).map(([k, v]) => [k, { ...v }]),
    ),
    obsSeq: [...src.obsSeq],
  };
}

export function renderDemo(): void {
  const i18n = t();
  document.title = `${i18n.demo.title} — ${i18n.common.brand}`;

  const slot = $("page-content");
  if (!slot) return;

  const d = i18n.demo;
  slot.innerHTML = `
  <div class="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
    <div>
      <div class="eyebrow">${d.eyebrow}</div>
      <h1 class="h2 mt-2 mb-1">${d.heading}</h1>
      <p class="text-secondary mb-0">${d.lead}</p>
    </div>
    <div>
      <div class="d-flex gap-2 align-items-center justify-content-lg-end">
        <label class="eyebrow mb-0 me-2" for="exampleSelect">${d.scenarioLabel}</label>
        <select id="exampleSelect" class="form-select" style="min-width: 220px;">
          ${EXAMPLE_KEYS.map(
            (k) =>
              `<option value="${k}">${i18n.examples[k].name}</option>`,
          ).join("")}
        </select>
      </div>
      <div id="quickExamples" class="quick-example-row mt-2">
        ${EXAMPLE_KEYS.map(
          (k) =>
            `<button type="button" class="btn quick-example-btn" data-example="${k}">${i18n.examples[k].name}</button>`,
        ).join("")}
      </div>
    </div>
  </div>

  <div class="demo-grid">
    <aside>
      <div class="card p-3 sidebar-sticky">
        <div class="eyebrow mb-3">${d.paramsLabel}</div>
        <label class="form-label">${d.obsSeqLabel}</label>
        <div id="obsBuilder" class="d-flex flex-wrap gap-1 mb-2" style="min-height: 30px;"></div>
        <div class="d-flex gap-1 mb-3 align-items-start">
          <div id="obsPalette" class="d-flex flex-wrap gap-1 flex-grow-1"></div>
          <button id="clearObs" class="btn btn-sm btn-outline-secondary" title="${d.clear}">${d.clear}</button>
        </div>
        <details class="mb-2"><summary>${d.transLabel}</summary><div id="transTable" class="mt-2"></div></details>
        <details class="mb-2"><summary>${d.emitLabel}</summary><div id="emitTable" class="mt-2"></div></details>
        <details class="mb-3"><summary>${d.startLabel}</summary><div id="startTable" class="mt-2"></div></details>
        <button id="runBtn" class="btn btn-accent w-100">${d.runBtn}</button>
      </div>
    </aside>
    <div>
      <div class="card p-3 mb-3">
        <div class="control-bar">
          <div class="eyebrow mb-0">${d.trellisLabel}</div>
          <div class="control-actions">
            <button id="stepBack" class="btn btn-outline-light btn-sm">${d.back}</button>
            <button id="stepFwd" class="btn btn-accent btn-sm">${d.forward}</button>
            <button id="stepAll" class="btn btn-outline-light btn-sm">${d.playAll}</button>
            <button id="stopPlay" class="btn btn-outline-light btn-sm">${d.stop}</button>
            <button id="stepReset" class="btn btn-outline-secondary btn-sm">${d.reset}</button>
          </div>
        </div>
        <div class="trellis-wrap">
          <svg id="trellis" viewBox="0 0 800 380" preserveAspectRatio="xMidYMid meet"></svg>
        </div>
        <div class="progress mt-3">
          <div id="progress" class="progress-bar bg-accent" style="width: 0%"></div>
        </div>
      </div>
      <div class="row g-3">
        <div class="col-lg-8">
          <div class="card p-3 h-100">
            <div class="eyebrow mb-2">${d.matrixLabel}</div>
            <div id="matrixWrap" class="matrix-scroll">
              <div class="text-secondary small">${d.matrixEmpty}</div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card p-3 h-100">
            <div class="eyebrow mb-2">${d.resultLabel}</div>
            <div id="resultBox" class="small text-secondary">—</div>
          </div>
        </div>
        <div class="col-12">
          <div class="card p-3">
            <div class="eyebrow mb-2">${d.explanationLabel}</div>
            <div id="explanation" class="mono-small text-secondary">${d.explainIntro}</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  wireControls();
  const qs = new URLSearchParams(location.search);
  const startKey =
    qs.get("ex") && EXAMPLE_KEYS.includes(qs.get("ex") as ExampleKey)
      ? (qs.get("ex") as ExampleKey)
      : EXAMPLE_KEYS[0];
  loadExample(startKey);
}

function wireControls(): void {
  $("exampleSelect").addEventListener("change", () => {
    loadExample(($("exampleSelect") as HTMLSelectElement).value as ExampleKey);
  });
  document
    .querySelectorAll<HTMLButtonElement>("[data-example]")
    .forEach((btn) => {
      btn.addEventListener("click", () =>
        loadExample(btn.dataset.example as ExampleKey),
      );
    });
  $("runBtn").addEventListener("click", compute);
  $("stepFwd").addEventListener("click", () => step(1));
  $("stepBack").addEventListener("click", () => step(-1));
  $("stepAll").addEventListener("click", playAll);
  $("stopPlay").addEventListener("click", stopPlayback);
  $("stepReset").addEventListener("click", () => {
    stopPlayback();
    demo.stepIdx = -1;
    render();
  });
  $("clearObs").addEventListener("click", () => {
    stopPlayback();
    demo.model.obsSeq = [];
    renderObs();
  });

  let rzTimer: ReturnType<typeof setTimeout> | null = null;
  window.addEventListener("resize", () => {
    if (rzTimer) clearTimeout(rzTimer);
    rzTimer = setTimeout(() => {
      if (demo.result) render();
    }, 120);
  });
}

function loadExample(key: ExampleKey): void {
  stopPlayback();
  demo.key = key;
  demo.model = cloneExample(key);
  demo.result = null;
  demo.stepIdx = -1;
  syncExampleControls();
  renderAll();
  compute();
}

function syncExampleControls(): void {
  ($("exampleSelect") as HTMLSelectElement).value = demo.key;
  document.querySelectorAll<HTMLElement>("[data-example]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.example === demo.key);
  });
  history.replaceState(null, "", `${location.pathname}?ex=${encodeURIComponent(demo.key)}`);
}

function renderAll(): void {
  renderObs();
  renderProbTables();
  renderTrellis();
  renderMatrix();
  $("explanation").innerHTML = t().demo.explainIntro;
}

function renderObs(): void {
  const i18n = t();
  const builder = $("obsBuilder");
  builder.innerHTML = "";
  demo.model.obsSeq.forEach((o, i) => {
    const chip = document.createElement("span");
    chip.className = "obs-chip placed";
    chip.textContent = `${i + 1}. ${translateObsName(o)}`;
    chip.title = i18n.demo.clickToRemove;
    chip.onclick = () => {
      demo.model.obsSeq.splice(i, 1);
      renderObs();
    };
    builder.appendChild(chip);
  });
  if (demo.model.obsSeq.length === 0) {
    builder.innerHTML = `<span class="small text-secondary">${i18n.demo.obsEmptyHint}</span>`;
  }

  const palette = $("obsPalette");
  palette.innerHTML = "";
  demo.model.obsAlphabet.forEach((o) => {
    const chip = document.createElement("span");
    chip.className = "obs-chip";
    chip.textContent = `+ ${translateObsName(o)}`;
    chip.onclick = () => {
      demo.model.obsSeq.push(o);
      renderObs();
    };
    palette.appendChild(chip);
  });
}

function makeInput(val: number, onchange: (v: number) => void): HTMLInputElement {
  const inp = document.createElement("input");
  inp.type = "number";
  inp.step = "0.05";
  inp.min = "0";
  inp.max = "1";
  inp.value = Number(val).toFixed(2);
  inp.addEventListener("change", () => onchange(parseFloat(inp.value)));
  return inp;
}

function renderProbTables(): void {
  const st = $("startTable");
  st.innerHTML = "";
  const t1 = document.createElement("table");
  t1.className = "ptable";
  demo.model.states.forEach((s) => {
    const tr = t1.insertRow();
    tr.insertCell().textContent = translateStateName(s);
    const c = tr.insertCell();
    c.appendChild(makeInput(demo.model.startP[s], (v) => (demo.model.startP[s] = v)));
  });
  st.appendChild(t1);

  const tt = $("transTable");
  tt.innerHTML = "";
  const t2 = document.createElement("table");
  t2.className = "ptable";
  const hdr = t2.insertRow();
  hdr.insertCell().textContent = "";
  demo.model.states.forEach((s) => {
    const th = document.createElement("th");
    th.textContent = translateStateName(s);
    hdr.appendChild(th);
  });
  demo.model.states.forEach((s) => {
    const tr = t2.insertRow();
    const lab = document.createElement("th");
    lab.textContent = translateStateName(s);
    tr.appendChild(lab);
    demo.model.states.forEach((s2) => {
      const c = tr.insertCell();
      c.appendChild(
        makeInput(demo.model.transP[s][s2], (v) => (demo.model.transP[s][s2] = v)),
      );
    });
  });
  tt.appendChild(t2);

  const et = $("emitTable");
  et.innerHTML = "";
  const t3 = document.createElement("table");
  t3.className = "ptable";
  const hdr2 = t3.insertRow();
  hdr2.insertCell().textContent = "";
  demo.model.obsAlphabet.forEach((o) => {
    const th = document.createElement("th");
    th.textContent = translateObsName(o);
    hdr2.appendChild(th);
  });
  demo.model.states.forEach((s) => {
    const tr = t3.insertRow();
    const lab = document.createElement("th");
    lab.textContent = translateStateName(s);
    tr.appendChild(lab);
    demo.model.obsAlphabet.forEach((o) => {
      const c = tr.insertCell();
      c.appendChild(
        makeInput(demo.model.emitP[s][o], (v) => (demo.model.emitP[s][o] = v)),
      );
    });
  });
  et.appendChild(t3);
}

function compute(): void {
  const i18n = t();
  stopPlayback();
  if (demo.model.obsSeq.length === 0) {
    $("explanation").textContent = i18n.demo.errEmptyObs;
    return;
  }
  try {
    demo.result = runViterbi(demo.model, demo.model.obsSeq);
    demo.stepIdx = -1;
    render();
  } catch {
    demo.result = null;
    $("explanation").textContent = i18n.demo.errComputeFailed;
    ($("resultBox") as HTMLElement).innerHTML =
      `<span class="text-secondary">${i18n.demo.errComputeFailed}</span>`;
  }
}

function step(dir: number): void {
  if (!demo.result) {
    compute();
    return;
  }
  const maxIdx = demo.result.steps.length - 1;
  demo.stepIdx = Math.max(-1, Math.min(maxIdx, demo.stepIdx + dir));
  render();
}

function playAll(): void {
  if (!demo.result) return;
  stopPlayback();
  demo.stepIdx = -1;
  render();
  demo.timer = setInterval(() => {
    if (!demo.result || demo.stepIdx >= demo.result.steps.length - 1) {
      stopPlayback();
      return;
    }
    demo.stepIdx++;
    render();
  }, 900);
}

function stopPlayback(): void {
  if (demo.timer) {
    clearInterval(demo.timer);
    demo.timer = null;
  }
}

function render(): void {
  renderTrellis();
  renderMatrix();
  renderExplanation();
  renderResult();
  const maxIdx = demo.result ? demo.result.steps.length - 1 : 0;
  const pct =
    demo.result && demo.stepIdx >= 0
      ? ((demo.stepIdx + 1) / (maxIdx + 1)) * 100
      : 0;
  ($("progress") as HTMLElement).style.width = pct + "%";
}

function renderTrellis(): void {
  const svg = $<SVGSVGElement & HTMLElement>("trellis") as unknown as SVGSVGElement;
  svg.innerHTML = "";
  if (!demo.result) return;

  const result = demo.result;
  const states = result.states;
  const T = result.obsSeq.length;
  const W = 1000;
  const H = Math.max(340, 120 + states.length * 110);
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

  const padL = 170, padR = 70, padT = 100, padB = 50;
  const colW = T > 1 ? (W - padL - padR) / (T - 1) : 0;
  const rowH = states.length > 1 ? (H - padT - padB) / (states.length - 1) : 0;

  const xOf = (ti: number): number =>
    T === 1 ? padL + (W - padL - padR) / 2 : padL + ti * colW;
  const yOf = (si: number): number =>
    states.length === 1 ? H / 2 : padT + si * rowH;

  for (let ti = 0; ti < T; ti++) {
    const x = xOf(ti);
    const l1 = svgEl("text", { x, y: 30, "text-anchor": "middle", class: "tr-col-label" });
    l1.textContent = `t = ${ti}`;
    svg.appendChild(l1);
    const l2 = svgEl("text", { x, y: 58, "text-anchor": "middle", class: "tr-obs-label" });
    l2.textContent = translateObsName(result.obsSeq[ti]);
    svg.appendChild(l2);
  }

  svg.appendChild(
    svgEl("line", {
      x1: padL - 20, y1: 72, x2: W - padR + 20, y2: 72,
      stroke: "var(--border)", "stroke-width": 1,
    }),
  );

  states.forEach((s, si) => {
    const tx = svgEl("text", {
      x: padL - 52, y: yOf(si) + 5,
      "text-anchor": "end", class: "tr-row-label",
    });
    tx.textContent = translateStateName(s);
    svg.appendChild(tx);
  });

  const lastStep = result.steps[result.steps.length - 1];
  const pathReached = demo.stepIdx >= result.steps.length - 1;
  const pathSet = new Set<string>();
  if (pathReached && lastStep.path) {
    lastStep.path.forEach((s, ti) => pathSet.add(`${ti}:${s}`));
  }

  const curStep: ViterbiStep | null =
    demo.stepIdx >= 0 && demo.stepIdx < result.steps.length - 1
      ? result.steps[demo.stepIdx]
      : null;

  const NODE_R = 34;
  for (let ti = 0; ti < T - 1; ti++) {
    const nextStep = result.steps[ti + 1];
    const reached = demo.stepIdx >= ti + 1;
    for (let i = 0; i < states.length; i++) {
      for (let j = 0; j < states.length; j++) {
        const cx1 = xOf(ti), cy1 = yOf(i);
        const cx2 = xOf(ti + 1), cy2 = yOf(j);
        const dx = cx2 - cx1, dy = cy2 - cy1;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const x1 = cx1 + ux * (NODE_R + 2);
        const y1 = cy1 + uy * (NODE_R + 2);
        const x2 = cx2 - ux * (NODE_R + 2);
        const y2 = cy2 - uy * (NODE_R + 2);
        const cls = ["tr-edge"];
        if (reached && nextStep.cells) {
          const cell = nextStep.cells.find((c) => c.state === states[j]);
          if (cell && cell.from === states[i]) cls.push("winner");
          else cls.push("candidate");
        }
        if (
          pathReached &&
          pathSet.has(`${ti}:${states[i]}`) &&
          pathSet.has(`${ti + 1}:${states[j]}`)
        ) {
          cls.push("path");
        }
        svg.appendChild(svgEl("line", { x1, y1, x2, y2, class: cls.join(" ") }));
      }
    }
  }

  for (let ti = 0; ti < T; ti++) {
    for (let si = 0; si < states.length; si++) {
      const s = states[si];
      const x = xOf(ti), y = yOf(si);
      const cls = ["tr-node"];
      if (curStep && curStep.t === ti) cls.push("active");
      if (pathSet.has(`${ti}:${s}`)) cls.push("path");
      const reached = demo.stepIdx >= ti;

      svg.appendChild(svgEl("circle", { cx: x, cy: y, r: NODE_R, class: cls.join(" ") }));

      const val = svgEl("text", {
        x, y: y + 4, "text-anchor": "middle",
        class: "tr-node-value" + (reached ? " visible" : ""),
      });
      if (reached && result.V[ti]) val.textContent = fmtProb(result.V[ti][s], 1);
      svg.appendChild(val);
    }
  }
}

function renderMatrix(): void {
  const wrap = $("matrixWrap");
  if (!demo.result) {
    wrap.innerHTML = `<div class="text-secondary small">${t().demo.matrixEmpty}</div>`;
    return;
  }
  const result = demo.result;
  const states = result.states;
  const T = result.obsSeq.length;
  const reached = Math.min(demo.stepIdx, T - 1);
  const pathReached = demo.stepIdx >= result.steps.length - 1;
  const pathSet = new Set<string>();
  if (pathReached) {
    result.steps[result.steps.length - 1].path?.forEach((s, ti) =>
      pathSet.add(`${ti}:${s}`),
    );
  }

  let html = '<table class="vmatrix"><thead><tr><th class="state-label"></th>';
  for (let ti = 0; ti < T; ti++) {
    html += `<th>t = ${ti}<span class="obs-glyph">${translateObsName(result.obsSeq[ti])}</span></th>`;
  }
  html += "</tr></thead><tbody>";
  states.forEach((s) => {
    html += `<tr><td class="state-label">${translateStateName(s)}</td>`;
    for (let ti = 0; ti < T; ti++) {
      const cls: string[] = [];
      if (ti > reached) cls.push("empty");
      if (
        demo.stepIdx >= 0 &&
        demo.stepIdx < result.steps.length - 1 &&
        result.steps[demo.stepIdx].t === ti
      )
        cls.push("active");
      if (pathSet.has(`${ti}:${s}`)) cls.push("path");
      const v = ti <= reached ? fmtProb(result.V[ti][s], 3) : "—";
      html += `<td class="${cls.join(" ")}">${v}</td>`;
    }
    html += "</tr>";
  });
  html += "</tbody></table>";
  wrap.innerHTML = html;
}

function renderExplanation(): void {
  const i18n = t();
  const e = $("explanation");
  if (!demo.result) return;
  if (demo.stepIdx < 0) {
    e.innerHTML = i18n.demo.explainStart;
    return;
  }
  const step = demo.result.steps[demo.stepIdx];
  let main = "";
  if (step.kind === "init" && step.obs) {
    main = i18n.demo.initMessage(step.t, translateObsName(step.obs));
  } else if (step.kind === "recursion" && step.obs) {
    main = i18n.demo.recursionMessage(step.t, translateObsName(step.obs));
  } else if (step.kind === "terminate" && step.path && step.finalState != null && step.bestProb != null) {
    main = i18n.demo.terminateMessage(
      fmtProb(step.bestProb, 3),
      translateStateName(step.finalState),
      step.path.map(translateStateName).join(" → "),
    );
  }

  let html = `<div class="mb-2">${main}</div>`;
  if (step.cells && step.kind !== "terminate") {
    html += '<div class="small" style="color: var(--muted)">';
    step.cells.forEach((c) => {
      let line = "";
      if (step.kind === "init" && step.obs) {
        const pi = demo.model.startP[c.state].toFixed(3);
        const b = demo.model.emitP[c.state][step.obs].toFixed(3);
        line = i18n.demo.initFormula(
          translateStateName(c.state),
          translateObsName(step.obs),
          pi,
          b,
          c.value.toFixed(4),
        );
      } else if (c.from) {
        line = i18n.demo.recursionFormula(
          step.t,
          translateStateName(c.state),
          step.obs ? translateObsName(step.obs) : "",
          translateStateName(c.from),
          c.value.toFixed(5),
        );
      }
      html += `<div>• <strong style="color:var(--accent)">${translateStateName(c.state)}</strong>: ${line}</div>`;
    });
    html += "</div>";
  }
  e.innerHTML = html;
}

function renderResult(): void {
  const i18n = t();
  const r = $("resultBox");
  if (!demo.result) {
    r.textContent = "—";
    return;
  }
  const pathReached = demo.stepIdx >= demo.result.steps.length - 1;
  if (!pathReached) {
    r.innerHTML = `<span class="text-secondary">${i18n.demo.resultEmpty}</span>`;
    return;
  }
  r.innerHTML = `
    <div><span class="text-secondary">${i18n.demo.resultPath}</span></div>
    <div class="mono" style="color: var(--path); font-size: 0.9rem; margin: 4px 0;">
      ${demo.result.path.map(translateStateName).join(" → ")}
    </div>
    <div class="text-secondary small">${i18n.demo.resultProb}
      <span class="mono" style="color:var(--text)">${fmtProb(demo.result.bestProb, 3)}</span>
    </div>
  `;
}
