def apply_transit_activation(windows, chart):
    """
    Apply transit-based amplification to the calculated age windows.
    """
    # For now, a simplified activation logic. 
    # In a real implementation, this would look at current planet positions vs birth chart.
    for w in windows:
        lord = w.get("lord")
        
        # Simplified: if the lord is in a Kendra (1,4,7,10) in the birth chart, amplify.
        is_active = False
        houses = chart.get("houses", {})
        for h_num, house_data in houses.items():
            if lord in house_data.get("planets", []):
                if int(h_num) in [1, 4, 7, 10]:
                    is_active = True
                break
        
        w["transit_active"] = is_active
        if is_active:
            w["potential"] = "Peak" if w["potential"] == "High" else "Strong"
            
    return windows
