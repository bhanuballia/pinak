import math
import datetime
import swisseph as swe

class KurmaEngine:
    """
    Calculates the Kurma Chakra (Tortoise Chakra) used in Mundane Astrology.
    Maps the 27 Nakshatras onto the 9 regions of the tortoise.
    """

    NAKSHATRAS_27 = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
        "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
        "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
        "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
        "Uttara Bhadrapada", "Revati"
    ]

    KURMA_MAPPING = {
        "Central (Belly)": ["Krittika", "Rohini", "Mrigashira"],
        "East (Face)": ["Ardra", "Punarvasu", "Pushya"],
        "South-East (Right Front Leg)": ["Ashlesha", "Magha", "Purva Phalguni"],
        "South (Right Side)": ["Uttara Phalguni", "Hasta", "Chitra"],
        "South-West (Right Hind Leg)": ["Swati", "Vishakha", "Anuradha"],
        "West (Tail)": ["Jyeshtha", "Mula", "Purva Ashadha"],
        "North-West (Left Hind Leg)": ["Uttara Ashadha", "Shravana", "Dhanishta"],
        "North (Left Side)": ["Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada"],
        "North-East (Left Front Leg)": ["Revati", "Ashwini", "Bharani"]
    }

    def __init__(self):
        pass

    def get_nakshatra_from_lon(self, lon):
        idx = int((lon % 360) / (360 / 27))
        return self.NAKSHATRAS_27[idx]

    def get_region_for_nakshatra(self, nakshatra_name):
        for region, nakshatras in self.KURMA_MAPPING.items():
            if nakshatra_name in nakshatras:
                return region
        return "Unknown"

    def get_current_transit_planets(self):
        now = datetime.datetime.utcnow()
        jd = swe.julday(now.year, now.month, now.day, now.hour + now.minute/60.0)
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        
        planets = {
            "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS,
            "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER, 
            "Venus": swe.VENUS, "Saturn": swe.SATURN,
            "Rahu": swe.MEAN_NODE
        }
        
        res = {}
        for name, p_id in planets.items():
            pos, ret = swe.calc_ut(jd, p_id, swe.FLG_SIDEREAL)
            res[name] = pos[0]
            
        res["Ketu"] = (res["Rahu"] + 180.0) % 360.0
        return res

    def calculate_kurma_chakra(self, transit_planets=None):
        """
        transit_planets: dict of planet_name -> longitude. If None, calculates current real-time transits.
        Returns regions with planets in them and vulnerability score.
        """
        if not transit_planets:
            transit_planets = self.get_current_transit_planets()

        malefics = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]
        benefics = ["Moon", "Mercury", "Jupiter", "Venus"]

        results = []
        region_scores = {region: 0 for region in self.KURMA_MAPPING.keys()}

        for planet, lon in transit_planets.items():
            nak = self.get_nakshatra_from_lon(lon)
            region = self.get_region_for_nakshatra(nak)
            
            impact = "Neutral"
            if planet in malefics:
                impact = "Negative (Malefic Stress)"
                region_scores[region] -= 1
            elif planet in benefics:
                impact = "Positive (Benefic Protection)"
                region_scores[region] += 1

            results.append({
                "planet": planet,
                "nakshatra": nak,
                "region": region,
                "impact": impact
            })
            
        return {
            "planet_positions": results,
            "region_scores": region_scores,
            "mapping": self.KURMA_MAPPING
        }
