from .base import mantra, ritual, charity, severity_bucket

def remedies_kalsarpa(dosha_result: dict) -> dict:
    if not dosha_result.get("present"):
        return {"dosha": "Kalsarpa", "present": False}

    severity = severity_bucket(dosha_result.get("score", 0))

    primary = [
        mantra(
            "Om Namah Shivaya",
            "ॐ नमः शिवाय"
        )
    ]

    optional = [
        ritual(
            "Rudrabhishek on Monday",
            "सोमवार को रुद्राभिषेक"
        ),
        charity(
            "Donate black sesame and blankets",
            "काले तिल और कंबल दान करें"
        )
    ]

    advanced = []
    if severity == "severe":
        advanced.append(
            ritual(
                "Kalsarpa Shanti Puja at Trimbakeshwar / Ujjain",
                "त्र्यंबकेश्वर या उज्जैन में कालसर्प शांति पूजा"
            )
        )

    return {
        "dosha": "Kalsarpa",
        "present": True,
        "severity": severity,
        "remedies": {
            "primary": primary,
            "optional": optional,
            "advanced": advanced,
        },
        "notes": "If Jupiter or Venus is strong, effect is reduced."
    }
