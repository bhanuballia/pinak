# jaimini_system/chara_dasha.py

class CharaDasha:
    SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    
    PRIMARY_LORDS = {
        "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
        "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
        "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
    }

    def __init__(self, chart):
        self.chart = chart

    def get_sign_index(self, sign_name):
        return self.SIGNS.index(sign_name)

    def get_planet_sign(self, planet_name):
        for h, data in self.chart.get("houses", {}).items():
            for p in data.get("planets", []):
                if p["name"] == planet_name:
                    return data["sign_name"]
        return "Aries" # fallback

    def get_dasha_sequence(self, lagna_sign):
        lagna_idx = self.get_sign_index(lagna_sign)
        seq = []
        is_odd = (lagna_idx % 2 == 0) # Aries is 0 (even index, but 1st sign, so Odd)
        
        for i in range(12):
            if is_odd:
                seq.append(self.SIGNS[(lagna_idx + i) % 12])
            else:
                seq.append(self.SIGNS[(lagna_idx - i) % 12])
        return seq

    def calculate_duration(self, sign_name):
        lord = self.PRIMARY_LORDS[sign_name]
        lord_sign = self.get_planet_sign(lord)
        
        sign_idx = self.get_sign_index(sign_name)
        lord_idx = self.get_sign_index(lord_sign)
        
        if sign_idx == lord_idx:
            return 12
            
        is_odd = (sign_idx % 2 == 0) # 1st sign (Aries) = Odd, 2nd (Taurus) = Even
        
        if is_odd:
            # Count forward from sign to lord
            diff = (lord_idx - sign_idx) % 12
        else:
            # Count backward from sign to lord
            diff = (sign_idx - lord_idx) % 12
            
        duration = diff
        return duration if duration > 0 else 12

    def calculate(self, birth_jd, lagna_sign):
        sequence = self.get_dasha_sequence(lagna_sign)
        dashas = []
        
        current_jd = birth_jd
        for sign in sequence:
            dur = self.calculate_duration(sign)
            # 1 solar year ~ 365.2425 days
            dur_days = dur * 365.2425
            
            # Sub-periods (Antardashas) logic
            # Same sequence logic from the Mahadasha sign
            ad_seq = self.get_dasha_sequence(sign)
            ad_dur = dur_days / 12.0
            
            antardashas = []
            ad_current_jd = current_jd
            for ad_sign in ad_seq:
                antardashas.append({
                    "sign": ad_sign,
                    "start_jd": ad_current_jd,
                    "end_jd": ad_current_jd + ad_dur,
                    "duration_years": dur / 12.0
                })
                ad_current_jd += ad_dur
                
            dashas.append({
                "sign": sign,
                "start_jd": current_jd,
                "end_jd": current_jd + dur_days,
                "duration_years": dur,
                "antardashas": antardashas
            })
            current_jd += dur_days
            
        return dashas
