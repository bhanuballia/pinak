# nakshatra/pada_calculator.py

from nakshatra.constants import (
    PADA_SIZE
)

def calculate_pada(
    degrees_inside_nakshatra: float
):

    return int(
        degrees_inside_nakshatra
        /
        PADA_SIZE
    ) + 1
