# panch_pakshi/timing_alerts.py

def generate_alert(activity: str):

    if activity == "Ruling":
        return "Excellent time for important activities."

    if activity == "Eating":
        return "Good financial and business activity period."

    if activity == "Walking":
        return "Good for travel and movement."

    if activity == "Sleeping":
        return "Avoid major decisions."

    if activity == "Dying":
        return "Dangerous timing window."

    return ""
