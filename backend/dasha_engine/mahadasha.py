from datetime import datetime

VIMSHOTTARI_SEQUENCE = [
    ("Ketu", 7),
    ("Venus", 20),
    ("Sun", 6),
    ("Moon", 10),
    ("Mars", 7),
    ("Rahu", 18),
    ("Jupiter", 16),
    ("Saturn", 19),
    ("Mercury", 17)
]


class MahadashaEngine:

    def __init__(self, birth_date, moon_nakshatra_lord):
        self.birth_date = birth_date
        self.start_lord = moon_nakshatra_lord

    def generate(self, years=120):

        result = []

        start_index = 0

        for i, (planet, _) in enumerate(VIMSHOTTARI_SEQUENCE):
            if planet == self.start_lord:
                start_index = i
                break

        current_date = self.birth_date

        for i in range(len(VIMSHOTTARI_SEQUENCE)):

            idx = (start_index + i) % len(VIMSHOTTARI_SEQUENCE)

            planet, duration = VIMSHOTTARI_SEQUENCE[idx]

            start = current_date
            end_year = current_date.year + duration

            end = current_date.replace(year=end_year)

            result.append({
                "planet": planet,
                "duration_years": duration,
                "start": start,
                "end": end
            })

            current_date = end

        return result
