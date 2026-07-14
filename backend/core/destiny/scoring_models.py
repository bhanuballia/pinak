def domain_multiplier(domain):

    weights = {
        "career": 1.15,
        "finance": 1.10,
        "relationship": 1.05,
        "health": 0.95,
        "spiritual": 1.20,
    }

    return weights.get(domain,1.0)
