"""Branded carousel slide generator — 4-8 slides, illustration+text, Agentrix visual identity."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from instagentrix import brand


def _load_font(path: str, size: int, bold_axis: bool = False) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(path, size)
    if bold_axis:
        try:
            axes = font.get_variation_axes()
        except (OSError, NotImplementedError):
            # OSError: static (non-variable) font — no variation axes to query.
            # NotImplementedError: FreeType build too old to support variations.
            # Either way, the font falls back to its only weight.
            axes = []
        # Pillow's axis dicts expose "name" (e.g. b"Weight"), not an OpenType
        # axis tag — match on that to find the weight axis.
        weight_index = next(
            (i for i, axis in enumerate(axes) if (axis.get("name") or b"").strip().lower() == b"weight"),
            None,
        )
        if weight_index is not None:
            # set_variation_by_axes takes one value per axis, positionally —
            # keep every other axis at its default and only override weight.
            values = [axis["default"] for axis in axes]
            axis = axes[weight_index]
            values[weight_index] = max(axis["minimum"], min(700, axis["maximum"]))
            font.set_variation_by_axes(values)
    return font


def _wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
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


def _render_slide(text: str, index: int, total: int) -> Image.Image:
    img = Image.new("RGB", (brand.CAROUSEL_W, brand.CAROUSEL_H), brand.BG)
    draw = ImageDraw.Draw(img)
    pad = 90

    # Wordmark, top-left
    wordmark_font = _load_font(brand.FONT_DISPLAY_BOLD, 40, bold_axis=True)
    draw.text((pad, 70), brand.WORDMARK, font=wordmark_font, fill=brand.ACCENT)

    # Slide number badge, top-right
    badge_font = _load_font(brand.FONT_BODY, 32)
    badge_text = f"{index + 1}/{total}"
    badge_w = draw.textlength(badge_text, font=badge_font)
    draw.text((brand.CAROUSEL_W - pad - badge_w, 78), badge_text, font=badge_font, fill=brand.MUTED)

    # Body copy, vertically centered
    body_font = _load_font(brand.FONT_DISPLAY_BOLD, 64, bold_axis=True)
    max_text_width = brand.CAROUSEL_W - 2 * pad
    lines = _wrap_text(draw, text, body_font, max_text_width)
    line_height = 78
    block_height = len(lines) * line_height
    y = (brand.CAROUSEL_H - block_height) // 2
    for line in lines:
        draw.text((pad, y), line, font=body_font, fill=brand.TEXT)
        y += line_height

    # Page-dot indicator, bottom-center
    dot_r = 7
    gap = 24
    total_w = total * dot_r * 2 + (total - 1) * gap
    x = (brand.CAROUSEL_W - total_w) // 2
    dot_y = brand.CAROUSEL_H - 90
    for i in range(total):
        color = brand.ACCENT if i == index else brand.SURFACE_2
        draw.ellipse([x, dot_y - dot_r, x + dot_r * 2, dot_y + dot_r], fill=color)
        x += dot_r * 2 + gap

    return img


def generate_carousel(slides: list[str], output_dir: Path, slug: str) -> list[Path]:
    """Render each slide text to a branded 1080x1350 PNG. Returns the list of file paths,
    in slide order, named f"{slug}-{i+1}.png".
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    paths = []
    for i, text in enumerate(slides):
        img = _render_slide(text, i, len(slides))
        path = output_dir / f"{slug}-{i + 1}.png"
        img.save(path)
        paths.append(path)
    return paths
