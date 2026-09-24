"""Branded carousel slide generator — 4-8 slides, centered text, Agentrix visual identity.

Visual language lifted from the site's own design system (agentrix/styles.css) and iterated
live against real Instagram/Facebook posts: two background treatments (PCB-style circuit traces,
or a connected-particle field), both with soft radial accent glows and HUD-style corner
brackets. One of the two is picked at random per carousel (not per slide, so a single post's
slides stay visually consistent) — drawn in-house so there's no third-party asset to license.
"""
import math
import random
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


_TRACE_RNG_SEED = 7  # fixed seed: the circuit pattern itself is deterministic/reproducible


def _base_glow(w: int, h: int, alpha1: int = 42, alpha2: int = 34) -> Image.Image:
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse([w * 0.55, -h * 0.25, w * 1.25, h * 0.35], fill=(*ACCENT_RGB, alpha1))
    d.ellipse([-w * 0.35, h * 0.60, w * 0.45, h * 1.20], fill=(70, 110, 200, alpha2))
    return glow.filter(ImageFilter.GaussianBlur(130))


def _draw_hud_corners(w: int, h: int) -> Image.Image:
    """Small L-shaped corner brackets, like a viewfinder/HUD frame — a common sci-fi/interface
    shorthand for "high-tech" that reads instantly even at a glance."""
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    inset, arm, lw, color = 44, 56, 4, (*ACCENT_RGB, 130)
    corners = [
        ((inset, inset), (1, 1)),
        ((w - inset, inset), (-1, 1)),
        ((inset, h - inset), (1, -1)),
        ((w - inset, h - inset), (-1, -1)),
    ]
    for (cx, cy), (dx, dy) in corners:
        draw.line([(cx, cy), (cx + arm * dx, cy)], fill=color, width=lw)
        draw.line([(cx, cy), (cx, cy + arm * dy)], fill=color, width=lw)
    return layer


def _build_background_circuit(w: int, h: int) -> Image.Image:
    """Background A: PCB-style traces (right-angle paths with node dots, a few brighter "active"
    lines with a small glow at their endpoint) + HUD corner brackets + layered accent glows."""
    img = Image.new("RGB", (w, h), brand.BG)
    glow = _base_glow(w, h)
    img.paste(glow, (0, 0), glow)

    rng = random.Random(_TRACE_RNG_SEED)
    traces = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(traces)
    for i in range(13):
        hot = i % 4 == 0  # every 4th trace is a brighter "active" line
        alpha = 70 if hot else 34
        edge = rng.choice(["left", "right", "top"])
        if edge == "left":
            x, y = 0, rng.randint(0, h)
        elif edge == "right":
            x, y = w, rng.randint(0, h)
        else:
            x, y = rng.randint(0, w), 0
        points = [(x, y)]
        for _ in range(rng.randint(2, 3)):
            if rng.random() < 0.5:
                x = max(0, min(w, x + rng.choice([-1, 1]) * rng.randint(80, 220)))
            else:
                y = max(0, min(h, y + rng.choice([-1, 1]) * rng.randint(80, 220)))
            points.append((x, y))
        draw.line(points, fill=(*ACCENT_RGB, alpha), width=3 if hot else 2)
        for px, py in points[1:]:
            r = 5 if hot else 3
            draw.ellipse([px - r, py - r, px + r, py + r], fill=(*ACCENT_RGB, alpha + 40))
        if hot:
            # A small glow at the trace's endpoint, like an active data point / LED.
            glow_r = 22
            end_x, end_y = points[-1]
            node_glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
            ImageDraw.Draw(node_glow).ellipse(
                [end_x - glow_r, end_y - glow_r, end_x + glow_r, end_y + glow_r], fill=(*ACCENT_RGB, 130)
            )
            node_glow = node_glow.filter(ImageFilter.GaussianBlur(14))
            traces.alpha_composite(node_glow)
    img.paste(traces, (0, 0), traces)

    corners = _draw_hud_corners(w, h)
    img.paste(corners, (0, 0), corners)
    return img


def _build_background_particles(w: int, h: int) -> Image.Image:
    """Background E: a field of connected glowing dots (a few nodes joined by faint lines when
    close together), like a live data/network visualization — plus HUD corner brackets and the
    same layered accent glows as the circuit background, for a consistent family look."""
    img = Image.new("RGB", (w, h), brand.BG)
    glow = _base_glow(w, h, alpha1=30, alpha2=24)
    img.paste(glow, (0, 0), glow)

    rng = random.Random(_TRACE_RNG_SEED + 1)
    field = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(field)
    # Keep clear of the central band where the (centered) headline text renders — a bright node
    # sitting right behind a glyph reads as a mistake, not a texture.
    text_band = (h * 0.30, h * 0.78)
    points = []
    while len(points) < 28:
        x, y = rng.randint(40, w - 40), rng.randint(40, h - 40)
        if text_band[0] <= y <= text_band[1]:
            continue
        points.append((x, y))
    for i, (x, y) in enumerate(points):
        for x2, y2 in points[i + 1:]:
            if math.hypot(x - x2, y - y2) < 160:
                draw.line([(x, y), (x2, y2)], fill=(*ACCENT_RGB, 22), width=1)
    for i, (x, y) in enumerate(points):
        bright = i % 6 == 0
        r = 5 if bright else rng.choice([2, 2, 3])
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(*ACCENT_RGB, 200 if bright else 90))
    img.paste(field, (0, 0), field)

    corners = _draw_hud_corners(w, h)
    img.paste(corners, (0, 0), corners)
    return img


