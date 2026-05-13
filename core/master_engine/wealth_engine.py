def wealth_periods(chart, dasha):

    wealth_houses = [2,5,9,11]

    results = []

    for period in dasha["list"]:

        lord = period["lord"]

        house = chart[lord]["house"]

        if house in wealth_houses:

            results.append({
                "period": period,
                "effect": "financial growth"
            })

    return results