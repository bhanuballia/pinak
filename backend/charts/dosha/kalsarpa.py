# charts/dosha/kalsarpa.py

ZODIAC_ORDER = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
]

def _zodiac_range(start, end):
    """Inclusive zodiac slice from start → end"""
    s = ZODIAC_ORDER.index(start)
    e = ZODIAC_ORDER.index(end)
    if s <= e:
        return ZODIAC_ORDER[s:e+1]
    return ZODIAC_ORDER[s:] + ZODIAC_ORDER[:e+1]

def check_kalsarpa_dosha(planets: dict) -> dict:
    rahu = planets.get("Rahu")
    ketu = planets.get("Ketu")
    if not rahu or not ketu:
        return {"present": False, "reason": "Rahu/Ketu missing"}

    span = _zodiac_range(rahu["sign"], ketu["sign"])

    for p, info in planets.items():
        if p in ("Rahu", "Ketu"):
            continue
        if info["sign"] not in span:
            return {"present": False}

    return {
        "present": True,
        "type": "Kalsarpa Dosha",
        "span": f"{rahu['sign']} → {ketu['sign']}"
    }
