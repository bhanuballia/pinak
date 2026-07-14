def finance_window(lord, strength):

    if lord in ["Jupiter", "Mercury"]:
        return {
            "type": "wealth_cycle",
            "message": "Favorable period for finance and investments."
        }

    return None
