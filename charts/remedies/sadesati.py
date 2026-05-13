from .base import mantra, ritual, charity

def remedies_sadesati(dosha_result: dict) -> dict:
    if not dosha_result.get("present"):
        return {"dosha": "SadeSati", "present": False}

    phase = dosha_result.get("phase", "middle")

    primary = [
        mantra(
            "Om Sham Shanicharaya Namah",
            "ॐ शं शनैश्चराय नमः"
        )
    ]

    optional = [
        ritual(
            "Light sesame oil lamp on Saturday",
            "शनिवार को तिल के तेल का दीपक"
        ),
        charity(
            "Donate iron and black clothes",
            "लोहे और काले वस्त्र का दान"
        )
    ]

    advanced = []
    if phase == "middle":
        advanced.append(
            ritual(
                "Shani Shanti Puja",
                "शनि शांति पूजा"
            )
        )

    return {
        "dosha": "SadeSati",
        "present": True,
        "severity": phase,
        "remedies": {
            "primary": primary,
            "optional": optional,
            "advanced": advanced,
        },
        "notes": "Discipline and patience are the best remedies."
    }
