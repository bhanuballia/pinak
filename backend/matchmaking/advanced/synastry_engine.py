class SynastryEngine:
    def analyze(self, bride, groom):
        # Extremely basic mock synastry using raw placements
        score = 50
        details = []
        
        bc = bride.get("chart", {}).get("houses", {})
        gc = groom.get("chart", {}).get("houses", {})
        
        # Build maps of planet to house for both
        bp = {}
        for h, d in bc.items():
            for p in d.get("planets", []):
                name = p["name"] if isinstance(p, dict) else p
                bp[name] = int(h)
                
        gp = {}
        for h, d in gc.items():
            for p in d.get("planets", []):
                name = p["name"] if isinstance(p, dict) else p
                gp[name] = int(h)
                
        # Check Venus-Mars alignment
        if bp.get("Venus") == gp.get("Mars"):
            score += 25
            details.append("Bride's Venus is conjunct Groom's Mars (Excellent Passion)")
        
        if bp.get("Moon") == gp.get("Sun") or gp.get("Moon") == bp.get("Sun"):
            score += 25
            details.append("Sun-Moon Conjunction across charts (Soulmate Indicator)")
            
        return {
            "score": min(100, max(0, score)),
            "details": details
        }
