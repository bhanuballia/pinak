# astottaramsa/d108_engine.py

SIGNS = [
    "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius",
    "Capricorn", "Aquarius", "Pisces"
]


class D108Engine:

    DIVISIONS = 108
    DIVISION_SIZE = 30 / 108

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
