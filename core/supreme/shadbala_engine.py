def compute_shadbala(chart):

    planets = chart.get("planet_positions", {})
    result = {}

    for name, p in planets.items():

        house = p.get("house", 1)  # Default to house 1 if missing

        # Simple realistic weight model
        strength = 1.0

        if house in [1, 5, 9]:
            strength += 0.3

        if house in [6, 8, 12]:
            strength -= 0.2

        result[name] = round(strength, 2)

    return result
