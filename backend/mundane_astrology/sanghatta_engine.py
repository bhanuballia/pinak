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
        risk_score = 0
        market_analysis = []

        # 1. Inspect Malefic Vedha Severity
        saturn_mars_vedhas = [v for v in vedhas if v["source_planet"] in ["Saturn", "Mars"]]
        rahu_ketu_vedhas = [v for v in vedhas if v["source_planet"] in ["Rahu", "Ketu"]]

        if saturn_mars_vedhas:
            risk_score += 40
            planets_str = ", ".join(list(set(v["source_planet"] for v in saturn_mars_vedhas)))
            market_analysis.append(f"Heavy malefic Vedha active from {planets_str}. Indicates sharp market volatility and selling pressure in core equity sectors.")
            
        if rahu_ketu_vedhas:
            risk_score += 25
            market_analysis.append("Node-driven Sanghatta rays detected (Rahu/Ketu). Expect sudden speculative market swings and unannounced news triggers.")

        # 2. Inspect Direct Collisions with Natal / Transit Planets
        direct_collisions = [v for v in vedhas if len(v["affected_planets"]) > 0]
        if direct_collisions:
            risk_score += 30
            hit_planets = list(set([p for v in direct_collisions for p in v["affected_planets"]]))
            market_analysis.append(f"Direct planetary collision on Sanghatta axes hitting {', '.join(hit_planets)}. Expect swift sectorial rotation.")

        # 3. Commodity & Sectorial Checks
        agri_vedhas = [v for v in vedhas if v["target_nakshatra"] in ["Krittika", "Rohini", "Mrigashira", "Pushya"]]
        if agri_vedhas:
            risk_score += 15
            market_analysis.append("Agriculture, bullion (Gold/Silver), and commodity markets under planetary stress.")
            
        banking_vedhas = [v for v in vedhas if v["target_nakshatra"] in ["Anuradha", "Jyeshtha", "Mula", "Uttara Bhadrapada"]]
        if banking_vedhas:
            risk_score += 15
            market_analysis.append("Financial institutions, banking indices, and treasury yields face pressure.")

        tech_vedhas = [v for v in vedhas if v["target_nakshatra"] in ["Ardra", "Shatabhisha", "Swati"]]
        if tech_vedhas:
            risk_score += 15
            market_analysis.append("Technology, IT services, and telecom stocks experience high intraday fluctuations.")

        # Cap score at 100
        risk_score = min(risk_score, 100)

        if risk_score >= 60:
            risk_level = "HIGH"
        elif risk_score >= 30:
            risk_level = "MODERATE"
        else:
            risk_level = "LOW"
            
        if len(market_analysis) == 0:
            market_analysis.append("Markets remain relatively stable with no critical geometric afflictions detected on the 28-Nakshatra Sanghatta grid.")

        return {
            "planet_positions": planet_nakshatras,
            "vedhas": vedhas,
            "risk_assessment": {
                "level": risk_level,
                "score": risk_score,
                "analysis": market_analysis
            }
        }
