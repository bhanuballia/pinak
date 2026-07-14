# nakshatra_advanced/remedies/mantra_engine.py

def recommend_mantra(lord: str):
    """
    Stub to return standard seed (beej) mantras for each planetary lord.
    """
    mantras = {
        "Sun": "Om Hram Hreem Hroum Sah Suryaya Namah",
        "Moon": "Om Shram Shreem Shroum Sah Chandraya Namah"
    }
    return mantras.get(lord, "Om Namah Shivaya")
