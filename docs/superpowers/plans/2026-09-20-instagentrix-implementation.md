# Instagentrix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Instagentrix pipeline — a daily text-only content brief (cloud routine) plus
an on-demand local subagent that turns approved briefs into finished vertical videos and branded
carousels for `@agentrix-ia`, with a strict never-auto-publish gate.

**Architecture:** Pure-Python helper modules (`instagentrix/`) provide hashtag selection, geo-city
rotation, carousel rendering (Pillow) and video assembly (ffmpeg + Pixabay stock footage). These
modules have zero network dependency except `video.py`'s stock-footage fetch, so the daily cloud
routine can safely reuse `hashtags.py`/`geo.py` for text briefs while media production
(`carousel.py`/`video.py`) only ever runs from a local Claude Code session. A new Airtable table
tracks every post from idea to published. A new subagent file (`instagentrix.md`) and a new cloud
routine (created via the `schedule` skill, not part of this plan's tasks) drive the pipeline.

**Tech Stack:** Python 3 (stdlib + Pillow, already installed), ffmpeg (already installed at
`/opt/homebrew/bin/ffmpeg`), Pixabay REST API (free key, video + image search), Airtable MCP
tools, Gmail MCP tools (text-only, no attachments — see prior Gmail MCP attachment bug).

---

## Prerequisites (manual, before Task 1)

These are account/credential steps only the user can do — flag them, don't attempt them:

1. Get a free Pixabay API key at https://pixabay.com/api/docs/ (instant, no approval wait).
   Add to `.env` as `PIXABAY_API_KEY=...`.
2. Confirm the Gmail MCP connector used by the daily routine can send to
   `contact@agentrix-ia.com` (same address AIBlogs already uses — should already work).

Task 5 (video assembly) cannot be exercised end-to-end without the Pixabay key, but every other
task is independently testable without it.

---

## File Structure

```
instagentrix/
  brand.py               # color/font constants converted from agentrix/styles.css
  hashtags.py             # hashtag pools + selection logic (pure, no network)
  geo.py                  # 9-city rotation logic (pure, no network)
  carousel.py             # branded slide PNG generator (Pillow, no network)
  video.py                 # Pixabay b-roll fetch + ffmpeg assembly (network: Pixabay only)
  assets/
    fonts/
      BricolageGrotesque-Bold.ttf
      Manrope-Regular.ttf
      Manrope-Bold.ttf
  output/                 # generated media, gitignored
  tests/
    test_hashtags.py
    test_geo.py
    test_carousel.py
  README.md
.claude/agents/instagentrix.md
.env                       # add PIXABAY_API_KEY=
.gitignore                 # add instagentrix/output/
```

---

### Task 1: Brand assets (fonts + color constants)

**Files:**
- Create: `instagentrix/brand.py`
- Create: `instagentrix/assets/fonts/BricolageGrotesque-Bold.ttf`
- Create: `instagentrix/assets/fonts/Manrope-Regular.ttf`
- Create: `instagentrix/assets/fonts/Manrope-Bold.ttf`

- [ ] **Step 1: Download the three font files from Google Fonts (whitelisted domain, works from
      any environment)**

```bash
mkdir -p instagentrix/assets/fonts
curl -sL "https://github.com/google/fonts/raw/main/ofl/bricolagegrotesque/BricolageGrotesque%5Bopsz%2Cwdth%2Cwght%5D.ttf" \
  -o instagentrix/assets/fonts/BricolageGrotesque-Bold.ttf
curl -sL "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope%5Bwght%5D.ttf" \
  -o instagentrix/assets/fonts/Manrope-Regular.ttf
cp instagentrix/assets/fonts/Manrope-Regular.ttf instagentrix/assets/fonts/Manrope-Bold.ttf
```

Note: both are variable-weight TTFs (a single file covers the whole weight axis). Pillow's
`ImageFont.truetype(path, size)` loads the default (usually regular/400) instance from a variable
font; `brand.py` below sets `set_variation_by_axes([700])` on the Bold handles so headline weight
renders bold instead of falling back to the default axis position.

- [ ] **Step 2: Verify both files are valid TrueType/variable fonts**

Run: `python3 -c "from PIL import ImageFont; f=ImageFont.truetype('instagentrix/assets/fonts/BricolageGrotesque-Bold.ttf', 40); print(f.getname())"`
Expected: prints a tuple like `('Bricolage Grotesque', ...)` with no exception.

- [ ] **Step 3: Write `instagentrix/brand.py`**

```python
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

WORDMARK = "Agentrix"

# Carousel canvas — Instagram-recommended portrait 4:5
CAROUSEL_W = 1080
CAROUSEL_H = 1350

# Video canvas — Reels/Stories vertical
VIDEO_W = 1080
VIDEO_H = 1920
```

- [ ] **Step 4: Commit**

```bash
git add instagentrix/brand.py instagentrix/assets/
git commit -m "feat(instagentrix): add brand fonts and color constants"
```

---

### Task 2: Hashtag pools and selection

**Files:**
- Create: `instagentrix/hashtags.py`
- Create: `instagentrix/tests/test_hashtags.py`

- [ ] **Step 1: Write the failing test**

```python
# instagentrix/tests/test_hashtags.py
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from instagentrix.hashtags import select_hashtags, PILLARS

def test_returns_between_20_and_25_tags():
    for pillar in PILLARS:
        tags = select_hashtags(pillar)
        assert 20 <= len(tags) <= 25, f"{pillar}: got {len(tags)}"

def test_all_tags_are_valid_instagram_hashtags():
    tags = select_hashtags(PILLARS[0])
    for tag in tags:
        assert tag.startswith("#")
        body = tag[1:]
        assert body.isalnum(), f"invalid hashtag: {tag}"

def test_always_includes_all_9_geo_tags():
    from instagentrix.hashtags import GEO_TAGS
    tags = select_hashtags(PILLARS[0])
    for geo_tag in GEO_TAGS:
        assert geo_tag in tags

def test_unknown_pillar_raises():
    try:
        select_hashtags("not-a-real-pillar")
        assert False, "expected ValueError"
    except ValueError:
        pass

if __name__ == "__main__":
    test_returns_between_20_and_25_tags()
    test_all_tags_are_valid_instagram_hashtags()
    test_always_includes_all_9_geo_tags()
    test_unknown_pillar_raises()
    print("OK")
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 instagentrix/tests/test_hashtags.py`
Expected: `ModuleNotFoundError: No module named 'instagentrix.hashtags'`

- [ ] **Step 3: Write `instagentrix/hashtags.py`**

```python
"""Hashtag pools and per-post selection for Instagentrix.

~22 hashtags per post: 5 broad + 3 brand + 5 niche (pillar-specific) + 9 geo (always all 9,
per docs/superpowers/specs/2026-09-20-instagentrix-design.md).
"""

PILLARS = [
    "conseils-pme",
    "actu-tendances",
    "demo-services",
    "mythes-ia",
    "micro-formations-claude",
]

BROAD_TAGS = [
    "#IA", "#IntelligenceArtificielle", "#Automatisation", "#Entrepreneuriat",
    "#Innovation", "#TechAfrique",
]

BRAND_TAGS = ["#AgentrixIA", "#Agentrix", "#AgentsIA"]

NICHE_TAGS = {
    "conseils-pme": [
        "#ProductivitePME", "#AutomatisationPME", "#GainDeTemps",
        "#OutilsIA", "#TransformationDigitale", "#PMEDigitale",
    ],
    "actu-tendances": [
        "#ActuIA", "#TendancesIA", "#InnovationTech",
        "#IAGenerative", "#FutureOfWork", "#TechNews",
    ],
    "demo-services": [
        "#AgentIA", "#ScrapingLeads", "#SiteWebPerformant",
        "#AutomatisationWorkflow", "#LeadGeneration", "#SolutionsIA",
    ],
    "mythes-ia": [
        "#MythesIA", "#IAExpliquee", "#VraiOuFaux",
        "#DemystifierIA", "#IAAccessible", "#PeurDeIA",
    ],
    "micro-formations-claude": [
        "#ClaudeAI", "#AnthropicAI", "#ApprendreIA",
        "#TutoIA", "#ClaudeCode", "#PromptEngineering",
    ],
}

# One tag per targeted country/city, per docs/superpowers/specs/2026-09-20-instagentrix-design.md
GEO_TAGS = [
    "#MarocTech",       # Casablanca
    "#TunisieTech",     # Tunis
    "#AlgerieTech",     # Alger
    "#SenegalBusiness", # Dakar
    "#CotedIvoireBiz",  # Abidjan (no apostrophe — Instagram hashtags can't contain them)
    "#CamerounTech",    # Douala
    "#RDCongoTech",     # Kinshasa
    "#FranceTech",      # Paris
    "#CanadaTech",      # Montréal
]


def select_hashtags(pillar: str, day_index: int = 0) -> list[str]:
    """Return ~22 hashtags for a post: 5 broad + 3 brand + 5 niche + all 9 geo.

    `day_index` rotates which 5-of-6 broad/niche tags are dropped each day, so consecutive
    posts on the same pillar don't reuse an identical set (avoids Instagram's repetitive-tag
    spam signal).
    """
    if pillar not in NICHE_TAGS:
        raise ValueError(f"Unknown pillar: {pillar!r}. Expected one of {PILLARS}")

    def rotate_drop_one(pool: list[str], seed: int) -> list[str]:
        drop = seed % len(pool)
        return [t for i, t in enumerate(pool) if i != drop]

    broad = rotate_drop_one(BROAD_TAGS, day_index)
    niche = rotate_drop_one(NICHE_TAGS[pillar], day_index + 1)

    return broad + BRAND_TAGS + niche + GEO_TAGS
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 instagentrix/tests/test_hashtags.py`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add instagentrix/hashtags.py instagentrix/tests/test_hashtags.py
git commit -m "feat(instagentrix): add hashtag pools and per-post selection"
```

---

### Task 3: Geo-city rotation

**Files:**
- Create: `instagentrix/geo.py`
- Create: `instagentrix/tests/test_geo.py`

- [ ] **Step 1: Write the failing test**

```python
# instagentrix/tests/test_geo.py
import sys, datetime
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from instagentrix.geo import CITIES, city_for_day

def test_9_cities_defined():
    assert len(CITIES) == 9

def test_rotation_is_deterministic_and_cycles():
    d0 = datetime.date(2026, 1, 1)
    seen = [city_for_day(d0 + datetime.timedelta(days=i)) for i in range(9)]
    assert seen == CITIES
    # day 9 wraps back to day 0's city
    assert city_for_day(d0 + datetime.timedelta(days=9)) == seen[0]

if __name__ == "__main__":
    test_9_cities_defined()
    test_rotation_is_deterministic_and_cycles()
    print("OK")
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 instagentrix/tests/test_geo.py`
Expected: `ModuleNotFoundError: No module named 'instagentrix.geo'`

- [ ] **Step 3: Write `instagentrix/geo.py`**

```python
"""9-city geotag rotation for Instagentrix — one city per day, cycling.

Deterministic on the calendar date (day-of-year modulo 9) so the cloud routine and a local
session always agree on "today's city" without needing to share state anywhere else.
"""
import datetime

CITIES = [
    "Casablanca",  # Maroc
    "Tunis",       # Tunisie
    "Alger",       # Algerie
    "Dakar",       # Senegal
    "Abidjan",     # Cote d'Ivoire
    "Douala",      # Cameroun
    "Kinshasa",    # RD Congo
    "Paris",       # France
    "Montreal",    # Canada
]


def city_for_day(day: datetime.date) -> str:
    return CITIES[day.toordinal() % len(CITIES)]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 instagentrix/tests/test_geo.py`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add instagentrix/geo.py instagentrix/tests/test_geo.py
git commit -m "feat(instagentrix): add 9-city geotag rotation"
```

---

### Task 4: Carousel slide generator

**Files:**
- Create: `instagentrix/carousel.py`
- Create: `instagentrix/tests/test_carousel.py`

- [ ] **Step 1: Write the failing test**

```python
# instagentrix/tests/test_carousel.py
import sys, tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from PIL import Image
from instagentrix.carousel import generate_carousel
from instagentrix.brand import CAROUSEL_W, CAROUSEL_H

def test_generates_one_file_per_slide():
    slides = [
        "3 erreurs qui coutent des heures a votre PME chaque semaine",
        "Erreur 1 : repondre aux memes questions clients a la main",
        "Erreur 2 : recopier des leads d'un fichier vers un autre",
        "Un agent IA peut regler les trois en moins d'une semaine",
    ]
    with tempfile.TemporaryDirectory() as tmp:
        paths = generate_carousel(slides, Path(tmp), slug="test-post")
        assert len(paths) == len(slides)
        for p in paths:
            assert p.exists()
            img = Image.open(p)
            assert img.size == (CAROUSEL_W, CAROUSEL_H)

if __name__ == "__main__":
    test_generates_one_file_per_slide()
    print("OK")
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 instagentrix/tests/test_carousel.py`
Expected: `ModuleNotFoundError: No module named 'instagentrix.carousel'`

- [ ] **Step 3: Write `instagentrix/carousel.py`**

```python
"""Branded carousel slide generator — 4-8 slides, illustration+text, Agentrix visual identity."""
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from instagentrix import brand


def _load_font(path: str, size: int, bold_axis: bool = False) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(path, size)
    try:
        if bold_axis and "wght" in {a["tag"] for a in font.get_variation_axes()}:
            font.set_variation_by_axes([700])
    except Exception:
        pass  # static (non-variable) font fallback — already at its only weight
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 instagentrix/tests/test_carousel.py`
Expected: `OK`

- [ ] **Step 5: Visually sanity-check one output**

Run: `python3 -c "
from pathlib import Path
from instagentrix.carousel import generate_carousel
paths = generate_carousel(['3 erreurs qui coutent des heures a votre PME chaque semaine', 'Erreur 1 : repondre aux memes questions clients a la main'], Path('instagentrix/output/sanity-check'), 'sanity-check')
print(paths)
"`
Then open the printed PNG paths and confirm: dark background, lime headline text wraps cleanly
within margins, page dots visible at the bottom, "Agentrix" wordmark top-left in lime.

- [ ] **Step 6: Commit**

```bash
git add instagentrix/carousel.py instagentrix/tests/test_carousel.py
rm -rf instagentrix/output/sanity-check
git commit -m "feat(instagentrix): add branded carousel slide generator"
```

---

### Task 5: Video assembly (Pixabay b-roll + ffmpeg)

**Files:**
- Create: `instagentrix/video.py`

- [ ] **Step 1: Write `instagentrix/video.py`**

```python
"""Faceless explainer video assembly: Pixabay b-roll + animated on-screen text + music, via
ffmpeg. No voice-over (text + music only, per docs/superpowers/specs/2026-09-20-instagentrix-design.md).
Network dependency: Pixabay API only. Must run from a local session, never from the cloud routine.
"""
import os
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
    # "medium" size is plenty for a 1080x1920 vertical output after ffmpeg scale/crop
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

    escaped_font = brand.FONT_DISPLAY_BOLD.replace(":", r"\:")
    drawtext_filters = []
    for i, line in enumerate(text_lines):
        start = i * seconds_per_line
        end = start + seconds_per_line
        safe_text = line.replace("'", r"\'").replace(":", r"\:")
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
```

- [ ] **Step 2: Smoke-test with a real Pixabay key (requires `PIXABAY_API_KEY` in `.env`, see
      Prerequisites)**

Run:
```bash
export $(grep -v '^#' .env | xargs)
python3 -c "
from pathlib import Path
from instagentrix.video import search_broll, download_file, build_video

url = search_broll('office team laptop', __import__('os').environ['PIXABAY_API_KEY'])
print('broll url:', url)
broll = download_file(url, Path('instagentrix/output/sanity-broll.mp4'))

# Reuse a short silent placeholder if no music track is curated yet: generate 5s of silence.
import subprocess
subprocess.run(['ffmpeg', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-t', '5',
                 'instagentrix/output/sanity-silence.mp3'], check=True, capture_output=True)

out = build_video(
    broll,
    ['3 erreurs qui coutent des heures a votre PME', 'Erreur 1 : repondre a la main'],
    Path('instagentrix/output/sanity-silence.mp3'),
    Path('instagentrix/output/sanity-check.mp4'),
)
print('video:', out)
"
```
Expected: no exception, `instagentrix/output/sanity-check.mp4` exists. Open it and confirm: b-roll
plays full-screen vertical, the two text lines appear in sequence with a readable dark box behind
them, and it runs for ~7 seconds.

If this step can't be run yet (no `PIXABAY_API_KEY`), skip it and come back once the user has
added the key — everything else in this plan works without it.

- [ ] **Step 3: Clean up sanity-check artifacts and commit**

```bash
rm -f instagentrix/output/sanity-broll.mp4 instagentrix/output/sanity-silence.mp3 instagentrix/output/sanity-check.mp4
git add instagentrix/video.py
git commit -m "feat(instagentrix): add Pixabay b-roll fetch and ffmpeg video assembly"
```

---

### Task 6: Ignore generated output

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add the output directory**

Read the current `.gitignore` first, then append:

```
instagentrix/output/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore instagentrix generated media output"
```

---

### Task 7: Airtable table — "Instagram Content Pipeline"

**No files** — this is an Airtable MCP operation, not a code change. Run it from an interactive
session (not this plan's automation) using `mcp__claude_ai_Airtable__create_table` against base
`agentrix` (`appcoqhKXGbCttULR`), matching the naming conventions already used by the existing
`Content Pipeline` table (Title Case field names, lowercase-hyphenated singleSelect option
values):

- [ ] **Step 1: Create the table**

Table name: `Instagram Content Pipeline`

Fields:

| Field | Type | Options |
|---|---|---|
| Slug | singleLineText (primary) | e.g. `2026-09-21-conseils-1` |
| Title | singleLineText | |
| Pillar | singleSelect | `conseils-pme`, `actu-tendances`, `demo-services`, `mythes-ia`, `micro-formations-claude` |
| Format | singleSelect | `video`, `carrousel` |
| Status | singleSelect | `idea`, `brief-sent`, `approved`, `media-ready`, `published`, `blocked` |
| Script Or Slides | multilineText | video script lines, or one line per carousel slide |
| Caption | multilineText | Instagram caption text |
| Hashtags | multilineText | output of `select_hashtags()`, one per line |
| City Geotag | singleSelect | `Casablanca`, `Tunis`, `Alger`, `Dakar`, `Abidjan`, `Douala`, `Kinshasa`, `Paris`, `Montreal` |
| Source URL | url | only for `actu-tendances` posts |
| Source Date | date (ISO) | only for `actu-tendances` posts — must be within 3 months of Slug's date |
| Media Path | singleLineText | local repo path once Task-8-produced media exists, e.g. `instagentrix/output/2026-09-21-conseils-1.mp4` |
| Published Date | date (ISO) | |

- [ ] **Step 2: Verify**

Run `mcp__claude_ai_Airtable__get_table_schema` on the new table and confirm all 13 fields and
their option values match the table above exactly.

---

### Task 8: The `instagentrix` subagent

**Files:**
- Create: `.claude/agents/instagentrix.md`

- [ ] **Step 1: Write the subagent file**

```markdown
---
name: instagentrix
description: Agent responsable du contenu Instagram Agentrix (@agentrix-ia). Utiliser pour choisir un sujet dans Airtable (Instagram Content Pipeline), verifier la fraicheur des stats pour le pilier actu-tendances, rediger script/carrousel + legende + hashtags, produire la video ou le carrousel final via instagentrix/carousel.py et instagentrix/video.py, et preparer la publication apres validation explicite. Ne publie jamais sur Instagram sans confirmation explicite de l'utilisateur dans la session.
tools: Bash, Read, Write, Edit, Glob, Grep, WebSearch, WebFetch
---

Tu es Instagentrix, l'agent responsable du contenu Instagram d'Agentrix (agence d'IA agentique,
@agentrix-ia).

# Source de verite
Charge toujours avant de travailler :
- `docs/superpowers/specs/2026-09-20-instagentrix-design.md` (design approuve)
- `instagentrix/brand.py`, `instagentrix/hashtags.py`, `instagentrix/geo.py` (constantes et
  logique a reutiliser, ne jamais reinventer ces valeurs a la main)

# Tracker
Base Airtable `agentrix` (`appcoqhKXGbCttULR`), table `Instagram Content Pipeline`. Utilise les
outils MCP Airtable pour lire/ecrire cette table.

# Pipeline
1. **Choix du sujet** : ligne au statut `idea`, en respectant la rotation des 5 piliers (ne pas
   enchainer deux fois le meme pilier sans raison). Si aucune ligne `idea` n'existe, propose 2-3
   nouveaux sujets a l'utilisateur avant de continuer.
2. **Fraicheur (pilier `actu-tendances` uniquement)** : verifie toute statistique/actualite citee
   par 2 recherches WebSearch independantes, formulees differemment, confirmant une source datee
   de moins de 3 mois. Si rien de verifiable n'est trouve, ecarte le sujet et reprends-en un
   autre du meme pilier.
3. **Redaction** : script (video, ~4-6 lignes courtes) ou textes de slides (carrousel, 4-8
   slides), + legende Instagram, en francais. Genere les hashtags avec
   `instagentrix.hashtags.select_hashtags(pillar, day_index)` — ne jamais ecrire une liste de
   hashtags a la main. Calcule la ville du jour avec `instagentrix.geo.city_for_day(date)`.
4. **Production media** :
   - Carrousel : `instagentrix.carousel.generate_carousel(slides, Path("instagentrix/output"), slug)`
   - Video : `instagentrix.video.search_broll(...)` puis `build_video(...)` — necessite
     `PIXABAY_API_KEY` dans `.env`. Choisis une musique libre de droits adaptee au ton du sujet
     (recherche-la via WebSearch/WebFetch, par exemple sur pixabay.com/music, et telecharge le
     fichier localement dans `instagentrix/output/`) avant d'appeler `build_video`.
5. **Auto-QA avant email/validation** : aucune statistique non sourcee pour `actu-tendances`,
   hashtags = exactement la sortie de `select_hashtags` (pas de modification manuelle), legende
   sans tiret cadratin/demi-cadratin, fichier media genere et non vide.
6. **Ne publie JAMAIS sur Instagram sans confirmation explicite.** Produis le media, mets a jour
   la ligne Airtable (`Status` -> `media-ready`, `Media Path` renseigne), presente le resultat a
   l'utilisateur et attends son accord avant toute action de publication reelle. La mecanique de
   publication effective (manuelle ou via une connexion Zapier Instagram for Business future)
   reste a la discretion de l'utilisateur, voir le design pour le detail.
7. Une fois la publication confirmee par l'utilisateur, mets a jour `Status` -> `published` et
   `Published Date`.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/agents/instagentrix.md
git commit -m "feat(instagentrix): add local subagent definition"
```

---

### Task 9: Documentation

**Files:**
- Create: `instagentrix/README.md`

- [ ] **Step 1: Write the README**

```markdown
# Instagentrix

Daily Instagram content pipeline for @agentrix-ia. See
`docs/superpowers/specs/2026-09-20-instagentrix-design.md` for the full design and
`.claude/agents/instagentrix.md` for the subagent that runs it interactively.

## Prerequisites

- `PIXABAY_API_KEY` in `.env` (free key: https://pixabay.com/api/docs/) — only needed for
  `video.py`'s b-roll search, everything else works without it.
- ffmpeg installed locally (already present on this machine at `/opt/homebrew/bin/ffmpeg`).

## Modules

- `brand.py` — colors/fonts, no network, no dependencies beyond Pillow.
- `hashtags.py` — pure functions, no network.
- `geo.py` — pure functions, no network.
- `carousel.py` — renders branded slide PNGs locally, no network.
- `video.py` — fetches Pixabay b-roll (network) and assembles the final MP4 with ffmpeg
  (local). **Never run from the cloud routine** — see the design doc's network-egress section.

## Tests

```bash
python3 instagentrix/tests/test_hashtags.py
python3 instagentrix/tests/test_geo.py
python3 instagentrix/tests/test_carousel.py
```
```

- [ ] **Step 2: Commit**

```bash
git add instagentrix/README.md
git commit -m "docs(instagentrix): add module README"
```

---

### Task 10: Daily cloud routine (setup, not code)

**No files** — created via the `schedule` skill against the pushed GitHub repo, not part of this
plan's code changes. Do this only after Tasks 1-9 are pushed to `origin/main` (a cloud routine
only ever sees GitHub, never the local working tree — see [[deployment_mechanics]] /
[[aiblogs_agent]]).

- [ ] **Step 1: Push everything from Tasks 1-9**

```bash
git push origin main
```

- [ ] **Step 2: Create the routine via the `schedule` skill**

Name: `Instagentrix`
Cron: `0 7 * * *` (7h Afrique/Casablanca — same UTC-drift caveat during Ramadan as AIBlogs, see
[[aiblogs_agent]])
Repo: `github.com/aniss62/AGENTRIX-IA`
Connectors: Airtable + Gmail (same as AIBlogs)

Routine prompt (paste verbatim):

```
Tu es la routine cloud quotidienne Instagentrix pour Agentrix (@agentrix-ia).

CONTRAINTE CRITIQUE : cet environnement cloud a un acces reseau tres restreint (seuls npm, PyPI,
l'API GitHub et Google Fonts sont confirmes accessibles). N'appelle JAMAIS instagentrix/video.py
ou toute fonction qui telecharge du b-roll/musique (Pixabay ou autre) — ca va echouer. Tu ne
produis QUE du texte aujourd'hui, jamais de fichier media.

ETAPE 1 - Lire l'etat : lis la table Airtable "Instagram Content Pipeline" (base agentrix,
appcoqhKXGbCttULR) via les outils MCP Airtable. Identifie les lignes au statut "idea".

ETAPE 2 - Choisir 2-3 sujets du jour en respectant la rotation des 5 piliers (conseils-pme,
actu-tendances, demo-services, mythes-ia, micro-formations-claude) : ne reprends pas deux fois le
meme pilier que la veille sauf si aucun autre sujet "idea" n'est disponible. Si moins de 2-3
lignes "idea" existent, invente 2-3 nouveaux sujets toi-meme (coherents avec le pilier et la
marque Agentrix, cf. docs/superpowers/specs/2026-09-20-instagentrix-design.md) et cree les lignes
correspondantes avant de continuer.

ETAPE 3 - Pour tout sujet du pilier "actu-tendances" : verifie la statistique/actualite par 2
recherches WebSearch independantes, formulees differemment, confirmant une source datee de moins
de 3 mois. Si invérifiable, ecarte ce sujet et choisis-en un autre du meme pilier.

ETAPE 4 - Pour chaque sujet retenu : redige le script (video, 4-6 lignes courtes) ou les textes de
slides (carrousel, 4-8 slides), la legende Instagram, en francais. Calcule les hashtags avec
`python3 -c "from instagentrix.hashtags import select_hashtags; print(select_hashtags('<pillar>',
<day_index>))"` (day_index = jour de l'annee) et la ville du jour avec `python3 -c "from
instagentrix.geo import city_for_day; import datetime; print(city_for_day(datetime.date.today()))"`
— ne genere jamais ces valeurs a la main.

