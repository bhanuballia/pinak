
import os

append_code = r'''
def _analyze_health(houses, planets, strength, dasha=None) -> Any:
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    SIGN_LORDS = {0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"}

    def get_house_lord(h_num):
        h = houses.get(str(h_num), {})
        si = h.get("sign_index")
        if si is None and h.get("cusp_deg") is not None:
            si = int(h["cusp_deg"] / 30)
        return SIGN_LORDS.get(si, "Unknown")

    h1 = houses.get("1", {})
    h6 = houses.get("6", {})
    h8 = houses.get("8", {})
    lord_1 = get_house_lord(1)
    
    sun_strength = strength.get("Sun", {}).get("total", 60.0)
    moon_strength = strength.get("Moon", {}).get("total", 60.0)
    mars_strength = strength.get("Mars", {}).get("total", 60.0)
    
    h_score, h_notes = 0, []
    
    # 1. 1st House & Lord (35)
    s1, p1 = 15, pnames(h1)
    if any(p in {"Jupiter", "Venus", "Sun"} for p in p1): s1 += 10; h_notes.append("Benefics in 1st -> Strong physical constitution")
    if any(p in {"Saturn", "Rahu", "Mars"} for p in p1): s1 -= 8; h_notes.append("Malefics in 1st -> Physical stress or low immunity")
    # Lord 1 Strength (Simulated)
    s1 += 10 
    h_score += max(0, min(35, s1))
    
    # 2. 6th House (Fighting Disease) (20)
    s6, p6 = 10, pnames(h6)
    if any(p in {"Mars", "Saturn", "Rahu"} for p in p6): 
        s6 += 10; h_notes.append("Malefics in 6th (Upachaya) -> Strong ability to fight disease")
    if any(p in {"Venus", "Jupiter"} for p in p6):
        s6 -= 5; h_notes.append("Benefics in 6th -> Prone to lifestyle/sugar diseases")
    h_score += max(0, min(20, s6))
    
    # 3. Sun Strength (Vitality) (15)
    s_sun = round((sun_strength - 40) / 4)
    h_score += max(0, min(15, s_sun))
    if sun_strength < 50: h_notes.append("Weak Sun -> Low vitality and slow recovery")
    
    # 4. Moon Strength (Stability) (15)
    s_moon = round((moon_strength - 40) / 4)
    h_score += max(0, min(15, s_moon))
    if moon_strength < 50: h_notes.append("Weak Moon -> Prone to seasonal or fluid-based illness")
    
    # 5. 8th House (Longevity) (15)
    s8, p8 = 8, pnames(h8)
    if any(p in {"Saturn"} for p in p8): s8 += 7; h_notes.append("Saturn in 8th -> Promotes longevity")
    if any(p in {"Mars", "Rahu"} for p in p8): s8 -= 5; h_notes.append("Malefics in 8th -> Sudden health risks")
    h_score += max(0, min(15, s8))
    
    final_score = max(0, min(100, h_score))
    label, color = ("Robust Health", "excellent") if final_score >= 80 else ("Stable", "good") if final_score >= 60 else ("Vulnerable", "average") if final_score >= 40 else ("High Risk", "risk")
    
    remedies = ["Offer water to Sun daily (Surya Arghya)", "Daily 20 mins physical activity", "Donate Red Lentils (Mars) if weak", "Pranayama for vitality", "Regular medical checkups"]
    
    return {
        "score": final_score, "label": label, "color": color, "notes": h_notes,
        "remedies": remedies,
        "organs_to_watch": ["Heart & BP" if sun_strength < 55 else "Bones & Joints" if strength.get("Saturn", {}).get("total", 60) < 55 else "Digestion"],
        "planets": [
            {"name": "Sun", "role": "Immunity/Vitality", "strength": f"{sun_strength:.0f}/150"},
            {"name": "Mars", "role": "Fighting Power", "strength": f"{mars_strength:.0f}/150"}
        ],
        "note": "6th house malefic presence is actually a blessing for fighting enemies and disease."
    }
'''

filepath = r'd:\vedic-astrology-app\core\analysis\life_oracle.py'
lines = open(filepath, 'r', encoding='utf-8').readlines()

start_idx = -1
for i, line in enumerate(lines):
    if 'def _analyze_health' in line:
        start_idx = i
        break

end_idx = -1
for i in range(start_idx + 1, len(lines)):
    if 'def ' in lines[i] and '_analyze_health' not in lines[i]:
        end_idx = i
        break

if start_idx != -1:
    new_lines = lines[:start_idx] + [append_code] + lines[end_idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Function _analyze_health updated at index {start_idx}")
