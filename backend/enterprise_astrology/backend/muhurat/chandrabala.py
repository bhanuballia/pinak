# backend/muhurat/chandrabala.py

class ChandraBalaCalculator:
    # 1-based offset from natal Moon sign: 1, 3, 6, 7, 10, 11 are auspicious.
    AUSPICIOUS_HOUSES = {1, 3, 6, 7, 10, 11}
    
    def calculate_chandra_bala(self, birth_moon_sign: int, transit_moon_sign: int):
        """
        Calculates Chandra Bala given 1-based sign index (1 to 12) for birth and transit Moon.
        """
        b_sign = (birth_moon_sign - 1) % 12 + 1
        t_sign = (transit_moon_sign - 1) % 12 + 1
        
        house_pos = (t_sign - b_sign + 12) % 12 + 1
        
        is_auspicious = house_pos in self.AUSPICIOUS_HOUSES
        
        # Determine status description
        if house_pos == 8:
            status_desc = "Ashtama Chandra (Very Adverse: Avoid all major undertakings)"
            score = 10
        elif house_pos == 12:
            status_desc = "12th House Transit (Adverse: High expenditure, mental anxiety)"
            score = 25
        elif house_pos == 4:
            status_desc = "4th House Transit (Kalyani / Moderate Obstacles)"
            score = 45
        elif is_auspicious:
            status_desc = f"Auspicious position ({house_pos} house transit: Success and mental clarity)"
            score = 100
        else:
            status_desc = f"Neutral/Weak position ({house_pos} house transit)"
            score = 60
            
        return {
            "house_position": house_pos,
            "status_description": status_desc,
            "is_auspicious": is_auspicious,
            "score": score
        }
