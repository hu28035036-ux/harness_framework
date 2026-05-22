import json
from pathlib import Path
from unittest.mock import patch

import scripts.execute as ex


def test_extract_acceptance_commands(tmp_path):
    step = tmp_path / "step0.md"
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

    assert ex.extract_acceptance_commands(step) == ["npm run lint", "npm test"]


def test_write_json_preserves_korean(tmp_path):
    target = tmp_path / "x.json"
    ex.write_json(target, {"프로젝트": "쩔로그"})

    raw = target.read_text(encoding="utf-8")
    assert "쩔로그" in raw
    assert "\\u" not in raw
    assert json.loads(raw)["프로젝트"] == "쩔로그"


def test_mark_step_completed_adds_summary_and_timestamp(tmp_path):
    index = tmp_path / "index.json"
    ex.write_json(index, {"steps": [{"step": 0, "name": "x", "status": "pending"}]})

    ex.mark_step(index, 0, "completed", summary="done")

    data = ex.read_json(index)
    step = data["steps"][0]
    assert step["status"] == "completed"
    assert step["summary"] == "done"
    assert "completed_at" in step


def test_run_validation_requires_all_five_passes(tmp_path):
    with patch.object(ex, "run") as fake_run:
        fake_run.return_value = ex.CommandResult("ok", 0, "stdout", "", 0.01)
        ok, runs = ex.run_validation_five_times(["echo ok"], tmp_path, 0)

    assert ok is True
    assert len(runs) == ex.VALIDATION_RUNS
    assert fake_run.call_count == ex.VALIDATION_RUNS


def test_run_validation_stops_on_failure(tmp_path):
    with patch.object(ex, "run") as fake_run, patch.object(ex, "append_mistake") as fake_mistake:
        fake_run.return_value = ex.CommandResult("bad", 1, "", "failed", 0.01)
        ok, runs = ex.run_validation_five_times(["bad"], tmp_path, 0)

    assert ok is False
    assert len(runs) == 1
    fake_mistake.assert_called_once()


def test_write_step_output_records_push_result(tmp_path):
    step = {"step": 2, "name": "push-step"}
    impl = ex.CommandResult("claude", 0, "done", "", 1.0)
    push = ex.CommandResult("git push", 0, "pushed", "", 1.0)

    ex.write_step_output(
        tmp_path,
        step,
        implementation_result=impl,
        validation_ok=True,
        validation_runs=[{"run": 1, "ok": True}],
        push_result=push,
    )

    data = json.loads((tmp_path / "step2-output.json").read_text(encoding="utf-8"))
    assert data["validation"]["required_consecutive_passes"] == 5
    assert data["push"]["returncode"] == 0
