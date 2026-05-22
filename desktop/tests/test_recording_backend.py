import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from desktop.zzallog.recording_backend import FFmpegRecordingBackend, RecordingTarget


class FFmpegRecordingBackendTest(unittest.TestCase):
    def test_detect_returns_false_when_ffmpeg_is_missing(self) -> None:
        backend = FFmpegRecordingBackend()

        with patch("desktop.zzallog.recording_backend.shutil.which", return_value=None):
            self.assertFalse(backend.detect())

    def test_builds_three_second_test_recording_for_window_target(self) -> None:
        with TemporaryDirectory() as tmp:
            output = Path(tmp) / "test.mp4"
            backend = FFmpegRecordingBackend()

            command = backend.build_test_recording(RecordingTarget.game_window("MapleStory").value, output)

            self.assertIn("-t", command)
            self.assertEqual(command[command.index("-t") + 1], "3")
            self.assertIn("title=MapleStory", command)
            self.assertEqual(command[-1], str(output))

    def test_builds_thirty_second_clip_recording_for_region_target(self) -> None:
        with TemporaryDirectory() as tmp:
            output = Path(tmp) / "clip.mp4"
            backend = FFmpegRecordingBackend()

            command = backend.build_clip_recording(f"region:{RecordingTarget.region(10, 20, 1280, 720).value}", output)

            self.assertEqual(command[command.index("-t") + 1], "30")
            self.assertIn("-offset_x", command)
            self.assertIn("10", command)
            self.assertIn("-video_size", command)
            self.assertIn("1280,720", command)

    def test_record_raises_clear_error_when_ffmpeg_is_missing(self) -> None:
        backend = FFmpegRecordingBackend()

        with patch("desktop.zzallog.recording_backend.shutil.which", return_value=None):
            with self.assertRaises(FileNotFoundError):
                backend.record(["ffmpeg", "-version"])


if __name__ == "__main__":
    unittest.main()
