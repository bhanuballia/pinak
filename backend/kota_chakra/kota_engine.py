class KotaEngine:
    """
    Calculates the Kota Chakra (Fortress Chakra) using the 28 Nakshatra system.
    """
    
    NAKSHATRAS_28 = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
        "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
        "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
        "Abhijit", "Shravana", "Dhanishta", "Shatabhisha", 
        "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ]

    def __init__(self):
        pass

    def get_28_nakshatra(self, longitude):
        """
        Determine the Nakshatra in the 28-Nakshatra system (including Abhijit).
        Abhijit sits between Uttara Ashadha and Shravana.
        """
        lon = longitude % 360
        if 276.6667 <= lon < 280.8889:
            return 21, "Abhijit"
        
        idx_27 = int(lon / (360 / 27))
        
        if lon >= 280.8889:
            idx_28 = idx_27 + 1
        else:
            idx_28 = idx_27
            
        return idx_28, self.NAKSHATRAS_28[idx_28]

    def generate_kota_chakra(self, janma_nakshatra_idx_28):
        """
        Generates the Kota Chakra layout relative to the Janma Nakshatra.
        Returns the assignment of each of the 28 Nakshatras to:
        - Section: Stambha, Madhya, Prakara, Bahya
        - Path: Aroha (Entering), Avaroha (Exiting)
        """
        kota_pattern = [
            {"step": 1, "section": "Bahya", "path": "Aroha"},
            {"step": 2, "section": "Prakara", "path": "Aroha"},
            {"step": 3, "section": "Madhya", "path": "Aroha"},
            {"step": 4, "section": "Stambha", "path": "Aroha"},
            {"step": 5, "section": "Stambha", "path": "Avaroha"},
            {"step": 6, "section": "Madhya", "path": "Avaroha"},
            {"step": 7, "section": "Prakara", "path": "Avaroha"},
            {"step": 8, "section": "Bahya", "path": "Avaroha"},
            {"step": 9, "section": "Bahya", "path": "Aroha"},
            {"step": 10, "section": "Prakara", "path": "Aroha"},
            {"step": 11, "section": "Madhya", "path": "Aroha"},
            {"step": 12, "section": "Stambha", "path": "Aroha"},
            {"step": 13, "section": "Stambha", "path": "Avaroha"},
            {"step": 14, "section": "Madhya", "path": "Avaroha"},
            {"step": 15, "section": "Prakara", "path": "Avaroha"},
            {"step": 16, "section": "Bahya", "path": "Avaroha"},
            {"step": 17, "section": "Bahya", "path": "Aroha"},
            {"step": 18, "section": "Prakara", "path": "Aroha"},
            {"step": 19, "section": "Madhya", "path": "Aroha"},
            {"step": 20, "section": "Stambha", "path": "Aroha"},
            {"step": 21, "section": "Stambha", "path": "Avaroha"},
            {"step": 22, "section": "Madhya", "path": "Avaroha"},
            {"step": 23, "section": "Prakara", "path": "Avaroha"},
            {"step": 24, "section": "Bahya", "path": "Avaroha"},
            {"step": 25, "section": "Bahya", "path": "Aroha"},
            {"step": 26, "section": "Prakara", "path": "Aroha"},
            {"step": 27, "section": "Madhya", "path": "Aroha"},
            {"step": 28, "section": "Stambha", "path": "Aroha"},
        ]

        chakra_map = []
        for i in range(28):
            n_idx = (janma_nakshatra_idx_28 + i) % 28
            nakshatra_name = self.NAKSHATRAS_28[n_idx]
            
            pattern = kota_pattern[i]
            chakra_map.append({
                "nakshatra_index": n_idx,
                "nakshatra_name": nakshatra_name,
                "section": pattern["section"],
                "path": pattern["path"]
            })
            
        return chakra_map

    def calculate_vulnerability(self, chakra_map, transit_planets):
        """
        transit_planets: dict of planet -> longitude
        """
        results = []
        score = 0
        
        malefics = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]
        benefics = ["Moon", "Mercury", "Jupiter", "Venus"]

        for planet, lon in transit_planets.items():
            n_idx, n_name = self.get_28_nakshatra(lon)
            
            mapping = next((m for m in chakra_map if m["nakshatra_index"] == n_idx), None)
            
            if mapping:
                section = mapping["section"]
                path = mapping["path"]
                
                impact = "Neutral"
                if planet in malefics and path == "Aroha":
                    impact = "Negative (Malefic Entering)"
                    if section == "Stambha":
                        score -= 3
                    else:
                        score -= 1
                elif planet in benefics and path == "Aroha":
                    impact = "Positive (Benefic Entering)"
                    if section == "Stambha":
                        score += 3
                    else:
                        score += 1
                elif planet in malefics and path == "Avaroha":
                    impact = "Positive (Malefic Exiting)"
                    score += 1
                elif planet in benefics and path == "Avaroha":
                    impact = "Negative (Benefic Exiting)"
                    score -= 1
                    
                results.append({
                    "planet": planet,
                    "nakshatra": n_name,
                    "section": section,
                    "path": path,
                    "impact": impact
                })
                
        return {
            "vulnerability_score": score,
            "planet_positions": results
        }
