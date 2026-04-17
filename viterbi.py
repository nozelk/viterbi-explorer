"""
Viterbijev algoritem s sledenjem korakov za vizualizacijo.
Vsak korak vrne delno matriko V, backpointerje in razlago.
"""
import math


def run_viterbi(states, obs_seq, start_p, trans_p, emit_p):
    T = len(obs_seq)
    N = len(states)

    # V[t][s] = najvecja verjetnost poti, ki konca v stanju s ob casu t
    V = [{s: 0.0 for s in states} for _ in range(T)]
    # backpointer[t][s] = predhodno stanje na najboljsi poti do (t, s)
    B = [{s: None for s in states} for _ in range(T)]

    steps = []  # za frontend animacijo

    # --- inicializacija (t = 0) ---
    o0 = obs_seq[0]
    for s in states:
        V[0][s] = start_p[s] * emit_p[s][o0]
        B[0][s] = None

    steps.append({
        "t": 0,
        "obs": o0,
        "V": {s: V[0][s] for s in states},
        "B": {s: None for s in states},
        "explanation": (
            f"Inicializacija (t=0, opazovanje = '{o0}'): "
            f"V[0][s] = π(s) · b_s({o0}) za vsako stanje s."
        ),
        "cells": [
            {
                "state": s,
                "value": V[0][s],
                "formula": f"π({s})·b_{s}({o0}) = {start_p[s]:.3f}·{emit_p[s][o0]:.3f} = {V[0][s]:.4f}",
                "from": None,
            }
            for s in states
        ],
    })

    # --- rekurzija ---
    for t in range(1, T):
        ot = obs_seq[t]
        cells = []
        for s in states:
            best_prev = None
            best_val = -1.0
            candidates = []
            for sp in states:
                val = V[t - 1][sp] * trans_p[sp][s] * emit_p[s][ot]
                candidates.append({
                    "from": sp,
                    "value": val,
                    "formula": f"V[{t-1}][{sp}]·a({sp}→{s})·b_{s}({ot}) = "
                               f"{V[t-1][sp]:.4f}·{trans_p[sp][s]:.3f}·{emit_p[s][ot]:.3f} = {val:.5f}",
                })
                if val > best_val:
                    best_val = val
                    best_prev = sp
            V[t][s] = best_val
            B[t][s] = best_prev
            cells.append({
                "state": s,
                "value": best_val,
                "from": best_prev,
                "candidates": candidates,
                "formula": f"max → prihaja iz '{best_prev}', vrednost = {best_val:.5f}",
            })

        steps.append({
            "t": t,
            "obs": ot,
            "V": {s: V[t][s] for s in states},
            "B": {s: B[t][s] for s in states},
            "explanation": (
                f"Korak t={t}, opazovanje = '{ot}': za vsako stanje s izracunamo "
                f"max_sp V[{t-1}][sp]·a(sp→s)·b_s({ot}) in shranimo najboljsega predhodnika."
            ),
            "cells": cells,
        })

    # --- terminacija + backtrace ---
    last = T - 1
    final_state = max(states, key=lambda s: V[last][s])
    path = [final_state]
    for t in range(last, 0, -1):
        path.append(B[t][path[-1]])
    path.reverse()

    best_prob = V[last][final_state]

    steps.append({
        "t": T,  # pseudo-step
        "obs": None,
        "V": None,
        "B": None,
        "explanation": (
            f"Backtracking: najboljsa koncna verjetnost je {best_prob:.5f} "
            f"v stanju '{final_state}'. Po backpointerjih sledimo nazaj → pot: {' → '.join(path)}."
        ),
        "path": path,
        "best_prob": best_prob,
        "final_state": final_state,
    })

    return {
        "states": states,
        "obs_seq": obs_seq,
        "V": [{s: V[t][s] for s in states} for t in range(T)],
        "B": [{s: B[t][s] for s in states} for t in range(T)],
        "path": path,
        "best_prob": best_prob,
        "steps": steps,
    }


