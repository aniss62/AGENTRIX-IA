"""Branded carousel slide generator — 4-8 slides, illustration+text, Agentrix visual identity.

Visual language lifted straight from the site's own design system (agentrix/styles.css): a
hairline grid fading toward the bottom, two soft radial accent glows, and accent-soft pill
badges — not just text on a flat background.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

from instagentrix import brand


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))


ACCENT_RGB = _hex_to_rgb(brand.ACCENT)
TEXT_RGB = _hex_to_rgb(brand.TEXT)


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


def _build_background() -> Image.Image:
    """Dark base + hairline grid (fading toward the bottom) + two soft radial accent glows —
    the same recipe as the site's own hero background (agentrix/styles.css .hero__grid /
    .hero__aura), rendered as a flat raster instead of CSS layers.
    """
    w, h = brand.CAROUSEL_W, brand.CAROUSEL_H
    img = Image.new("RGB", (w, h), brand.BG)

    # Glow layer: a lime blob top-right, a cooler dim blob bottom-left, both heavily blurred.
    # Kept deliberately faint (this is a background wash, not a spotlight) — matches the site's
    # own --accent-soft (12% opacity) rather than a saturated corner wash.
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([w * 0.55, -h * 0.25, w * 1.25, h * 0.35], fill=(*ACCENT_RGB, 26))
    glow_draw.ellipse([-w * 0.35, h * 0.60, w * 0.45, h * 1.20], fill=(70, 90, 140, 22))
    glow = glow.filter(ImageFilter.GaussianBlur(130))
    img.paste(glow, (0, 0), glow)

    # Hairline grid, masked so it fades out by the lower third (mirrors the site's
    # mask-image: linear-gradient(180deg, black 0%, black 55%, transparent 100%)).
    grid = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid)
    step = 72
    line_rgba = (255, 255, 255, 18)
    for x in range(0, w, step):
        grid_draw.line([(x, 0), (x, h)], fill=line_rgba, width=1)
    for y in range(0, h, step):
        grid_draw.line([(0, y), (w, y)], fill=line_rgba, width=1)

    mask = Image.new("L", (1, h), color=0)
    fade_start = int(h * 0.55)
    for y in range(h):
        if y < fade_start:
            mask.putpixel((0, y), 255)
        else:
            t = (y - fade_start) / max(1, (h - fade_start))
            mask.putpixel((0, y), int(255 * (1 - t)))
    mask = mask.resize((w, h))
    grid.putalpha(Image.composite(grid.getchannel("A"), Image.new("L", (w, h), 0), mask))
    img.paste(grid, (0, 0), grid)

    return img


def _rounded_pill(draw: ImageDraw.ImageDraw, xy: tuple[int, int, int, int], fill: tuple, radius: int) -> None:
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def _render_slide(text: str, index: int, total: int) -> Image.Image:
    pad = 90
    img = _build_background().convert("RGBA")
    draw = ImageDraw.Draw(img)

    # Wordmark, top-left, with a soft lime glow behind it for the neon-accent feel.
    wordmark_font = _load_font(brand.FONT_DISPLAY_BOLD, 38, bold_axis=True)
    glow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(glow_layer).text((pad, 68), brand.WORDMARK, font=wordmark_font, fill=(*ACCENT_RGB, 160))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(10))
    img.alpha_composite(glow_layer)
    draw.text((pad, 68), brand.WORDMARK, font=wordmark_font, fill=brand.ACCENT)

    # Slide-counter pill, top-right — accent-soft fill + accent text, same chip language as the
    # site's icon badges (.chatsec__hint-ic { background: var(--accent-soft); color: var(--accent) }).
    # Drawn on its own transparent layer and alpha-composited: drawing a translucent fill directly
    # on the main RGBA canvas does NOT blend (Pillow just writes the low-alpha pixels verbatim),
    # so it would come out fully opaque once flattened to RGB — this composite step is required,
    # not decorative.
    badge_font = _load_font(brand.FONT_BODY, 28)
    badge_text = f"{index + 1:02d} / {total:02d}"
    chip_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    chip_draw = ImageDraw.Draw(chip_layer)
    badge_w = chip_draw.textlength(badge_text, font=badge_font)
    chip_pad_x, chip_h = 20, 48
    chip_right = brand.CAROUSEL_W - pad
    chip_left = chip_right - badge_w - chip_pad_x * 2
    chip_top = 60
    _rounded_pill(chip_draw, (chip_left, chip_top, chip_right, chip_top + chip_h),
                  fill=(*ACCENT_RGB, 28), radius=chip_h // 2)
    chip_draw.text((chip_left + chip_pad_x, chip_top + chip_h // 2), badge_text,
                    font=badge_font, fill=(*ACCENT_RGB, 255), anchor="lm")
    img.alpha_composite(chip_layer)

    # A large, very faint numeral behind the headline for editorial depth — same idea as a
    # magazine pull-number, kept subtle enough to never compete with the text on top of it.
    number_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    number_font = _load_font(brand.FONT_DISPLAY_BOLD, 420, bold_axis=True)
    ImageDraw.Draw(number_layer).text(
        (brand.CAROUSEL_W - pad, int(brand.CAROUSEL_H * 0.62)),
        f"{index + 1:02d}", font=number_font, fill=(*ACCENT_RGB, 16), anchor="rm",
    )
    img.alpha_composite(number_layer)

    # Headline, left-aligned, vertically anchored a bit above center.
    body_font = _load_font(brand.FONT_DISPLAY_BOLD, 60, bold_axis=True)
    max_text_width = brand.CAROUSEL_W - 2 * pad
    lines = _wrap_text(draw, text, body_font, max_text_width)
    line_height = 74
    content_top = int(brand.CAROUSEL_H * 0.34)
    y = content_top
    for line in lines:
        draw.text((pad, y), line, font=body_font, fill=brand.TEXT)
        y += line_height

    # Hairline separator above the page-dot indicator — same composite-layer requirement as the
    # counter chip above (a directly-drawn translucent line would flatten to solid white).
    sep_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sep_y = brand.CAROUSEL_H - 130
    ImageDraw.Draw(sep_layer).line([(pad, sep_y), (brand.CAROUSEL_W - pad, sep_y)],
                                    fill=(255, 255, 255, 22), width=1)
    img.alpha_composite(sep_layer)

    # Page-dot indicator, bottom-center — active dot gets a soft glow, like the site's
    # .diode--on treatment (box-shadow: 0 0 4px accent-glow, 0 0 10px accent-glow).
    dot_r = 7
    gap = 24
    total_w = total * dot_r * 2 + (total - 1) * gap
    x = (brand.CAROUSEL_W - total_w) // 2
    dot_y = brand.CAROUSEL_H - 88
    dot_glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    dot_glow_draw = ImageDraw.Draw(dot_glow)
    for i in range(total):
        if i == index:
            dot_glow_draw.ellipse(
                [x - 6, dot_y - dot_r - 6, x + dot_r * 2 + 6, dot_y + dot_r + 6],
                fill=(*ACCENT_RGB, 200),
            )
        x += dot_r * 2 + gap
    dot_glow = dot_glow.filter(ImageFilter.GaussianBlur(6))
    img.alpha_composite(dot_glow)

    x = (brand.CAROUSEL_W - total_w) // 2
    for i in range(total):
        color = brand.ACCENT if i == index else brand.SURFACE_2
        draw.ellipse([x, dot_y - dot_r, x + dot_r * 2, dot_y + dot_r], fill=color)
        x += dot_r * 2 + gap

    return img.convert("RGB")


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
