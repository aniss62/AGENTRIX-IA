# Instagentrix

Daily Instagram content pipeline for @agentrix-ia. See
`docs/superpowers/specs/2026-09-20-instagentrix-design.md` for the full design and
`.claude/agents/instagentrix.md` for the subagent that runs it interactively.

## Prerequisites

- `PIXABAY_API_KEY` in `.env` (free key: https://pixabay.com/api/docs/) — only needed for
  `video.py`'s b-roll search, everything else works without it.
- A drawtext-capable ffmpeg on `PATH`. The default Homebrew `ffmpeg` formula on this machine is
  built **without** freetype/fontconfig, so it has no `drawtext` filter and `video.py`'s
  `build_video()` will fail with `Unknown filter: 'drawtext'` until a full build (e.g.
  `ffmpeg-full`) is installed and linked ahead of the regular formula. Everything else in this
  package (hashtags, geo rotation, carousels) works with any ffmpeg or none at all.

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
