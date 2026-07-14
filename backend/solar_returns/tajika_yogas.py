# solar_returns/tajika_yogas.py

PLANET_SPEED_ORDER = {
    "Moon": 1,
    "Mercury": 2,
    "Venus": 3,
    "Sun": 4,
    "Mars": 5,
    "Jupiter": 6,
    "Saturn": 7
}

DEEPTAMSA = {
    "Sun": 15.0,
    "Moon": 12.0,
    "Mars": 8.0,
    "Mercury": 7.0,
    "Jupiter": 9.0,
    "Venus": 7.0,
    "Saturn": 9.0
}

def get_orb(p1, p2):
    return (DEEPTAMSA[p1] + DEEPTAMSA[p2]) / 2.0

def has_aspect(p1_sign, p2_sign):
    # Returns type of aspect: 'friendly', 'inimical', or None
    diff = (p2_sign - p1_sign) % 12
    house = diff + 1
    if house in [3, 5, 9, 11]:
        return 'friendly'
    elif house in [1, 4, 7, 10]:
        return 'inimical'
    return None

def check_tajika_aspect(p1, p2, pos1, pos2):
    # pos is a dict: {"degree": float, "sign_index": int, ...}
    sign1 = pos1["sign_index"]
    sign2 = pos2["sign_index"]
    
    aspect_type = has_aspect(sign1, sign2)
    if not aspect_type:
        return False, None
        
    deg1_in_sign = pos1["degree"] % 30
    deg2_in_sign = pos2["degree"] % 30
    
    orb = get_orb(p1, p2)
    if abs(deg1_in_sign - deg2_in_sign) <= orb:
        return True, aspect_type
    return False, None

def is_faster(p1, p2):
    # Returns True if p1 is faster than p2
    return PLANET_SPEED_ORDER[p1] < PLANET_SPEED_ORDER[p2]

def check_ithasala(p1, p2, pos1, pos2):
    in_aspect, _ = check_tajika_aspect(p1, p2, pos1, pos2)
    if not in_aspect:
        return False
        
    deg1 = pos1["degree"] % 30
    deg2 = pos2["degree"] % 30
    
    faster = p1 if is_faster(p1, p2) else p2
    slower = p2 if faster == p1 else p1
    deg_faster = deg1 if faster == p1 else deg2
    deg_slower = deg2 if slower == p2 else deg1
    
    # Faster planet must be "behind" (lesser degree)
    # Note: If retrograde, logic changes, but we simplify per standard rules
    if deg_faster < deg_slower:
        return True
    return False

def check_esharpha(p1, p2, pos1, pos2):
    in_aspect, _ = check_tajika_aspect(p1, p2, pos1, pos2)
    if not in_aspect:
        return False
        
    deg1 = pos1["degree"] % 30
    deg2 = pos2["degree"] % 30
    
    faster = p1 if is_faster(p1, p2) else p2
    slower = p2 if faster == p1 else p1
    deg_faster = deg1 if faster == p1 else deg2
    deg_slower = deg2 if slower == p2 else deg1
    
    # Faster planet is "ahead" (greater degree)
    if deg_faster >= deg_slower: # Includes equal degree crossing
        return True
    return False

def get_strong_planets(planet_positions, ascendant_sign):
    # Simplified strength: in own sign or exalted
    # Exaltations: Sun:0, Moon:1, Mars:9, Mer:5, Jup:3, Ven:11, Sat:6
    exalt = {"Sun": 0, "Moon": 1, "Mars": 9, "Mercury": 5, "Jupiter": 3, "Venus": 11, "Saturn": 6}
    own = {"Sun": [4], "Moon": [3], "Mars": [0, 7], "Mercury": [2, 5], "Jupiter": [8, 11], "Venus": [1, 6], "Saturn": [9, 10]}
    
    strong = []
    for p, pos in planet_positions.items():
        if p in ["Rahu", "Ketu"]: continue
        sign = pos["sign_index"]
        if sign == exalt.get(p) or sign in own.get(p, []):
            strong.append(p)
    return strong

