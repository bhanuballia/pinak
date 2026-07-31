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
            "Mercury": "Vata/Pitta/Kapha", # Adaptable mixed dosha
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
            10: "Vata",   # Capricorn (Earthy/Airy)
            11: "Vata",   # Aquarius
            12: "Kapha"   # Pisces
        }

        self.sign_lords = {
            1: "Mars", 2: "Venus", 3: "Mercury", 4: "Moon", 5: "Sun", 6: "Mercury",
            7: "Venus", 8: "Mars", 9: "Jupiter", 10: "Saturn", 11: "Saturn", 12: "Jupiter"
        }

        # Panchamahabhuta mapping for Planets (Primary element)
        self.planet_elements = {
            "Sun": "Fire",
            "Moon": "Water",
            "Mars": "Fire",
            "Mercury": "Earth",
            "Jupiter": "Space",
            "Venus": "Water",
            "Saturn": "Air",
            "Rahu": "Air",
            "Ketu": "Fire"
        }

        # Panchamahabhuta mapping for Zodiac Signs
        self.sign_elements = {
            1: "Fire",  2: "Earth", 3: "Air",   4: "Water",
            5: "Fire",  6: "Earth", 7: "Air",   8: "Water",
            9: "Fire",  10: "Earth",11: "Air",  12: "Water"
        }

        # Anatomy Map (Kaal Purusha organ governance)
        self.body_anatomy = {
            1: "Head & Brain",
            2: "Face, Throat & Neck",
            3: "Shoulders, Arms & Lungs",
            4: "Chest, Breasts & Stomach",
            5: "Heart, Spine & Upper Back",
            6: "Lower Abdomen & Digestive Tract",
            7: "Kidneys, Lower Back & Lumbar",
            8: "Generative & Excretory Organs",
            9: "Thighs & Hips",
            10: "Knees, Joints & Bones",
            11: "Calves, Shins & Ankles",
            12: "Feet & Lymphatic System"
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
        scores = {"Vata": 0, "Pitta": 0, "Kapha": 0}
        
        def add_dosha(dosha, points):
            if dosha == "Vata/Pitta/Kapha":
                scores["Vata"] += points / 3
                scores["Pitta"] += points / 3
                scores["Kapha"] += points / 3
            elif dosha in scores:
                scores[dosha] += points

        asc_deg = positions.get("Ascendant", 0)
        asc_sign = self.get_sign_from_degree(asc_deg)
        add_dosha(self.sign_dosha[asc_sign], 20)

        lagna_lord = self.sign_lords[asc_sign]
        add_dosha(self.planet_dosha.get(lagna_lord, "Vata"), 15)

        moon_deg = positions.get("Moon", 0)
        moon_sign = self.get_sign_from_degree(moon_deg)
        add_dosha(self.sign_dosha[moon_sign], 10)
        add_dosha(self.planet_dosha["Moon"], 5)

        sun_deg = positions.get("Sun", 0)
        sun_sign = self.get_sign_from_degree(sun_deg)
        add_dosha(self.sign_dosha[sun_sign], 10)
        add_dosha(self.planet_dosha["Sun"], 5)

        sixth_sign = ((asc_sign + 5 - 1) % 12) + 1
        sixth_lord = self.sign_lords[sixth_sign]
        add_dosha(self.sign_dosha[sixth_sign], 10)
        add_dosha(self.planet_dosha.get(sixth_lord, "Vata"), 10)

        for p, dosha in self.planet_dosha.items():
            if p in ["Moon", "Sun", lagna_lord, sixth_lord]:
                add_dosha(dosha, 1)
            else:
                add_dosha(dosha, 2)

        total = sum(scores.values())
        for k in scores:
            scores[k] = round((scores[k] / total) * 100, 1) if total > 0 else 33.3

        sorted_scores = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        dominant = sorted_scores[0][0]
        secondary = sorted_scores[1][0]

        return {
            "scores": scores,
            "dominant": dominant,
            "secondary": secondary,
            "prakriti": f"{dominant}-{secondary}"
        }

    def calculate_panchamahabhuta(self, positions):
        """Calculates Panchamahabhuta (5 Elements) balance in the chart."""
        element_scores = {"Fire": 0, "Earth": 0, "Air": 0, "Water": 0, "Space": 0}
        
        # Ensure Ketu is calculated
        if "Ketu" not in positions and "Rahu" in positions:
            positions["Ketu"] = (positions["Rahu"] + 180.0) % 360.0

        # We weight the Ascendant and Moon higher (Lagna + Moon hold 40% combined weight)
        asc_deg = positions.get("Ascendant", 0)
        asc_sign = self.get_sign_from_degree(asc_deg)
        asc_element = self.sign_elements.get(asc_sign, "Space")
        element_scores[asc_element] += 15

        # Lagna Lord contribution
        lagna_lord = self.sign_lords[asc_sign]
        if lagna_lord in self.planet_elements:
            element_scores[self.planet_elements[lagna_lord]] += 10

        # Analyze each planet's sign and own element
        for planet, deg in positions.items():
            if planet == "Ascendant":
                continue
            
            p_sign = self.get_sign_from_degree(deg)
            sign_el = self.sign_elements.get(p_sign)
            p_el = self.planet_elements.get(planet)
            
            # Planet in sign element
            if sign_el:
                weight = 10 if planet in ["Moon", "Sun"] else 5
                element_scores[sign_el] += weight
                
            # Planet's inherent element
            if p_el:
                weight = 10 if planet in ["Moon", "Sun"] else 5
                element_scores[p_el] += weight

        # Normalize to percentages
        total = sum(element_scores.values())
        if total > 0:
            for el in element_scores:
                element_scores[el] = round((element_scores[el] / total) * 100, 1)
        else:
            element_scores = {"Fire": 20, "Earth": 20, "Air": 20, "Water": 20, "Space": 20}

        return element_scores

    def get_drekkana_sign(self, sign, degree_in_sign):
        if degree_in_sign < 10:
            return sign
        elif degree_in_sign < 20:
            return ((sign + 5 - 1) % 12) + 1
        else:
            return ((sign + 9 - 1) % 12) + 1

    def calculate_body_vulnerabilities(self, positions, transits):
        """Calculates vulnerability (0-100) for the 12 Kaal Purusha body regions."""
        asc_deg = positions.get("Ascendant", 0)
        asc_sign = self.get_sign_from_degree(asc_deg)
        
        malefics = ["Saturn", "Mars", "Rahu", "Ketu"]
        if "Ketu" not in positions and "Rahu" in positions:
            positions["Ketu"] = (positions["Rahu"] + 180.0) % 360.0
        if "Ketu" not in transits and "Rahu" in transits:
            transits["Ketu"] = (transits["Rahu"] + 180.0) % 360.0

        vulnerabilities = {}

        for sign_num, organ in self.body_anatomy.items():
            score = 10  # base score
            reasons = []

            # 1. House placement relative to lagna
            house = ((sign_num - asc_sign) % 12) + 1
            if house in [6, 8, 12]:
                score += 25
                reasons.append(f"Sign falls in the house of disease/chronic issues ({house}th house)")

            # 2. Natal malefics in this sign
            natal_malefics_present = []
            for mal in malefics:
                if mal in positions:
                    mal_sign = self.get_sign_from_degree(positions[mal])
                    if mal_sign == sign_num:
                        natal_malefics_present.append(mal)
            
            if natal_malefics_present:
                score += 30
                reasons.append(f"Natal malefic ({', '.join(natal_malefics_present)}) placed here")

            # 3. Sign Lord afflicted
            lord = self.sign_lords[sign_num]
            lord_deg = positions.get(lord, 0)
            lord_sign = self.get_sign_from_degree(lord_deg)
            lord_house = ((lord_sign - asc_sign) % 12) + 1
            
            lord_afflicted = False
            for mal in malefics:
                if mal != lord and mal in positions:
                    mal_s = self.get_sign_from_degree(positions[mal])
                    if mal_s == lord_sign:
                        lord_afflicted = True
            
            if lord_house in [6, 8, 12] or lord_afflicted:
                score += 15
                reasons.append(f"Sign Lord ({lord}) is afflicted or placed in a dusthana house")

            # 4. Transits of Saturn, Mars, Rahu, Ketu
            transit_malefics_present = []
            transit_malefics_opposing = []
            for mal in malefics:
                if mal in transits:
                    t_sign = self.get_sign_from_degree(transits[mal])
                    if t_sign == sign_num:
                        transit_malefics_present.append(mal)
                    elif t_sign == ((sign_num + 6 - 1) % 12) + 1:
                        transit_malefics_opposing.append(mal)

            if transit_malefics_present:
                score += 20
                reasons.append(f"Transiting malefic ({', '.join(transit_malefics_present)}) is directly conjunct")
            if transit_malefics_opposing:
                score += 10
                reasons.append(f"Transiting malefic ({', '.join(transit_malefics_opposing)}) is aspecting/opposing")

            # Cap score
            score = min(score, 100)
            
            risk_level = "Low"
            if score >= 60:
                risk_level = "High"
            elif score >= 35:
                risk_level = "Moderate"

            vulnerabilities[organ] = {
                "score": score,
                "risk_level": risk_level,
                "reasons": reasons,
                "sign_num": sign_num
            }

        # Convert to sorted list based on score
        sorted_vuln = [
            {"organ": k, **v} for k, v in sorted(vulnerabilities.items(), key=lambda item: item[1]["score"], reverse=True)
        ]
        return sorted_vuln

    def calculate_symptom_diagnostics(self, positions):
        """Maps afflicted natal planets to symptoms/organs."""
        asc_deg = positions.get("Ascendant", 0)
        asc_sign = self.get_sign_from_degree(asc_deg)
        
        malefics = ["Saturn", "Mars", "Rahu", "Ketu"]
        if "Ketu" not in positions and "Rahu" in positions:
            positions["Ketu"] = (positions["Rahu"] + 180.0) % 360.0

        diagnostics = []
        
        # Medical descriptions
        symptom_map = {
            "Sun": {
                "organs": "Heart, blood circulation, bones, spinal cord, eyes",
                "symptoms": "Low energy, cardiac strain, bone density issues, structural problems, eye fatigue"
            },
            "Moon": {
                "organs": "Body fluids, stomach, lungs, mind/mental state",
                "symptoms": "Emotional swings, anxiety, water retention, phlegmatic cough, digestive sensitivity"
            },
            "Mars": {
                "organs": "Blood, muscles, head, bone marrow",
                "symptoms": "Inflammatory conditions, blood pressure spikes, muscle injuries, rash, susceptability to cuts/burns"
            },
            "Mercury": {
                "organs": "Nervous system, skin, speech, respiratory tract",
                "symptoms": "Anxiety, skin allergies/rashes, insomnia, nervous tremors, respiratory sensitivity"
            },
            "Jupiter": {
                "organs": "Liver, kidneys, blood sugar regulation, fat tissue",
                "symptoms": "Sluggish liver, high blood sugar, arterial block risks, hearing sensitivity"
            },
            "Venus": {
                "organs": "Urinary system, reproductive organs, skin quality, throat",
                "symptoms": "Hormonal imbalances, urinary tract congestion, throat sensitivity, skin dryness"
            },
            "Saturn": {
                "organs": "Bones, joints, teeth, digestive colon, nervous system",
                "symptoms": "Joint stiffness, arthritis, constipation, chronic fatigue, mineral absorption issues"
            },
            "Rahu": {
                "organs": "Immune system, nervous channels",
                "symptoms": "Unusual/phantom symptoms, toxic buildup, sudden digestive spasms, intense nervous anxiety"
            },
            "Ketu": {
                "organs": "Digestive tract, skin layer, sensory nerves",
                "symptoms": "Viral infections, hard-to-diagnose skin eruptions, intestinal worms, mental disorientation"
            }
        }

        for planet in symptom_map.keys():
            if planet not in positions:
                continue

            deg = positions[planet]
            p_sign = self.get_sign_from_degree(deg)
            house = ((p_sign - asc_sign) % 12) + 1
            
            # Affliction checks
            is_in_dusthana = house in [6, 8, 12]
            conjunct_malefics = []
            
            for mal in malefics:
                if mal != planet and mal in positions:
                    mal_s = self.get_sign_from_degree(positions[mal])
                    if mal_s == p_sign:
                        conjunct_malefics.append(mal)

            # Determine severity
            severity_score = 0
            affliction_notes = []
            
            if is_in_dusthana:
                severity_score += 40
                affliction_notes.append(f"Placed in {house}th House (Dusthana)")
            if conjunct_malefics:
                severity_score += 40
                affliction_notes.append(f"Conjunct malefic ({', '.join(conjunct_malefics)})")
            
            # If the planet is a malefic itself placed in a dusthana, it causes stress to its ruled body part
            if planet in malefics and is_in_dusthana:
                severity_score += 20
                affliction_notes.append("Malefic energy focused in house of disease")

            if severity_score > 0:
                diagnostics.append({
                    "planet": planet,
                    "severity": "High" if severity_score >= 80 else "Moderate",
                    "affliction": ", ".join(affliction_notes),
                    "organs": symptom_map[planet]["organs"],
                    "symptoms": symptom_map[planet]["symptoms"]
                })

        return diagnostics

    def get_vedic_remedies(self, dominant_dosha, diagnostics):
        """Suggests health remedies based on dosha and afflicted planets."""
        remedies = {
            "herbs": [],
            "mantras": [],
            "color_therapy": [],
            "lifestyle": []
        }

        # 1. Dosha remedies
        if dominant_dosha == "Vata":
            remedies["herbs"].append("Ashwagandha: Rejuvenating root to calm the nervous system and strengthen muscles.")
            remedies["color_therapy"].append("Favour warming, grounding colors like soft gold, orange, and pastel yellows.")
            remedies["lifestyle"].append("Abhyanga (oil massage) using warm sesame oil before bath.")
            remedies["lifestyle"].append("Maintain a warm environment and strict bedtime routines to ground erratic air energy.")
        elif dominant_dosha == "Pitta":
            remedies["herbs"].append("Amalaki (Amla) & Shatavari: Cooling herbs to soothe digestive inflammation and heat.")
            remedies["color_therapy"].append("Favour cooling colors like ocean blue, forest green, white, and silver.")
            remedies["lifestyle"].append("Practice Sheetali Pranayama (cooling breath) daily.")
            remedies["lifestyle"].append("Avoid intense exercise or hot sun exposure between 10 AM and 3 PM.")
        else: # Kapha
            remedies["herbs"].append("Ginger, Trikatu & Pippali: Warming spices to stimulate sluggish digestion (Agni).")
            remedies["color_therapy"].append("Favour stimulating, energizing colors like vibrant red, bright yellow, and warm gold.")
            remedies["lifestyle"].append("Engage in vigorous, sweat-inducing workouts in the morning.")
            remedies["lifestyle"].append("Practice dry brushing (Udvartana) to stimulate lymphatic flow.")

        # 2. Planet-specific remedies
        planet_remedies = {
            "Sun": {
                "herb": "Ginger/Cardamom tea",
                "mantra": "Om Hram Hreem Hroum Sah Suryaya Namaha",
                "gem_color": "Ruby red / Orange"
            },
            "Moon": {
                "herb": "Chamomile or Mint infusion",
                "mantra": "Om Shram Shreem Shroum Sah Chandraya Namaha",
                "gem_color": "Pearl / Milky white"
            },
            "Mars": {
                "herb": "Aloe vera juice / Coriander juice",
                "mantra": "Om Kram Kreem Kroum Sah Bhaumaya Namaha",
                "gem_color": "Coral / Copper"
            },
            "Mercury": {
                "herb": "Brahmi / Gotu Kola tea",
                "mantra": "Om Bram Breem Broum Sah Budhaya Namaha",
                "gem_color": "Emerald green"
            },
            "Jupiter": {
                "herb": "Turmeric / Licorice root",
                "mantra": "Om Gram Greem Groum Sah Gurave Namaha",
                "gem_color": "Yellow sapphire / Gold"
            },
            "Venus": {
                "herb": "Saffron milk / Rose infusion",
                "mantra": "Om Dram Dreem Droum Sah Shukraya Namaha",
                "gem_color": "Diamond white / Light pink"
            },
            "Saturn": {
                "herb": "Guggulu resin / Triphala",
                "mantra": "Om Pram Preem Proum Sah Shanishcharaya Namaha",
                "gem_color": "Blue / Dark violet"
            },
            "Rahu": {
                "herb": "Sandalwood / Calamus root",
                "mantra": "Om Bhram Bhreem Bhroum Sah Rahave Namaha",
                "gem_color": "Gomed / Honey brown"
            },
            "Ketu": {
                "herb": "Ginger / Ashwagandha",
                "mantra": "Om Stram Streem Stroum Sah Ketave Namaha",
                "gem_color": "Cat's eye / Multi-color speckles"
            }
        }

        # Gather remedies for up to 3 afflicted planets
        afflicted_planets = [d["planet"] for d in diagnostics if d["severity"] == "High"]
        if not afflicted_planets:
            afflicted_planets = [d["planet"] for d in diagnostics][:2]

        for p in afflicted_planets:
            if p in planet_remedies:
                info = planet_remedies[p]
                remedies["herbs"].append(f"{p} Remedy: Consume {info['herb']} to balance planetary vibrations.")
                remedies["mantras"].append(f"{p} Healing Mantra: Chant '{info['mantra']}' 108 times daily.")
                remedies["color_therapy"].append(f"{p} Color: Meditate on or wear {info['gem_color']} to align energies.")

        return remedies

    def calculate_vulnerability(self, positions, transits):
        asc_deg = positions.get("Ascendant", 0)
        asc_sign = self.get_sign_from_degree(asc_deg)
        asc_deg_in_sign = asc_deg % 30

        eighth_sign = ((asc_sign + 8 - 1) % 12) + 1
        eighth_lord = self.sign_lords[eighth_sign]

        khara_sign = self.get_drekkana_sign(eighth_sign, asc_deg_in_sign)
        khara_lord = self.sign_lords[khara_sign]

        sixth_sign = ((asc_sign + 6 - 1) % 12) + 1
        sixth_lord = self.sign_lords[sixth_sign]

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
        panchamahabhuta = self.calculate_panchamahabhuta(natal_positions)
        vuln_timing = self.calculate_vulnerability(natal_positions, transits)
        body_parts = self.calculate_body_vulnerabilities(natal_positions, transits)
        diagnostics = self.calculate_symptom_diagnostics(natal_positions)
        remedies = self.get_vedic_remedies(tridosha["dominant"], diagnostics)

        return {
            "tridosha": tridosha,
            "panchamahabhuta": panchamahabhuta,
            "vulnerability_timing": vuln_timing,
            "body_parts": body_parts,
            "diagnostics": diagnostics,
            "remedies": remedies
        }
