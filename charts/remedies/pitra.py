from .base import mantra, ritual, charity, severity_bucket

def remedies_pitra(dosha_result: dict) -> dict:
    if not dosha_result.get("present"):
        return {"dosha": "Pitra", "present": False}

    severity = severity_bucket(dosha_result.get("score", 0))

    primary = [
        mantra(
            "Om Pitrubhyah Namah",
            "ॐ पितृभ्यः नमः"
        )
    ]

    optional = [
        ritual(
            "Shraddha during Pitru Paksha",
            "पितृ पक्ष में श्राद्ध"
        ),
        charity(
            "Feed cows and Brahmins",
            "गौ और ब्राह्मण भोजन"
        )
    ]

    advanced = []
    if severity == "severe":
        advanced.append(
            ritual(
                "Narayan Bali Puja",
                "नारायण बलि पूजा"
            )
        )

    return {
        "dosha": "Pitra",
        "present": True,
        "severity": severity,
        "remedies": {
            "primary": primary,
            "optional": optional,
            "advanced": advanced,
        },
        "notes": "Strong Sun or Jupiter reduces impact."
    }
