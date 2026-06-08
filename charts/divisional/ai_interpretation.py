"""
charts/divisional/ai_interpretation.py
========================================
AI-style textual interpretation engine for D5, D6, D8, D11 divisional charts.
Provides planet-in-sign narratives for professional astrological reporting.
"""
from __future__ import annotations

# ---------------------------------------------------------------------------
# Sign-based keywords (canonical)
# ---------------------------------------------------------------------------
_SIGN_KEYWORDS = {
    "Aries":       "boldness, initiative, and pioneering energy",
    "Taurus":      "stability, material comfort, and persistence",
    "Gemini":      "communication, versatility, and intellectual curiosity",
    "Cancer":      "emotion, nurturing, and karmic family bonds",
    "Leo":         "authority, charisma, and creative power",
    "Virgo":       "analysis, service, and meticulous refinement",
    "Libra":       "diplomacy, balance, and aesthetic harmony",
    "Scorpio":     "transformation, depth, and hidden forces",
    "Sagittarius": "wisdom, expansion, and higher knowledge",
    "Capricorn":   "discipline, ambition, and worldly mastery",
    "Aquarius":    "innovation, humanitarian ideals, and detachment",
    "Pisces":      "spirituality, compassion, and dissolution of ego",
}

# ---------------------------------------------------------------------------
# D5 – Panchamsha: Fame · Power · Authority · Recognition
# ---------------------------------------------------------------------------
_D5_PLANET_THEMES = {
    "Sun":     "royal authority and state power",
    "Moon":    "popular recognition and public fame",
    "Mars":    "military or political dominance",
    "Mercury": "intellectual fame and advisory roles",
    "Jupiter": "spiritual authority and wisdom-based power",
    "Venus":   "artistic fame and cultural influence",
    "Saturn":  "enduring institutional authority",
    "Rahu":    "unconventional rise to prominence",
    "Ketu":    "past-life authority and detached power",
}

# ---------------------------------------------------------------------------
# D6 – Shashtamsha: Health · Diseases · Debts · Enemies
# ---------------------------------------------------------------------------
_D6_PLANET_THEMES = {
    "Sun":     "vitality challenges and ego-related health stress",
    "Moon":    "psychosomatic conditions and emotional health",
    "Mars":    "accidents, inflammation, and blood-related issues",
    "Mercury": "nervous system and digestive health patterns",
    "Jupiter": "liver, phlegm-related disorders, and debt through generosity",
    "Venus":   "reproductive health and kidney-related vulnerabilities",
    "Saturn":  "chronic diseases, skeletal issues, and long-term debts",
    "Rahu":    "mysterious ailments and karmic enemies",
    "Ketu":    "surgical events and past-life health karma",
}

# ---------------------------------------------------------------------------
# D8 – Ashtamsha: Longevity · Obstacles · Transformation
# ---------------------------------------------------------------------------
_D8_PLANET_THEMES = {
    "Sun":     "authority obstacles and ego-driven setbacks",
    "Moon":    "emotional crises and transformative grief",
    "Mars":    "sudden accidents and aggressive obstacles",
    "Mercury": "communication breakdowns and intellectual stagnation",
    "Jupiter": "loss through misplaced trust or over-expansion",
    "Venus":   "relationship obstacles and transformative loss",
    "Saturn":  "chronic delays and karmic burdens",
    "Rahu":    "hidden dangers and sudden reversals",
    "Ketu":    "spiritual detachment and mysterious endings",
}

# ---------------------------------------------------------------------------
# D11 – Rudramsha: Gains · Fortune · Elder Siblings · Fulfillment
# ---------------------------------------------------------------------------
_D11_PLANET_THEMES = {
    "Sun":     "gains through government, authority, and leadership",
    "Moon":    "gains through public dealings and emotional intelligence",
    "Mars":    "gains through real estate, engineering, and enterprise",
    "Mercury": "gains through commerce, writing, and communication",
    "Jupiter": "gains through wisdom, teaching, and spiritual pursuits",
    "Venus":   "gains through arts, luxury trade, and partnerships",
    "Saturn":  "gains through disciplined effort and long-term investment",
    "Rahu":    "unexpected gains through unconventional means",
    "Ketu":    "gains through spiritual detachment and inherited wisdom",
}


class DivisionalAIInterpretation:
    """
    Generates professional textual interpretations for D5, D6, D8, D11 charts.
    Each method returns a concise, classical-style description.
    """

    # -----------------------------------------------------------------------
    def interpret_d5(self, planet: str, sign: str) -> str:
        """D5 Panchamsha — Fame and Power interpretation."""
        theme   = _D5_PLANET_THEMES.get(planet, "karmic power dynamics")
        quality = _SIGN_KEYWORDS.get(sign, "unique qualities")
        return (
            f"{planet} in {sign} in the Panchamsha (D5) chart brings {theme} "
            f"expressed through {quality}. This placement shapes the native's "
            f"capacity for recognition, authority, and the fulfilment of past-life "
            f"merits in the public sphere."
        )

    # -----------------------------------------------------------------------
    def interpret_d6(self, planet: str, sign: str) -> str:
        """D6 Shashtamsha — Health and Enemies interpretation."""
        theme   = _D6_PLANET_THEMES.get(planet, "health karma")
        quality = _SIGN_KEYWORDS.get(sign, "complex forces")
        return (
            f"{planet} in {sign} in the Shashtamsha (D6) chart indicates {theme} "
            f"coloured by {quality}. Remedial measures aligned with this planet "
            f"can mitigate health vulnerabilities and reduce adversarial forces."
        )

    # -----------------------------------------------------------------------
    def interpret_d8(self, planet: str, sign: str) -> str:
        """D8 Ashtamsha — Obstacles and Transformation interpretation."""
        theme   = _D8_PLANET_THEMES.get(planet, "transformative patterns")
        quality = _SIGN_KEYWORDS.get(sign, "deep undercurrents")
        return (
            f"{planet} in {sign} in the Ashtamsha (D8) chart reveals {theme} "
            f"shaped by {quality}. This placement uncovers the hidden forces "
            f"that drive major life transformations and karmic turning points."
        )

    # -----------------------------------------------------------------------
    def interpret_d11(self, planet: str, sign: str) -> str:
        """D11 Rudramsha — Gains and Desires interpretation."""
        theme   = _D11_PLANET_THEMES.get(planet, "gains and ambitions")
        quality = _SIGN_KEYWORDS.get(sign, "distinctive strengths")
        return (
            f"{planet} in {sign} in the Rudramsha (D11) chart indicates {theme} "
            f"channelled through {quality}. This positions the native for "
            f"meaningful gains and the fulfilment of long-cherished desires."
        )
