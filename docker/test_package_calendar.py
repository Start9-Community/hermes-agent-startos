"""Regression tests for the package-only calendar identity binding."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "calendar_binding", Path(__file__).with_name("set-package-calendar.py"))
binding = importlib.util.module_from_spec(spec)
spec.loader.exec_module(binding)
COMMIT = "71d34bad1045610252eda02ee79549436896e784"


class CalendarBindingTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        (self.root / "hermes_cli").mkdir()
        self.module = self.root / "hermes_cli/__init__.py"
        self.module.write_text('__release_date__ = "2026.10.11"\n')
        self.stamp = self.root / "install-stamp.json"
        self.original = dict(baseVersion="0.21.7", displayVersion="0.21.7",
            commit=COMMIT, distance=0, dirty=False,
            distribution="docker", updateMechanism="external")
        self.stamp.write_text(json.dumps(self.original))

    def bind(self, date="2026.10.12"):
        binding.bind_calendar(self.root, date, "0.21.7", COMMIT)

    def test_native_stamp_is_byte_identical_and_idempotent(self):
        before = self.stamp.read_bytes()
        self.bind()
        self.bind()
        self.assertEqual(before, self.stamp.read_bytes())
        self.assertEqual(self.module.read_text(), '__release_date__ = "2026.10.12"\n')
        identity = json.loads((self.root / "startos-package-identity.json").read_text())
        self.assertEqual(identity["nativeVersion"], "0.21.7")
        self.assertEqual(identity["upstreamCommit"], COMMIT)

    def test_invalid_dates_do_not_mutate(self):
        before = self.module.read_bytes()
        for date in ("2026.02.12", "2026.2.30", "2026.10.12:0", "v0.21.7", "2026.13.1"):
            with self.subTest(date=date), self.assertRaises(ValueError):
                self.bind(date)
            self.assertEqual(before, self.module.read_bytes())

    def test_mismatched_provenance_does_not_mutate(self):
        before = self.module.read_bytes()
        for field, value in (("baseVersion", "0.21.6"), ("displayVersion", "0.21.7-dev"),
                ("commit", "0" * 40), ("distance", True), ("distance", "0"),
                ("dirty", 0), ("dirty", True), ("distribution", "git"),
                ("updateMechanism", "git")):
            with self.subTest(field=field, value=value):
                self.stamp.write_text(json.dumps({**self.original, field: value}))
                with self.assertRaises(ValueError):
                    self.bind()
                self.assertEqual(before, self.module.read_bytes())

    def test_missing_or_duplicate_label_refused(self):
        for source in ("", '__release_date__ = "x"\n__release_date__ = "y"\n'):
            self.module.write_text(source)
            with self.assertRaises(ValueError):
                self.bind()
            self.assertEqual(source, self.module.read_text())


if __name__ == "__main__":
    unittest.main()
