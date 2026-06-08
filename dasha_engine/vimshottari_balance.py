from dasha_engine.mahadasha import VIMSHOTTARI_SEQUENCE


NAKSHATRA_LORDS = {
    "Ashwini": "Ketu",
    "Bharani": "Venus",
    "Krittika": "Sun",
    "Rohini": "Moon"
}


class VimshottariBalanceCalculator:

    def calculate_balance(
        self,
        moon_longitude,
        nakshatra,
        planet_years
    ):

        nak_length = 13.3333333333

        traversed = moon_longitude % nak_length

        remaining = nak_length - traversed

        balance_ratio = remaining / nak_length

        remaining_years = balance_ratio * planet_years

        return round(remaining_years, 2)
