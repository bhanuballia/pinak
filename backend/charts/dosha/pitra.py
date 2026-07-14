# charts/dosha/pitra.py

def check_pitra_dosha(planets: dict) -> dict:
    sun = planets.get("Sun")
    rahu = planets.get("Rahu")
    ketu = planets.get("Ketu")

    if sun and sun["house"] == 9:
        return {"present": True, "reason": "Sun in 9th house"}

    if rahu and rahu["house"] == 9:
        return {"present": True, "reason": "Rahu in 9th house"}

    if ketu and ketu["house"] == 9:
        return {"present": True, "reason": "Ketu in 9th house"}

    return {"present": False}
