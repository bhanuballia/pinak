class KPMarriageTiming:
    """
    KP-based event timing.
    """
    MARRIAGE_HOUSES = [2, 7, 11]

    def predict(self, chart, dasha=None):
        if dasha is None:
            dasha = {}
            
        active = []
        houses = chart.get("houses", {})
        
        # Find planets in houses 2, 7, 11
        for h in self.MARRIAGE_HOUSES:
            h_data = houses.get(h) or houses.get(str(h)) or {}
            h_planets = h_data.get("planets", [])
            for p in h_planets:
                name = p.get("name") if isinstance(p, dict) else p
                if name and name not in active:
                    active.append(name)
                    
        is_db_active = False
        if active and dasha:
            current_dasha = dasha.get("current", {})
            dasha_lord = current_dasha.get("lord") if isinstance(current_dasha, dict) else str(current_dasha)
            
            # Simple bhukti lord approximation by just taking the first antardasha lord
            # Better to get the current one by JD, but this is a fallback
            antardashas = current_dasha.get("antardashas", [])
            bhukti_lord = antardashas[0].get("lord") if antardashas and isinstance(antardashas[0], dict) else None
            
            if dasha_lord in active or bhukti_lord in active:
                is_db_active = True
            elif len(active) >= 2:
                # Fallback: if multiple strong significators but DB lords not directly matched or missing
                is_db_active = True

        return {
            "active_planets": active,
            "event_probability": "HIGH" if len(active) >= 2 else "LOW",
            "is_active": is_db_active
        }
