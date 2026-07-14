import math
import datetime
import swisseph as swe

class SanghattaEngine:
    def __init__(self):
        self.nakshatras_28 = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
            "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
            "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
            "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", 
            "Abhijit", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
            "Uttara Bhadrapada", "Revati"
        ]

    def get_current_transits(self):
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
            pos, _ = swe.calc_ut(jd, p_id, swe.FLG_SIDEREAL)
            res[name] = pos[0]
            
        res["Ketu"] = (res["Rahu"] + 180.0) % 360.0
        return res

    def get_28_nakshatra(self, longitude):
        """
        Calculates the 28-Nakshatra system which includes Abhijit.
        Normal Nakshatra length is 13°20' (13.3333°).
        Abhijit starts at 276°40' and ends at 280°53'20".
        """
        if 266.6667 <= longitude < 276.6667:
            return "Uttara Ashadha"
        elif 276.6667 <= longitude < 280.8889:
            return "Abhijit"
        elif 280.8889 <= longitude < 293.3333:
            return "Shravana"
        elif longitude >= 293.3333:
            # Adjust for the shift caused by Abhijit
            idx = 23 + int((longitude - 293.3333) / 13.3333)
            idx = min(idx, 27) # Cap at Revati
            return self.nakshatras_28[idx]
        else:
            idx = int(longitude / 13.3333)
            return self.nakshatras_28[idx]

    def get_nakshatra_index(self, name):
        return self.nakshatras_28.index(name)

    def calculate_sanghatta(self, transit_planets=None):
        if not transit_planets:
            transit_planets = self.get_current_transits()

        malefics = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]
        benefics = ["Moon", "Mercury", "Jupiter", "Venus"]

        planet_nakshatras = []
        for p, lon in transit_planets.items():
            nak = self.get_28_nakshatra(lon)
            planet_nakshatras.append({
                "planet": p,
                "longitude": lon,
                "nakshatra": nak,
                "nakshatra_index": self.get_nakshatra_index(nak) + 1,
                "is_malefic": p in malefics
            })

        # Calculate Vedha (Affliction)
        # In the classical Sanghatta layout, certain geometric pairs cause Vedha.
        # A simple symmetrical pairing logic (e.g., 1 & 28, 2 & 27) creates the vertical/horizontal piercing.
        vedhas = []
        for p1 in planet_nakshatras:
            if p1["is_malefic"]:
                # Affliction affects the mirror nakshatra (29 - index)
                mirror_idx = 29 - p1["nakshatra_index"]
                mirror_name = self.nakshatras_28[mirror_idx - 1]
                
                # Check if any planet is in the mirror nakshatra
                affected_planets = [p["planet"] for p in planet_nakshatras if p["nakshatra_index"] == mirror_idx]
                
                vedhas.append({
                    "source_planet": p1["planet"],
                    "source_nakshatra": p1["nakshatra"],
                    "target_nakshatra": mirror_name,
                    "affected_planets": affected_planets
                })

        # Generate Market Risk Assessment
        risk_level = "LOW"
        risk_score = 0
        market_analysis = []

        if any(v["source_planet"] in ["Saturn", "Mars"] for v in vedhas):
            risk_score += 40
            market_analysis.append("Heavy malefic Vedha detected from Saturn/Mars. Suggests sharp volatility or decline in affected commodity sectors.")
            
        if any(len(v["affected_planets"]) > 0 for v in vedhas):
            risk_score += 30
            market_analysis.append("Direct planetary collision along Sanghatta axes. Expect sudden shifts in market indices.")
            
        if any(v["target_nakshatra"] in ["Krittika", "Rohini", "Mrigashira"] for v in vedhas):
            risk_score += 20
            market_analysis.append("Agriculture and precious metals (gold) under stress.")
            
        if any(v["target_nakshatra"] in ["Anuradha", "Jyeshtha", "Mula"] for v in vedhas):
            risk_score += 20
            market_analysis.append("Financial institutions, banking, and treasury reserves face potential crisis.")

        if risk_score > 60:
            risk_level = "HIGH"
        elif risk_score > 30:
            risk_level = "MODERATE"
            
        if len(market_analysis) == 0:
            market_analysis.append("Markets remain relatively stable with no critical geometric afflictions detected.")

        return {
            "planet_positions": planet_nakshatras,
            "vedhas": vedhas,
            "risk_assessment": {
                "level": risk_level,
                "score": risk_score,
                "analysis": market_analysis
            }
        }
