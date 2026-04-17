import type {
  HmmModel,
  ProbMap,
  ViterbiCandidate,
  ViterbiCell,
  ViterbiResult,
  ViterbiStep,
} from "./types";

const buildRow = <T>(states: readonly string[], value: T): Record<string, T> =>
  Object.fromEntries(states.map((s) => [s, value])) as Record<string, T>;

const fmt = (x: number, digits = 3): string => x.toFixed(digits);

export function runViterbi(
  model: HmmModel,
  obsSeq: readonly string[],
): ViterbiResult {
  if (obsSeq.length === 0) {
    throw new Error("Observation sequence must not be empty.");
  }

  const { states, startP, transP, emitP } = model;
  const T = obsSeq.length;

  const V: ProbMap[] = Array.from({ length: T }, () => buildRow(states, 0));
  const B: Record<string, string | null>[] = Array.from(
    { length: T },
    () => buildRow<string | null>(states, null),
  );
  const steps: ViterbiStep[] = [];

  // --- initialization ---
  const o0 = obsSeq[0];
  const initCells: ViterbiCell[] = states.map((s) => {
    V[0][s] = startP[s] * emitP[s][o0];
    B[0][s] = null;
    return {
      state: s,
      value: V[0][s],
      from: null,
    };
  });

  steps.push({
    t: 0,
    obs: o0,
    V: { ...V[0] },
    B: { ...B[0] },
    cells: initCells,
    kind: "init",
  });

  // --- recursion ---
  for (let t = 1; t < T; t++) {
    const obs = obsSeq[t];
    const cells: ViterbiCell[] = [];

    for (const state of states) {
      const candidates: ViterbiCandidate[] = [];
      let bestPrev: string | null = null;
      let bestVal = -1;

      for (const prev of states) {
        const value = V[t - 1][prev] * transP[prev][state] * emitP[state][obs];
        candidates.push({
          from: prev,
          value,
          formulaParts: {
            prev: fmt(V[t - 1][prev], 4),
            trans: fmt(transP[prev][state], 3),
            emit: fmt(emitP[state][obs], 3),
            value: fmt(value, 5),
          },
        });
        if (value > bestVal) {
          bestVal = value;
          bestPrev = prev;
        }
      }

      V[t][state] = bestVal;
      B[t][state] = bestPrev;
      cells.push({ state, value: bestVal, from: bestPrev, candidates });
    }

    steps.push({
      t,
      obs,
      V: { ...V[t] },
      B: { ...B[t] },
      cells,
      kind: "recursion",
    });
  }

  // --- termination + backtrace ---
  const last = T - 1;
  const finalState = states.reduce(
    (best, s) => (V[last][s] > V[last][best] ? s : best),
    states[0],
  );
  const path: string[] = [finalState];
  for (let t = last; t > 0; t--) {
    const prev = B[t][path[path.length - 1]];
    if (prev == null) break;
    path.push(prev);
  }
  path.reverse();

  const bestProb = V[last][finalState];
  steps.push({
    t: T,
    obs: null,
    V: null,
    B: null,
    path,
    bestProb,
    finalState,
    kind: "terminate",
  });

  return { states, obsSeq: [...obsSeq], V, B, path, bestProb, steps };
}
