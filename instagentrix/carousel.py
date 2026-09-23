"""Branded carousel slide generator — 4-8 slides, illustration+text, Agentrix visual identity.

Visual language lifted straight from the site's own design system (agentrix/styles.css): a
hairline grid fading toward the bottom, two soft radial accent glows, and accent-soft pill
badges. Each slide also gets a themed line-art illustration on its right half, picked by keyword
from the slide text — drawn in-house (not fetched third-party art) so licensing is a non-issue
and the style always matches the brand exactly.
"""
import math
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


# ---------------------------------------------------------------------------
# Themed illustrations — simple line-art, drawn in-house so there's no third-
# party asset licensing to track and the style always matches the brand.
# Each function draws inside a (cx, cy, size) box: cx/cy is the box center,
# size is its width/height. `color` is an RGB tuple, `lw` the stroke width.
# ---------------------------------------------------------------------------

def _icon_robot(draw: ImageDraw.ImageDraw, cx: float, cy: float, size: float, color: tuple, lw: int) -> None:
    """Friendly agent/robot head + body — the generic "AI agent" illustration."""
    head_w, head_h = size * 0.62, size * 0.46
    head_top = cy - size * 0.42
    head_box = [cx - head_w / 2, head_top, cx + head_w / 2, head_top + head_h]
    draw.rounded_rectangle(head_box, radius=size * 0.1, outline=color, width=lw)
    draw.line([(cx, head_top), (cx, head_top - size * 0.14)], fill=color, width=lw)
    ant_r = size * 0.035
    draw.ellipse([cx - ant_r, head_top - size * 0.14 - ant_r, cx + ant_r, head_top - size * 0.14 + ant_r],
                 outline=color, width=lw)
    eye_y = head_top + head_h * 0.45
    eye_dx = head_w * 0.22
    eye_r = size * 0.045
    draw.ellipse([cx - eye_dx - eye_r, eye_y - eye_r, cx - eye_dx + eye_r, eye_y + eye_r], fill=color)
    draw.ellipse([cx + eye_dx - eye_r, eye_y - eye_r, cx + eye_dx + eye_r, eye_y + eye_r], fill=color)
    body_top = head_box[3] + size * 0.08
    body_box = [cx - size * 0.4, body_top, cx + size * 0.4, body_top + size * 0.4]
    draw.rounded_rectangle(body_box, radius=size * 0.08, outline=color, width=lw)
    draw.line([(cx - size * 0.18, body_top + size * 0.16), (cx + size * 0.18, body_top + size * 0.16)],
              fill=color, width=lw)
    draw.line([(cx - size * 0.18, body_top + size * 0.28), (cx + size * 0.02, body_top + size * 0.28)],
              fill=color, width=lw)


def _icon_chat(draw: ImageDraw.ImageDraw, cx: float, cy: float, size: float, color: tuple, lw: int) -> None:
    """Chat bubble with a typing indicator — for Claude / prompt content."""
    box = [cx - size * 0.42, cy - size * 0.32, cx + size * 0.42, cy + size * 0.20]
    draw.rounded_rectangle(box, radius=size * 0.14, outline=color, width=lw)
    tail = [(cx - size * 0.14, box[3]), (cx - size * 0.14, box[3] + size * 0.16), (cx + size * 0.02, box[3])]
    draw.polygon(tail, outline=color, width=lw)
    dot_r = size * 0.045
    for i, dx in enumerate((-0.16, 0.0, 0.16)):
        dot_x = cx + size * dx
        draw.ellipse([dot_x - dot_r, cy - size * 0.06 - dot_r, dot_x + dot_r, cy - size * 0.06 + dot_r], fill=color)


