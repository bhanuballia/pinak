# nakshatra_advanced/remedies/fasting_engine.py

def recommend_fasting(lord: str):
    """
    Stub to calculate recommended fasting days and diets based on the planetary lord.
    """
    fasting = {
        "Sun": "Sunday - Avoid salt",
        "Moon": "Monday - Dairy fasting"
    }
    return fasting.get(lord, "None")