_BACKGROUNDS = [_build_background_circuit, _build_background_particles]


def _rounded_pill(draw: ImageDraw.ImageDraw, xy: tuple[int, int, int, int], fill: tuple, radius: int) -> None:
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def _render_slide(background_fn: callable, text: str, index: int, total: int) -> Image.Image:
    pad = 90
    w, h = brand.CAROUSEL_W, brand.CAROUSEL_H
    img = background_fn(w, h).convert("RGBA")
    draw = ImageDraw.Draw(img)

    # Wordmark, top-left, with a soft lime glow behind it for the neon-accent feel.
    # "-IA" renders in plain white, breaking it out from the "Agentrix" accent color.
    wordmark_font = _load_font(brand.FONT_DISPLAY_BOLD, 38, bold_axis=True)
    wordmark_name, _, wordmark_suffix = brand.WORDMARK.partition("-")
    wordmark_suffix = f"-{wordmark_suffix}"
    glow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(glow_layer).text((pad, 68), brand.WORDMARK, font=wordmark_font, fill=(*ACCENT_RGB, 160))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(10))
    img.alpha_composite(glow_layer)
    draw.text((pad, 68), wordmark_name, font=wordmark_font, fill=brand.ACCENT)
    name_w = draw.textlength(wordmark_name, font=wordmark_font)
    draw.text((pad + name_w, 68), wordmark_suffix, font=wordmark_font, fill=brand.TEXT)

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
    chip_right = w - pad
    chip_left = chip_right - badge_w - chip_pad_x * 2
    chip_top = 60
    _rounded_pill(chip_draw, (chip_left, chip_top, chip_right, chip_top + chip_h),
                  fill=(*ACCENT_RGB, 28), radius=chip_h // 2)
    chip_draw.text((chip_left + chip_pad_x, chip_top + chip_h // 2), badge_text,
                    font=badge_font, fill=(*ACCENT_RGB, 255), anchor="lm")
    img.alpha_composite(chip_layer)

    # Headline, centered both horizontally and as a block vertically.
    body_font = _load_font(brand.FONT_DISPLAY_BOLD, 62, bold_axis=True)
    max_text_width = w - 2 * pad
    lines = _wrap_text(draw, text, body_font, max_text_width)
    line_height = 76
    block_height = len(lines) * line_height
    y = (h - block_height) // 2
    for line in lines:
        line_w = draw.textlength(line, font=body_font)
        draw.text(((w - line_w) / 2, y), line, font=body_font, fill=brand.TEXT)
        y += line_height

    # Hairline separator above the page-dot indicator — same composite-layer requirement as the
    # counter chip above (a directly-drawn translucent line would flatten to solid white).
    sep_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sep_y = h - 130
    ImageDraw.Draw(sep_layer).line([(pad, sep_y), (w - pad, sep_y)], fill=(255, 255, 255, 22), width=1)
    img.alpha_composite(sep_layer)

    # Page-dot indicator, bottom-center — active dot gets a soft glow, like the site's
    # .diode--on treatment (box-shadow: 0 0 4px accent-glow, 0 0 10px accent-glow).
    dot_r = 7
    gap = 24
    total_w = total * dot_r * 2 + (total - 1) * gap
    x = (w - total_w) // 2
    dot_y = h - 88
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

    x = (w - total_w) // 2
    for i in range(total):
        color = brand.ACCENT if i == index else brand.SURFACE_2
        draw.ellipse([x, dot_y - dot_r, x + dot_r * 2, dot_y + dot_r], fill=color)
        x += dot_r * 2 + gap

    return img.convert("RGB")


def generate_carousel(slides: list[str], output_dir: Path, slug: str) -> list[Path]:
    """Render each slide text to a branded 1080x1350 PNG. Returns the list of file paths,
    in slide order, named f"{slug}-{i+1}.png". One of the two background styles (circuit traces
    or particle field) is picked at random for the whole carousel, so all its slides match.
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    background_fn = random.choice(_BACKGROUNDS)
    paths = []
    for i, text in enumerate(slides):
        img = _render_slide(background_fn, text, i, len(slides))
        path = output_dir / f"{slug}-{i + 1}.png"
        img.save(path)
        paths.append(path)
    return paths
