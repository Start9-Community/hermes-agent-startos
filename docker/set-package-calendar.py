"""Bind a StartOS calendar label without changing the official native stamp."""
import datetime
import hashlib
import json
import re
import sys
from pathlib import Path


def bind_calendar(root: Path, calendar: str, native: str, commit: str) -> None:
    if not re.fullmatch(r"[0-9]{4}\.[1-9][0-9]?\.[1-9][0-9]?", calendar):
        raise ValueError("expected canonical StartOS calendar date")
    datetime.date(*map(int, calendar.split(".")))
    stamp_path = root / "install-stamp.json"
    original = stamp_path.read_bytes()
    stamp = json.loads(original)
    expected = dict(baseVersion=native, displayVersion=native, commit=commit,
                    distance=0, dirty=False, distribution="docker", updateMechanism="external")
    if any(stamp.get(key) != value for key, value in expected.items()):
        raise ValueError("official native image does not match the release")
    if type(stamp.get("distance")) is not int or stamp.get("dirty") is not False:
        raise ValueError("invalid native stamp types")
    module = root / "hermes_cli/__init__.py"
    source, count = re.subn(r'^__release_date__ = "[^"\n]*"$',
                           f'__release_date__ = "{calendar}"', module.read_text(), flags=re.M)
    if count != 1:
        raise ValueError("upstream calendar label surface changed")
    module.write_text(source)
    (root / "startos-package-identity.json").write_text(json.dumps(dict(
        calendarVersion=calendar, nativeVersion=native, upstreamCommit=commit,
        upstreamStampSha256=hashlib.sha256(original).hexdigest()), indent=2) + "\n")
    if stamp_path.read_bytes() != original:
        raise RuntimeError("native stamp changed")


if __name__ == "__main__":
    bind_calendar(Path(sys.argv[1]), *sys.argv[2:])
