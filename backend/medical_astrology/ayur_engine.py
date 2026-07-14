import math
import datetime
import swisseph as swe

class AyurEngine:
    def __init__(self):
        # Dosha mapping for Planets
        self.planet_dosha = {
            "Sun": "Pitta",
            "Moon": "Kapha",
            "Mars": "Pitta",
            "Mercury": "Vata/Pitta/Kapha", # Adaptable, takes dosha of conjuncts, but traditionally Vata/Pitta/Kapha mixed. Let's say Vata/Pitta/Kapha evenly.
            "Jupiter": "Kapha",
            "Venus": "Kapha",
            "Saturn": "Vata",
            "Rahu": "Vata",
            "Ketu": "Pitta"
        }

        # Dosha mapping for Signs
        self.sign_dosha = {
            1: "Pitta",   # Aries
            2: "Kapha",   # Taurus
            3: "Vata",    # Gemini
            4: "Kapha",   # Cancer
            5: "Pitta",   # Leo
            6: "Vata",    # Virgo
            7: "Vata",    # Libra
            8: "Kapha",   # Scorpio (Watery)
            9: "Pitta",   # Sagittarius
            10: "Vata",   # Capricorn (Earthy/Airy influence, often Vata)
            11: "Vata",   # Aquarius
            12: "Kapha"   # Pisces
        }

        self.sign_lords = {
            1: "Mars", 2: "Venus", 3: "Mercury", 4: "Moon", 5: "Sun", 6: "Mercury",
            7: "Venus", 8: "Mars", 9: "Jupiter", 10: "Saturn", 11: "Saturn", 12: "Jupiter"
        }

        self.planets_id = {
            "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS,
            "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER, 
            "Venus": swe.VENUS, "Saturn": swe.SATURN,
            "Rahu": swe.MEAN_NODE
        }

    def get_sign_from_degree(self, degree):
        return int(degree / 30) + 1

    def calculate_tridosha(self, positions):
        # Initial scores
        scores = {"Vata": 0, "Pitta": 0, "Kapha": 0}
        
        def add_dosha(dosha, points):
            if dosha == "Vata/Pitta/Kapha":
                scores["Vata"] += points / 3
                scores["Pitta"] += points / 3
                scores["Kapha"] += points / 3
            elif dosha in scores:
                scores[dosha] += points

        # 1. Ascendant (Lagna) Sign - 20 points
        asc_deg = positions.get("Ascendant", 0)
        asc_sign = self.get_sign_from_degree(asc_deg)
        add_dosha(self.sign_dosha[asc_sign], 20)

        # 2. Lagna Lord - 15 points
        lagna_lord = self.sign_lords[asc_sign]
        add_dosha(self.planet_dosha[lagna_lord], 15)

        # 3. Moon Sign & Planet - 15 points
        moon_deg = positions.get("Moon", 0)
        moon_sign = self.get_sign_from_degree(moon_deg)
        add_dosha(self.sign_dosha[moon_sign], 10)
        add_dosha(self.planet_dosha["Moon"], 5)

        # 4. Sun Sign & Planet - 15 points
        sun_deg = positions.get("Sun", 0)
        sun_sign = self.get_sign_from_degree(sun_deg)
        add_dosha(self.sign_dosha[sun_sign], 10)
        add_dosha(self.planet_dosha["Sun"], 5)

        # 5. 6th House Sign & Lord (House of Disease) - 20 points
        sixth_sign = ((asc_sign + 5 - 1) % 12) + 1
        sixth_lord = self.sign_lords[sixth_sign]
        add_dosha(self.sign_dosha[sixth_sign], 10)
        add_dosha(self.planet_dosha[sixth_lord], 10)

        # 6. Evaluate all planets generally (15 points distributed)
        for p, dosha in self.planet_dosha.items():
            if p in ["Moon", "Sun", lagna_lord, sixth_lord]:
                add_dosha(dosha, 1) # small additional weight
            else:
                add_dosha(dosha, 2)

        # Normalize to percentages
        total = sum(scores.values())
        for k in scores:
            scores[k] = round((scores[k] / total) * 100, 1)

        # Determine dominant
        sorted_scores = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        dominant = sorted_scores[0][0]
        secondary = sorted_scores[1][0]

        return {
            "scores": scores,
            "dominant": dominant,
            "secondary": secondary,
            "prakriti": f"{dominant}-{secondary}"
        }

    def get_drekkana_sign(self, sign, degree_in_sign):
        # 1st Drekkana (0-10) -> Same sign
        # 2nd Drekkana (10-20) -> 5th sign from it
        # 3rd Drekkana (20-30) -> 9th sign from it
        if degree_in_sign < 10:
            return sign
        elif degree_in_sign < 20:
            return ((sign + 5 - 1) % 12) + 1
        else:
            return ((sign + 9 - 1) % 12) + 1

    def calculate_vulnerability(self, positions, transits):
        asc_deg = positions.get("Ascendant", 0)
        asc_sign = self.get_sign_from_degree(asc_deg)
        asc_deg_in_sign = asc_deg % 30

        # 8th House from Lagna
        eighth_sign = ((asc_sign + 8 - 1) % 12) + 1
        eighth_lord = self.sign_lords[eighth_sign]

        # 22nd Drekkana is the Drekkana of the 8th house holding the exact same degree
        khara_sign = self.get_drekkana_sign(eighth_sign, asc_deg_in_sign)
        khara_lord = self.sign_lords[khara_sign]

        # 6th House Lord
        sixth_sign = ((asc_sign + 6 - 1) % 12) + 1
        sixth_lord = self.sign_lords[sixth_sign]

        # Check transits over these critical lords
        # For simplicity, we check if transiting Saturn, Mars, Rahu, Ketu are conjunct 
        # (same sign) as natal Khara Lord, 8th Lord, or 6th Lord.
        vulnerabilities = []
        risk_score = 0
        
        malefics = ["Saturn", "Mars", "Rahu", "Ketu"]
        critical_lords = {
            "Khara Lord (22nd Drekkana)": khara_lord,
            "8th Lord (Longevity/Chronic)": eighth_lord,
            "6th Lord (Acute Disease)": sixth_lord
        }

        for malefic in malefics:
            if malefic in transits:
                transit_sign = self.get_sign_from_degree(transits[malefic])
                
                for title, lord in critical_lords.items():
                    natal_lord_deg = positions.get(lord, 0)
                    natal_lord_sign = self.get_sign_from_degree(natal_lord_deg)
                    
                    if transit_sign == natal_lord_sign:
                        vulnerabilities.append(f"Transiting {malefic} is conjunct natal {lord} ({title}).")
                        risk_score += 25
                        
                    # Opposition (7th aspect)
                    if transit_sign == ((natal_lord_sign + 6 - 1) % 12) + 1:
                        vulnerabilities.append(f"Transiting {malefic} is aspecting natal {lord} ({title}).")
                        risk_score += 15

        risk_level = "Low"
        if risk_score >= 50:
            risk_level = "High"
        elif risk_score >= 25:
            risk_level = "Moderate"

        return {
            "khara_lord": khara_lord,
            "eighth_lord": eighth_lord,
            "sixth_lord": sixth_lord,
            "active_vulnerabilities": vulnerabilities,
            "risk_score": risk_score,
            "risk_level": risk_level
        }

    def get_current_transits(self):
        now = datetime.datetime.utcnow()
        jd = swe.julday(now.year, now.month, now.day, now.hour + now.minute/60.0)
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        
        res = {}
        for name, p_id in self.planets_id.items():
            pos, _ = swe.calc_ut(jd, p_id, swe.FLG_SIDEREAL)
            res[name] = pos[0]
            
        res["Ketu"] = (res["Rahu"] + 180.0) % 360.0
        return res

    def calculate_medical_report(self, natal_positions, transits=None):
        if not transits:
            transits = self.get_current_transits()

        tridosha = self.calculate_tridosha(natal_positions)
        vuln = self.calculate_vulnerability(natal_positions, transits)

        recommendations = []
        if tridosha["dominant"] == "Vata":
            recommendations = [
                "Favour warm, moist, heavy, and oily foods (soups, stews, root vegetables).",
                "Maintain a strict daily routine (Dinacharya) to calm the nervous system.",
                "Avoid raw, cold, and dry foods.",
                "Engage in grounding exercises like restorative yoga or walking in nature."
            ]
        elif tridosha["dominant"] == "Pitta":
            recommendations = [
                "Favour cool, refreshing, and slightly dry foods (leafy greens, sweet fruits).",
                "Avoid spicy, sour, fried, and fermented foods.",
                "Keep cool and avoid over-exertion during the hottest parts of the day.",
                "Practice cooling pranayama (breathing) like Sheetali."
            ]
        else:
            recommendations = [
                "Favour warm, light, spicy, and dry foods to stimulate digestion.",
                "Avoid heavy, oily, cold, and sweet foods (dairy, heavy meats).",
                "Engage in vigorous, sweat-inducing exercise daily.",
                "Fast occasionally or eat smaller meals to keep Agni (digestive fire) strong."
            ]

        return {
            "tridosha": tridosha,
            "recommendations": recommendations,
            "vulnerability_timing": vuln
        }
