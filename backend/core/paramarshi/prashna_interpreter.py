
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

import random

def prashna_handler(question, report_data):
    brahma = report_data.get("brahma", {})
    dosha = report_data.get("dosha", {})
    strength = report_data.get("strength", {})
    
    seed = sum(ord(c) for c in question)
    random.seed(seed)

    response = {}
    q_low = question.lower()

    # 1. Prediction Tier
    if "career" in q_low or "job" in q_low:
        options = [
            brahma.get("profession_prediction", "A phase of professional evolution is indicated."),
            "Your chart suggests significant movements in your career sector.",
            f"The current dasha lord favors your professional legacy."
        ]
        response["prediction"] = random.choice(options)
    elif "marriage" in q_low or "relationship" in q_low:
        options = [
            "Union and relational harmony are highlighted by the planetary grid.",
            "Relationships evolve as you balance your inner lunar energies.",
            "Stability in bonds is indicated for this particular phase."
        ]
        response["prediction"] = random.choice(options)
    else:
        options = [
            "A period of steady, progressive growth is outlined in your charts.",
            "The cosmic alignment favors deep personal transformation.",
            "Harmonious energies surround your primary life activities right now."
        ]
        response["prediction"] = random.choice(options)

    # 2. Warning Tier (Dosha influence)
    warnings = []
    if dosha.get("kalsarp", {}).get("present"):
        warnings.append("Progress may feel delayed due to circular karmic patterns.")
    if dosha.get("pitra", {}).get("present"):
        warnings.append("Ancestral patterns require your mindful attention through charitable acts.")
    if dosha.get("manglik", {}).get("present"):
        warnings.append("Martian intensity suggests staying calm during interpersonal friction.")
        
    if warnings:
        response["warning"] = random.choice(warnings)

    # 3. Contextual Summary (Connective tissue)
    summaries = [
        "Focus on the long-term vision rather than immediate fluctuations.",
        "Your current dasha cycle supports the realization of these trends.",
        "Small adjustments in your daily rhythm will amplify these results.",
        "The universe rewards persistence aligned with your dharma."
    ]
    response["summary"] = random.choice(summaries)

    response["confidence"] = int(sum(([p.get('total_score', 60) for p in _get_strength(strength, 'planets', {}).values()] if isinstance(strength, dict) and 'planets' in strength else [v for v in strength.values() if isinstance(v, (int, float))]) if strength else []) * 10)

    return response
