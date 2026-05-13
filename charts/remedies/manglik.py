from .base import mantra, ritual, charity, severity_bucket

def remedies_manglik(dosha_result: dict) -> dict:
    if not dosha_result.get("present"):
        return {"dosha": "Manglik", "present": False}

    severity = severity_bucket(dosha_result.get("score", 0))

    primary = [
        mantra(
            "Om Angarakaya Namah",
            "ॐ अंगारकाय नमः"
        )
    ]

    optional = [
        ritual(
            "Hanuman Chalisa on Tuesday",
            "मंगलवार को हनुमान चालीसा"
        ),
        charity(
            "Donate red lentils and copper",
            "लाल मसूर और तांबा दान करें"
        )
    ]

    advanced = []
    if severity == "severe":
        advanced.append(
            ritual(
                "Mangal Shanti Puja before marriage",
                "विवाह से पूर्व मंगल शांति पूजा"
            )
        )

    return {
        "dosha": "Manglik",
        "present": True,
        "severity": severity,
        "remedies": {
            "primary": primary,
            "optional": optional,
            "advanced": advanced,
        },
        "notes": "Manglik dosha cancels if both partners are Manglik."
    }
