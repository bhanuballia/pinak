from core.astrology.divisional.base.constants import (
    SIGNS,
    ODD_SIGNS
)

from core.astrology.divisional.base.helpers import (
    normalize_longitude,
    sign_index,
    degree_in_sign,
    safe_division_part
)

from core.astrology.divisional.base.varga_result import (
    build_varga_result
)


class D10Iyer:
    """
    Professional Dashamsha Calculator
    based on Seshadri Iyer style
    Parashari Dashamsha rules.
    """

    DIVISION = 10
    PART_SIZE = 3.0

    def calculate(
        self,
        longitude: float
    ) -> dict:
        longitude = normalize_longitude(
            longitude
        )

        natal_sign = sign_index(
            longitude
        )

        deg = degree_in_sign(
            longitude
        )

        division_part = safe_division_part(
            deg,
            self.PART_SIZE,
            self.DIVISION
        )

        # ODD signs: start from same sign
        if natal_sign in ODD_SIGNS:
            start_sign = natal_sign
        # EVEN signs: start from 9th sign (Sign + 8)
        else:
            start_sign = (
                natal_sign + 8
            ) % 12

        final_sign = (
            start_sign +
            division_part
        ) % 12

        # Dasamsa Deities (10 Digpalas)
        deities = [
            "Indra", "Agni", "Yama", "Rakshasa", "Varuna",
            "Vayu", "Kubera", "Ishana", "Brahma", "Ananta"
        ]
        deity = deities[division_part - 1]

        degree_inside = min(
            (deg % self.PART_SIZE) * self.DIVISION,
            29.999999
        )

        res = build_varga_result(
            final_sign,
            SIGNS[final_sign],
            division_part,
            degree_inside
        )
        res["deity"] = deity
        return res

    def calculate_house(
        self,
        asc_sign: int,
        planet_sign: int
    ) -> int:
        return (
            (
                planet_sign -
                asc_sign
            ) % 12
        ) + 1
