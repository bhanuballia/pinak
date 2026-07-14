import math

class AyurdayaEngine:
    """
    Advanced Longevity Calculations (Ayurdaya).
    Calculates Pindayu (Sri Pati method), Nisargayu, and Jaimini Three-Pair method.
    """
    
    # Maximum years granted by planets in Pindayu when exactly exalted.
    PINDAYU_MAX_YEARS = {
        "Sun": 19, "Moon": 25, "Mars": 15, "Mercury": 12,
        "Jupiter": 15, "Venus": 21, "Saturn": 20
    }
    
    # Deep exaltation points (in absolute degrees from 0 Aries)
    EXALTATION_DEGREES = {
        "Sun": 10, "Moon": 33, "Mars": 298, "Mercury": 165,
        "Jupiter": 95, "Venus": 357, "Saturn": 200
    }

    # Natural years (Nisargayu)
    NISARGAYU_MAX_YEARS = {
        "Moon": 1, "Mars": 2, "Mercury": 9, "Venus": 20,
        "Jupiter": 18, "Sun": 20, "Saturn": 50
    }

    SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    
    MOVEABLE = ["Aries", "Cancer", "Libra", "Capricorn"]
    FIXED = ["Taurus", "Leo", "Scorpio", "Aquarius"]
    DUAL = ["Gemini", "Virgo", "Sagittarius", "Pisces"]

    PRIMARY_LORDS = {
        "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
        "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
        "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
    }

    def __init__(self, chart):
        self.chart = chart

    def get_planet_sign(self, planet_name):
        for h, data in self.chart.get("houses", {}).items():
            for p in data.get("planets", []):
                if p["name"] == planet_name:
                    return data["sign_name"]
        return "Aries"

    def get_lagna_sign(self):
        return self.chart.get("houses", {}).get(1, {}).get("sign_name", "Aries")

    def get_8th_house_sign(self):
        return self.chart.get("houses", {}).get(8, {}).get("sign_name", "Scorpio")

    def _get_abs_degree(self, planet_name):
        # Fallback to center of sign if exact longitude is not provided in chart data
        sign_name = self.get_planet_sign(planet_name)
        idx = self.SIGNS.index(sign_name)
        return (idx * 30) + 15

    def calculate_pindayu(self):
        """
        Calculates Pindayu using Sri Pati approximation.
        Years = Max_Years * (Distance from Debilitation) / 180
        """
        results = {}
        total_years = 0
        
        for planet, max_years in self.PINDAYU_MAX_YEARS.items():
            abs_deg = self._get_abs_degree(planet)
            exalt_deg = self.EXALTATION_DEGREES[planet]
            debilit_deg = (exalt_deg + 180) % 360
            
            # Distance from debilitation
            dist = abs_deg - debilit_deg
            if dist < 0:
                dist += 360
            if dist > 180:
                dist = 360 - dist
                
            granted_years = max_years * (dist / 180.0)
            
            results[planet] = round(granted_years, 2)
            total_years += granted_years
            
        return {
            "planet_contributions": results,
            "total_pindayu_years": round(total_years, 2),
            "vitality_score": min(100, int((total_years / 127.0) * 100))
        }

    def calculate_nisargayu(self):
        """
        Calculates Nisargayu (Natural Lifespan).
        In a full implementation, these max years are reduced by malefic aspects.
        We will return a proportional vitality metric.
        """
        return {
            "total_nisargayu_years": 120, # Theoretical max
            "vitality_score": 85 # Placeholder for standard health baseline
        }

    def _get_jaimini_category(self, sign1, sign2):
        s1_type = "Moveable" if sign1 in self.MOVEABLE else "Fixed" if sign1 in self.FIXED else "Dual"
        s2_type = "Moveable" if sign2 in self.MOVEABLE else "Fixed" if sign2 in self.FIXED else "Dual"
        
        pairs = {s1_type, s2_type}
        
        if pairs == {"Moveable"}: return "Long"
        if pairs == {"Fixed"}: return "Short"
        if pairs == {"Dual"}: return "Medium"
        if pairs == {"Moveable", "Fixed"}: return "Medium"
        if pairs == {"Moveable", "Dual"}: return "Short"
        if pairs == {"Fixed", "Dual"}: return "Long"
        
        return "Medium"

    def calculate_jaimini_pairs(self):
        """
        Jaimini Three-Pair Method.
        1. Lagna & Hora Lagna (Approximated if not provided)
        2. Lagna Lord & 8th Lord
        3. Moon & Saturn
        """
        lagna = self.get_lagna_lagna_lord = self.PRIMARY_LORDS[self.get_lagna_sign()]
        lagna_sign = self.get_lagna_sign()
        
        lagna_lord = self.PRIMARY_LORDS[lagna_sign]
        lord_8th = self.PRIMARY_LORDS[self.get_8th_house_sign()]
        
        ll_sign = self.get_planet_sign(lagna_lord)
        l8_sign = self.get_planet_sign(lord_8th)
        
        moon_sign = self.get_planet_sign("Moon")
        saturn_sign = self.get_planet_sign("Saturn")
        
        # We will assume Hora Lagna is in the 2nd house for this approximation
        hl_sign = self.SIGNS[(self.SIGNS.index(lagna_sign) + 1) % 12]
        
        pair_1 = self._get_jaimini_category(lagna_sign, hl_sign)
        pair_2 = self._get_jaimini_category(ll_sign, l8_sign)
        pair_3 = self._get_jaimini_category(moon_sign, saturn_sign)
        
        # Determine final (majority wins)
        categories = [pair_1, pair_2, pair_3]
        counts = {c: categories.count(c) for c in set(categories)}
        final = max(counts, key=counts.get)
        
        return {
            "lagna_and_hora": pair_1,
            "lords_1_and_8": pair_2,
            "moon_and_saturn": pair_3,
            "final_consensus": final
        }

    def generate_report(self):
        pindayu = self.calculate_pindayu()
        nisargayu = self.calculate_nisargayu()
        jaimini = self.calculate_jaimini_pairs()
        
        # Calculate a composite vitality score (0-100)
        # Weight Pindayu heavily, add bonus for Jaimini "Long"
        base_score = pindayu["vitality_score"]
        if jaimini["final_consensus"] == "Long":
            base_score += 15
        elif jaimini["final_consensus"] == "Short":
            base_score -= 15
            
        composite = min(100, max(10, base_score))
        
        # Ethical abstraction
        vitality_band = "Medium"
        if composite > 75: vitality_band = "High"
        elif composite < 40: vitality_band = "Low"
        
        return {
            "pindayu": pindayu,
            "nisargayu": nisargayu,
            "jaimini_pairs": jaimini,
            "composite_score": composite,
            "vitality_band": vitality_band
        }
