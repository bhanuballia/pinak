# wheel_system/kaksha_engine.py

class KakshaEngine:

    KAKSHA_SIZE = 3.75

    KAKSHA_LORDS = [
        "Saturn",
        "Jupiter",
        "Mars",
        "Sun",
        "Venus",
        "Mercury",
        "Moon",
        "Asc"
    ]

    def get_kaksha(self, longitude):

        deg_in_sign = longitude % 30

        index = int(deg_in_sign / self.KAKSHA_SIZE)

        return {
            "kaksha_number": index + 1,
            "lord": self.KAKSHA_LORDS[index]
        }
