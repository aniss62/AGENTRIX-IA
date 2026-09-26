"""Faceless explainer video assembly: Pixabay b-roll + animated on-screen text + music, via
ffmpeg. No voice-over (text + music only, per docs/superpowers/specs/2026-09-20-instagentrix-design.md).
Network dependency: Pixabay API only. Must run from a local session, never from the cloud routine.
"""
import subprocess
import urllib.request
import urllib.parse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from instagentrix import brand

PIXABAY_VIDEO_SEARCH = "https://pixabay.com/api/videos/"

_DRAWTEXT_FONT_SIZE = 56
_DRAWTEXT_LINE_HEIGHT = 68
_DRAWTEXT_SIDE_MARGIN = 80


def _wrap_for_drawtext(text: str, max_width: int) -> list[str]:
    """Wrap `text` into lines that fit `max_width` at `_DRAWTEXT_FONT_SIZE`, using the same
    greedy word-wrap as carousel._wrap_text. Without this, a full sentence passed straight to
    a single drawtext filter overflows off both edges of the 1080px canvas instead of wrapping.
    """
    font = ImageFont.truetype(brand.FONT_DISPLAY_BOLD, _DRAWTEXT_FONT_SIZE)
    draw = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=font) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


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
    """Build the ffmpeg drawtext filter chain for a sequence of timed, centered caption lines.

    Each entry in `text_lines` is word-wrapped (see `_wrap_for_drawtext`) into as many sub-lines
    as needed and rendered as one drawtext filter per sub-line, stacked around the vertical
    center — otherwise a full sentence overflows off both edges of the 1080px canvas.
    """
    escaped_font = brand.FONT_DISPLAY_BOLD.replace("'", "'\\''")
    max_width = brand.VIDEO_W - 2 * _DRAWTEXT_SIDE_MARGIN
    drawtext_filters = []
    for i, line in enumerate(text_lines):
        start = i * seconds_per_line
        end = start + seconds_per_line
        sublines = _wrap_for_drawtext(line, max_width)
        block_height = len(sublines) * _DRAWTEXT_LINE_HEIGHT
        for j, subline in enumerate(sublines):
            safe_text = subline.replace("'", "'\\''")
            y_expr = f"(h/2)-{block_height // 2}+{j * _DRAWTEXT_LINE_HEIGHT}"
            drawtext_filters.append(
                "drawtext="
                f"fontfile='{escaped_font}':text='{safe_text}':"
                f"fontcolor=white:fontsize={_DRAWTEXT_FONT_SIZE}:"
                f"x=(w-text_w)/2:y={y_expr}:"
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


def build_video_from_slides(
    slide_paths: list[Path],
    music_path: Path,
    output_path: Path,
    seconds_per_slide: float = 3.0,
    fps: int = 25,
) -> Path:
    """Turn already-rendered carousel slide images (from carousel.generate_carousel) into a
    vertical Reels-format slideshow video: each slide is letterboxed onto a 1080x1920 canvas
    (brand background fills the padding top/bottom, the slide's own text/wordmark/progress dots
    are untouched -- no drawtext involved) shown in sequence, with music mixed in underneath.

    Instagram's Graph API has no audio parameter for photo/carousel posts (confirmed against the
    Zapier "Publish Photo(s)" action schema), and adding music to an already-published carousel
    from the app is unreliable/not generally available. A Reel's video file carries its own
    embedded audio instead, so publishing carousel content this way via Zapier's video action is
    the only fully automated path that reliably ships with music -- no manual app step needed.
    """
    if not slide_paths:
        raise ValueError("slide_paths must not be empty")

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    total_duration = len(slide_paths) * seconds_per_slide
    bg_color = "0x" + brand.BG.lstrip("#")

    inputs = []
    for p in slide_paths:
        inputs += ["-loop", "1", "-t", str(seconds_per_slide), "-i", str(p)]
    music_input_index = len(slide_paths)
    inputs += ["-stream_loop", "-1", "-i", str(music_path)]

    per_slide_filters = [
        f"[{i}:v]scale={brand.CAROUSEL_W}:{brand.CAROUSEL_H},"
        f"pad={brand.VIDEO_W}:{brand.VIDEO_H}:(ow-iw)/2:(oh-ih)/2:color={bg_color},"
        f"fps={fps},setsar=1[v{i}]"
        for i in range(len(slide_paths))
    ]
    concat_inputs = "".join(f"[v{i}]" for i in range(len(slide_paths)))
    filter_complex = ";".join(per_slide_filters) + f";{concat_inputs}concat=n={len(slide_paths)}:v=1:a=0[v]"

    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", f"{music_input_index}:a",
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
