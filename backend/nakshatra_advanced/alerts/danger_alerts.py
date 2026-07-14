# nakshatra_advanced/alerts/danger_alerts.py

def detect_danger_alerts(transit_nakshatra: str, moon_nakshatra: str):
    """
    Stub to check for dangerous transits (e.g. Vadha Tara or Janma Tara transits).
    """
    return {
        "danger_detected": transit_nakshatra == moon_nakshatra,
        "advice": "Perform charity and chant planetary mantras."
    }
