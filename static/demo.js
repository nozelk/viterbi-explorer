// Viterbi Explorer - interaktivni demo
const EXAMPLES = JSON.parse(document.getElementById("examplesData").textContent);

let currentKey = null;
let current = null;       // globoka kopija trenutnega primera (edit-able)
let result = null;        // odgovor API-ja
let stepIdx = -1;         // -1 = pred zacetkom
let timer = null;

const $ = (id) => document.getElementById(id);

function stopPlayback() {
    clearInterval(timer);
    timer = null;
}

function syncExampleControls() {
    $("exampleSelect").value = currentKey;
    document.querySelectorAll("[data-example]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.example === currentKey);
    });
    history.replaceState(null, "", `${location.pathname}?ex=${encodeURIComponent(currentKey)}`);
}

// ---- helpers: lepsi zapis stevil ----
const SUP = { "-": "⁻", "+": "", "0": "⁰", "1": "¹", "2": "²", "3": "³",
              "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
function toSup(str) {
    return [...str].map(c => SUP[c] ?? c).join("");
}
/** Format probability for display: e.g. 0.054 -> "5.4·10⁻²", 0 -> "0". */
function fmtProb(x, digits = 2) {
    if (!isFinite(x)) return "—";
    if (x === 0) return "0";
    if (x >= 0.01 && x < 10) return x.toFixed(digits + 1);
    const exp = Math.floor(Math.log10(Math.abs(x)));
    const mant = x / Math.pow(10, exp);
    return `${mant.toFixed(digits)}·10${toSup(String(exp))}`;
}

// ---------- init ----------
function init() {
    const sel = $("exampleSelect");
    sel.addEventListener("change", () => loadExample(sel.value));
    document.querySelectorAll("[data-example]").forEach((button) => {
        button.addEventListener("click", () => loadExample(button.dataset.example));
    });

    // ?ex= query param
    const qs = new URLSearchParams(location.search);
    const startKey = qs.get("ex") && EXAMPLES[qs.get("ex")] ? qs.get("ex") : Object.keys(EXAMPLES)[0];
    sel.value = startKey;
    loadExample(startKey);

    $("runBtn").addEventListener("click", runViterbi);
    $("stepFwd").addEventListener("click", () => step(1));
    $("stepBack").addEventListener("click", () => step(-1));
    $("stepAll").addEventListener("click", playAll);
    $("stopPlay").addEventListener("click", stopPlayback);
    $("stepReset").addEventListener("click", () => {
        stopPlayback();
        stepIdx = -1;
        render();
    });
    $("clearObs").addEventListener("click", () => {
        stopPlayback();
        current.obs_seq = [];
        renderObs();
    });

    // re-render on window resize so SVG proportions always fit the screen
    let rzTimer = null;
    window.addEventListener("resize", () => {
        clearTimeout(rzTimer);
        rzTimer = setTimeout(() => { if (result) render(); }, 120);
    });
}

function loadExample(key) {
    stopPlayback();
    currentKey = key;
    current = JSON.parse(JSON.stringify(EXAMPLES[key]));
    result = null;
    stepIdx = -1;
    syncExampleControls();
    renderAll();
    runViterbi(); // auto-run za takoj viden trellis
}

function renderAll() {
    renderObs();
    renderProbTables();
    renderTrellis();   // prazna shema
    renderMatrix();
    $("explanation").innerHTML = "Pritisni <strong>Naprej →</strong> za sprehod skozi algoritem.";
}

// ---------- observations builder ----------
function renderObs() {
    const builder = $("obsBuilder");
    builder.innerHTML = "";
    current.obs_seq.forEach((o, i) => {
        const chip = document.createElement("span");
        chip.className = "obs-chip placed";
        chip.textContent = `${i+1}. ${o}`;
        chip.title = "Klikni za odstranitev";
        chip.onclick = () => { current.obs_seq.splice(i, 1); renderObs(); };
        builder.appendChild(chip);
    });
    if (current.obs_seq.length === 0) {
        builder.innerHTML = '<span class="small text-secondary">Izberi opazovanja spodaj.</span>';
    }

    const palette = $("obsPalette");
    palette.innerHTML = "";
    current.obs_alphabet.forEach(o => {
        const chip = document.createElement("span");
        chip.className = "obs-chip";
        chip.textContent = `+ ${o}`;
        chip.onclick = () => { current.obs_seq.push(o); renderObs(); };
        palette.appendChild(chip);
    });
}

// ---------- probability tables ----------
function makeInput(val, onchange) {
    const inp = document.createElement("input");
    inp.type = "number"; inp.step = "0.05"; inp.min = "0"; inp.max = "1";
    inp.value = Number(val).toFixed(2);
    inp.addEventListener("change", () => onchange(parseFloat(inp.value)));
    return inp;
}

function renderProbTables() {
    // start
    const st = $("startTable");
    st.innerHTML = "";
    const t1 = document.createElement("table"); t1.className = "ptable";
    current.states.forEach(s => {
        const tr = t1.insertRow();
        tr.insertCell().textContent = s;
        const c = tr.insertCell();
        c.appendChild(makeInput(current.start_p[s], v => current.start_p[s] = v));
    });
    st.appendChild(t1);

    // transitions
    const tt = $("transTable"); tt.innerHTML = "";
    const t2 = document.createElement("table"); t2.className = "ptable";
    const hdr = t2.insertRow();
    hdr.insertCell().textContent = "";
    current.states.forEach(s => { const th = document.createElement("th"); th.textContent = s; hdr.appendChild(th); });
    current.states.forEach(s => {
        const tr = t2.insertRow();
        const lab = document.createElement("th"); lab.textContent = s; tr.appendChild(lab);
        current.states.forEach(s2 => {
            const c = tr.insertCell();
            c.appendChild(makeInput(current.trans_p[s][s2], v => current.trans_p[s][s2] = v));
        });
    });
    tt.appendChild(t2);

    // emissions
    const et = $("emitTable"); et.innerHTML = "";
    const t3 = document.createElement("table"); t3.className = "ptable";
    const hdr2 = t3.insertRow();
    hdr2.insertCell().textContent = "";
    current.obs_alphabet.forEach(o => { const th = document.createElement("th"); th.textContent = o; hdr2.appendChild(th); });
    current.states.forEach(s => {
        const tr = t3.insertRow();
        const lab = document.createElement("th"); lab.textContent = s; tr.appendChild(lab);
        current.obs_alphabet.forEach(o => {
            const c = tr.insertCell();
            c.appendChild(makeInput(current.emit_p[s][o], v => current.emit_p[s][o] = v));
        });
    });
    et.appendChild(t3);
}

// ---------- run API ----------
async function runViterbi() {
    stopPlayback();
    if (current.obs_seq.length === 0) {
        $("explanation").textContent = "Najprej dodaj vsaj eno opazovanje.";
        return;
    }
    const body = {
        states: current.states,
        obs_alphabet: current.obs_alphabet,
        start_p: current.start_p,
        trans_p: current.trans_p,
        emit_p: current.emit_p,
        obs_seq: current.obs_seq,
    };
    try {
        const r = await fetch("/api/viterbi", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        });
        if (!r.ok) throw new Error("API request failed");
        result = await r.json();
        stepIdx = -1;
        render();
    } catch (error) {
        result = null;
        $("explanation").textContent = "Pri izračunu je prišlo do napake. Poskusi ponovno.";
        $("resultBox").innerHTML = '<span class="text-secondary">Izračun ni uspel.</span>';
    }
}

