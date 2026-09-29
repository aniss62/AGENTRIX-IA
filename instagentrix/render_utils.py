"""Shared PIL rendering helpers for the carousel and video pipelines — kept in one place so the
Agentrix-IA wordmark and font-loading logic can't drift between the two media types again (see
the 2026-09-29 incident: the video pipeline shipped with no wordmark at all).
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from instagentrix import brand


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))


ACCENT_RGB = hex_to_rgb(brand.ACCENT)
TEXT_RGB = hex_to_rgb(brand.TEXT)


def load_font(path: str, size: int, bold_axis: bool = False) -> ImageFont.FreeTypeFont:
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


def draw_wordmark(img: Image.Image, pad: int = 90, top: int = 68, font_size: int = 38) -> None:
    """Draw the Agentrix-IA wordmark top-left onto `img` (RGBA, modified in place), with the same
    soft lime glow and accent/white split used on every branded carousel slide and video frame.
    """
    draw = ImageDraw.Draw(img)
    font = load_font(brand.FONT_DISPLAY_BOLD, font_size, bold_axis=True)
    name, _, suffix = brand.WORDMARK.partition("-")
    suffix = f"-{suffix}"
    glow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(glow_layer).text((pad, top), brand.WORDMARK, font=font, fill=(*ACCENT_RGB, 160))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(10))
    img.alpha_composite(glow_layer)
    draw.text((pad, top), name, font=font, fill=brand.ACCENT)
    name_w = draw.textlength(name, font=font)
    draw.text((pad + name_w, top), suffix, font=font, fill=brand.TEXT)
