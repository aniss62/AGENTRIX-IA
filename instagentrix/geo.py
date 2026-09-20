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

# Epoch: 2026-01-01 maps to CITIES[0]
_EPOCH = datetime.date(2026, 1, 1)


def city_for_day(day: datetime.date) -> str:
    """Return the city for a given day.

    Uses an epoch-based calculation relative to 2026-01-01 (which maps to CITIES[0])
    to ensure deterministic 9-city cycling regardless of the day's ordinal modulo.
    """
    days_since_epoch = (day - _EPOCH).days
    return CITIES[days_since_epoch % len(CITIES)]