// ---------- stepping ----------
function step(dir) {
    if (!result) { runViterbi(); return; }
    const maxIdx = result.steps.length - 1;
    stepIdx = Math.max(-1, Math.min(maxIdx, stepIdx + dir));
    render();
}

function playAll() {
    if (!result) return;
    stopPlayback();
    stepIdx = -1;
    render();
    timer = setInterval(() => {
        if (stepIdx >= result.steps.length - 1) { stopPlayback(); return; }
        stepIdx++; render();
    }, 900);
}

// ---------- render orchestrator ----------
function render() {
    renderTrellis();
    renderMatrix();
    renderExplanation();
    renderResult();

    const maxIdx = result ? result.steps.length - 1 : 0;
    const pct = result && stepIdx >= 0 ? ((stepIdx + 1) / (maxIdx + 1)) * 100 : 0;
    $("progress").style.width = pct + "%";
}

// ---------- trellis SVG ----------
function renderTrellis() {
    const svg = $("trellis");
    svg.innerHTML = "";
    if (!result) return;

    const states = result.states;
    const T = result.obs_seq.length;
    const W = 1000;
    const H = Math.max(340, 120 + states.length * 110);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const padL = 170, padR = 70, padT = 100, padB = 50;
    const colW = T > 1 ? (W - padL - padR) / (T - 1) : 0;
    const rowH = states.length > 1 ? (H - padT - padB) / (states.length - 1) : 0;

    const xOf = t => T === 1 ? (padL + (W - padL - padR) / 2) : padL + t * colW;
    const yOf = si => states.length === 1 ? H / 2 : padT + si * rowH;

    // column labels (t=k on first row, obs on second row, clearly above nodes)
    for (let t = 0; t < T; t++) {
        const x = xOf(t);
        const l1 = svgEl("text", { x, y: 30, "text-anchor": "middle", class: "tr-col-label" });
        l1.textContent = `t = ${t}`; svg.appendChild(l1);
        const l2 = svgEl("text", { x, y: 58, "text-anchor": "middle", class: "tr-obs-label" });
        l2.textContent = result.obs_seq[t]; svg.appendChild(l2);
    }

    // subtle separator under header
    svg.appendChild(svgEl("line", {
        x1: padL - 20, y1: 72, x2: W - padR + 20, y2: 72,
        stroke: "var(--border)", "stroke-width": 1,
    }));

    // row labels (state names on the left, right-aligned)
    states.forEach((s, si) => {
        const tx = svgEl("text", {
            x: padL - 52, y: yOf(si) + 5,
            "text-anchor": "end", class: "tr-row-label",
        });
        tx.textContent = s;
        svg.appendChild(tx);
    });

    // final path
    const lastStep = result.steps[result.steps.length - 1];
    const pathReached = stepIdx >= result.steps.length - 1;
    const pathSet = new Set();
    if (pathReached && lastStep.path) {
        lastStep.path.forEach((s, t) => pathSet.add(`${t}:${s}`));
    }

    // current step
    const curStep = stepIdx >= 0 && stepIdx < result.steps.length - 1 ? result.steps[stepIdx] : null;

    // edges (t -> t+1) -- shortened so they stop at the node border
    const NODE_R = 34;
    for (let t = 0; t < T - 1; t++) {
        const nextStep = result.steps[t + 1];
        const reached = stepIdx >= t + 1;
        for (let i = 0; i < states.length; i++) {
            for (let j = 0; j < states.length; j++) {
                const cx1 = xOf(t),     cy1 = yOf(i);
                const cx2 = xOf(t + 1), cy2 = yOf(j);
                const dx = cx2 - cx1, dy = cy2 - cy1;
                const len = Math.hypot(dx, dy) || 1;
                const ux = dx / len, uy = dy / len;
                const x1 = cx1 + ux * (NODE_R + 2);
                const y1 = cy1 + uy * (NODE_R + 2);
                const x2 = cx2 - ux * (NODE_R + 2);
                const y2 = cy2 - uy * (NODE_R + 2);
                const cls = ["tr-edge"];
                if (reached) {
                    const cell = nextStep.cells.find(c => c.state === states[j]);
                    if (cell && cell.from === states[i]) cls.push("winner");
                    else cls.push("candidate");
                }
                if (pathReached && pathSet.has(`${t}:${states[i]}`) && pathSet.has(`${t+1}:${states[j]}`)) {
                    cls.push("path");
                }
                svg.appendChild(svgEl("line", { x1, y1, x2, y2, class: cls.join(" ") }));
            }
        }
    }

    // nodes (circles + value inside + backpointer "from" hint)
    for (let t = 0; t < T; t++) {
        for (let si = 0; si < states.length; si++) {
            const s = states[si];
            const x = xOf(t), y = yOf(si);
            const cls = ["tr-node"];
            if (curStep && curStep.t === t) cls.push("active");
            if (pathSet.has(`${t}:${s}`)) cls.push("path");
            const reached = stepIdx >= t;

            svg.appendChild(svgEl("circle", { cx: x, cy: y, r: NODE_R, class: cls.join(" ") }));

            // value inside node
            const val = svgEl("text", {
                x, y: y + 4, "text-anchor": "middle",
                class: "tr-node-value" + (reached ? " visible" : ""),
            });
            if (reached && result.V[t]) val.textContent = fmtProb(result.V[t][s], 1);
            svg.appendChild(val);
        }
    }
}

