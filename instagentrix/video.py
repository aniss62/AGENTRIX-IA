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

from instagentrix import brand, render_utils

PIXABAY_VIDEO_SEARCH = "https://pixabay.com/api/videos/"

_DRAWTEXT_FONT_SIZE = 56
_DRAWTEXT_SIDE_MARGIN = 80


def _wrap_for_drawtext(text: str, max_width: int) -> list[str]:
    """Wrap `text` into lines that fit `max_width` at `_DRAWTEXT_FONT_SIZE`, using the same
    greedy word-wrap as carousel._wrap_text. Without this, a full sentence passed straight to
    a single drawtext filter overflows off both edges of the 1080px canvas instead of wrapping.
    """
    font = render_utils.load_font(brand.FONT_DISPLAY_BOLD, _DRAWTEXT_FONT_SIZE, bold_axis=True)
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


def _render_text_overlay(text: str, output_path: Path) -> Path:
    """Render one full-canvas (VIDEO_W x VIDEO_H) transparent PNG with `text` word-wrapped and
    centered, each sub-line on its own translucent black bar -- the PIL equivalent of
    ffmpeg drawtext's `box=1:boxcolor=black@0.55`. Composited with the `overlay` filter instead
    of using drawtext, because drawtext requires an ffmpeg build with libfreetype, which neither
    this machine's Homebrew ffmpeg nor the cloud routine's PyPI-installed static ffmpeg has.
    `overlay` needs no font support in ffmpeg at all -- the text is already rasterized here.
    """
    font = render_utils.load_font(brand.FONT_DISPLAY_BOLD, _DRAWTEXT_FONT_SIZE, bold_axis=True)
    img = Image.new("RGBA", (brand.VIDEO_W, brand.VIDEO_H), (0, 0, 0, 0))
    render_utils.draw_wordmark(img)
    draw = ImageDraw.Draw(img)
    max_width = brand.VIDEO_W - 2 * _DRAWTEXT_SIDE_MARGIN
    sublines = _wrap_for_drawtext(text, max_width)
    box_pad_x, box_pad_y = 24, 10
    # Size each line's box on the font's real ascent+descent (not just _DRAWTEXT_FONT_SIZE) and
    # space lines a few px past that box height -- otherwise consecutive boxes overlap and each
    # line's black bar gets painted over the descenders (g/j/p/q/y) of the line above it (2026-09-30
    # incident: "Un client vous ecrit..." shipped with every descender clipped by the next line).
    ascent, descent = font.getmetrics()
    glyph_height = ascent + descent
    line_height = glyph_height + 2 * box_pad_y + 6
    block_height = len(sublines) * line_height
    top = (brand.VIDEO_H - block_height) // 2
    for j, subline in enumerate(sublines):
        line_w = draw.textlength(subline, font=font)
        y = top + j * line_height
        box = (
            (brand.VIDEO_W - line_w) / 2 - box_pad_x,
            y - box_pad_y,
            (brand.VIDEO_W + line_w) / 2 + box_pad_x,
            y + glyph_height + box_pad_y,
        )
        draw.rectangle(box, fill=(0, 0, 0, 140))
        draw.text(((brand.VIDEO_W - line_w) / 2, y), subline, font=font, fill=(255, 255, 255, 255))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path)
    return output_path


def _overlay_chain(
    text_lines: list[str], seconds_per_line: float, base_input_count: int, work_dir: Path
) -> tuple[list[str], str, str]:
    """Render one transparent overlay PNG per text line and return
    (extra ffmpeg -i args, filter chain string, final video label) to append after the base
    video filter (which must end in `[v]`)."""
    extra_inputs = []
    overlay_filters = []
    in_label = "[v]"
    for i, line in enumerate(text_lines):
        png_path = work_dir / f"_overlay_{i}.png"
        _render_text_overlay(line, png_path)
        extra_inputs += ["-loop", "1", "-i", str(png_path)]
        start = i * seconds_per_line
        end = start + seconds_per_line
        out_label = f"[vt{i}]"
        overlay_input_idx = base_input_count + i
        overlay_filters.append(
            f"{in_label}[{overlay_input_idx}:v]overlay=0:0:enable='between(t,{start},{end})'{out_label}"
        )
        in_label = out_label
    return extra_inputs, ";".join(overlay_filters), in_label


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

    base_filter = (
        f"[0:v]scale={brand.VIDEO_W}:{brand.VIDEO_H}:force_original_aspect_ratio=increase,"
        f"crop={brand.VIDEO_W}:{brand.VIDEO_H}[v]"
    )
    overlay_inputs, overlay_filter, final_label = _overlay_chain(
        text_lines, seconds_per_line, base_input_count=2, work_dir=output_path.parent
    )
    filter_complex = f"{base_filter};{overlay_filter}"

    cmd = [
        "ffmpeg", "-y",
        "-stream_loop", "-1", "-i", str(broll_path),
        "-stream_loop", "-1", "-i", str(music_path),
        *overlay_inputs,
        "-filter_complex", filter_complex,
        "-map", final_label, "-map", "1:a",
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

    # Upscale before zoompan to avoid visible pixelation as the zoom progresses, then zoompan
    # holds/animates the still across every output frame, then crop/scale locks the final frame.
    # x/y must be pinned to the (recomputed, per-frame) center -- zoompan's default x=0:y=0
    # anchors the crop to the top-left corner, so as zoom changes the visible window drifts
    # toward that corner instead of zooming in place, reading as an unwanted stretch/pan rather
    # than a clean Ken Burns move (2026-09-30 incident, proposition 1 "agent-reponse-client...").
    # z starts at 1.4 and eases down to 1.0 (zoom OUT, keyed on the absolute output-frame index
    # `on` rather than the `zoom` recurrence, since that recurrence's implicit start value is
    # always 1.0 and can't be made to start high) -- background elements pull back from the
    # edges toward the center as the frame widens, i.e. motion reads as inward, not the
    # outward/expanding drift a zoom-in gives when elements grow past the frame edges (same
    # 2026-09-30 incident, second round of feedback).
    base_filter = (
        f"[0:v]scale=8000:-2,"
        f"zoompan=z='max(1.4-0.0015*on,1.0)':d={total_frames}:"
        f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
        f"s={brand.VIDEO_W}x{brand.VIDEO_H}:fps={fps},"
        f"crop={brand.VIDEO_W}:{brand.VIDEO_H}[v]"
    )
    overlay_inputs, overlay_filter, final_label = _overlay_chain(
        text_lines, seconds_per_line, base_input_count=2, work_dir=output_path.parent
    )
    filter_complex = f"{base_filter};{overlay_filter}"

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(image_path),
        "-stream_loop", "-1", "-i", str(music_path),
        *overlay_inputs,
        "-filter_complex", filter_complex,
        "-map", final_label, "-map", "1:a",
        "-t", str(total_duration),
        "-af", "volume=0.25",
        "-c:v", "libx264", "-preset", "medium", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        "-shortest",
        str(output_path),
    ]
    _run_ffmpeg(cmd)
    return output_path
