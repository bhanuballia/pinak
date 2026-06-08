from dasha_engine.mahadasha import VIMSHOTTARI_SEQUENCE


class AntardashaEngine:

    def generate(self, mahadasha_planet, mahadasha_years):

        antardashas = []

        total_cycle = 120

        for planet, years in VIMSHOTTARI_SEQUENCE:

            duration = (mahadasha_years * years) / total_cycle

            antardashas.append({
                "planet": planet,
                "duration_years": round(duration, 2)
            })

        return antardashas
