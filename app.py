from flask import Flask, render_template, request, jsonify
from viterbi import run_viterbi, EXAMPLES

app = Flask(__name__)

NAV = [
    ("index",   "Domov",             "/"),
    ("markov",  "Markovske verige",  "/teorija/markovske-verige"),
    ("hmm",     "Skriti modeli",     "/teorija/hmm"),
    ("viterbi", "Viterbi algoritem", "/teorija/viterbi"),
    ("demo",    "Interaktivni demo", "/demo"),
    ("primeri", "Primeri",           "/primeri"),
]


@app.context_processor
def inject_nav():
    return {"NAV": NAV}


@app.route("/")
def index():
    return render_template("index.html", active="index")


@app.route("/teorija/markovske-verige")
def teorija_markov():
    return render_template("teorija/markov.html", active="markov")


@app.route("/teorija/hmm")
def teorija_hmm():
    return render_template("teorija/hmm.html", active="hmm")


@app.route("/teorija/viterbi")
def teorija_viterbi():
    return render_template("teorija/viterbi.html", active="viterbi")


@app.route("/demo")
def demo():
    return render_template("demo.html", examples=EXAMPLES, active="demo")


@app.route("/primeri")
def primeri():
    return render_template("primeri.html", examples=EXAMPLES, active="primeri")


@app.route("/api/viterbi", methods=["POST"])
def api_viterbi():
    data = request.get_json()
    states = data["states"]
    observations_alphabet = data["obs_alphabet"]
    start_p = {s: float(data["start_p"][s]) for s in states}
    trans_p = {s: {s2: float(data["trans_p"][s][s2]) for s2 in states} for s in states}
    emit_p = {
        s: {o: float(data["emit_p"][s][o]) for o in observations_alphabet}
        for s in states
    }
    obs_seq = data["obs_seq"]
    result = run_viterbi(states, obs_seq, start_p, trans_p, emit_p)
    return jsonify(result)


app.run(debug=True, port=5000)
