"""Faceless explainer video assembly: Pixabay b-roll + animated on-screen text + music, via
ffmpeg. No voice-over (text + music only, per docs/superpowers/specs/2026-09-20-instagentrix-design.md).
Network dependency: Pixabay API only. Must run from a local session, never from the cloud routine.
"""
import subprocess
import urllib.request
import urllib.parse
import json
from pathlib import Path

from instagentrix import brand

PIXABAY_VIDEO_SEARCH = "https://pixabay.com/api/videos/"


def search_broll(query: str, api_key: str) -> str:
    """Return the direct .mp4 URL of the best-matching free-to-use Pixabay video for `query`."""
    params = urllib.parse.urlencode({
        "key": api_key,
        "q": query,
        "video_type": "film",
        "orientation": "vertical",
        "safesearch": "true",
        "per_page": 5,
    })
    with urllib.request.urlopen(f"{PIXABAY_VIDEO_SEARCH}?{params}", timeout=20) as resp:
        data = json.loads(resp.read())
    hits = data.get("hits", [])
    if not hits:
        raise RuntimeError(f"No Pixabay b-roll found for query: {query!r}")
    videos = hits[0]["videos"]
    for quality in ("medium", "small", "tiny", "large"):
        if quality in videos:
            return videos[quality]["url"]
    raise RuntimeError(f"Pixabay hit for {query!r} has no usable video quality: {list(videos)}")


def download_file(url: str, dest: Path) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=20) as resp, open(dest, "wb") as f:
        f.write(resp.read())
    return dest


def _drawtext_chain(text_lines: list[str], seconds_per_line: float) -> str:
    """Build the ffmpeg drawtext filter chain for a sequence of timed, centered caption lines."""
    escaped_font = brand.FONT_DISPLAY_BOLD.replace("'", "'\\''")
    drawtext_filters = []
    for i, line in enumerate(text_lines):
        start = i * seconds_per_line
        end = start + seconds_per_line
        safe_text = line.replace("'", "'\\''")
        drawtext_filters.append(
            "drawtext="
            f"fontfile='{escaped_font}':text='{safe_text}':"
            "fontcolor=white:fontsize=56:"
            "x=(w-text_w)/2:y=(h-text_h)/2:"
            "box=1:boxcolor=black@0.55:boxborderw=24:"
            f"enable='between(t,{start},{end})'"
        )
    return ",".join(drawtext_filters)


def _run_ffmpeg(cmd: list[str]) -> None:
    try:
        subprocess.run(cmd, check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        raise RuntimeError(
            f"ffmpeg failed (exit {e.returncode}):\n{e.stderr.decode(errors='replace')}"
        ) from e


def build_video(
    broll_path: Path,
    text_lines: list[str],
    music_path: Path,
    output_path: Path,
    seconds_per_line: float = 3.5,
) -> Path:
    """Scale/crop b-roll to 1080x1920, overlay each text line in sequence (timed), mix in music
    at low volume, and write a vertical MP4 to output_path.
    """
    if not text_lines:
        raise ValueError("text_lines must not be empty")

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    total_duration = len(text_lines) * seconds_per_line

    drawtext_chain = _drawtext_chain(text_lines, seconds_per_line)
    filter_complex = (
        f"[0:v]scale={brand.VIDEO_W}:{brand.VIDEO_H}:force_original_aspect_ratio=increase,"
        f"crop={brand.VIDEO_W}:{brand.VIDEO_H},{drawtext_chain}[v]"
    )

    cmd = [
        "ffmpeg", "-y",
        "-stream_loop", "-1", "-i", str(broll_path),
        "-stream_loop", "-1", "-i", str(music_path),
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "1:a",
        "-t", str(total_duration),
        "-af", "volume=0.25",
        "-c:v", "libx264", "-preset", "medium", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        "-shortest",
        str(output_path),
    ]
    _run_ffmpeg(cmd)
    return output_path


def build_video_from_image(
    image_path: Path,
    text_lines: list[str],
    music_path: Path,
    output_path: Path,
    seconds_per_line: float = 3.5,
    fps: int = 25,
) -> Path:
    """Animate a single still image with a slow Ken Burns zoom/pan (instead of real b-roll
    footage), overlay each text line in sequence (timed), mix in music at low volume, and write
    a vertical MP4 to output_path.

    Use this instead of `build_video` when the background comes from an AI image generator
    (e.g. a Nano Banana image generated via the Zapier Google AI Studio connector) rather than
    Pixabay stock footage. `image_path` must already be a local file — this function has no
    network dependency of its own.
    """
    if not text_lines:
        raise ValueError("text_lines must not be empty")

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    total_duration = len(text_lines) * seconds_per_line
    total_frames = max(1, round(total_duration * fps))

    drawtext_chain = _drawtext_chain(text_lines, seconds_per_line)
    # Upscale before zoompan to avoid visible pixelation as the zoom progresses, then zoompan
    # holds/animates the still across every output frame, then crop/scale locks the final frame.
    filter_complex = (
        f"[0:v]scale=8000:-2,"
        f"zoompan=z='min(zoom+0.0015,1.4)':d={total_frames}:s={brand.VIDEO_W}x{brand.VIDEO_H}:fps={fps},"
        f"crop={brand.VIDEO_W}:{brand.VIDEO_H},{drawtext_chain}[v]"
    )

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(image_path),
        "-stream_loop", "-1", "-i", str(music_path),
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "1:a",
        "-t", str(total_duration),
        "-af", "volume=0.25",
        "-c:v", "libx264", "-preset", "medium", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        "-shortest",
        str(output_path),
    ]
    _run_ffmpeg(cmd)
    return output_path
