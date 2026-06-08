def get_aspecting_planets(chart, target_house):
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
