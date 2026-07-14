# core/predictions/transit_engine.py

def jupiter_transit_effect(year, chart):

    if year % 2 == 0:
        return "Jupiter brings expansion, learning and positive growth."
    else:
        return "Jupiter encourages internal wisdom and planning."


def saturn_transit_effect(year, chart):

    if year % 3 == 0:
        return "Saturn demands discipline and responsibility."
    else:
        return "Steady progress through patience."
