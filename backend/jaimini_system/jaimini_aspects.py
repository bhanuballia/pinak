# jaimini_system/jaimini_aspects.py

class JaiminiAspects:
    SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    
    MOVEABLE = ["Aries", "Cancer", "Libra", "Capricorn"]
    FIXED = ["Taurus", "Leo", "Scorpio", "Aquarius"]
    DUAL = ["Gemini", "Virgo", "Sagittarius", "Pisces"]

    def __init__(self, chart):
        self.chart = chart
        
    def get_aspecting_signs(self, sign_name):
        """Returns a list of signs that the given sign aspects."""
        if sign_name in self.MOVEABLE:
            # Aspects all FIXED except adjacent
            idx = self.SIGNS.index(sign_name)
            adjacent = self.SIGNS[(idx + 1) % 12]
            return [s for s in self.FIXED if s != adjacent]
            
        elif sign_name in self.FIXED:
            # Aspects all MOVEABLE except adjacent
            idx = self.SIGNS.index(sign_name)
            adjacent = self.SIGNS[(idx - 1) % 12]
            return [s for s in self.MOVEABLE if s != adjacent]
            
        elif sign_name in self.DUAL:
            # Aspects all other DUAL signs
            return [s for s in self.DUAL if s != sign_name]
            
        return []

    def get_planets_in_sign(self, sign_name):
        for h, data in self.chart.get("houses", {}).items():
            if data["sign_name"] == sign_name:
                return data.get("planets", [])
        return []

    def get_aspecting_planets(self, target_sign_name):
        """Returns a list of planets aspecting the target sign via Rashi Drishti."""
        aspecting_planets = []
        for sign in self.SIGNS:
            if target_sign_name in self.get_aspecting_signs(sign):
                planets = self.get_planets_in_sign(sign)
                aspecting_planets.extend([p["name"] for p in planets])
        return aspecting_planets
