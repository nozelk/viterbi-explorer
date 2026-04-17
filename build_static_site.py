"""Build a static version of the app for GitHub Pages."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup

from app import NAV, REPO_URL
from viterbi import EXAMPLES

ROOT = Path(__file__).resolve().parent
TEMPLATES = ROOT / "templates"
STATIC = ROOT / "static"
OUTPUT = ROOT / "docs"
SITE_BASE = "/viterbi-explorer"

ROUTE_MAP = {
    "index": f"{SITE_BASE}/",
    "demo": f"{SITE_BASE}/demo/",
    "primeri": f"{SITE_BASE}/primeri/",
    "teorija_markov": f"{SITE_BASE}/teorija/markovske-verige/",
    "teorija_hmm": f"{SITE_BASE}/teorija/hmm/",
    "teorija_viterbi": f"{SITE_BASE}/teorija/viterbi/",
}

PAGES = [
    ("index.html", "index.html", {"active": "index"}),
    ("demo/index.html", "demo.html", {"active": "demo", "examples": EXAMPLES}),
    ("primeri/index.html", "primeri.html", {"active": "primeri", "examples": EXAMPLES}),
    ("teorija/markovske-verige/index.html", "teorija/markov.html", {"active": "markov"}),
    ("teorija/hmm/index.html", "teorija/hmm.html", {"active": "hmm"}),
    ("teorija/viterbi/index.html", "teorija/viterbi.html", {"active": "viterbi"}),
]


def url_for(endpoint: str, **values: str) -> str:
    """Minimal replacement for Flask's url_for during static rendering."""

    if endpoint == "static":
        return f"{SITE_BASE}/static/{values['filename']}"
    return ROUTE_MAP[endpoint]


def tojson_filter(value) -> Markup:
    """Render JSON without escaping unicode characters."""

    return Markup(json.dumps(value, ensure_ascii=False))


def build() -> None:
    """Render all templates into the docs directory."""

    env = Environment(
        loader=FileSystemLoader(TEMPLATES),
        autoescape=select_autoescape(["html", "xml"]),
    )
    env.globals["url_for"] = url_for
    env.filters["tojson"] = tojson_filter

    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    shutil.copytree(STATIC, OUTPUT / "static")

    for output_name, template_name, context in PAGES:
        output_path = OUTPUT / output_name
        output_path.parent.mkdir(parents=True, exist_ok=True)
        html = env.get_template(template_name).render(
            NAV=NAV,
            REPO_URL=REPO_URL,
            **context,
        )
        output_path.write_text(html, encoding="utf-8")

    (OUTPUT / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    build()