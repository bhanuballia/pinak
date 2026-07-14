# shadbala/kala_bala.py
"""
Kala Bala (Temporal Strength) - Shadbala Component 3/6

Temporal strength composed of:
- Nathonnatha Bala  : Day/Night strength
- Paksha Bala       : Lunar phase strength
- Tribhaga Bala     : Day divided into 3 parts
- Ayana Bala        : North/South declination bonus
- Yuddha Bala       : Planetary war (simplified)
- Masa Bala         : Month lord bonus
- Vara Bala         : Weekday lord bonus
- Hora Bala         : Hour lord bonus

For practical calculation without live ephemeris at call-time, this
module derives values from chart metadata (birth_info) when available
and falls back to sensible neutral scores.
"""

from math import fabs

# Classical weekday lord order (Sun=0 Mon=1 ... Sat=6)
WEEKDAY_LORDS = [
    "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"
]

# Hora hour lords (starting from weekday lord)
# Each weekday has a fixed hora sequence; simplified as same as weekday lord
HORA_LORDS = WEEKDAY_LORDS  # simplified

# Paksha (lunar phase) benefics gain in Shukla; malefics in Krishna
PAKSHA_BENEFICS = {"Moon", "Mercury", "Jupiter", "Venus"}
PAKSHA_MALEFICS = {"Sun", "Mars", "Saturn", "Rahu", "Ketu"}

# Natural strengths for Nathonnatha (diurnal/nocturnal)
DAY_STRONG  = {"Sun", "Jupiter", "Saturn"}
NIGHT_STRONG = {"Moon", "Mars", "Venus"}
BOTH_STRONG  = {"Mercury"}

# Ayana Bala: North declination boosts Sun/Mars/Jupiter/Mercury
NORTH_AYANA = {"Sun", "Mars", "Jupiter", "Mercury"}
SOUTH_AYANA = {"Moon", "Venus", "Saturn"}


def _nathonnatha_bala(planet: str, is_day: bool) -> float:
    """Day/Night strength. Full = 60, Half = 30."""
    if planet in BOTH_STRONG:
        return 30.0
    if is_day and planet in DAY_STRONG:
        return 60.0
    if not is_day and planet in NIGHT_STRONG:
        return 60.0
    return 15.0


def _paksha_bala(planet: str, moon_phase_deg: float) -> float:
    """
    Paksha Bala based on lunar phase (0=New Moon, 180=Full Moon).
    Benefics gain in Shukla Paksha (0–180); malefics in Krishna (180–360).
    Score 0–60.
    """
    # Normalize 0-180 for Shukla; 0-180 for Krishna
    if planet in PAKSHA_BENEFICS:
        # strongest at full moon (180 deg from sun)
        score = (moon_phase_deg / 180.0) * 60.0
        return min(60.0, score) if moon_phase_deg <= 180 else (360 - moon_phase_deg) / 180.0 * 60.0
    elif planet in PAKSHA_MALEFICS:
        # malefics gain in Krishna Paksha
        if moon_phase_deg > 180:
            return ((moon_phase_deg - 180) / 180.0) * 60.0
        return ((180 - moon_phase_deg) / 180.0) * 60.0
    return 30.0  # Neutral


def _vara_bala(planet: str, weekday: int) -> float:
    """Weekday lord gets 45; others get 0."""
    if WEEKDAY_LORDS[weekday % 7] == planet:
        return 45.0
    return 0.0


def _hora_bala(planet: str, weekday: int, birth_hour: int) -> float:
    """Hora lord of birth hour gets 60."""
    # Each hour from sunrise ruled cyclically from weekday lord
    hora_idx = (weekday + birth_hour) % 7
    if HORA_LORDS[hora_idx] == planet:
        return 60.0
    return 0.0


def _ayana_bala(planet: str, declination: float) -> float:
    """
    Ayana Bala: North declination > 0 benefits Sun/Mars/Jupiter/Mercury;
    South declination benefits Moon/Venus/Saturn.
    Score 0–30.
    """
    if planet in NORTH_AYANA and declination > 0:
        return min(30.0, declination * 2)
    if planet in SOUTH_AYANA and declination < 0:
        return min(30.0, fabs(declination) * 2)
    return 10.0  # Neutral


def calculate_kala_bala(chart: dict, planet: str) -> float:
    """
    Calculate Kala Bala (Temporal Strength) for a planet.

    Reads optional birth_info from chart for day/night, weekday, lunar phase.
    Returns composite score (Rupas, capped at 60).
    """
    birth_info = chart.get("birth_info", {})

    is_day      = birth_info.get("is_day", True)
    weekday     = int(birth_info.get("weekday", 0))     # 0=Sun, 6=Sat
    birth_hour  = int(birth_info.get("birth_hour", 6))
    
    if "moon_phase_deg" in birth_info:
        moon_phase = float(birth_info["moon_phase_deg"])
    else:
        moon_lon = float(chart.get("planet_positions", {}).get("Moon", {}).get("sidereal", {}).get("lon", 90.0))
        sun_lon = float(chart.get("planet_positions", {}).get("Sun", {}).get("sidereal", {}).get("lon", 0.0))
        moon_phase = (moon_lon - sun_lon) % 360.0
        
    if "declination" in birth_info and planet in birth_info["declination"]:
        declination = float(birth_info["declination"][planet])
    else:
        declination = float(chart.get("planet_positions", {}).get(planet, {}).get("equatorial", {}).get("dec", 0.0))

    nathonnatha = _nathonnatha_bala(planet, is_day)
    paksha      = _paksha_bala(planet, moon_phase)
    vara        = _vara_bala(planet, weekday)
    hora        = _hora_bala(planet, weekday, birth_hour)
    ayana       = _ayana_bala(planet, declination)

    # Classical composite (weighted average to keep in 0–60 range)
    total = (nathonnatha * 0.30 +
             paksha      * 0.30 +
             vara        * 0.10 +
             hora        * 0.10 +
             ayana       * 0.20)

    # Scale from 0-60 to 0-300 classical range
    scaled_score = (total / 60.0) * 300.0
    return max(0.0, round(min(scaled_score, 300.0), 2))
