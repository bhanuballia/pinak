from .base import tone_by_severity, confidence_score

def explain_dosha(dosha: dict, lang: str = "en", style: str = "minimal") -> dict:
    name = dosha["dosha"]
    severity = dosha.get("severity", "moderate")
    tone = tone_by_severity(severity)

    if name == "Manglik":
        en = _manglik_en(severity, tone, style)
        hi = _manglik_hi(severity, tone, style)

    elif name == "Kalsarpa":
        en = _kalsarpa_en(severity, tone, style)
        hi = _kalsarpa_hi(severity, tone, style)

    elif name == "Pitra":
        en = _pitra_en(severity, tone, style)
        hi = _pitra_hi(severity, tone, style)

    elif name == "SadeSati":
        en = _sadesati_en(dosha.get("phase", ""), style)
        hi = _sadesati_hi(dosha.get("phase", ""), style)

    else:
        en = hi = "Explanation unavailable."

    return {
        "title": f"{name} Dosha",
        "en": en,
        "hi": hi,
        "severity_note": f"Severity: {severity}",
        "confidence": confidence_score(severity)
    }


# -------------------------------
# Manglik
# -------------------------------
def _manglik_en(sev, tone, style):
    base = {
        "soft": "Mars influences relationships but does not indicate harm.",
        "balanced": "Mars creates emotional intensity and marital delays.",
        "serious": "Strong Mars influence may cause conflicts if ignored."
    }[tone]

    if style == "premium":
        base += (
            " This dosha primarily affects marriage timing, compatibility, "
            "and emotional balance. Proper matching and remedies neutralize its impact."
        )
    return base


def _manglik_hi(sev, tone, style):
    base = {
        "soft": "मंगल का प्रभाव संबंधों में ऊर्जा देता है।",
        "balanced": "मंगल विवाह में विलंब और मानसिक तनाव ला सकता है।",
        "serious": "प्रबल मंगल दोष विवाह में बाधा उत्पन्न कर सकता है।"
    }[tone]

    if style == "premium":
        base += (
            " यह दोष विवाह के समय, सामंजस्य और मानसिक संतुलन को प्रभावित करता है। "
            "उचित उपायों से प्रभाव समाप्त हो जाता है।"
        )
    return base


# -------------------------------
# Kalsarpa
# -------------------------------
def _kalsarpa_en(sev, tone, style):
    base = {
        "soft": "Rahu-Ketu axis creates some life challenges but is manageable.",
        "balanced": "Kalsarpa yoga may cause delays and obstacles in career and health.",
        "severe": "Full Kalsarpa yoga can create significant hurdles in all life areas."
    }[tone]

    if style == "premium":
        base += (
            " This dosha affects overall life flow, career growth, and mental peace. "
            "Remedies help restore balance and remove blockages."
        )
    return base


def _kalsarpa_hi(sev, tone, style):
    base = {
        "soft": "राहु-केतु अक्ष जीवन में कुछ चुनौतियां देता है।",
        "balanced": "कालसर्प योग करियर और स्वास्थ्य में विलंब ला सकता है।",
        "severe": "पूर्ण कालसर्प योग जीवन के सभी क्षेत्रों में बड़ी बाधाएं उत्पन्न कर सकता है।"
    }[tone]

    if style == "premium":
        base += (
            " यह योग जीवन प्रवाह, करियर और मानसिक शांति को प्रभावित करता है। "
            "उपायों से रुकावटें दूर होती हैं।"
        )
    return base


# -------------------------------
# Pitra
# -------------------------------
def _pitra_en(sev, tone, style):
    base = {
        "soft": "Ancestral energy is supportive with minor challenges.",
        "balanced": "Pitra dosha may cause instability in career and health.",
        "severe": "Strong Pitra dosha can create significant obstacles and unrest."
    }[tone]

    if style == "premium":
        base += (
            " This dosha reflects ancestral blessings and unresolved issues. "
            "Respectful rituals bring peace and prosperity."
        )
    return base


def _pitra_hi(sev, tone, style):
    base = {
        "soft": "पितृ ऊर्जा सहायक है, चुनौतियां मामूली हैं।",
        "balanced": "पितृ दोष करियर और स्वास्थ्य में अस्थिरता ला सकता है।",
        "severe": "प्रबल पितृ दोष जीवन में बड़ी बाधाएं और अशांति दे सकता है।"
    }[tone]

    if style == "premium":
        base += (
            " यह दोष पूर्वजों के आशीर्वाद और अनसुलझे मुद्दों को दर्शाता है। "
            "श्रद्धापूर्ण उपाय शांति और समृद्धि लाते हैं।"
        )
    return base


# -------------------------------
# SadeSati
# -------------------------------
def _sadesati_en(phase, style):
    if phase == "early":
        base = "Early SadeSati brings mental pressure and lifestyle changes."
    elif phase == "middle":
        base = "Middle SadeSati tests patience and creates significant challenges."
    else:
        base = "Late SadeSati brings final results and life adjustments."

    if style == "premium":
        base += (
            " This transit affects emotional stability, career, and relationships. "
            "Acceptance and timely remedies ease the journey."
        )
    return base


def _sadesati_hi(phase, style):
    if phase == "early":
        base = "प्रारंभिक साढ़ेसाती मानसिक दबाव और जीवनशैली में बदलाव लाती है।"
    elif phase == "middle":
        base = "मध्य साढ़ेसाती धैर्य की परीक्षा लेती है और बड़ी चुनौतियां देती है।"
    else:
        base = "अंतिम साढ़ेसाती अंतिम परिणाम और जीवन समायोजन लाती है।"

    if style == "premium":
        base += (
            " यह गोचर भावनात्मक स्थिरता, करियर और रिश्तों को प्रभावित करता है। "
            "स्वीकार्यता और समय पर उपाय यात्रा को आसान बनाते हैं।"
        )
    return base