function svgEl(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}

// ---------- matrix table ----------
function renderMatrix() {
    const wrap = $("matrixWrap");
    if (!result) { wrap.innerHTML = '<div class="text-secondary small">—</div>'; return; }

    const states = result.states;
    const T = result.obs_seq.length;
    const reached = Math.min(stepIdx, T - 1);
    const pathReached = stepIdx >= result.steps.length - 1;
    const pathSet = new Set();
    if (pathReached) result.steps[result.steps.length - 1].path.forEach((s, t) => pathSet.add(`${t}:${s}`));

    let html = '<table class="vmatrix"><thead><tr><th class="state-label"></th>';
    for (let t = 0; t < T; t++) {
        html += `<th>t = ${t}<span class="obs-glyph">${result.obs_seq[t]}</span></th>`;
    }
    html += "</tr></thead><tbody>";
    states.forEach(s => {
        html += `<tr><td class="state-label">${s}</td>`;
        for (let t = 0; t < T; t++) {
            const cls = [];
            if (t > reached) cls.push("empty");
            if (stepIdx >= 0 && stepIdx < result.steps.length - 1 && result.steps[stepIdx].t === t) cls.push("active");
            if (pathSet.has(`${t}:${s}`)) cls.push("path");
            const v = t <= reached ? fmtProb(result.V[t][s], 3) : "—";
            html += `<td class="${cls.join(" ")}">${v}</td>`;
        }
        html += "</tr>";
    });
    html += "</tbody></table>";
    wrap.innerHTML = html;
}

