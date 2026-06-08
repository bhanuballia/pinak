# backend/muhurat/tara_bala.py

class TaraBalaCalculator:
    TARA_NAMES = {
        1: "Janma (Body / Health Alert)",
        2: "Sampat (Wealth / Prosperity)",
        3: "Vipat (Obstacles / Losses)",
        4: "Kshema (Safety / Well-being)",
        5: "Pratyak (Opposition / Disputes)",
        6: "Sadhana (Success / Achievement)",
        7: "Naidhana (Danger / Avoid crucial actions)",
        8: "Mitra (Friendly / Cooperation)",
        9: "Ati-Mitra (Extremely Auspicious)"
    }
    
    TARA_AUSPICIOUSNESS = {
        1: False,
        2: True,
        3: False,
        4: True,
        5: False,
        6: True,
        7: False,
        8: True,
        9: True
    }

    def calculate_tara_bala(self, birth_nakshatra_idx: int, transit_nakshatra_idx: int):
        """
        Calculates Tara Bala given 1-based indices (1 to 27) for birth and transit Nakshatras.
        """
        # Ensure 1-based index within 1-27 range
        b_idx = (birth_nakshatra_idx - 1) % 27 + 1
        t_idx = (transit_nakshatra_idx - 1) % 27 + 1
        
        diff = (t_idx - b_idx + 27) % 27
        tara_value = (diff + 1) % 9
        if tara_value == 0:
            tara_value = 9
            
        is_good = self.TARA_AUSPICIOUSNESS.get(tara_value, False)
        tara_name = self.TARA_NAMES.get(tara_value, "Unknown")
        
        return {
            "tara_value": tara_value,
            "tara_name": tara_name,
            "is_auspicious": is_good,
            "score": 100 if tara_value in [2, 4, 6, 8, 9] else 30
        }
