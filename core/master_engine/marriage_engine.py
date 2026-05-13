def predict_marriage(chart, dasha):

    results = []

    venus_house = chart["Venus"]["house"]
    seventh_lord = chart["house_lords"][7]

    for period in dasha["list"]:

        lord = period["lord"]

        if lord == seventh_lord or lord == "Venus":

            results.append({
                "period": period,
                "probability": 0.75
            })

    return results