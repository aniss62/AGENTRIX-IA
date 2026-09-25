"""Background-music pool and per-post rotation for Instagentrix.

4 royalty-free Mixkit tracks, validated by the user 2026-09-25 (after listening to previews),
cycled in a fixed rotation so consecutive posts don't repeat the same track. Same epoch-based
determinism as `geo.city_for_day` so the cloud routine and a local session always agree without
shared state.

IMPORTANT (superseded a first attempt with Pixabay Music, 2026-09-25): Pixabay Music has no public
API and blocks programmatic downloads (403 on any non-browser request) -- unusable for
automation. Mixkit's tracks have stable, directly-downloadable mp3 URLs (`url` below), free for
commercial use, no attribution required -- confirmed working via plain `curl`/`urllib`.

Also (separate finding, same day): Instagram's Graph API has no audio parameter for
carousel/photo posts at all, and adding music to an already-published carousel from the app is
unreliable. So `track_for_day`'s track is not meant to sit next to a still carousel -- it's meant
to be downloaded and baked into a video with `video.build_video_from_slides` (turns the carousel's
own slide images into a Reels-format slideshow with this track mixed in), which is then published
via Zapier's video/Reels action instead of the photo/carousel action. That's the only fully
automated path that reliably ships with music.
"""
import datetime

TRACKS = [
    {
        "title": "Close Up",
        "artist": "Michael Ramir C.",
        "duration": "1:35",
        "mood": "sobre, pose — le plus proche de l'identite visuelle Agentrix",
        "url": "https://assets.mixkit.co/music/1167/1167.mp3",
    },
    {
        "title": "Motivating Mornings",
        "artist": "Ahjay Stelino",
        "duration": "1:36",
        "mood": "energique, positif — actu-tendances, annonces produit",
        "url": "https://assets.mixkit.co/music/33/33.mp3",
    },
    {
        "title": "Infinity",
        "artist": "Arulo",
        "duration": "1:43",
        "mood": "fluide, moderne — demo-services",
        "url": "https://assets.mixkit.co/music/440/440.mp3",
    },
    {
        "title": "Your Breath",
        "artist": "Eugenio Mininni",
        "duration": "3:56",
        "mood": "atmospherique, plus long — bien pour un carrousel a 6-8 slides",
        "url": "https://assets.mixkit.co/music/634/634.mp3",
    },
]

# Epoch: 2026-01-01 maps to TRACKS[0], same convention as geo._EPOCH
_EPOCH = datetime.date(2026, 1, 1)


def track_for_day(day: datetime.date) -> dict:
    """Return the track dict (title, artist, duration, mood, url) to use for a given day.

    Cycles through the 4 validated tracks in order, one per day, independent of geo/hashtag
    rotation. `url` is a direct, curl/urllib-downloadable mp3 -- download it and pass to
    `video.build_video_from_slides` (carousel-origin content) or `video.build_video`/
    `build_video_from_image` (b-roll/AI-image content) to bake it into the final file.
    """
    days_since_epoch = (day - _EPOCH).days
    return TRACKS[days_since_epoch % len(TRACKS)]
