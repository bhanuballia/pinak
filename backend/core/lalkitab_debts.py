"""
Lal Kitab Planetary Debts (Rin) engine.
Calculates the 9 ancestral debts based on the Lal Kitab chart.
"""

from typing import Dict, Any, List

def check_planets_in_houses(lk_chart: Dict[str, Any], planets: List[str], houses: List[int]) -> bool:
    """Helper to check if any of the given planets are in any of the given houses."""
    for h in houses:
        house_data = lk_chart["houses"].get(h)
        if house_data:
            for p in house_data["planets"]:
                if p["name"] in planets:
                    return True
    return False

def calculate_lalkitab_debts(lk_chart: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Evaluates the Lal Kitab chart for the 9 Pitra Rin (Ancestral Debts).
    Returns a list of dictionaries containing debt name, description, and remedy.
    """
    debts = []

    # 1. Forefathers' Debt (Pitra Rin)
    # Formed if Venus, Mercury or Rahu is in 2nd, 5th, 9th or 12th house.
    if check_planets_in_houses(lk_chart, ["Venus", "Mercury", "Rahu"], [2, 5, 9, 12]):
        debts.append({
            "name": "Forefathers' Debt (Pitra Rin)",
            "cause": "Venus, Mercury, or Rahu in 2nd, 5th, 9th, or 12th house.",
            "description": "Debt from ancestors. May cause unexplained wealth loss, delays in male progeny, or struggles in old age.",
            "remedy": "Collect equal money from family members and donate to a charity, temple, or feed the poor."
        })

    # 2. Self Debt (Swa Rin)
    # Formed if Venus or Saturn is placed in the 5th house.
    if check_planets_in_houses(lk_chart, ["Venus", "Saturn"], [5]):
        debts.append({
            "name": "Self Debt (Swa Rin)",
            "cause": "Venus or Saturn in the 5th house.",
            "description": "Result of turning away from tradition or religion in a past life. Can manifest as lack of peace, struggles with children, or health issues.",
            "remedy": "Perform a Surya Yagya (fire sacrifice to Sun God) using contributions from family members."
        })

    # 3. Mother's Debt (Matri Rin)
    # Formed if Ketu is placed in the 4th house.
    if check_planets_in_houses(lk_chart, ["Ketu"], [4]):
        debts.append({
            "name": "Mother's Debt (Matri Rin)",
            "cause": "Ketu in the 4th house.",
            "description": "Debt incurred by neglecting one's mother or causing her pain in past lives. Can lead to lack of domestic peace and wealth depletion.",
            "remedy": "Collect silver in equal weight from all blood relatives and drop it into a flowing river or running water."
        })

    # 4. Brother or Relatives' Debt (Bhatri Rin)
    # Formed if Mercury or Venus is placed in the 1st or 8th house.
    if check_planets_in_houses(lk_chart, ["Mercury", "Venus"], [1, 8]):
        debts.append({
            "name": "Brother/Relatives' Debt (Bhatri Rin)",
            "cause": "Mercury or Venus in the 1st or 8th house.",
            "description": "Caused by harm done to siblings or friends. This may result in betrayals and sudden unexpected losses.",
            "remedy": "Collect funds from family and donate for medical causes or medicines for the needy."
        })

    # 5. Woman's Debt (Stri Rin)
    # Formed if Sun, Moon or Rahu is in the 2nd or 7th house.
    if check_planets_in_houses(lk_chart, ["Sun", "Moon", "Rahu"], [2, 7]):
        debts.append({
            "name": "Woman's Debt (Stri Rin)",
            "cause": "Sun, Moon, or Rahu in the 2nd or 7th house.",
            "description": "Incurred due to exploitation or ill-treatment of women in past lives. Often causes marital discord and financial ruin.",
            "remedy": "Feed 100 cows with fodder (collected or funded equally by all family members)."
        })

    # 6. Daughter's Debt (Beti Rin)
    # Formed if Rahu is in the 3rd or 6th house.
    if check_planets_in_houses(lk_chart, ["Rahu"], [3, 6]):
        debts.append({
            "name": "Daughter/Sister's Debt (Beti/Bahen Rin)",
            "cause": "Rahu in the 3rd or 6th house.",
            "description": "Caused by harm or neglect to a sister or daughter. Leads to trouble for the female members of the current family.",
            "remedy": "Purchase yellow colored items (like turmeric, yellow cloth) with family contributions and donate them."
        })

    # 7. Cruelty Debt (Zalim Rin)
    # Formed if Sun, Moon or Mars is in the 10th or 11th house.
    if check_planets_in_houses(lk_chart, ["Sun", "Moon", "Mars"], [10, 11]):
        debts.append({
            "name": "Cruelty Debt (Zalim Rin)",
            "cause": "Sun, Moon, or Mars in the 10th or 11th house.",
            "description": "Incurred by cruel acts, cheating, or deceit. Causes obstacles in career, false allegations, and chronic ailments.",
            "remedy": "Feed 100 laborers or 100 fish at different locations."
        })

    # 8. Unborn Debt (Ajanma Rin)
    # Formed if Sun, Moon or Mars is in the 12th house.
    if check_planets_in_houses(lk_chart, ["Sun", "Moon", "Mars"], [12]):
        debts.append({
            "name": "Unborn Debt (Ajanma Rin)",
            "cause": "Sun, Moon, or Mars in the 12th house.",
            "description": "Caused by betrayal of trust or harming one's in-laws. Brings sudden, unexplainable heavy losses.",
            "remedy": "Purchase a whole coconut and submerge it in flowing water."
        })

    # 9. Godly/Divine Debt (Ishwariya Rin)
    # Formed if Moon or Mars is in the 6th house.
    if check_planets_in_houses(lk_chart, ["Moon", "Mars"], [6]):
        debts.append({
            "name": "Godly/Divine Debt (Ishwariya Rin)",
            "cause": "Moon or Mars in the 6th house.",
            "description": "Result of destroying religious places, killing animals ruthlessly, or atheism. Causes a life full of struggles and lack of divine grace.",
            "remedy": "Collect funds from family and donate to a priest, temple, or spiritual organization."
        })

    return debts
