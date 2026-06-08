import os

base_dir = r'd:\vedic-astrology-app - 2 - okFinal - Deploy\matchmaking'

files = {
    r'core\ultra\utils.py': '''def get_aspecting_planets(chart, target_house):
    """
    Returns a list of planets aspecting the target_house.
    Implements standard 7th house aspect, plus special Vedic aspects:
    Mars: 4, 7, 8
    Jupiter: 5, 7, 9
    Saturn: 3, 7, 10
    """
    aspecting = []
    houses = chart.get("houses", {})
    
    for h in range(1, 13):
        if h == target_house:
            continue
            
        h_planets = houses.get(h, {}).get("planets", [])
        h_planets = [p["name"] if isinstance(p, dict) else p for p in h_planets]
        
        distance = (target_house - h) % 12
        if distance <= 0:
            distance += 12
            
        for p in h_planets:
            if distance == 7:
                aspecting.append(p)
            elif p == "Mars" and distance in [4, 8]:
                aspecting.append(p)
            elif p == "Jupiter" and distance in [5, 9]:
                aspecting.append(p)
            elif p == "Saturn" and distance in [3, 10]:
                aspecting.append(p)
                
    return list(set(aspecting))
''',
    r'emotional\intimacy_analysis.py': '''from matchmaking.core.ultra.utils import get_aspecting_planets

class IntimacyAnalysisEngine:
    def analyze(self, bride, groom):
        score = 60
        desc = []
        
        for person_name, person_data in [("Bride", bride), ("Groom", groom)]:
            chart = person_data.get("chart", {})
            houses = chart.get("houses", {})
            
            h8 = houses.get(8, {}).get("planets", [])
            h12 = houses.get(12, {}).get("planets", [])
            
            h8_p = [p["name"] if isinstance(p, dict) else p for p in h8]
            h12_p = [p["name"] if isinstance(p, dict) else p for p in h12]
            
            # Check for direct placements
            if "Venus" in h12_p: score += 15
            if "Mars" in h8_p: score += 10
            
            # Check for aspects
            aspects_h8 = get_aspecting_planets(chart, 8)
            aspects_h12 = get_aspecting_planets(chart, 12)
            
            if "Venus" in aspects_h8: score += 10
            if "Jupiter" in aspects_h12: score += 10
            if "Saturn" in aspects_h12 or "Saturn" in aspects_h8: score -= 15
            if "Rahu" in aspects_h12: score -= 10
            
        return {
            "score": min(100, max(0, score)),
            "description": "Excellent physical compatibility." if score >= 75 else "Moderate compatibility." if score >= 50 else "Requires mutual effort."
        }
''',
    r'family\family_harmony.py': '''from matchmaking.core.ultra.utils import get_aspecting_planets

class FamilyHarmonyEngine:
    def analyze(self, bride, groom):
        score = 50
        
        for person_name, person_data in [("Bride", bride), ("Groom", groom)]:
            chart = person_data.get("chart", {})
            houses = chart.get("houses", {})
            
            h2 = houses.get(2, {}).get("planets", [])
            h4 = houses.get(4, {}).get("planets", [])
            
            h2_p = [p["name"] if isinstance(p, dict) else p for p in h2]
            h4_p = [p["name"] if isinstance(p, dict) else p for p in h4]
            
            if "Jupiter" in h2_p or "Venus" in h2_p: score += 10
            if "Jupiter" in h4_p or "Moon" in h4_p: score += 10
            
            aspects_h4 = get_aspecting_planets(chart, 4)
            if "Saturn" in aspects_h4: score -= 10
            if "Mars" in aspects_h4: score -= 10
            if "Jupiter" in aspects_h4: score += 15
            
        return {
            "score": min(100, max(0, score)),
            "description": "High likelihood of domestic peace and harmonious family integration." if score >= 70 else "Average domestic environment."
        }
''',
    r'advanced\synastry_engine.py': '''class SynastryEngine:
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
'''
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    # Ensure dir exists
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)
print('Synastry and Aspect Math implemented.')
