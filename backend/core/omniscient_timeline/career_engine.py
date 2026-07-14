def career_window(year, lord, transits):

    if lord in ["Saturn", "Jupiter"] or "jupiter_return" in transits:
        return {
            "type": "career_growth",
            "message": "Expansion in career, promotions or authority."
        }

    return None
