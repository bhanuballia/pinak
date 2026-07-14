# charts/dosha/sadesati.py

ZODIAC = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
]

def check_sadesati(moon_sign: str, saturn_sign: str) -> dict:
    m = ZODIAC.index(moon_sign)
    s = ZODIAC.index(saturn_sign)

    diff = (s - m) % 12

    if diff in (11, 0, 1):
        phase = {11: "First", 0: "Middle", 1: "Last"}[diff]
        return {
            "present": True,
            "phase": phase
        }

    return {"present": False}
