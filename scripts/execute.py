#!/usr/bin/env python3
"""
ZzalLog Harness Step Executor.

Runs one phase directory step by step. Each completed step must pass its
Acceptance Criteria five consecutive times, then gets committed and pushed.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parent.parent
KST = timezone(timedelta(hours=9))
VALIDATION_RUNS = 5
REPORT_INTERVAL_SECONDS = 300


@dataclass
class CommandResult:
    command: str
    returncode: int
    stdout: str
    stderr: str
    duration_sec: float

    @property
    def ok(self) -> bool:
        return self.returncode == 0


def stamp() -> str:
    return datetime.now(KST).strftime("%Y-%m-%dT%H:%M:%S%z")


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def run(command: str | list[str], *, cwd: Path = ROOT, check: bool = False) -> CommandResult:
    started = time.monotonic()
    if isinstance(command, str):
        proc = subprocess.run(command, cwd=cwd, shell=True, capture_output=True, text=True)
        command_label = command
    else:
        proc = subprocess.run(command, cwd=cwd, shell=False, capture_output=True, text=True)
        command_label = " ".join(command)
    result = CommandResult(
        command=command_label,
        returncode=proc.returncode,
        stdout=proc.stdout,
        stderr=proc.stderr,
        duration_sec=round(time.monotonic() - started, 3),
    )
    if check and not result.ok:
        raise RuntimeError(f"{command_label} failed: {result.stderr.strip()}")
    return result


def git(*args: str) -> CommandResult:
    return run(["git", *args])


def ensure_git_repo() -> None:
    if git("rev-parse", "--is-inside-work-tree").returncode != 0:
        run(["git", "init"], check=True)
    remotes = git("remote").stdout.splitlines()
    if "origin" not in remotes:
        run(["git", "remote", "add", "origin", "https://github.com/jha0313/harness_framework.git"], check=True)


def checkout_phase_branch(phase_name: str) -> str:
    branch = f"feat-{phase_name}"
    current = git("rev-parse", "--abbrev-ref", "HEAD")
    if current.ok and current.stdout.strip() == branch:
        return branch
    exists = git("rev-parse", "--verify", branch)
    if exists.ok:
        result = git("checkout", branch)
    else:
        result = git("checkout", "-b", branch)
    if not result.ok:
        raise RuntimeError(result.stderr.strip())
    return branch


def load_guardrails() -> str:
    sections: list[str] = []
    for path in [ROOT / "CLAUDE.md", *sorted((ROOT / "docs").glob("*.md"))]:
        if path.exists():
            sections.append(f"## {path.relative_to(ROOT)}\n\n{path.read_text(encoding='utf-8')}")
    return "\n\n---\n\n".join(sections)


def extract_acceptance_commands(step_file: Path) -> list[str]:
    text = step_file.read_text(encoding="utf-8")
    match = re.search(r"## Acceptance Criteria\s*```(?:bash)?\s*(.*?)```", text, flags=re.S)
    if not match:
        return []
    commands: list[str] = []
    for raw in match.group(1).splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        commands.append(line)
    return commands


def completed_summaries(index: dict) -> str:
    lines = []
    for step in index["steps"]:
        if step.get("status") == "completed" and step.get("summary"):
            lines.append(f"- Step {step['step']} ({step['name']}): {step['summary']}")
    return "\n".join(lines)


def invoke_agent(step_file: Path, phase_dir: Path, index: dict, previous_error: str | None) -> CommandResult:
    claude = shutil.which("claude")
    if not claude:
        return CommandResult(
            command="claude",
            returncode=127,
            stdout="",
            stderr="Claude CLI not found. Install or expose a `claude` command to execute implementation steps.",
            duration_sec=0,
        )

    prompt_parts = [
        "당신은 쩔로그 프로젝트 구현 에이전트입니다.",
        "아래 가드레일과 step 파일만 기준으로 구현하세요.",
        load_guardrails(),
    ]
    summaries = completed_summaries(index)
    if summaries:
        prompt_parts.append("## 이전 step 요약\n\n" + summaries)
    if previous_error:
        prompt_parts.append("## 이전 실패\n\n" + previous_error)
    prompt_parts.append(step_file.read_text(encoding="utf-8"))
    prompt = "\n\n---\n\n".join(prompt_parts)
    return run([claude, "-p", prompt], cwd=ROOT)


def validation_pass(commands: Iterable[str]) -> list[CommandResult]:
    results = []
    for command in commands:
        result = run(command)
        results.append(result)
        if not result.ok:
            break
    return results


def run_validation_five_times(commands: list[str], phase_dir: Path, step_num: int) -> tuple[bool, list[dict]]:
    if not commands:
        return False, [{"run": 1, "ok": False, "error": "No Acceptance Criteria commands found."}]

    all_runs: list[dict] = []
    last_report = time.monotonic()
    for attempt in range(1, VALIDATION_RUNS + 1):
        print(f"  검증 {attempt}/{VALIDATION_RUNS} 시작")
        results = validation_pass(commands)
        run_record = {
            "run": attempt,
            "ok": all(r.ok for r in results) and len(results) == len(commands),
            "commands": [
                {
                    "command": r.command,
                    "returncode": r.returncode,
                    "duration_sec": r.duration_sec,
                    "stdout_tail": r.stdout[-2000:],
                    "stderr_tail": r.stderr[-2000:],
                }
                for r in results
            ],
        }
        all_runs.append(run_record)
        if not run_record["ok"]:
            append_mistake(
                phase_dir.name,
                step_num,
                "Acceptance Criteria failed",
                results[-1].stderr.strip() or results[-1].stdout.strip() or "unknown error",
                "Fix implementation and restart validation from run 1.",
            )
            return False, all_runs
        if time.monotonic() - last_report >= REPORT_INTERVAL_SECONDS:
            print(f"  진행상황: step {step_num} 검증 {attempt}/{VALIDATION_RUNS} 통과")
            last_report = time.monotonic()
    return True, all_runs


def append_mistake(phase_name: str, step_num: int, symptom: str, cause: str, prevention: str) -> None:
    path = ROOT / "docs" / "MISTAKES.md"
    if not path.exists():
        return
    entry = (
        f"\n- 날짜: {stamp()}\n"
        f"  step: {phase_name}/step{step_num}\n"
        f"  증상: {symptom}\n"
        f"  원인: {cause[:1000]}\n"
        f"  수정: 구현 수정 후 검증 재시작\n"
        f"  재발 방지: {prevention}\n"
    )
    path.write_text(path.read_text(encoding="utf-8") + entry, encoding="utf-8")


def write_step_output(
    phase_dir: Path,
    step: dict,
    *,
    implementation_result: CommandResult,
    validation_ok: bool,
    validation_runs: list[dict],
    push_result: CommandResult | None = None,
) -> None:
    output = {
        "step": step["step"],
        "name": step["name"],
        "recorded_at": stamp(),
        "implementation": {
            "command": implementation_result.command,
            "returncode": implementation_result.returncode,
            "stdout_tail": implementation_result.stdout[-4000:],
            "stderr_tail": implementation_result.stderr[-4000:],
        },
        "validation": {
            "required_consecutive_passes": VALIDATION_RUNS,
            "ok": validation_ok,
            "runs": validation_runs,
        },
        "push": None
        if push_result is None
        else {
            "command": push_result.command,
            "returncode": push_result.returncode,
            "stdout_tail": push_result.stdout[-2000:],
            "stderr_tail": push_result.stderr[-2000:],
        },
    }
    write_json(phase_dir / f"step{step['step']}-output.json", output)


def mark_step(index_path: Path, step_num: int, status: str, **fields: str) -> None:
    index = read_json(index_path)
    for step in index["steps"]:
        if step["step"] == step_num:
            step["status"] = status
            step.update(fields)
            if status == "completed":
                step["completed_at"] = stamp()
            elif status == "error":
                step["failed_at"] = stamp()
            elif status == "blocked":
                step["blocked_at"] = stamp()
            break
    write_json(index_path, index)


def commit_and_push(phase_name: str, step: dict, branch: str) -> CommandResult:
    git("add", "-A")
    commit_msg = f"feat({phase_name}): step {step['step']} {step['name']}"
    diff = git("diff", "--cached", "--quiet")
    if diff.returncode != 0:
        commit = git("commit", "-m", commit_msg)
        if not commit.ok:
            return commit
    push = git("push", "-u", "origin", branch)
    return push


def update_top_index(phase_dir_name: str, status: str) -> None:
    path = ROOT / "phases" / "index.json"
    if not path.exists():
        return
    data = read_json(path)
    for phase in data["phases"]:
        if phase["dir"] == phase_dir_name:
            phase["status"] = status
            phase[f"{status}_at"] = stamp()
            break
    write_json(path, data)


def execute_phase(phase_dir_name: str) -> int:
    ensure_git_repo()
    branch = checkout_phase_branch(phase_dir_name)
    phase_dir = ROOT / "phases" / phase_dir_name
    index_path = phase_dir / "index.json"
    if not index_path.exists():
        print(f"ERROR: {index_path} not found")
        return 2

    index = read_json(index_path)
    if "created_at" not in index:
        index["created_at"] = stamp()
        write_json(index_path, index)

    for step in index["steps"]:
        if step["status"] == "completed":
            continue
        if step["status"] in {"error", "blocked"}:
            print(f"ERROR: step {step['step']} is {step['status']}. Reset to pending after fixing.")
            return 2
        step_num = step["step"]
        step_file = phase_dir / f"step{step_num}.md"
        if not step_file.exists():
            mark_step(index_path, step_num, "error", error_message=f"{step_file} not found")
            return 2

        print(f"\n=== {phase_dir_name} step {step_num}: {step['name']} ===")
        step["started_at"] = stamp()
        index = read_json(index_path)
        for current in index["steps"]:
            if current["step"] == step_num and "started_at" not in current:
                current["started_at"] = stamp()
        write_json(index_path, index)

        previous_error = None
        implementation = invoke_agent(step_file, phase_dir, index, previous_error)
        if not implementation.ok:
            mark_step(index_path, step_num, "blocked", blocked_reason=implementation.stderr.strip())
            write_step_output(
                phase_dir,
                step,
                implementation_result=implementation,
                validation_ok=False,
                validation_runs=[],
            )
            return 2

        commands = extract_acceptance_commands(step_file)
        validation_ok, validation_runs = run_validation_five_times(commands, phase_dir, step_num)
        if not validation_ok:
            mark_step(index_path, step_num, "error", error_message="Acceptance Criteria failed")
            write_step_output(
                phase_dir,
                step,
                implementation_result=implementation,
                validation_ok=False,
                validation_runs=validation_runs,
            )
            return 1

        summary = f"{step['name']} 구현 및 AC {VALIDATION_RUNS}회 연속 통과"
        mark_step(index_path, step_num, "completed", summary=summary)
        push = commit_and_push(phase_dir_name, step, branch)
        write_step_output(
            phase_dir,
            step,
            implementation_result=implementation,
            validation_ok=True,
            validation_runs=validation_runs,
            push_result=push,
        )
        if not push.ok:
            mark_step(index_path, step_num, "blocked", blocked_reason=f"git push failed: {push.stderr.strip()}")
            append_mistake(phase_dir_name, step_num, "GitHub push failed", push.stderr.strip(), "Confirm auth and remote before rerun.")
            return 2

    index = read_json(index_path)
    index["completed_at"] = stamp()
    write_json(index_path, index)
    update_top_index(phase_dir_name, "completed")
    git("add", "-A")
    if git("diff", "--cached", "--quiet").returncode != 0:
        git("commit", "-m", f"chore({phase_dir_name}): mark phase completed")
        push = git("push", "-u", "origin", branch)
        if not push.ok:
            print(push.stderr)
            return 2
    print(f"\nPhase {phase_dir_name} completed.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Run a ZzalLog harness phase")
    parser.add_argument("phase_dir", help="Phase directory name, e.g. 0-foundation")
    args = parser.parse_args()
    return execute_phase(args.phase_dir)


if __name__ == "__main__":
    raise SystemExit(main())
