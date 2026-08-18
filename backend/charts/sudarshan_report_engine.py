# backend/charts/sudarshan_report_engine.py

class SudarshanReportEngine:
    def generate(self, house_synthesis):
        """
        Generates a personalized, AI-style text report for Sudarshan Chakra
        based on the 'house_synthesis' array.
        """
        sentences = []
        focused_houses = [h for h in house_synthesis if h.get("is_focused_house")]
        
        if not focused_houses:
            return "Your Sudarshan Chakra shows a highly balanced planetary distribution across the physical (Lagna), emotional (Chandra), and spiritual (Surya) domains. No single sector is excessively heavily weighted, indicating a well-rounded approach to life's challenges without extreme hyper-focus on one specific area."
            
        sentences.append(f"Analysis of your Sudarshan Chakra reveals significant multi-dimensional planetary focus in {len(focused_houses)} specific sector(s) of your life.")
        
        for h in focused_houses:
            house_num = h["house"]
            total_planets = h["impact_score"]
            lagna_p = h.get("lagna_planets", [])
            chandra_p = h.get("chandra_planets", [])
            surya_p = h.get("surya_planets", [])
            
            # Identify prominent planets across rings
            all_planets = lagna_p + chandra_p + surya_p
            unique_planets = list(set(all_planets))
            
            # Simple domain mapping
            domains = {
                1: "Physical vitality, self-identity, and overall life path",
                2: "Wealth accumulation, family dynamics, and speech",
                3: "Courage, sibling relationships, and communication skills",
                4: "Domestic happiness, inner peace, and maternal influences",
                5: "Intellectual pursuits, creativity, and children",
                6: "Overcoming obstacles, health management, and daily routines",
                7: "Marriage, business partnerships, and public dealings",
                8: "Transformation, hidden matters, and unexpected changes",
                9: "Higher learning, dharma, and fortune",
                10: "Career achievements, public status, and authority",
                11: "Gains, large networks, and fulfillment of desires",
                12: "Spiritual liberation, expenses, and foreign connections"
            }
            
            domain_desc = domains.get(house_num, "key areas of life")
            
            planet_str = ", ".join(unique_planets) if unique_planets else "several planets"
            
            sentences.append(f"\n• House {house_num} Focus ({domain_desc}):")
            sentences.append(f"This sector holds a massive impact score of {total_planets} planetary influences across your Lagna, Chandra, and Surya charts. The combined energies of {planet_str} simultaneously trigger this house on physical, mental, and soul levels. Expect profound, undeniable manifestations and deep karmic experiences related to these domains.")
            
            # Add specific malefic/benefic flavor
            malefics = [p for p in unique_planets if p in ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]]
            benefics = [p for p in unique_planets if p in ["Moon", "Mercury", "Jupiter", "Venus"]]
            
            if len(malefics) > len(benefics):
                sentences.append(f"  > Actionable Advice: With prominent malefic influence ({', '.join(malefics)}) converging here, you must actively manage stress, delays, or intense challenges in this area. Patience and disciplined action are required.")
            elif len(benefics) > len(malefics):
                sentences.append(f"  > Actionable Advice: The strong benefic presence ({', '.join(benefics)}) provides immense protective grace. Capitalize on opportunities and blessings arising in this domain.")
            else:
                sentences.append("  > Actionable Advice: A mixed blend of energies exists here. Balance aggressive ambition with wisdom and tact.")
                
        sentences.append("\nSummary: The Sudarshan Chakra confirms that events related to these focused houses will manifest with absolute certainty, as they are imprinted simultaneously across your body, mind, and soul.")
        
        return "\n".join(sentences)