ETAPE 5 - Met a jour chaque ligne Airtable : Status -> "brief-sent", Script Or Slides, Caption,
Hashtags, City Geotag, et pour actu-tendances : Source URL + Source Date.

ETAPE 6 - Envoie UN SEUL email a contact@agentrix-ia.com, texte brut (PAS de piece jointe — voir
le bug Gmail MCP documente dans la memoire aiblogs_agent), avec pour chaque sujet du jour : titre,
pilier, format propose (video/carrousel), script ou textes de slides, legende, hashtags, ville
geotaggee. Termine l'email en rappelant explicitement qu'aucune publication n'a eu lieu et que la
production du media final (video/carrousel) se fait dans une session Claude Code locale une fois
le sujet valide.

ETAPE 7 - Arrete-toi. Ne publie jamais, ne produis jamais de fichier media, ne touche jamais a
instagentrix/video.py ni instagentrix/carousel.py.
```

- [ ] **Step 3: Trigger one manual run and inspect the log**

Use `RemoteTrigger` (`run`, then `get_run_log`) the same way it was validated for AIBlogs. Confirm
the email arrives with 2-3 well-formed text briefs and that Airtable rows moved to `brief-sent`.
Treat the first run as a discovery run, per the [[aiblogs_agent]] lesson that cloud sandbox
constraints surface by running, not by reading docs — fix the prompt and re-run if something
fails, don't assume the design is wrong from one failure.

---

## Self-review notes

- **Spec coverage:** 5 pillars (Task 8/10 prompts), text+music video with no voice (Task 5), free
  carousel format (Task 4), 3-month freshness rule (Task 8 step 2, Task 10 step 4), 9-country geo
  hashtags + city rotation (Task 2, Task 3), ~20-25 hashtags (Task 2), Airtable tracker (Task 7),
  email-only daily validation with no attachment (Task 10), never-auto-publish gate (Task 8 step
  6), no Higgsfield dependency by default (Tasks 4-5 use Pillow/ffmpeg/Pixabay only) — all covered.
- **Deferred by design, not forgotten:** actual Instagram publishing mechanics (manual vs. future
  Zapier connection) is explicitly out of scope per the approved spec — Task 8's subagent stops at
  `media-ready` and waits for the user.
