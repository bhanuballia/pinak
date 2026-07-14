# ashtakavarga/kakshya_engine.py
# Kakshya (micro-division) engine for sub-sign transit activation.
# Each sign is divided into 8 Kakshyas of 3.75° each, ruled by planets in order.

KAKSHYA_LORDS = [
    "Saturn",
    "Jupiter",
    "Mars",
    "Sun",
    "Venus",
    "Mercury",
    "Moon",
    "Lagna"
]


class KakshyaEngine:

    def get_kakshya(self, degree):
        """
        Determine which Kakshya a degree falls in within a sign.

        Args:
            degree (float): degrees within the sign (0.0 to 29.99)

        Returns:
            str: the lord of the Kakshya
        """
        segment = int(degree / 3.75)
        segment = min(segment, 7)  # Safety clamp to 0-7
        return KAKSHYA_LORDS[segment]
