# backend/websocket/transit_alerts.py

class TransitAlertEngine:
    def check_alerts(self, natal_houses: dict, transit_positions: dict, date_str: str = "2026-05-20"):
        """
        Check for major/critical transits:
        - Saturn transiting the 7th house from natal Ascendant or natal Moon.
        - Jupiter transiting the 2nd house.
        - Mars transiting the 8th house.
        """
        alerts = []
        
        # In a real engine, we calculate the house relative to Ascendant or Moon.
        # Let's check the transiting planet's active house placements.
        for planet, info in transit_positions.items():
            house = info.get("house")
            sign = info.get("sign", "Aries")
            
            if planet == "Saturn" and house == 7:
                alerts.append({
                    "planet": "Saturn",
                    "house": 7,
                    "transit_sign": sign,
                    "severity": "HIGH",
                    "message": "Saturn transiting your 7th house of partnerships. Expect testing, restructuring, and maturity demands in relationships.",
                    "date": date_str
                })
            elif planet == "Jupiter" and house == 2:
                alerts.append({
                    "planet": "Jupiter",
                    "house": 2,
                    "transit_sign": sign,
                    "severity": "LOW",
                    "message": "Jupiter transiting your 2nd house of wealth and family. Auspicious period for financial growth and harmonious communication.",
                    "date": date_str
                })
            elif planet == "Mars" and house == 8:
                alerts.append({
                    "planet": "Mars",
                    "house": 8,
                    "transit_sign": sign,
                    "severity": "HIGH",
                    "message": "Mars transiting your 8th house. High energy but watch out for sudden disputes, driving hazards, or minor health issues.",
                    "date": date_str
                })
        return alerts
