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
