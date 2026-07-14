# astrology/planets.py

def get_planet_sign(longitude):
    return int(longitude / 30)

def get_planet_degree(longitude):
    return longitude % 30
