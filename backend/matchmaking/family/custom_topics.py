# backend/matchmaking/family/custom_topics.py

class CustomTopicsEngine:
    def analyze(self, bride_data, groom_data, precomputed_reports=None):
        """
        Calculates 10 matchmaking topics with a verdict of 'Good', 'Bad', or 'Neutral'
        and detailed astrological explanations based on the Birth Chart (D1) and Navamsha Chart (D9).
        """
        # Fallbacks for precomputed reports
        precomputed = precomputed_reports or {}
        guna_milan = precomputed.get("guna_milan", {})
        manglik = precomputed.get("manglik", {})
        
        bride_planets_list = bride_data.get("planet_positions", [])
        groom_planets_list = groom_data.get("planet_positions", [])
        
        bride_planets = {p["planet"]: p for p in bride_planets_list if isinstance(p, dict)}
        groom_planets = {p["planet"]: p for p in groom_planets_list if isinstance(p, dict)}
        
        bride_houses = {int(h_num): h_data for h_num, h_data in bride_data.get("chart", {}).get("houses", {}).items()}
        groom_houses = {int(h_num): h_data for h_num, h_data in groom_data.get("chart", {}).get("houses", {}).items()}
        
        topics = []
        
        # ----------------------------------------------------
        # Category 1: In-Laws & Family Integration
        # ----------------------------------------------------
        
        # Topic 1: What kind of relationship will the girl have with the boy's family?
        # Astrological Basis: Girl's 8th (spouse family) and 2nd (integration)
        bride_h8 = bride_houses.get(8, {})
        bride_h2 = bride_houses.get(2, {})
        bride_h8_planets = bride_h8.get("planets", [])
        bride_h2_planets = bride_h2.get("planets", [])
        
        girl_score = 0
        girl_reasons = []
        
        if any(p in ["Jupiter", "Venus", "Moon"] for p in bride_h8_planets):
            girl_score += 2
            girl_reasons.append("Benefic planets (Jupiter/Venus/Moon) in your 8th house (representing spouse's family in the Birth Chart / D1) indicate a welcoming, loving environment in the husband's household.")
        if any(p in ["Saturn", "Rahu", "Ketu", "Mars"] for p in bride_h8_planets):
            girl_score -= 2
            girl_reasons.append("Malefic influence (Saturn/Rahu/Ketu/Mars) in the 8th house (representing spouse's family in the Birth Chart / D1) suggests initial adjustments, potential boundary issues, or coldness from in-laws.")
            
        if any(p in ["Jupiter", "Venus", "Mercury"] for p in bride_h2_planets):
            girl_score += 1
            girl_reasons.append("A strong 2nd house (representing family and values in the Birth Chart / D1) of family integration supports rapid adaptation to the new family culture.")
            
        if girl_score > 0:
            verdict_1 = "Good"
            explanation_1 = "The presence of positive planetary influences in the 8th house (spouse's family) and 2nd house (family integration) of the Birth Chart (D1) ensures mutual respect, help, and an overall harmonious alignment with the groom's family. " + " ".join(girl_reasons)
        elif girl_score < 0:
            verdict_1 = "Bad"
            explanation_1 = "Adjustment is key. Malefic placements in the 8th house (representing spouse's family in the Birth Chart / D1) suggest potential challenges or emotional gaps with in-laws. " + " ".join(girl_reasons)
        else:
            verdict_1 = "Neutral"
            explanation_1 = "Relations will remain standard and formal. No major affliction is observed in the 8th or 2nd houses of the Birth Chart (D1), promising a balanced and mature family dynamic."
            
        topics.append({
            "topic": "What kind of relationship will the girl have with the boy's family?",
            "category": "In-Laws & Family Integration",
            "verdict": verdict_1,
            "explanation": explanation_1
        })
        
        # Topic 2: What kind of relationship will the boy have with the girl's family?
        # Astrological Basis: Boy's 3rd house (wife's family / siblings) & 8th house
        groom_h3 = groom_houses.get(3, {})
        groom_h8 = groom_houses.get(8, {})
        groom_h3_planets = groom_h3.get("planets", [])
        groom_h8_planets = groom_h8.get("planets", [])
        
        boy_score = 0
        boy_reasons = []
        
        if any(p in ["Jupiter", "Venus", "Mercury"] for p in groom_h3_planets):
            boy_score += 2
            boy_reasons.append("Benefic planets in your 3rd house (representing the spouse's family and relatives in the Birth Chart / D1) ensure cooperative and cheerful communication.")
        if any(p in ["Saturn", "Rahu", "Mars"] for p in groom_h3_planets):
            boy_score -= 2
            boy_reasons.append("Saturn or Rahu in the 3rd house (representing the spouse's family in the Birth Chart / D1) might create a sense of distance or purely formal obligations with her family.")
            
        if any(p in ["Jupiter", "Sun"] for p in groom_h8_planets):
            boy_score += 1
            boy_reasons.append("Jupiter/Sun influence in the 8th house (representing joint family assets/respect from in-laws in the Birth Chart / D1) indicates high respect and dignity received from the bride's parents.")
            
        if boy_score > 0:
            verdict_2 = "Good"
            explanation_2 = "The groom's Birth Chart (D1) indicates warm, helpful, and communication-friendly bonds with the bride's parents and siblings due to strong placements in the 3rd and 8th houses. " + " ".join(boy_reasons)
        elif boy_score < 0:
            verdict_2 = "Bad"
            explanation_2 = "Communication gaps or high ego thresholds are indicated. The groom will need to actively nurture relationships with the bride's family based on challenging placements in the 3rd and 8th houses of his Birth Chart (D1). " + " ".join(boy_reasons)
        else:
            verdict_2 = "Neutral"
            explanation_2 = "Healthy boundaries. The relationship will be cordial and dignified, without excessive dependency or conflicts on either side, as no major afflictions exist in the 3rd and 8th houses of the Birth Chart (D1)."
            
        topics.append({
            "topic": "What kind of relationship will the boy have with the girl's family?",
            "category": "In-Laws & Family Integration",
            "verdict": verdict_2,
            "explanation": explanation_2
        })
        
        # Topic 3: Will the couple live independently or as a joint family?
        # Astrological Basis: Afflictions / separation influences on 2nd and 4th houses (Saturn, Rahu, Sun)
        separation_score = 0
        living_reasons = []
        
        for name, houses in [("Bride", bride_houses), ("Groom", groom_houses)]:
            h4 = houses.get(4, {})
            h2 = houses.get(2, {})
            h4_planets = h4.get("planets", [])
            h2_planets = h2.get("planets", [])
            
            if any(p in ["Saturn", "Rahu", "Sun"] for p in h4_planets + h2_planets):
                separation_score += 1
                living_reasons.append(f"{name}'s Birth Chart (D1) has separator planets (Saturn/Rahu/Sun) in the 2nd or 4th house (representing domestic home life and family values).")
                
        if separation_score >= 2:
            verdict_3 = "Bad"
            explanation_3 = "Astrological configurations strongly favor living independently. Afflictions or separator planets (Saturn, Sun, or Rahu) in the 2nd or 4th houses of the Birth Chart (D1) point to separate residence post-marriage to maintain harmony. " + " ".join(living_reasons)
        elif separation_score == 0:
            verdict_3 = "Good"
            explanation_3 = "Highly supportive of a joint family setup. Benefic influences in the 2nd and 4th houses of both Birth Charts (D1) suggest domestic happiness, collective bonding, and living peacefully under one roof with extended family."
        else:
            verdict_3 = "Neutral"
            explanation_3 = "Both setups are feasible. While they may live in a joint family initially, a transition to independent living for career or personal space is highly probable based on mild separator influences in the 2nd/4th houses of the Birth Chart (D1), without causing family friction."
            
        topics.append({
            "topic": "Will the couple live independently or as a joint family?",
            "category": "In-Laws & Family Integration",
            "verdict": verdict_3,
            "explanation": explanation_3
        })
        
        # ----------------------------------------------------
        # Category 2: Emotional & Temperament Alignment
        # ----------------------------------------------------
        
        # Topic 4: Emotional Resonance & Mental Wave-length (Maitri & Bhakoot)
        bhakoot_score = guna_milan.get("scores", {}).get("Bhakoot", 7)
        if bhakoot_score == 7 or bhakoot_score >= 6:
            verdict_4 = "Good"
            explanation_4 = "Excellent emotional sync! The Moon sign distance (Bhakoot) in the Birth Chart (D1) is highly auspicious, which guarantees intuitive mutual understanding and reduces the likelihood of long-term emotional gaps."
        elif bhakoot_score == 0:
            verdict_4 = "Bad"
            explanation_4 = "A Bhakoot Dosha (6-8 Shashtashtaka or 2-12 Dwiradwadasha placement of Moons in the Birth Chart / D1) is present. This indicates potential emotional mismatch, mood swings, or feeling unheard unless conscious effort is made."
        else:
            verdict_4 = "Neutral"
            explanation_4 = "Average emotional compatibility. Moon signs in the Birth Chart (D1) are neutral. The couple will require active communication to align their moods, but there is no major threat to mental compatibility."
            
        topics.append({
            "topic": "Emotional Resonance & Mental Wave-length (Maitri & Bhakoot)",
            "category": "Emotional & Temperament Alignment",
            "verdict": verdict_4,
            "explanation": explanation_4
        })
        
        # Topic 5: Ego Clashes & Dominance Dynamics (Graha Maitri & Varna/Vashya)
        graha_maitri = guna_milan.get("scores", {}).get("Graha Maitri", 5)
        vashya = guna_milan.get("scores", {}).get("Vashya", 2)
        
        ego_score = graha_maitri + vashya
        if ego_score >= 5:
            verdict_5 = "Good"
            explanation_5 = "Superb planetary friendship (Graha Maitri) and mutual attraction (Vashya) based on Moon sign lords and placements in the Birth Chart (D1). The couple will share high mutual respect and easily find common ground rather than engaging in power struggles."
        elif ego_score <= 2:
            verdict_5 = "Bad"
            explanation_5 = "Low Graha Maitri score in the Birth Chart (D1) indicates potential friction in basic worldviews or temperamental ego clashes. Both will need to practice humility and respect each other's leadership zones."
        else:
            verdict_5 = "Neutral"
            explanation_5 = "Moderate ego alignment based on the Birth Chart (D1) configurations. There is a healthy balance of power. While occasional disagreements or differences in authority might arise, they are highly manageable."
            
        topics.append({
            "topic": "Ego Clashes & Dominance Dynamics (Graha Maitri & Varna/Vashya)",
            "category": "Emotional & Temperament Alignment",
            "verdict": verdict_5,
            "explanation": explanation_5
        })
        
        # ----------------------------------------------------
        # Category 3: Career, Wealth & Prosperity Synergy
        # ----------------------------------------------------
        
        # Topic 6: Financial Luck & Fortune post-marriage (Bhagya)
        luck_score = 0
        for name, houses in [("Bride", bride_houses), ("Groom", groom_houses)]:
            h7 = houses.get(7, {})
            h9 = houses.get(9, {})
            h11 = houses.get(11, {})
            all_planets = h7.get("planets", []) + h9.get("planets", []) + h11.get("planets", [])
            if "Jupiter" in all_planets or "Venus" in all_planets:
                luck_score += 1
                
        if luck_score >= 2:
            verdict_6 = "Good"
            explanation_6 = "Highly auspicious connection between the houses of Marriage (7th), Fortune (9th), and Gains (11th) in the Birth Chart (D1) and Navamsha Chart (D9). Marriage will act as a major catalyst for financial luck and expansion."
        elif luck_score == 0:
            verdict_6 = "Bad"
            explanation_6 = "Delayed financial activation. Saturn or Rahu aspects on the 7th and 9th houses of the Birth Chart (D1) might require hard work and patient planning to build wealth post-marriage."
        else:
            verdict_6 = "Neutral"
            explanation_6 = "Steady financial growth. Birth Chart (D1) and Navamsha (D9) parameters show marriage will not cause financial stress, but rather bring standard, stable growth aligned with their independent professional paths."
            
        topics.append({
            "topic": "Financial Luck & Fortune post-marriage (Bhagya)",
            "category": "Career, Wealth & Prosperity Synergy",
            "verdict": verdict_6,
            "explanation": explanation_6
        })
        
        # Topic 7: Mutual Career Support vs. Friction
        career_score = 0
        for name, houses in [("Bride", bride_houses), ("Groom", groom_houses)]:
            h10 = houses.get(10, {})
            h10_planets = h10.get("planets", [])
            if any(p in ["Jupiter", "Venus", "Mercury", "Sun"] for p in h10_planets):
                career_score += 1
            if any(p in ["Rahu", "Saturn"] for p in h10_planets):
                career_score -= 1
                
        if career_score > 0:
            verdict_7 = "Good"
            explanation_7 = "Both partners have strong 10th houses (representing career in the Birth Chart / D1) and beneficial planetary aspects in their Dashamsha (D10) charts, ensuring mutual motivation, professional understanding, and excellent work-life balance."
        elif career_score < 0:
            verdict_7 = "Bad"
            explanation_7 = "Potential work-life friction. Saturn/Rahu influence on the 10th house of career in the Birth Chart (D1) indicates that demanding career schedules or professional stress could spill over into domestic life."
        else:
            verdict_7 = "Neutral"
            explanation_7 = "Standard career compatibility. Both Birth Chart (D1) and Dashamsha (D10) parameters suggest they will focus on their individual careers independently with normal levels of mutual support and accommodation."
            
        topics.append({
            "topic": "Mutual Career Support vs. Friction",
            "category": "Career, Wealth & Prosperity Synergy",
            "verdict": verdict_7,
            "explanation": explanation_7
        })
        
        # ----------------------------------------------------
        # Category 4: Domestic Life, Children & Longevity
        # ----------------------------------------------------
        
        # Topic 8: Progeny & Family Legacy (Santati / Nadi Guna)
        nadi_score = guna_milan.get("scores", {}).get("Nadi", 8)
        
        if nadi_score == 8:
            verdict_8 = "Good"
            explanation_8 = "Outstanding progeny promise! The Nadi Koota match in the Birth Chart (D1) is excellent (no Nadi Dosha), indicating healthy genetic compatibility, smooth child-birth prospects, and strong family legacy in both the Birth Chart (D1) and Saptamsha (D7) Chart."
        elif nadi_score == 0:
            verdict_8 = "Bad"
            explanation_8 = "Nadi Dosha is detected in the Birth Chart (D1) Moon positions. This shows potential genetic incompatibility or delays in childbirth/health challenges. Consulting a doctor and seeking specific Vedic remedies is advised."
        else:
            verdict_8 = "Neutral"
            explanation_8 = "Normal progeny prospects. While there is no major Nadi Dosha in the Birth Chart (D1), minor delays might happen. Overall family expansion is protected by benefic Jupiter aspects in the D7 Chart."
            
        topics.append({
            "topic": "Progeny & Family Legacy (Santati / Nadi Guna)",
            "category": "Domestic Life, Children & Longevity",
            "verdict": verdict_8,
            "explanation": explanation_8
        })
        
        # Topic 9: Health, Longevity & Crisis Management (Mahendra Koota & 8th House)
        b_h8_aff = len([p for p in bride_houses.get(8, {}).get("planets", []) if p in ["Rahu", "Saturn", "Mars"]]) >= 2
        g_h8_aff = len([p for p in groom_houses.get(8, {}).get("planets", []) if p in ["Rahu", "Saturn", "Mars"]]) >= 2
        
        if b_h8_aff or g_h8_aff:
            verdict_9 = "Bad"
            explanation_9 = "8th house afflictions in the Birth Chart (D1) and Navamsha Chart (D9) indicate that crisis management, health issues, or sudden changes will require high emotional resilience and strong health care practices."
        elif not b_h8_aff and not g_h8_aff:
            verdict_9 = "Good"
            explanation_9 = "Clean 8th houses (representing longevity and sudden transformations in both the Birth Chart / D1 and Navamsha / D9 Chart) protect both partners. They will face life's ups and downs with resilience, providing a secure shield for each other."
        else:
            verdict_9 = "Neutral"
            explanation_9 = "Average longevity and crisis response. Standard planetary alignments in the 8th house of the Birth Chart (D1) suggest that normal precautions, a healthy lifestyle, and patience will ensure a stable lifetime partnership."
            
        topics.append({
            "topic": "Health, Longevity & Crisis Management (Mahendra Koota & 8th House)",
            "category": "Domestic Life, Children & Longevity",
            "verdict": verdict_9,
            "explanation": explanation_9
        })
        
        # ----------------------------------------------------
        # Category 5: Conflict Resolution & Remedial Support
        # ----------------------------------------------------
        
        # Topic 10: How will they handle arguments and disputes?
        dispute_score = 0
        for name, houses in [("Bride", bride_houses), ("Groom", groom_houses)]:
            h6 = houses.get(6, {})
            h6_planets = h6.get("planets", [])
            if "Mars" in h6_planets or "Saturn" in h6_planets:
                dispute_score -= 1
            if "Jupiter" in h6_planets or "Venus" in h6_planets:
                dispute_score += 1
                
        if dispute_score >= 1:
            verdict_10 = "Good"
            explanation_10 = "Arguments will be handled maturely. Benefics in or aspecting the 6th house (representing disputes in the Birth Chart / D1) ensure that dispute resolution is quick, peace-loving, and guided by wisdom rather than ego."
        elif dispute_score <= -1:
            verdict_10 = "Bad"
            explanation_10 = "Placements indicate a tendency for heated arguments or holding onto grudges. Mars/Saturn influence on the 6th house (representing disputes in the Birth Chart / D1) suggests the couple must avoid escalations and practice active cooling-off periods."
        else:
            verdict_10 = "Neutral"
            explanation_10 = "Standard resolution dynamics. Normal disagreements will occur in the 6th house (Birth Chart / D1) parameters, but will be resolved through standard compromise without leaving lasting relationship scars."
            
        topics.append({
            "topic": "How will they handle arguments and disputes?",
            "category": "Conflict Resolution & Remedial Support",
            "verdict": verdict_10,
            "explanation": explanation_10
        })
        
        # Topic 11: Manglik Dosha & Compatibility Safeguards
        b_mang = manglik.get("bride", {}).get("is_manglik", False)
        g_mang = manglik.get("groom", {}).get("is_manglik", False)
        
        if b_mang == g_mang:
            verdict_11 = "Good"
            explanation_11 = f"Excellent alignment! Both are {'Manglik' if b_mang else 'Non-Manglik'} (checked from the Ascendant, Moon, and Venus in both the Birth Chart / D1 and Navamsha / D9 Chart). This results in the natural cancellation (Dosha Samya) of any fiery traits, securing long-term compatibility."
        else:
            verdict_11 = "Bad"
            explanation_11 = f"Unmatched Manglik status: Bride is {'Manglik' if b_mang else 'Non-Manglik'} and Groom is {'Manglik' if g_mang else 'Non-Manglik'} (checked from the Ascendant, Moon, and Venus in both the Birth Chart / D1 and Navamsha / D9 Chart). This requires performing Mars remedies (e.g. Kumbh Vivah or chanting Hanuman Chalisa) to pacify the energy imbalance."
            
        topics.append({
            "topic": "Manglik Dosha & Compatibility Safeguards",
            "category": "Conflict Resolution & Remedial Support",
            "verdict": verdict_11,
            "explanation": explanation_11
        })
        
        return topics
