"""Smoke tests for Flask routes and the Viterbi API."""

import copy
import importlib.util
import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]


def load_module(module_name, file_name):
    """Load a module directly from the repository root."""

    spec = importlib.util.spec_from_file_location(module_name, ROOT / file_name)
    module = importlib.util.module_from_spec(spec)
    if spec.loader is None:
        raise RuntimeError(f"Cannot load module {module_name}")
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    return module


VITERBI_MODULE = load_module("viterbi", "viterbi.py")
APP_MODULE = load_module("app_under_test", "app.py")

create_app = APP_MODULE.create_app
EXAMPLES = VITERBI_MODULE.EXAMPLES


class FlaskAppTestCase(unittest.TestCase):
    """Covers the main user-facing pages and API."""

    def setUp(self):
        self.app = create_app({"TESTING": True})
        self.client = self.app.test_client()

    def test_main_pages_render(self):
        for route in [
            "/",
            "/teorija/markovske-verige",
            "/teorija/hmm",
            "/teorija/viterbi",
            "/demo",
            "/primeri",
        ]:
            response = self.client.get(route)
            self.assertEqual(response.status_code, 200)

    def test_homepage_contains_key_content(self):
        response = self.client.get("/")
        body = response.get_data(as_text=True)

        self.assertIn("Skriti Markovski modeli", body)
        self.assertIn("Viterbi", body)

    def test_viterbi_api_returns_expected_path(self):
        payload = copy.deepcopy(EXAMPLES["vreme"])

        response = self.client.post("/api/viterbi", json=payload)
        data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            data["path"],
            ["Soncno", "Dezevno", "Dezevno", "Soncno"],
        )
        self.assertGreater(data["best_prob"], 0)


if __name__ == "__main__":
    unittest.main()