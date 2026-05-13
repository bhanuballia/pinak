# charts/dosha/mangalik.py

MANGALIK_HOUSES = {1, 2, 4, 7, 8, 12}

def check_manglik_dosha(planets: dict, lagna_house: int, moon_house: int) -> dict:
    mars = planets.get("Mars")
    if not mars:
        return {"present": False}

    from_lagna = mars["house"] in MANGALIK_HOUSES
    from_moon = ((mars["house"] - moon_house) % 12 or 12) in MANGALIK_HOUSES

    if from_lagna or from_moon:
        return {
            "present": True,
            "type": "Mangalik Dosha",
            "from": "Lagna" if from_lagna else "Moon",
            "house": mars["house"]
        }

    return {"present": False}
