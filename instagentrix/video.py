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
    return hits[0]["videos"]["medium"]["url"]


def download_file(url: str, dest: Path) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(url, dest)
    return dest


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
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    total_duration = len(text_lines) * seconds_per_line

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
    drawtext_chain = ",".join(drawtext_filters)

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
    subprocess.run(cmd, check=True, capture_output=True)
    return output_path