# --- predpripravljeni primeri ---
EXAMPLES = {
    "vreme": {
        "name": "Vreme → Dežnik",
        "description": (
            "Klasičen uvodni primer. Skrita stanja so vreme (sončno/deževno), "
            "opazovanja pa ali soseda opaziš z dežnikom. Iz zaporedja dežnikov "
            "ugibamo vreme."
        ),
        "states": ["Soncno", "Dezevno"],
        "obs_alphabet": ["Dezn.", "BrezD."],
        "start_p": {"Soncno": 0.6, "Dezevno": 0.4},
        "trans_p": {
            "Soncno":  {"Soncno": 0.7, "Dezevno": 0.3},
            "Dezevno": {"Soncno": 0.4, "Dezevno": 0.6},
        },
        "emit_p": {
            "Soncno":  {"Dezn.": 0.1, "BrezD.": 0.9},
            "Dezevno": {"Dezn.": 0.8, "BrezD.": 0.2},
        },
        "obs_seq": ["BrezD.", "Dezn.", "Dezn.", "BrezD."],
    },
    "sladoled": {
        "name": "Sladoled (Jurafsky)",
        "description": (
            "Primer iz knjige Jurafsky & Martin. Skrita stanja: HOT/COLD dan. "
            "Opazovanja: stevilo pojedenih sladoledov (1, 2 ali 3)."
        ),
        "states": ["HOT", "COLD"],
        "obs_alphabet": ["1", "2", "3"],
        "start_p": {"HOT": 0.8, "COLD": 0.2},
        "trans_p": {
            "HOT":  {"HOT": 0.7, "COLD": 0.3},
            "COLD": {"HOT": 0.4, "COLD": 0.6},
        },
        "emit_p": {
            "HOT":  {"1": 0.2, "2": 0.4, "3": 0.4},
            "COLD": {"1": 0.5, "2": 0.4, "3": 0.1},
        },
        "obs_seq": ["3", "1", "3"],
    },
    "razpolozenje": {
        "name": "Razpoloženje → Objave",
        "description": (
            "Skrita stanja so razpolozenje osebe (veselo/zalostno), "
            "opazovanja pa tip objave na socialnem omrezju."
        ),
        "states": ["Veselo", "Zalostno"],
        "obs_alphabet": ["Meme", "Selfie", "Citat"],
        "start_p": {"Veselo": 0.5, "Zalostno": 0.5},
        "trans_p": {
            "Veselo":   {"Veselo": 0.8, "Zalostno": 0.2},
            "Zalostno": {"Veselo": 0.3, "Zalostno": 0.7},
        },
        "emit_p": {
            "Veselo":   {"Meme": 0.5, "Selfie": 0.4, "Citat": 0.1},
            "Zalostno": {"Meme": 0.1, "Selfie": 0.2, "Citat": 0.7},
        },
        "obs_seq": ["Meme", "Citat", "Citat", "Selfie", "Meme"],
    },
    "borza": {
        "name": "Borza → Tržni režim",
        "description": (
            "Klasična uporaba HMM v financah (regime-switching model). "
            "Skrita stanja so tržni režim: Bikov trg (rast) ali Medvedji trg (padec). "
            "Opazovanja so dnevni premiki indeksa: Gor, Dol, ali Mir. "
            "Iz zaporedja dnevnih gibov skušamo ugotoviti, kakšno je bilo ozadje trga."
        ),
        "states": ["Bikov", "Medvedji"],
        "obs_alphabet": ["Gor", "Dol", "Mir"],
        "start_p": {"Bikov": 0.6, "Medvedji": 0.4},
        "trans_p": {
            "Bikov":    {"Bikov": 0.85, "Medvedji": 0.15},
            "Medvedji": {"Bikov": 0.20, "Medvedji": 0.80},
        },
        "emit_p": {
            "Bikov":    {"Gor": 0.6, "Dol": 0.2, "Mir": 0.2},
            "Medvedji": {"Gor": 0.2, "Dol": 0.6, "Mir": 0.2},
        },
        "obs_seq": ["Gor", "Gor", "Dol", "Dol", "Dol", "Gor"],
    },
}
