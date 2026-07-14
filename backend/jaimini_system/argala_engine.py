# jaimini_system/argala_engine.py

class ArgalaEngine:
    SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

    def __init__(self, chart):
        self.chart = chart

    def get_sign_index(self, sign_name):
        return self.SIGNS.index(sign_name)

    def get_planets_in_sign(self, sign_name):
        for h, data in self.chart.get("houses", {}).items():
            if data["sign_name"] == sign_name:
                return [p["name"] for p in data.get("planets", [])]
        return []

    def calculate_argala(self, target_sign):
        """
        Calculates Argala (Intervention) and Virodha Argala (Obstruction)
        for a given target sign.
        """
        target_idx = self.get_sign_index(target_sign)
        
        # Helper to get planets in the Nth house from target (1-indexed)
        def get_planets_nth(n):
            sign_name = self.SIGNS[(target_idx + n - 1) % 12]
            return self.get_planets_in_sign(sign_name)

        argalas = {
            "primary": {
                "2nd": {"argala": get_planets_nth(2), "virodha": get_planets_nth(12)},
                "4th": {"argala": get_planets_nth(4), "virodha": get_planets_nth(10)},
                "11th": {"argala": get_planets_nth(11), "virodha": get_planets_nth(3)}
            },
            "secondary": {
                "5th": {"argala": get_planets_nth(5), "virodha": get_planets_nth(9)}
            }
        }

        # Determine effective argala (basic strength check: number of planets)
        def evaluate_effective(arg_list, vir_list):
            if len(arg_list) > len(vir_list):
                return arg_list
            elif len(vir_list) > len(arg_list):
                return [] # Obstructed completely
            elif len(arg_list) > 0 and len(arg_list) == len(vir_list):
                return arg_list # Tie goes to the Argala usually, or needs deeper strength check
            return []

        effective_argalas = []
        for pair in [("2nd", argalas["primary"]["2nd"]), ("4th", argalas["primary"]["4th"]), ("11th", argalas["primary"]["11th"])]:
            eff = evaluate_effective(pair[1]["argala"], pair[1]["virodha"])
            if eff:
                effective_argalas.extend(eff)
                
        eff_5 = evaluate_effective(argalas["secondary"]["5th"]["argala"], argalas["secondary"]["5th"]["virodha"])
        if eff_5:
            effective_argalas.extend(eff_5)

        return {
            "target": target_sign,
            "details": argalas,
            "effective_argala_planets": list(set(effective_argalas))
        }
