# nakshatra_advanced/alerts/marriage_alerts.py

def detect_marriage_alerts(transit_nakshatra: str, venus_nakshatra: str):
    """
    Stub to check for relationship event activation windows.
    """
    return {
        "marriage_window": transit_nakshatra == venus_nakshatra,
        "intensity": "high" if transit_nakshatra == venus_nakshatra else "normal"
    }