def calculate_16_yogas(planet_positions, lagnesh, karyesh):
    # planet_positions: dict of planet name to pos dict
    
    # 1. Iqabala: All planets (Sun-Sat) in Kendras (1,4,7,10) or Panapharas (2,5,8,11)
    # i.e., NO planet in Apoklimas (3,6,9,12)
    iqabala = True
    induvara = True
    for p in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]:
        house = planet_positions[p]["house"]
        if house in [3, 6, 9, 12]:
            iqabala = False
        else:
            induvara = False # If any planet is not in Apoklima, Induvara is false
            
    # For yogas 3-16, we mainly look at Lagnesh and Karyesh
    pos1 = planet_positions[lagnesh]
    pos2 = planet_positions[karyesh]
    
    ithasala = check_ithasala(lagnesh, karyesh, pos1, pos2)
    esharpha = check_esharpha(lagnesh, karyesh, pos1, pos2)
    
    # 5. Nakata: No aspect between L and K. A faster planet aspects both.
    in_aspect, _ = check_tajika_aspect(lagnesh, karyesh, pos1, pos2)
    nakata = False
    yamaya = False
    
    if not in_aspect:
        for p in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]:
            if p == lagnesh or p == karyesh: continue
            if is_faster(p, lagnesh) and is_faster(p, karyesh):
                has_a1, _ = check_tajika_aspect(p, lagnesh, planet_positions[p], pos1)
                has_a2, _ = check_tajika_aspect(p, karyesh, planet_positions[p], pos2)
                if has_a1 and has_a2:
                    nakata = True
            if not is_faster(p, lagnesh) and not is_faster(p, karyesh):
                has_a1, _ = check_tajika_aspect(p, lagnesh, planet_positions[p], pos1)
                has_a2, _ = check_tajika_aspect(p, karyesh, planet_positions[p], pos2)
                if has_a1 and has_a2:
                    yamaya = True
                    
    # 7. Manua: L & K in Ithasala. Saturn or Mars inimically aspects the faster.
    manua = False
    faster_lk = lagnesh if is_faster(lagnesh, karyesh) else karyesh
    if ithasala:
        for malefic in ["Saturn", "Mars"]:
            if malefic == faster_lk: continue
            has_asp, asp_type = check_tajika_aspect(malefic, faster_lk, planet_positions[malefic], planet_positions[faster_lk])
            if has_asp and asp_type == 'inimical':
                manua = True
                
    # 8. Kamboola: Ithasala. Moon aspects one/both from behind.
    kamboola = False
    if ithasala and lagnesh != "Moon" and karyesh != "Moon":
        posM = planet_positions["Moon"]
        asp_l, _ = check_tajika_aspect("Moon", lagnesh, posM, pos1)
        asp_k, _ = check_tajika_aspect("Moon", karyesh, posM, pos2)
        if asp_l or asp_k:
            degM = posM["degree"] % 30
            # Is behind? (Moon is fastest, so behind means less degree)
            if (asp_l and degM < (pos1["degree"] % 30)) or (asp_k and degM < (pos2["degree"] % 30)):
                kamboola = True
                
    # 9. Gairi-Kamboola: Moon on last degree, no current aspect, but aspects on entering next sign.
    gairi_kamboola = False
    khallsara = False
    if ithasala and lagnesh != "Moon" and karyesh != "Moon":
        degM = planet_positions["Moon"]["degree"] % 30
        if not kamboola:
            if degM >= 29:
                gairi_kamboola = True # Simplified approximation
            else:
                khallsara = True # Moon is not associating
                
    # 11. Rudda: Ithasala. Either is retrograde, combust (ignored for simplicity), debilitated, 6/8/12, etc.
    rudda = False
    if ithasala:
        for p, pos in [(lagnesh, pos1), (karyesh, pos2)]:
            if pos["is_retrograde"] or pos["house"] in [6, 8, 12]:
                rudda = True
                
    strong_planets = get_strong_planets(planet_positions, 0)
    
    # 12. Duphali-Kutta: Ithasala. Slower is strong, faster is weak.
    duphali = False
    faster_lk = lagnesh if is_faster(lagnesh, karyesh) else karyesh
    slower_lk = karyesh if faster_lk == lagnesh else lagnesh
    if ithasala:
        if slower_lk in strong_planets and faster_lk not in strong_planets:
            duphali = True
            
    # 13. Dutthotta-Daivira: Two weak. One in Ithasala with a strong planet.
    dutt = False
    if lagnesh not in strong_planets and karyesh not in strong_planets:
        for strong_p in strong_planets:
            if strong_p == lagnesh or strong_p == karyesh: continue
            if check_ithasala(lagnesh, strong_p, pos1, planet_positions[strong_p]) or check_ithasala(karyesh, strong_p, pos2, planet_positions[strong_p]):
                dutt = True
                break
                
    # 14. Tambira: L & K no aspect. Karyesh in last degree, establishes aspect on next sign.
    tambira = False
    if not in_aspect:
        if (pos2["degree"] % 30) >= 29:
            tambira = True # Simplified
            
    # 15. Kutta: L & K powerful in Kendras/Panapharas, benefic aspects.
    kutta = False
    if lagnesh in strong_planets and karyesh in strong_planets:
        if pos1["house"] not in [3,6,9,12] and pos2["house"] not in [3,6,9,12]:
            kutta = True
            
    # 16. Durupha: L & K weak, in 6/8/12, retro/combust.
    durupha = False
    if lagnesh not in strong_planets and karyesh not in strong_planets:
        if pos1["house"] in [6,8,12] and pos2["house"] in [6,8,12]:
            durupha = True
            
    return [
        {"no": 1, "name": "Iqabala Yoga", "present": iqabala},
        {"no": 2, "name": "Induvara Yoga", "present": induvara},
        {"no": 3, "name": "Ithasala Yoga", "present": ithasala},
        {"no": 4, "name": "Esharpha Yoga", "present": esharpha},
        {"no": 5, "name": "Nakata Yoga", "present": nakata},
        {"no": 6, "name": "Yamaya Yoga", "present": yamaya},
        {"no": 7, "name": "Manua Yoga", "present": manua},
        {"no": 8, "name": "Kamboola Yoga", "present": kamboola},
        {"no": 9, "name": "Gairi-Kamboola Yoga", "present": gairi_kamboola},
        {"no": 10, "name": "Khallsara Yoga", "present": khallsara},
        {"no": 11, "name": "Rudda Yoga", "present": rudda},
        {"no": 12, "name": "Duphali-Kutta Yoga", "present": duphali},
        {"no": 13, "name": "Dutthotta-Daivira Yoga", "present": dutt},
        {"no": 14, "name": "Tambira Yoga", "present": tambira},
        {"no": 15, "name": "Kutta Yoga", "present": kutta},
        {"no": 16, "name": "Durupha Yoga", "present": durupha},
    ]
