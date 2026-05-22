#!/usr/bin/env python3
"""Small stdlib test runner for the harness tests.

This keeps the harness self-checkable even before the future Next.js project
adds its own JavaScript test stack.
"""

from __future__ import annotations

import tempfile
from pathlib import Path
from unittest.mock import patch

import execute as ex


def assert_true(value: bool, message: str) -> None:
    if not value:
        raise AssertionError(message)


def test_extract_acceptance_commands() -> None:
    with tempfile.TemporaryDirectory() as d:
        step = Path(d) / "step0.md"
        step.write_text(
            """
## Acceptance Criteria
```bash
npm run lint

# comment
npm test
```
""",
            encoding="utf-8",
        )
        assert_true(ex.extract_acceptance_commands(step) == ["npm run lint", "npm test"], "AC parsing failed")


def test_json_and_mark_step() -> None:
    with tempfile.TemporaryDirectory() as d:
        target = Path(d) / "index.json"
        ex.write_json(target, {"steps": [{"step": 0, "name": "x", "status": "pending"}], "프로젝트": "쩔로그"})
        raw = target.read_text(encoding="utf-8")
        assert_true("쩔로그" in raw and "\\u" not in raw, "Korean JSON was escaped")

        ex.mark_step(target, 0, "completed", summary="done")
        data = ex.read_json(target)
        step = data["steps"][0]
        assert_true(step["status"] == "completed", "step status not updated")
        assert_true(step["summary"] == "done", "step summary not updated")
        assert_true("completed_at" in step, "completed_at missing")


def test_validation_five_passes() -> None:
    with tempfile.TemporaryDirectory() as d:
        with patch.object(ex, "run") as fake_run:
            fake_run.return_value = ex.CommandResult("ok", 0, "stdout", "", 0.01)
            ok, runs = ex.run_validation_five_times(["echo ok"], Path(d), 0)
        assert_true(ok, "validation should pass")
        assert_true(len(runs) == ex.VALIDATION_RUNS, "validation did not run five times")
        assert_true(fake_run.call_count == ex.VALIDATION_RUNS, "command count mismatch")


def test_validation_failure_stops() -> None:
    with tempfile.TemporaryDirectory() as d:
        with patch.object(ex, "run") as fake_run, patch.object(ex, "append_mistake") as fake_mistake:
            fake_run.return_value = ex.CommandResult("bad", 1, "", "failed", 0.01)
            ok, runs = ex.run_validation_five_times(["bad"], Path(d), 0)
        assert_true(not ok, "validation should fail")
        assert_true(len(runs) == 1, "validation should stop after first failed run")
        fake_mistake.assert_called_once()


def test_write_step_output() -> None:
    with tempfile.TemporaryDirectory() as d:
        step = {"step": 2, "name": "push-step"}
        impl = ex.CommandResult("claude", 0, "done", "", 1.0)
        push = ex.CommandResult("git push", 0, "pushed", "", 1.0)
        ex.write_step_output(
            Path(d),
            step,
            implementation_result=impl,
            validation_ok=True,
            validation_runs=[{"run": 1, "ok": True}],
            push_result=push,
        )
        data = ex.read_json(Path(d) / "step2-output.json")
        assert_true(data["validation"]["required_consecutive_passes"] == 5, "validation count not recorded")
        assert_true(data["push"]["returncode"] == 0, "push result not recorded")


def main() -> int:
    tests = [
        test_extract_acceptance_commands,
        test_json_and_mark_step,
        test_validation_five_passes,
        test_validation_failure_stops,
        test_write_step_output,
    ]
    for test in tests:
        test()
        print(f"PASS {test.__name__}")
    print(f"{len(tests)} tests passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
