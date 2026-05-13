def gaja_kesari(chart):
    # Retrieve enriched planet objects directly from the chart
    moon_data = chart.get("Moon", {})
    jupiter_data = chart.get("Jupiter", {})
    
    if not moon_data or not jupiter_data:
        return False

    moon_house = moon_data.get("house")
    jupiter_house = jupiter_data.get("house")

    if moon_house is None or jupiter_house is None:
        return False

    # Standard Gaja Kesari: Jupiter in Kendra from Moon (1, 4, 7, 10 houses)
    # This corresponds to mathematical differences of 0, 3, 6, 9
    diff = abs(moon_house - jupiter_house)
    return diff in [0, 3, 6, 9]