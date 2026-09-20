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
