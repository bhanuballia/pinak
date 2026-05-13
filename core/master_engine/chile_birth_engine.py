def child_birth_period(chart, dasha):

    fifth_lord = chart["house_lords"][5]

    periods = []

    for p in dasha["list"]:

        if p["lord"] == fifth_lord or p["lord"] == "Jupiter":

            periods.append(p)

    return periods