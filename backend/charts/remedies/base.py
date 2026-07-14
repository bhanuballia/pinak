def severity_bucket(score: float) -> str:
    if score >= 75:
        return "severe"
    elif score >= 40:
        return "moderate"
    else:
        return "mild"


def mantra(text_en: str, text_hi: str = "") -> dict:
    return {
        "type": "mantra",
        "en": text_en,
        "hi": text_hi or text_en,
    }


def ritual(text_en: str, text_hi: str = "") -> dict:
    return {
        "type": "ritual",
        "en": text_en,
        "hi": text_hi or text_en,
    }


def charity(text_en: str, text_hi: str = "") -> dict:
    return {
        "type": "charity",
        "en": text_en,
        "hi": text_hi or text_en,
    }
