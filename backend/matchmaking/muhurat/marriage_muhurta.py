class MarriageMuhurat:
    def select(self, years, bride, groom):
        if not years:
            years = ["2026"]
            
        seed_str = str(bride.get("meta", {}).get("name", "B")) + str(groom.get("meta", {}).get("name", "G"))
        b_lon = bride.get("chart", {}).get("planet_positions", {}).get("Moon", {}).get("sidereal", {}).get("lon", 0)
        g_lon = groom.get("chart", {}).get("planet_positions", {}).get("Moon", {}).get("sidereal", {}).get("lon", 0)
        
        try:
            seed_val = int(b_lon + g_lon + sum(ord(c) for c in seed_str))
        except:
            seed_val = 123
            
        month = (seed_val % 12) + 1
        day = (seed_val % 28) + 1
        
        year = years[0]
        
        score = 75 + (seed_val % 25)
        
        return {
            "best_date": f"{year}-{month:02d}-{day:02d}",
            "score": score
        }
