from dasha_engine.mahadasha import VIMSHOTTARI_SEQUENCE


class PratyantarEngine:

    def generate(self, antardasha_years):

        result = []

        total_cycle = 120

        for planet, years in VIMSHOTTARI_SEQUENCE:

            duration = (antardasha_years * years) / total_cycle

            result.append({
                "planet": planet,
                "duration_months": round(duration * 12, 2)
            })

        return result
