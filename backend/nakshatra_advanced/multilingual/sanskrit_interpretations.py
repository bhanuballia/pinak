# nakshatra_advanced/multilingual/sanskrit_interpretations.py

SANSKRIT_SHLOKAS = {
    "Ashwini": "अश्वयुग्दस्त्रसहिता त्रिगुणोपेतकारिणी...",
    "Bharani": "भरणी यमदैवत्या सर्वभूतहिते रता..."
}

def get_sanskrit_shloka(nakshatra_name: str):
    """
    Stub to return historical Sanskrit scriptures describing each Nakshatra.
    """
    return SANSKRIT_SHLOKAS.get(nakshatra_name, "")
