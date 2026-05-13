from core.master_engine.yoga_engine import detect_yogas
from core.master_engine.ashtakavarga_engine import compute_ashtakavarga
from core.master_engine.marriage_engine import predict_marriage
from core.master_engine.wealth_engine import wealth_periods
from core.master_engine.profession_engine import detect_profession
from core.master_engine.chile_birth_engine import child_birth_period

SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

def enrich_chart_for_master(chart):
    chart_enrich = dict(chart)
    chart_enrich["house_lords"] = {}
    
    planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    for p in planets:
        if p not in chart_enrich:
            chart_enrich[p] = {"house": 1, "sign": "Aries"}
        elif not isinstance(chart_enrich[p], dict):
            chart_enrich[p] = {"house": 1, "sign": "Aries"}
            
    for h, data in chart_enrich.get("houses", {}).items():
        sign_name = data.get("sign_name")
        if sign_name:
            chart_enrich["house_lords"][int(h)] = SIGN_LORDS.get(sign_name, "Mars")
        for p in data.get("planets", []):
            if p in planets:
                chart_enrich[p] = {"house": int(h), "sign": sign_name}
                
    # fallback for house_lords
    for i in range(1, 13):
        if i not in chart_enrich["house_lords"]:
            chart_enrich["house_lords"][i] = "Mars"
    return chart_enrich

def run_master_engine(chart, dasha):
    chart_enrich = enrich_chart_for_master(chart)

    results = {}

    results["yogas"] = detect_yogas(chart_enrich)
    results["ashtakavarga"] = compute_ashtakavarga(chart_enrich)
    results["marriage_prediction"] = predict_marriage(chart_enrich, dasha)
    results["wealth_periods"] = wealth_periods(chart_enrich, dasha)
    results["profession"] = detect_profession(chart_enrich)
    results["child_birth_periods"] = child_birth_period(chart_enrich, dasha)

    return results