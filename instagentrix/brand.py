"""Brand constants for Instagentrix media (colors converted from agentrix/styles.css oklch
values via the standard OKLab matrices — see docs/superpowers/specs/2026-09-20-instagentrix-design.md).
"""
from pathlib import Path

ASSETS_DIR = Path(__file__).parent / "assets"
FONTS_DIR = ASSETS_DIR / "fonts"

FONT_DISPLAY_BOLD = str(FONTS_DIR / "BricolageGrotesque-Bold.ttf")
FONT_BODY = str(FONTS_DIR / "Manrope-Regular.ttf")
FONT_BODY_BOLD = str(FONTS_DIR / "Manrope-Bold.ttf")

# Dark theme (default site theme), converted from agentrix/styles.css oklch values.
BG = "#0a0c10"
BG_2 = "#101216"
SURFACE = "#15171c"
SURFACE_2 = "#1d2026"
TEXT = "#f5f7f9"
MUTED = "#a7abb3"
FAINT = "#71757c"
ACCENT = "#aeec46"
ACCENT_DIM = "#98cb46"
ACCENT_INK = "#121f00"

WORDMARK = "Agentrix-IA"

# Carousel canvas — Instagram-recommended portrait 4:5
CAROUSEL_W = 1080
CAROUSEL_H = 1350

# Video canvas — Reels/Stories vertical
VIDEO_W = 1080
VIDEO_H = 1920
