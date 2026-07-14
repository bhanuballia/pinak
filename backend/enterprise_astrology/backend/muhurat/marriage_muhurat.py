# backend/muhurat/marriage_muhurat.py

from enterprise_astrology.backend.muhurat.tara_bala import TaraBalaCalculator
from enterprise_astrology.backend.muhurat.chandrabala import ChandraBalaCalculator

class MarriageMuhuratEvaluator:
    def __init__(self):
        self.tara_calc = TaraBalaCalculator()
        self.chandra_calc = ChandraBalaCalculator()

    def evaluate_marriage_day(self, 
                              bride_moon_sign: int, bride_nakshatra: int,
                              groom_moon_sign: int, groom_nakshatra: int,
                              transit_moon_sign: int, transit_nakshatra: int,
                              venus_combust: bool = False, jupiter_combust: bool = False):
        """
        Evaluate marriage compatibility for a specific transit day.
        Combines Bride and Groom's Tara Bala and Chandra Bala, checking for combustion.
        """
        b_tara = self.tara_calc.calculate_tara_bala(bride_nakshatra, transit_nakshatra)
        g_tara = self.tara_calc.calculate_tara_bala(groom_nakshatra, transit_nakshatra)
        
        b_chandra = self.chandra_calc.calculate_chandra_bala(bride_moon_sign, transit_moon_sign)
        g_chandra = self.chandra_calc.calculate_chandra_bala(groom_moon_sign, transit_moon_sign)
        
        # Base score from composite averages
        base_score = (b_tara["score"] + g_tara["score"] + b_chandra["score"] + g_chandra["score"]) / 4.0
        
        # Penalties for Combustion
        if venus_combust:
            base_score -= 20
        if jupiter_combust:
            base_score -= 20
            
        base_score = max(0.0, min(100.0, base_score))
        
        if base_score >= 80:
            status = "Excellent"
        elif base_score >= 60:
            status = "Good / Auspicious"
        elif base_score >= 40:
            status = "Average / Guarded"
        else:
            status = "Inauspicious / Avoid"
            
        return {
            "score": round(base_score, 2),
            "status": status,
            "bride_tara": b_tara,
            "groom_tara": g_tara,
            "bride_chandra": b_chandra,
            "groom_chandra": g_chandra,
            "combustion_active": venus_combust or jupiter_combust
        }
