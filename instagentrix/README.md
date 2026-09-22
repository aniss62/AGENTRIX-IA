# Instagentrix

Daily Instagram content pipeline for @agentrix-ia. See
`docs/superpowers/specs/2026-09-20-instagentrix-design.md` for the full design and
`.claude/agents/instagentrix.md` for the subagent that runs it interactively.

## Prerequisites

- `PIXABAY_API_KEY` in `.env` (free key: https://pixabay.com/api/docs/) — only needed for
  `video.py`'s `search_broll`/`build_video` (real b-roll footage path).
- A Google AI Studio (Gemini) account connected via the Zapier MCP connector — only needed for
  the Nano Banana image-background path (`build_video_from_image`). Image generation itself goes
  through the Zapier `execute_zapier_write_action` tool from an agent session, not a Python call
  in `video.py`.
- A drawtext-capable ffmpeg on `PATH`. The default Homebrew `ffmpeg` formula on this machine is
  built **without** freetype/fontconfig, so it has no `drawtext` filter and `video.py`'s
  `build_video()`/`build_video_from_image()` will fail with `Unknown filter: 'drawtext'` until a
  full build (e.g. `ffmpeg-full`) is installed and linked ahead of the regular formula. Everything
  else in this package (hashtags, geo rotation, carousels, the `zoompan` Ken Burns effect itself)
  works with the default ffmpeg or none at all.

## Modules

- `brand.py` — colors/fonts, no network, no dependencies beyond Pillow.
- `hashtags.py` — pure functions, no network.
- `geo.py` — pure functions, no network.
- `carousel.py` — renders branded slide PNGs locally, no network.
- `video.py` — two video sources, chosen per post:
  - `search_broll`/`download_file`/`build_video` — real Pixabay b-roll (network: Pixabay only).
  - `build_video_from_image` — animates a locally-saved still image (e.g. Nano Banana output
    fetched by the agent via Zapier) with a Ken Burns zoom/pan; the function itself has no
    network dependency, only local ffmpeg.
  **Never run from the cloud routine** — see the design doc's network-egress section.

## Tests

```bash
python3 instagentrix/tests/test_hashtags.py
python3 instagentrix/tests/test_geo.py
python3 instagentrix/tests/test_carousel.py
```
