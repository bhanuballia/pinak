# shadbala/shadbala_ratio.py

REQUIRED_STRENGTHS = {
    "Sun": 390,
    "Moon": 360,
    "Mars": 300,
    "Mercury": 420,
    "Jupiter": 390,
    "Venus": 330,
    "Saturn": 300
}

def calculate_ratio(planet, actual_strength):
    required = REQUIRED_STRENGTHS.get(planet, 300)
    ratio = actual_strength / required
    return {
        "actual": actual_strength,
        "required": required,
        "ratio": round(ratio, 2),
        "percent": round(ratio * 100, 1)
    }