def _icon_gear(draw: ImageDraw.ImageDraw, cx: float, cy: float, size: float, color: tuple, lw: int) -> None:
    """Gear with a circular arrow — for automation / repetitive-task content."""
    r_outer, r_inner, teeth = size * 0.26, size * 0.17, 8
    tooth_w, tooth_len = size * 0.10, size * 0.09
    for i in range(teeth):
        angle = (2 * math.pi / teeth) * i
        mid_x = cx + (r_outer + tooth_len / 2) * math.cos(angle)
        mid_y = cy + (r_outer + tooth_len / 2) * math.sin(angle)
        # A small rectangle, rotated to point outward from the gear body — reads as a
        # chunky gear tooth rather than a thin radiating line (which looked like a compass).
        perp = angle + math.pi / 2
        dx, dy = math.cos(angle) * tooth_len / 2, math.sin(angle) * tooth_len / 2
        px, py = math.cos(perp) * tooth_w / 2, math.sin(perp) * tooth_w / 2
        draw.polygon([
            (mid_x - dx - px, mid_y - dy - py), (mid_x - dx + px, mid_y - dy + py),
            (mid_x + dx + px, mid_y + dy + py), (mid_x + dx - px, mid_y + dy - py),
        ], fill=color)
    # A thick-stroked ring (not a filled circle) — avoids having to "punch" a center hole
    # through an arbitrary background color, which wouldn't match the panel/glow already
    # composited underneath at this point.
    ring_width = r_outer - r_inner
    ring_r = (r_outer + r_inner) / 2
    draw.ellipse([cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r], outline=color, width=int(ring_width))
    # Circular arrow orbiting the gear, suggesting a repeating automated cycle.
    orbit_r = size * 0.46
    bbox = [cx - orbit_r, cy - orbit_r, cx + orbit_r, cy + orbit_r]
    draw.arc(bbox, start=-40, end=200, fill=color, width=lw)
    tip_angle = math.radians(200)
    tip_x, tip_y = cx + orbit_r * math.cos(tip_angle), cy + orbit_r * math.sin(tip_angle)
    draw.polygon([
        (tip_x, tip_y),
        (tip_x - size * 0.07, tip_y - size * 0.02),
        (tip_x - size * 0.01, tip_y + size * 0.07),
    ], fill=color)


def _icon_verdict(draw: ImageDraw.ImageDraw, cx: float, cy: float, size: float, color: tuple, lw: int) -> None:
    """Circle with a check/cross — for myth-busting "vrai ou faux" content."""
    r = size * 0.36
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=lw)
    draw.line([(cx - r * 0.4, cy - r * 0.4), (cx + r * 0.4, cy + r * 0.4)], fill=color, width=lw)
    draw.line([(cx + r * 0.4, cy - r * 0.4), (cx - r * 0.4, cy + r * 0.4)], fill=color, width=lw)


def _icon_browser(draw: ImageDraw.ImageDraw, cx: float, cy: float, size: float, color: tuple, lw: int) -> None:
    """Browser window with content lines — for website content."""
    box = [cx - size * 0.42, cy - size * 0.32, cx + size * 0.42, cy + size * 0.32]
    draw.rounded_rectangle(box, radius=size * 0.06, outline=color, width=lw)
    bar_y = box[1] + size * 0.14
    draw.line([box[0], bar_y, box[2], bar_y], fill=color, width=lw)
    for i, dx in enumerate((0.10, 0.17, 0.24)):
        dot_x = box[0] + size * dx
        dot_r = size * 0.02
        draw.ellipse([dot_x - dot_r, box[1] + size * 0.07 - dot_r, dot_x + dot_r, box[1] + size * 0.07 + dot_r],
                     fill=color)
    for i, dy in enumerate((0.24, 0.34, 0.44)):
        line_w = size * (0.6 - i * 0.12)
        draw.line([(box[0] + size * 0.08, box[1] + size * dy), (box[0] + size * 0.08 + line_w, box[1] + size * dy)],
                   fill=color, width=int(lw * 0.8))


