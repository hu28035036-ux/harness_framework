from dataclasses import dataclass
from pathlib import Path
import shutil
import subprocess
from typing import Protocol


class RecordingBackend(Protocol):
    def detect(self) -> bool:
        ...

    def build_test_recording(self, target: str, output_path: Path) -> list[str]:
        ...

    def build_clip_recording(self, target: str, output_path: Path) -> list[str]:
        ...

    def record(self, command: list[str]) -> subprocess.CompletedProcess[str]:
        ...


@dataclass(frozen=True)
class RecordingTarget:
    mode: str
    value: str

    @staticmethod
    def game_window(title: str) -> "RecordingTarget":
        return RecordingTarget(mode="window", value=title)

    @staticmethod
    def region(x: int, y: int, width: int, height: int) -> "RecordingTarget":
        return RecordingTarget(mode="region", value=f"{x},{y},{width},{height}")


@dataclass(frozen=True)
class FFmpegRecordingBackend:
    ffmpeg_path: str = "ffmpeg"
    test_duration_sec: int = 3
    clip_duration_sec: int = 30

    def detect(self) -> bool:
        return shutil.which(self.ffmpeg_path) is not None

    def build_test_recording(self, target: str, output_path: Path) -> list[str]:
        return self._build_command(duration_sec=self.test_duration_sec, target=target, output_path=output_path)

    def build_clip_recording(self, target: str, output_path: Path) -> list[str]:
        return self._build_command(duration_sec=self.clip_duration_sec, target=target, output_path=output_path)

    def record(self, command: list[str]) -> subprocess.CompletedProcess[str]:
        if not self.detect():
            raise FileNotFoundError("ffmpeg executable was not found")
        return subprocess.run(command, capture_output=True, check=False, text=True)

    def _build_command(self, duration_sec: int, target: str, output_path: Path) -> list[str]:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        return [
            self.ffmpeg_path,
            "-y",
            *self._input_args(target),
            "-t",
            str(duration_sec),
            "-pix_fmt",
            "yuv420p",
            str(output_path),
        ]

    def _input_args(self, target: str) -> list[str]:
        if target.startswith("region:"):
            x, y, width, height = target.removeprefix("region:").split(",")
            return ["-f", "gdigrab", "-offset_x", x, "-offset_y", y, "-video_size", f"{width},{height}", "-i", "desktop"]
        return ["-f", "gdigrab", "-i", f"title={target}"]
