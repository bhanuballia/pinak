# ashtakavarga/bhinnashtakavarga.py
# Core planetary Ashtakavarga (Bhinnashtakavarga) calculation.

from ashtakavarga.constants.planets import PLANETS
from ashtakavarga.bindu_rules import BAV_RULES


class Bhinnashtakavarga:

    def calculate(self, chart):
        """
        Calculate each planet's individual AV (Bhinnashtakavarga).

        Args:
            chart (dict): mapping of planet/Ascendant name -> 0-indexed sign number (0=Aries ... 11=Pisces)

        Returns:
            dict: { 
                "sums": { planet: { sign_index: bindu_sum } },
                "breakdown": { target_planet: { sign_index: { source_planet: bindu } } }
            }
        """
        sums_result = {}
        breakdown_result = {}

        target_planets = PLANETS + ["Ascendant"]
        
        for target_planet in target_planets:
            sums_result[target_planet] = {}
            breakdown_result[target_planet] = {}

            for target_sign in range(12):
                bindu_sum = 0
                breakdown_result[target_planet][target_sign] = {}
                
                for source_planet, houses in BAV_RULES[target_planet].items():
                    if source_planet not in chart:
                        continue
                    
                    source_sign = chart[source_planet]
                    # Calculate relative house from source_sign to target_sign
                    # (0-indexed difference, +1 for 1-indexed house)
                    relative_house = ((target_sign - source_sign) % 12) + 1
                    
                    if relative_house in houses:
                        bindu_sum += 1
                        breakdown_result[target_planet][target_sign][source_planet] = 1
                    else:
                        breakdown_result[target_planet][target_sign][source_planet] = 0
                        
                sums_result[target_planet][target_sign] = bindu_sum

        return {
            "sums": sums_result,
            "breakdown": breakdown_result
        }
