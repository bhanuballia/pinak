def health_risk(dosha):

    if dosha.get("sadesati", {}).get("present"):
        return {
            "type": "health_caution",
            "message": "Energy levels may fluctuate — maintain balance."
        }

    return None
