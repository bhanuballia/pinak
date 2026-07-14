# matchmaking/jaimini/jaimini_engine.py

from typing import Dict, Any, Tuple
from core.utils import get_sign_index

class JaiminiEngine:
    def __init__(self):
        # 0-indexed sign rulerships
        # 0:Aries, 1:Taurus, 2:Gemini, 3:Cancer, 4:Leo, 5:Virgo,
        # 6:Libra, 7:Scorpio, 8:Sagittarius, 9:Capricorn, 10:Aquarius, 11:Pisces
        self.sign_lords = {
            0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
            4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars", # Co-lord Ketu handled specially
            8: "Jupiter", 9: "Saturn", 10: "Saturn", # Co-lord Rahu handled specially
            11: "Jupiter"
        }
        self.karaka_planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]

    def calculate(self, chart: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates Jaimini Karakas and Lagnas.
        """
        planet_positions = chart.get("planet_positions", {})
        houses = chart.get("houses", {})
        
        dk = self._calculate_dara_karaka(planet_positions)
        ul_sign = self._calculate_upapada_lagna(planet_positions, houses)
        a7_sign = self._calculate_darapada(planet_positions, houses)
        
        return {
            "dara_karaka": dk,
            "upapada_lagna": ul_sign,
            "darapada": a7_sign
        }

    def _calculate_dara_karaka(self, planet_positions: Dict[str, Any]) -> str:
        lowest_degree = 31.0
        dk_planet = "Venus" # fallback
        
        for p in self.karaka_planets:
            pos = planet_positions.get(p)
            if pos:
                # Need to handle different possible structures of planet_positions
                if "sidereal" in pos:
                    lon = pos["sidereal"].get("lon", 0.0)
                elif "degree" in pos:
                    lon = pos.get("degree", 0.0)
                else:
                    lon = pos.get("lon", 0.0)
                    
                deg_in_sign = lon % 30.0
                if deg_in_sign < lowest_degree:
                    lowest_degree = deg_in_sign
                    dk_planet = p
                    
        return dk_planet

    def _get_planet_sign_index(self, planet: str, planet_positions: Dict[str, Any]) -> int:
        pos = planet_positions.get(planet)
        if not pos:
            return 0
            
        if "sign_index" in pos:
            return pos["sign_index"]
        elif "sidereal" in pos:
            return get_sign_index(pos["sidereal"].get("lon", 0.0))
        elif "degree" in pos:
            return get_sign_index(pos.get("degree", 0.0))
        elif "lon" in pos:
            return get_sign_index(pos.get("lon", 0.0))
        return 0

    def _get_house_sign_index(self, h_num: int, houses: Dict[str, Any]) -> int:
        h_data = houses.get(h_num) or houses.get(str(h_num))
        if h_data:
            if "sign_index" in h_data:
                return h_data["sign_index"]
            elif "cusp_deg" in h_data:
                return get_sign_index(h_data["cusp_deg"])
        return 0

    def _get_stronger_lord(self, sign_idx: int, planet_positions: Dict[str, Any]) -> str:
        """
        Determines the stronger lord for Scorpio (Mars/Ketu) and Aquarius (Saturn/Rahu).
        Using a simplified logic: if co-lord is conjoined with more planets, it's stronger.
        Otherwise, default to primary lord.
        """
        if sign_idx == 7:
            primary, co = "Mars", "Ketu"
        elif sign_idx == 10:
            primary, co = "Saturn", "Rahu"
        else:
            return self.sign_lords.get(sign_idx, "Sun")
            
        prim_sign = self._get_planet_sign_index(primary, planet_positions)
        co_sign = self._get_planet_sign_index(co, planet_positions)
        
        # Count conjunct planets
        prim_conjuncts = sum(1 for p in planet_positions if self._get_planet_sign_index(p, planet_positions) == prim_sign)
        co_conjuncts = sum(1 for p in planet_positions if self._get_planet_sign_index(p, planet_positions) == co_sign)
        
        if co_conjuncts > prim_conjuncts:
            return co
        return primary

    def _calculate_arudha(self, house_num: int, planet_positions: Dict[str, Any], houses: Dict[str, Any]) -> int:
        """
        Calculates the Arudha Pada of a given house.
        """
        source_sign = self._get_house_sign_index(house_num, houses)
        lord = self._get_stronger_lord(source_sign, planet_positions)
        lord_sign = self._get_planet_sign_index(lord, planet_positions)
        
        # Distance from source to lord
        # Distance is inclusive (if both in same sign, distance is 1, so 0 diff means 1)
        # We calculate zero-based distance
        diff = (lord_sign - source_sign) % 12
        
        # Arudha is distance counted from lord
        arudha_sign = (lord_sign + diff) % 12
        
        # Exceptions
        # If Arudha falls in the source house (1st from source) -> place in 10th from source
        if arudha_sign == source_sign:
            arudha_sign = (source_sign + 9) % 12
            
        # If Arudha falls in the 7th from source -> place in 4th from source
        elif arudha_sign == (source_sign + 6) % 12:
            arudha_sign = (source_sign + 3) % 12
            
        return arudha_sign

    def _calculate_upapada_lagna(self, planet_positions: Dict[str, Any], houses: Dict[str, Any]) -> int:
        """Arudha of the 12th house"""
        return self._calculate_arudha(12, planet_positions, houses)

    def _calculate_darapada(self, planet_positions: Dict[str, Any], houses: Dict[str, Any]) -> int:
        """Arudha of the 7th house"""
        return self._calculate_arudha(7, planet_positions, houses)

    def analyze_compatibility(self, bride: Dict[str, Any], groom: Dict[str, Any]) -> Dict[str, Any]:
        """
        Compares Jaimini indicators between Bride and Groom.
        """
        b_jaimini = self.calculate(bride.get("chart", {}))
        g_jaimini = self.calculate(groom.get("chart", {}))
        
        score = 0
        details = []
        
        # 1. DK comparison (simplified: benefics vs malefics, or sign relationship)
        # We will score based on mutual placement of Upapada Lagnas (UL)
        # If they are in 1/7, 5/9, 3/11 relationship it is good.
        # 6/8, 2/12 is challenging.
        
        b_ul = b_jaimini["upapada_lagna"]
        g_ul = g_jaimini["upapada_lagna"]
        
        ul_diff = min((b_ul - g_ul) % 12, (g_ul - b_ul) % 12)
        
        if ul_diff in [0, 4, 6]: # 1/1, 5/9, 7/7
            score += 85
            details.append("Excellent Upapada Lagna alignment indicating strong soul connection and marital longevity.")
        elif ul_diff in [2, 10]: # 3/11
            score += 70
            details.append("Friendly Upapada Lagna placement.")
        elif ul_diff in [3, 9]: # 4/10
            score += 55
            details.append("Neutral Upapada Lagna placement.")
        else: # 2/12, 6/8
            score += 30
            details.append("Challenging Upapada Lagna alignment. Marital adjustment required.")
            
        return {
            "score": min(100, score),
            "details": " ".join(details),
            "bride_jaimini": b_jaimini,
            "groom_jaimini": g_jaimini
        }
