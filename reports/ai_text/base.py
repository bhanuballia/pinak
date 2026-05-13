def tone_by_severity(severity: str) -> str:
    return {
        "mild": "soft",
        "moderate": "balanced",
        "severe": "serious",
    }.get(severity, "balanced")


def confidence_score(severity: str) -> float:
    return {
        "mild": 0.75,
        "moderate": 0.88,
        "severe": 0.95,
    }.get(severity, 0.80)