def _icon_clock(draw: ImageDraw.ImageDraw, cx: float, cy: float, size: float, color: tuple, lw: int) -> None:
    """Clock face with hands — for time-saving content."""
    r = size * 0.36
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=lw)
    draw.line([(cx, cy), (cx, cy - r * 0.55)], fill=color, width=lw)
    draw.line([(cx, cy), (cx + r * 0.42, cy + r * 0.15)], fill=color, width=lw)
    for angle_deg in range(0, 360, 30):
        angle = math.radians(angle_deg)
        x1, y1 = cx + (r - size * 0.03) * math.cos(angle), cy + (r - size * 0.03) * math.sin(angle)
        x2, y2 = cx + r * math.cos(angle), cy + r * math.sin(angle)
        draw.line([(x1, y1), (x2, y2)], fill=color, width=max(1, lw // 2))


def _icon_leads(draw: ImageDraw.ImageDraw, cx: float, cy: float, size: float, color: tuple, lw: int) -> None:
    """Magnifying glass over a few nodes — for scraping / lead-generation content."""
    for dx, dy in ((-0.22, -0.18), (0.20, -0.10), (-0.05, 0.24), (0.24, 0.20)):
        nx, ny = cx + size * dx, cy + size * dy
        draw.ellipse([nx - size * 0.03, ny - size * 0.03, nx + size * 0.03, ny + size * 0.03], fill=color)
    lens_cx, lens_cy, lens_r = cx - size * 0.05, cy - size * 0.05, size * 0.22
    draw.ellipse([lens_cx - lens_r, lens_cy - lens_r, lens_cx + lens_r, lens_cy + lens_r], outline=color, width=lw)
    handle_start = (lens_cx + lens_r * 0.75, lens_cy + lens_r * 0.75)
    handle_end = (lens_cx + lens_r * 1.5, lens_cy + lens_r * 1.5)
    draw.line([handle_start, handle_end], fill=color, width=int(lw * 1.4))


_ILLUSTRATIONS: dict[str, callable] = {
    "claude": _icon_chat,
    "prompt": _icon_chat,
    "chat": _icon_chat,
    "mythe": _icon_verdict,
    "vrai": _icon_verdict,
    "faux": _icon_verdict,
    "site web": _icon_browser,
    "site": _icon_browser,
    "leads": _icon_leads,
    "scraping": _icon_leads,
    "prospects": _icon_leads,
    "temps": _icon_clock,
    "heure": _icon_clock,
    "gagner": _icon_clock,
    "automat": _icon_gear,
    "tache": _icon_gear,
    "workflow": _icon_gear,
    "repetitiv": _icon_gear,
}


def _pick_illustration(text: str) -> callable:
    lowered = text.lower()
    for keyword, fn in _ILLUSTRATIONS.items():
        if keyword in lowered:
            return fn
    return _icon_robot


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

    # Illustration panel — right half of the slide, below the header row. A softly-tinted
    # rounded card grounds the icon (same accent-soft chip language as the counter above),
    # topped with a blurred glow behind the icon itself for a bit of depth.
    illus_top = int(brand.CAROUSEL_H * 0.30)
    illus_bottom = brand.CAROUSEL_H - 170
    illus_left = int(brand.CAROUSEL_W * 0.54)
    illus_right = brand.CAROUSEL_W - pad
    panel_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(panel_layer).rounded_rectangle(
        (illus_left, illus_top, illus_right, illus_bottom), radius=36, fill=(*ACCENT_RGB, 14),
    )
    img.alpha_composite(panel_layer)

    panel_cx = (illus_left + illus_right) / 2
    panel_cy = (illus_top + illus_bottom) / 2
    icon_size = min(illus_right - illus_left, illus_bottom - illus_top) * 0.72

    icon_glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    icon_glow_draw = ImageDraw.Draw(icon_glow)
    glow_r = icon_size * 0.5
    icon_glow_draw.ellipse(
        [panel_cx - glow_r, panel_cy - glow_r, panel_cx + glow_r, panel_cy + glow_r], fill=(*ACCENT_RGB, 45)
    )
    icon_glow = icon_glow.filter(ImageFilter.GaussianBlur(45))
    img.alpha_composite(icon_glow)

    icon_fn = _pick_illustration(text)
    icon_fn(draw, panel_cx, panel_cy, icon_size, ACCENT_RGB, max(6, int(icon_size * 0.028)))

    # Headline, left half only now that the right half holds the illustration.
    body_font = _load_font(brand.FONT_DISPLAY_BOLD, 52, bold_axis=True)
    max_text_width = illus_left - pad - 36
    lines = _wrap_text(draw, text, body_font, max_text_width)
    line_height = 64
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
