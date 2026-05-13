def explain_remedy(remedy: dict) -> dict:
    if remedy["type"] == "mantra":
        return {
            "en": "Mantras realign planetary vibrations through sound frequency.",
            "hi": "मंत्र ध्वनि तरंगों द्वारा ग्रहों की ऊर्जा संतुलित करते हैं।"
        }

    if remedy["type"] == "ritual":
        return {
            "en": "Rituals symbolically harmonize planetary karma.",
            "hi": "अनुष्ठान ग्रहों के कर्म को शांत करते हैं।"
        }

    if remedy["type"] == "charity":
        return {
            "en": "Charity reduces karmic intensity through selfless action.",
            "hi": "दान से कर्मों की तीव्रता कम होती है।"
        }

    return {"en": "", "hi": ""}


# -------------------------------
# Remedy Explainer
# -------------------------------
def explain_remedy(remedy: dict) -> dict:
    if remedy["type"] == "mantra":
        return {
            "en": "Mantras realign planetary vibrations through sound frequency.",
            "hi": "मंत्र ध्वनि तरंगों द्वारा ग्रहों की ऊर्जा संतुलित करते हैं।"
        }

    if remedy["type"] == "ritual":
        return {
            "en": "Rituals symbolically harmonize planetary karma.",
            "hi": "अनुष्ठान ग्रहों के कर्म को शांत करते हैं।"
        }

    if remedy["type"] == "charity":
        return {
            "en": "Charity reduces karmic intensity through selfless action.",
            "hi": "दान से कर्मों की तीव्रता कम होती है।"
        }

    return {"en": "", "hi": ""}


# -------------------------------
# Generate All Remedies
# -------------------------------
def generate_all_remedies(doshas: list) -> list:
    all_remedies = []

    for d in doshas:
        name = d["dosha"]
        severity = d.get("severity", "moderate")

        if name == "Manglik":
            all_remedies.extend(_manglik_remedies(severity))

        elif name == "Kalsarpa":
            all_remedies.extend(_kalsarpa_remedies(severity))

        elif name == "Pitra":
            all_remedies.extend(_pitra_remedies(severity))

        elif name == "SadeSati":
            all_remedies.extend(_sadesati_remedies(severity))

    return all_remedies


# -------------------------------
# Manglik Remedies
# -------------------------------
def _manglik_remedies(sev):
    if sev == "mild":
        return [
            {"type": "mantra", "name": "Om Mangalaya Namah", "count": 108},
            {"type": "charity", "name": "Donate red lentils", "amount": "1/4 kg"}
        ]

    if sev == "moderate":
        return [
            {"type": "mantra", "name": "Hanuman Chalisa", "count": 11},
            {"type": "ritual", "name": "Visit Hanuman temple", "frequency": "Tuesdays"},
            {"type": "charity", "name": "Donate sweets", "amount": "1 kg"}
        ]

    return [
        {"type": "mantra", "name": "Mangal Beej Mantra", "count": 1008},
        {"type": "ritual", "name": "Mars Puja", "frequency": "Monthly"},
        {"type": "charity", "name": "Donate blood", "frequency": "Once"},
        {"type": "charity", "name": "Donate copper", "amount": "250g"}
    ]


# -------------------------------
# Kalsarpa Remedies
# -------------------------------
def _kalsarpa_remedies(sev):
    if sev == "mild":
        return [
            {"type": "mantra", "name": "Om Namah Shivaya", "count": 108},
            {"type": "charity", "name": "Feed birds", "frequency": "Daily"}
        ]

    if sev == "moderate":
        return [
            {"type": "mantra", "name": "Rahu Beej Mantra", "count": 108},
            {"type": "ritual", "name": "Visit Trimbakeshwar", "frequency": "Once"},
            {"type": "charity", "name": "Donate black sesame", "amount": "500g"}
        ]

    return [
        {"type": "mantra", "name": "Kalsarpa Shanti Puja", "frequency": "Once"},
        {"type": "ritual", "name": "Naga Puja", "frequency": "Monthly"},
        {"type": "charity", "name": "Donate silver", "amount": "100g"},
        {"type": "charity", "name": "Donate rice", "amount": "5 kg"}
    ]


# -------------------------------
# Pitra Remedies
# -------------------------------
def _pitra_remedies(sev):
    if sev == "mild":
        return [
            {"type": "ritual", "name": "Offer water to ancestors", "frequency": "Daily"},
            {"type": "charity", "name": "Feed Brahmins", "frequency": "Monthly"}
        ]

    if sev == "moderate":
        return [
            {"type": "ritual", "name": "Pitra Tarpan", "frequency": "Amavasya"},
            {"type": "charity", "name": "Donate clothes", "amount": "3 sets"},
            {"type": "charity", "name": "Feed cows", "frequency": "Weekly"}
        ]

    return [
        {"type": "ritual", "name": "Grand Pitra Puja", "frequency": "Once"},
        {"type": "ritual", "name": "Shraddha ceremony", "frequency": "Annually"},
        {"type": "charity", "name": "Donate food", "amount": "10 kg"},
        {"type": "charity", "name": "Donate money", "amount": "₹5000"}
    ]


# -------------------------------
# SadeSati Remedies
# -------------------------------
def _sadesati_remedies(sev):
    if sev == "mild":
        return [
            {"type": "mantra", "name": "Shani Beej Mantra", "count": 108},
            {"type": "charity", "name": "Feed crows", "frequency": "Saturdays"}
        ]

    if sev == "moderate":
        return [
            {"type": "mantra", "name": "Shani Chalisa", "count": 11},
            {"type": "ritual", "name": "Visit Shani temple", "frequency": "Saturdays"},
            {"type": "charity", "name": "Donate black shoes", "amount": "1 pair"}
        ]

    return [
        {"type": "mantra", "name": "Shani Mahamrityunjaya", "count": 1008},
        {"type": "ritual", "name": "Shani Puja", "frequency": "Monthly"},
        {"type": "charity", "name": "Donate iron", "amount": "1 kg"},
        {"type": "charity", "name": "Donate oil", "amount": "5 liters"}
    ]