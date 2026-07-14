from dasha_engine.mahadasha import VIMSHOTTARI_SEQUENCE


class SukshmaEngine:

    def generate(self, pratyantar_months):

        result = []

        total_cycle = 120

        for planet, years in VIMSHOTTARI_SEQUENCE:

            duration_days = ((pratyantar_months / 12) * years / total_cycle) * 365

            result.append({
                "planet": planet,
                "duration_days": round(duration_days, 2)
            })

        return result
