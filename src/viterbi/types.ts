export type ProbMap<T extends string = string> = Record<T, number>;

export interface HmmModel {
  readonly states: readonly string[];
  readonly obsAlphabet: readonly string[];
  readonly startP: ProbMap;
  readonly transP: Record<string, ProbMap>;
  readonly emitP: Record<string, ProbMap>;
}

export interface Example extends HmmModel {
  readonly key: string;
  readonly obsSeq: string[];
}

export interface ViterbiCandidate {
  from: string;
  value: number;
  formulaParts: { prev: string; trans: string; emit: string; value: string };
}

export interface ViterbiCell {
  state: string;
  value: number;
  from: string | null;
  candidates?: ViterbiCandidate[];
}

export interface ViterbiStep {
  t: number;
  obs: string | null;
  V: ProbMap | null;
  B: Record<string, string | null> | null;
  cells?: ViterbiCell[];
  path?: string[];
  bestProb?: number;
  finalState?: string;
  kind: "init" | "recursion" | "terminate";
}

export interface ViterbiResult {
  states: readonly string[];
  obsSeq: string[];
  V: ProbMap[];
  B: Record<string, string | null>[];
  path: string[];
  bestProb: number;
  steps: ViterbiStep[];
}
