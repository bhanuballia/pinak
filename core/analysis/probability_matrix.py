

from __future__ import annotations
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default



# ==========================================================
# ASTROCONSULT PROBABILITY MATRIX ENGINE
# ==========================================================

"""
This module converts chart analytics into structured probability scores.

Output example:

{
  "career_growth": 72,
  "marriage_probability": 65,
  "wealth_index": 81,
  "health_stability": 54,
  "life_balance_index": 70
}
"""


# ----------------------------------------------------------
# MAIN ENTRY
# ----------------------------------------------------------
def build_probability_matrix(chart, dasha, dosha, strength, life_events):

    avg_strength = _get_strength(strength, "average", 60)

    matrix = {
        "career_growth": _career_index(avg_strength, dasha, dosha, life_events),
        "marriage_probability": _marriage_index(avg_strength, dasha, dosha),
        "wealth_index": _wealth_index(avg_strength, dasha),
        "health_stability": _health_index(avg_strength, dosha),
        "life_balance_index": 0,
    }

    # overall stability index
    matrix["life_balance_index"] = int(
        (
            matrix["career_growth"]
            + matrix["marriage_probability"]
            + matrix["wealth_index"]
            + matrix["health_stability"]
        )
        / 4
    )

    return matrix


# ----------------------------------------------------------
# CAREER SCORE
# ----------------------------------------------------------
def _career_index(avg, dasha, dosha, events):

    score = avg

    lord = _current_lord(dasha)

    if lord in ["Saturn", "Sun"]:
        score += 12

    if dosha.get("sadesati", {}).get("present"):
        score -= 10

    # boost if career event detected
    for e in events:
        if "Career Breakthrough" in e.get("events", []):
            score += 8

    return _clamp(score)


# ----------------------------------------------------------
# MARRIAGE SCORE
# ----------------------------------------------------------
def _marriage_index(avg, dasha, dosha):

    score = avg

    lord = _current_lord(dasha)

    if lord in ["Venus", "Jupiter", "Moon"]:
        score += 10

    if dosha.get("mangalik", {}).get("present"):
        score -= 15

    if dosha.get("kalsarp", {}).get("present"):
        score -= 5

    return _clamp(score)


# ----------------------------------------------------------
# WEALTH SCORE
# ----------------------------------------------------------
def _wealth_index(avg, dasha):

    score = avg

    lord = _current_lord(dasha)

    if lord in ["Jupiter", "Mercury"]:
        score += 14

    if lord == "Rahu":
        score += 6

    return _clamp(score)


# ----------------------------------------------------------
# HEALTH SCORE
# ----------------------------------------------------------
def _health_index(avg, dosha):

    score = avg

    if dosha.get("sadesati", {}).get("present"):
        score -= 15

    if dosha.get("kalsarp", {}).get("present"):
        score -= 8

    return _clamp(score)


# ----------------------------------------------------------
# HELPERS
# ----------------------------------------------------------
def _current_lord(dasha):

    return dasha.get("current", {}).get("lord", "Unknown")


def _clamp(val):
    return max(0, min(100, int(val)))
