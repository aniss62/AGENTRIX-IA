"""Background-music pool and per-post rotation for Instagentrix.

4 royalty-free Pixabay tracks, validated by the user 2026-09-25, cycled in a fixed rotation
so consecutive posts don't repeat the same track. Same epoch-based determinism as
`geo.city_for_day` so the cloud routine and a local session always agree without shared state.

IMPORTANT: Instagram's Graph API (and therefore the Zapier "Publish Photo(s)" action this
pipeline uses) has no audio parameter for carousel/photo posts -- that catalog is only reachable
from Instagram's own app UI. For a carousel, `track_for_day` gives the *direction* to search for
manually in Instagram's in-app music picker when publishing; it does not get attached
automatically. For a video/Reel produced via `video.py`, the returned `url` can be downloaded and
baked into the file with ffmpeg like any other royalty-free track.
"""
import datetime

TRACKS = [
    {
        "title": "Corporate Upbeat Tech",
        "artist": "SoulProdMusic",
        "duration": "2:01",
        "mood": "energique, rythme EDM — actu-tendances, annonces produit",
        "url": "https://pixabay.com/music/corporate-corporate-upbeat-tech-208855/",
    },
    {
        "title": "Upbeat Tech Corporate",
        "artist": "stock_music",
        "duration": "1:42",
        "mood": "electronique, uplifting, medium-fast — demo-services",
        "url": "https://pixabay.com/music/corporate-upbeat-tech-corporate-153729/",
    },
    {
        "title": "Corporate Background Music",
        "artist": "MaksymMalko",
        "duration": "2:12",
        "mood": "fluide, elegant, hopeful — le plus polyvalent des 4",
        "url": "https://pixabay.com/music/upbeat-corporate-background-music-301236/",
    },
    {
        "title": "Minimal Tech Corporate",
        "artist": "SoulProdMusic",
        "duration": "2:42",
        "mood": "sobre, confiant, ambient — le plus proche de l'identite visuelle Agentrix",
        "url": "https://pixabay.com/music/corporate-minimal-tech-corporate-212257/",
    },
]

# Epoch: 2026-01-01 maps to TRACKS[0], same convention as geo._EPOCH
_EPOCH = datetime.date(2026, 1, 1)


def track_for_day(day: datetime.date) -> dict:
    """Return the track dict (title, artist, duration, mood, url) to use for a given day.

    Cycles through the 4 validated tracks in order, one per day, independent of geo/hashtag
    rotation. For a carousel this is guidance for manual selection in Instagram's music picker;
    for a video it's the track to download and bake in with ffmpeg.
    """
    days_since_epoch = (day - _EPOCH).days
    return TRACKS[days_since_epoch % len(TRACKS)]
