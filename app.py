"""Flask aplikacija za razlago HMM in Viterbijevega algoritma."""

from flask import Flask, jsonify, render_template, request

from viterbi import EXAMPLES, run_viterbi

NAV = [
    ("index", "Domov", "/"),
    ("markov", "Markovske verige", "/teorija/markovske-verige"),
    ("hmm", "Skriti modeli", "/teorija/hmm"),
    ("viterbi", "Viterbi algoritem", "/teorija/viterbi"),
    ("demo", "Interaktivni prikaz", "/demo"),
    ("primeri", "Primeri", "/primeri"),
]
REPO_URL = "https://github.com/nozelk/viterbi-explorer"


def create_app(test_config=None):
    """Ustvari in konfigurira Flask aplikacijo."""

    flask_app = Flask(__name__)
    flask_app.config.update(REPO_URL=REPO_URL)
    if test_config:
        flask_app.config.update(test_config)

    @flask_app.context_processor
    def inject_globals():
        """V predloge doda navigacijo in povezavo do repozitorija."""

        return {"NAV": NAV, "REPO_URL": flask_app.config["REPO_URL"]}

    @flask_app.route("/")
    def index():
        """Prikaže uvodno stran."""

        return render_template("index.html", active="index")

    @flask_app.route("/teorija/markovske-verige")
    def teorija_markov():
        """Prikaže stran o markovskih verigah."""

        return render_template("teorija/markov.html", active="markov")

    @flask_app.route("/teorija/hmm")
    def teorija_hmm():
        """Prikaže stran o skritih Markovskih modelih."""

        return render_template("teorija/hmm.html", active="hmm")

    @flask_app.route("/teorija/viterbi")
    def teorija_viterbi():
        """Prikaže stran o Viterbijevem algoritmu."""

        return render_template("teorija/viterbi.html", active="viterbi")

    @flask_app.route("/demo")
    def demo():
        """Prikaže interaktivni prikaz z vsemi primeri."""

        return render_template("demo.html", examples=EXAMPLES, active="demo")

    @flask_app.route("/primeri")
    def primeri():
        """Prikaže pripravljene scenarije."""

        return render_template("primeri.html", examples=EXAMPLES, active="primeri")

    @flask_app.route("/api/viterbi", methods=["POST"])
    def api_viterbi():
        """Izvede Viterbijev algoritem za podane parametre modela."""

        data = request.get_json()
        states = data["states"]
        observations_alphabet = data["obs_alphabet"]
        start_p = {state: float(data["start_p"][state]) for state in states}
        trans_p = {
            state: {
                next_state: float(data["trans_p"][state][next_state])
                for next_state in states
            }
            for state in states
        }
        emit_p = {
            state: {
                obs: float(data["emit_p"][state][obs])
                for obs in observations_alphabet
            }
            for state in states
        }
        obs_seq = data["obs_seq"]
        result = run_viterbi(states, obs_seq, start_p, trans_p, emit_p)
        return jsonify(result)

    return flask_app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
