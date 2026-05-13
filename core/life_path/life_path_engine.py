from core.life_path.life_theme import detect_life_theme
from core.life_path.karma_signature import karma_signature
from core.life_path.destiny_score import destiny_score
from core.life_path.growth_cycles import detect_growth_cycles
from core.life_path.narrative_builder import build_life_narrative


def run_life_path_engine(report_data):

    chart = report_data.get("chart", {})
    dosha = report_data.get("dosha", {})
    strength = report_data.get("strength", {}) # Fixed key
    omni = report_data.get("omniscient_timeline", {}).get("omniscient_timeline", [])

    # 1️⃣ Life Theme
    theme = detect_life_theme(chart, strength)

    # 2️⃣ Karma Signature
    karma = karma_signature(dosha, strength)

    # 3️⃣ Destiny Curve
    curve = []
    for y in omni:
        curve.append({
            "year": y["year"],
            "score": destiny_score(y["year"], y)
        })

    # 4️⃣ Growth Peaks
    peaks = detect_growth_cycles(omni)

    # 5️⃣ Narrative
    narrative = build_life_narrative(theme, karma, peaks)

    return {
        "life_theme": theme,
        "karma_signature": karma,
        "destiny_curve": curve,
        "growth_peaks": peaks,
        "life_narrative": narrative
    }