// ---------- explanation ----------
function renderExplanation() {
    const e = $("explanation");
    if (!result) return;
    if (stepIdx < 0) {
        e.innerHTML = `<strong>Pripravljen.</strong> Pritisni <em>Naprej →</em> za inicializacijo (t=0).`;
        return;
    }
    const step = result.steps[stepIdx];
    let html = `<div class="mb-2">${step.explanation}</div>`;
    if (step.cells) {
        html += '<div class="small" style="color: var(--muted)">';
        step.cells.forEach(c => {
            html += `<div>• <strong style="color:var(--accent)">${c.state}</strong>: ${c.formula}</div>`;
        });
        html += '</div>';
    }
    e.innerHTML = html;
}

function renderResult() {
    const r = $("resultBox");
    if (!result) { r.textContent = "—"; return; }
    const pathReached = stepIdx >= result.steps.length - 1;
    if (!pathReached) {
        r.innerHTML = `<span class="text-secondary">Dokončaj korake za backtracking.</span>`;
        return;
    }
    r.innerHTML = `
        <div><span class="text-secondary">Najboljša pot:</span></div>
        <div class="mono" style="color: var(--path); font-size: 0.9rem; margin: 4px 0;">
            ${result.path.join(" → ")}
        </div>
        <div class="text-secondary small">Verjetnost: <span class="mono" style="color:var(--text)">${fmtProb(result.best_prob, 3)}</span></div>
    `;
}

init();
