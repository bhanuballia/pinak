# core/astrology/divisional/base/helpers.py

def normalize_longitude(longitude):
    return longitude % 360.0


def sign_index(longitude):
    return int(longitude // 30.0)


def degree_in_sign(longitude):
    return longitude % 30.0


def safe_division_part(degree, part_size, total_parts):
    """
    Refinement 1: Float boundary safety
    Prevents 29.9999 from becoming the next sign's division.
    """
    return min(
        int(degree / part_size),
        total_parts - 1
    )


def safe_varga_degree(degree):
    """
    Refinement 2: Varga degree float safety.
    Prevents accidental 30° rendering glitches.
    """
    return min(degree, 29.999999)


def calculate_varga_house(asc_sign, planet_sign):
    """
    Refinement 3: Whole-sign house calculation.
    Essential for Gains, Elder Sibling, and general Varga analysis.
    """
    return ((planet_sign - asc_sign) % 12) + 1
