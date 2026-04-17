"""Unit tests for the Viterbi implementation."""

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


VITERBI_MODULE = load_module("viterbi_under_test", "viterbi.py")

EXAMPLES = VITERBI_MODULE.EXAMPLES
run_viterbi = VITERBI_MODULE.run_viterbi


class ViterbiAlgorithmTestCase(unittest.TestCase):
    """Verifies deterministic outputs for predefined examples."""

    def test_weather_example_path_and_probability(self):
        example = EXAMPLES["vreme"]
        result = run_viterbi(
            example["states"],
            example["obs_seq"],
            example["start_p"],
            example["trans_p"],
            example["emit_p"],
        )

        self.assertEqual(
            result["path"],
            ["Soncno", "Dezevno", "Dezevno", "Soncno"],
        )
        self.assertAlmostEqual(result["best_prob"], 0.02239488)
        self.assertEqual(len(result["steps"]), len(example["obs_seq"]) + 1)

    def test_every_example_returns_valid_path_length(self):
        for example in EXAMPLES.values():
            result = run_viterbi(
                example["states"],
                example["obs_seq"],
                example["start_p"],
                example["trans_p"],
                example["emit_p"],
            )

            self.assertEqual(len(result["path"]), len(example["obs_seq"]))
            self.assertGreater(result["best_prob"], 0)


if __name__ == "__main__":
    unittest.main()