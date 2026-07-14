# nakshatra/nakshatra_engine.py

from nakshatra.constants import (
    NAKSHATRAS,
    NAKSHATRA_SIZE
)

from nakshatra.pada_calculator import (
    calculate_pada
)

from nakshatra.nakshatra_lords import (
    get_nakshatra_lord
)


class NakshatraEngine:

    def calculate(self, longitude: float):

        longitude = longitude % 360.0

        nak_index = int(
            longitude / NAKSHATRA_SIZE
        )

        nak_name = NAKSHATRAS[nak_index]

        deg_in_nak = (
            longitude % NAKSHATRA_SIZE
        )

        pada = calculate_pada(
            deg_in_nak
        )

        lord = get_nakshatra_lord(
            nak_index
        )

        return {

            "nakshatra_index": nak_index + 1,
            "nakshatra": nak_name,
            "lord": lord,
            "pada": pada,
            "degrees_inside": round(
                deg_in_nak,
                4
            )
        }
