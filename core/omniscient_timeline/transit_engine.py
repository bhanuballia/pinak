def get_major_transits(year, chart):

    # SIMPLE deterministic logic (expand later)
    transits = []

    if year % 12 == 0:
        transits.append("jupiter_return")

    if year % 30 == 0:
        transits.append("saturn_return")

    return transits
