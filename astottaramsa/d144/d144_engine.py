# astottaramsa/d144/d144_engine.py

SIGNS = [
    "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius",
    "Capricorn", "Aquarius", "Pisces"
]


class D144Engine:

    DIVISIONS = 144
    DIVISION_SIZE = 30 / 144

    def calculate(
        self,
        sign_index,
        longitude_in_sign
    ):

        division = int(
            longitude_in_sign
            / self.DIVISION_SIZE
        )

        final_sign = (
            sign_index + division
        ) % 12

        return {
            "division": division + 1,
            "sign": SIGNS[final_sign]
        }
