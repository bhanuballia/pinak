YOGINI_SEQUENCE = [
    "Mangala","Pingala","Dhanya","Bhramari",
    "Bhadrika","Ulka","Siddha","Sankata"
]

def yogini_predictions(dasha):

    lord = dasha.get("current", {}).get("lord", "Unknown")

    if lord in ["Mars","Sun"]:
        return "Fast karmic changes and bold action cycles."

    if lord in ["Venus","Moon"]:
        return "Relationship and emotional growth phase."

    return "Stable karmic rhythm."
