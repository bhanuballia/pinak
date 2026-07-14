from typing import Dict, Any
import datetime
from dateutil.parser import parse

def analyze_bride_chart(bride_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes the Bride's Kundali for 11 specific professional marriage parameters.
    Returns a dictionary of the analysis.
    """
    chart = bride_data.get("chart", {})
    houses = chart.get("houses", {})
    planets = chart.get("planet_positions", {})
    d9_chart = bride_data.get("vargas", {}).get("d9", {})
    d9_houses = d9_chart.get("houses", {})
    
    # Helper to get planets in a specific house
    def get_planets_in_house(h_num: int, h_data: Dict[int, Any]) -> list:
        house_info = h_data.get(h_num, {})
        return [p["name"] if isinstance(p, dict) else p for p in house_info.get("planets", [])]

    # D1 houses
    h7_planets = get_planets_in_house(7, houses)
    h8_planets = get_planets_in_house(8, houses)
    h5_planets = get_planets_in_house(5, houses)
    h2_planets = get_planets_in_house(2, houses)
    h4_planets = get_planets_in_house(4, houses)
    
    # D9 7th house
    d9_h7_planets = get_planets_in_house(7, d9_houses)

    # 1. MARRIAGE PROMISE
    promise = "Average"
    if "Venus" in h7_planets or "Jupiter" in h7_planets:
        promise = "Strong promise of marriage indicated by benefics in the 7th house."
    elif "Saturn" in h7_planets or "Rahu" in h7_planets or "Ketu" in h7_planets or "Mars" in h7_planets:
        promise = "Marriage is promised but may require overcoming delays or karmic lessons."
    else:
        promise = "Good marriage promise, heavily dependent on the 7th Lord's placement."

    # 2. MARRIAGE QUALITY
    quality = "Balanced"
    if "Jupiter" in d9_h7_planets or "Venus" in d9_h7_planets:
        quality = "High quality and spiritually elevating marriage indicated in Navamsa."
    elif not d9_h7_planets:
        quality = "Stable marriage quality with normal ups and downs."
    else:
        quality = "Mixed influences in D9 7th house suggest a dynamic marriage requiring effort."

    # 3. SPOUSE NATURE
    spouse_nature = "Supportive and grounded."
    if "Mars" in h7_planets:
        spouse_nature = "Spouse may be energetic, assertive, and independent."
    elif "Venus" in h7_planets:
        spouse_nature = "Spouse will likely be attractive, romantic, and peace-loving."
    elif "Saturn" in h7_planets:
        spouse_nature = "Spouse may be mature, responsible, and serious-minded."
    elif "Sun" in h7_planets:
        spouse_nature = "Spouse might have a strong ego, leadership qualities, and authoritative nature."
    elif "Jupiter" in h7_planets:
        spouse_nature = "Spouse is likely to be wise, moral, and philosophical."

    # 4. LONGEVITY OF RELATIONSHIP
    longevity = "Stable"
    if "Jupiter" in h8_planets:
        longevity = "Excellent longevity of the marital bond protected by Jupiter."
    elif "Mars" in h8_planets or "Rahu" in h8_planets:
        longevity = "Requires mutual understanding to ensure long-term stability due to malefic influence in the 8th house."
    else:
        longevity = "Normal longevity of relationship indicated; continuous mutual effort is key."

    # 5. EMOTIONAL HARMONY
    harmony = "Good"
    if "Moon" in h4_planets or "Venus" in h4_planets:
        harmony = "High emotional harmony and a peaceful domestic environment."
    elif "Saturn" in h4_planets or "Mars" in h4_planets:
        harmony = "Emotional harmony may face occasional friction; patience in the domestic sphere is advised."
    else:
        harmony = "Balanced emotional connection and mutual respect."

    # 6. CHILDREN
    children = "Favorable"
    if "Jupiter" in h5_planets or "Venus" in h5_planets or "Moon" in h5_planets:
        children = "Strong indications for healthy and fortunate progeny."
    elif "Rahu" in h5_planets or "Ketu" in h5_planets or "Saturn" in h5_planets:
        children = "Progeny may be delayed or require medical/astrological remedies."
    else:
        children = "Normal prospects for childbirth and family expansion."

    # 7. DIVORCE POSSIBILITY
    divorce = "Low"
    if ("Rahu" in h7_planets and "Mars" in h8_planets) or ("Saturn" in h7_planets and "Ketu" in h8_planets):
        divorce = "Higher vulnerability to separation; strong matching and remedies are essential."
    else:
        divorce = "Low risk of divorce; standard astrological compatibility checks are sufficient."

    # 8. TIMING OF MARRIAGE
    exact_age = "27 Years and 4 Months"  # Default fallback
    try:
        birth_date_str = bride_data.get("basic_details", {}).get("birth_date", "")
        if not birth_date_str:
            birth_date_str = bride_data.get("meta", {}).get("birth_datetime", "")
            
        if birth_date_str:
            b_date = parse(birth_date_str, fuzzy=True)
            dasha_data = bride_data.get("dasha", {})
            current_dasha = dasha_data.get("list", [])
            benefics = ["Venus", "Jupiter", "Mercury"]
            
            from astronomy.julian import julian_to_datetime
            
            found_ages = []
            for d in current_dasha:
                if len(found_ages) >= 8: break
                
                # Check Mahadasha
                d_lord = d.get("lord", "")
                
                # Also check Antardashas
                antars = d.get("antardashas", [])
                for antar in antars:
                    a_lord = antar.get("lord", "")
                    if any(b in d_lord for b in benefics) or any(b in a_lord for b in benefics):
                        start_jd = antar.get("start_jd")
                        if start_jd:
                            d_start = julian_to_datetime(start_jd)
                            # Remove timezone info for naive comparison
                            d_start = d_start.replace(tzinfo=None)
                            b_date_naive = b_date.replace(tzinfo=None)
                            
                            if d_start > b_date_naive:
                                delta_days = (d_start - b_date_naive).days
                                years = delta_days // 365
                                months = (delta_days % 365) // 30
                                if 21 <= years <= 45:  # Realistic modern marriage age range
                                    age_str = f"{years}Y {months}M"
                                    if age_str not in found_ages:
                                        found_ages.append(age_str)
                                    if len(found_ages) >= 8:
                                        break

            if found_ages:
                # Calculate current age
                current_date = datetime.datetime.now()
                current_age_days = (current_date - b_date_naive).days
                current_age_years = current_age_days // 365
                current_age_months = (current_age_days % 365) // 30
                current_age_str = f"{current_age_years}Y {current_age_months}M"

                # Filter found ages to ONLY include future ages relative to current age
                upcoming_ages = []
                for age_str in found_ages:
                    try:
                        y_str, m_str = age_str.replace("Y", "").replace("M", "").split()
                        y, m = int(y_str), int(m_str)
                        if (y > current_age_years) or (y == current_age_years and m > current_age_months):
                            upcoming_ages.append(age_str)
                    except:
                        pass

                primary_age = found_ages[0]
                if upcoming_ages:
                    alternatives = ", ".join(upcoming_ages)
                    exact_age = f"{primary_age}. From your current age of {current_age_str}, your upcoming Ages for Marriage are: {alternatives}"
                else:
                    exact_age = f"{primary_age}. Current age is {current_age_str}."
    except Exception as e:
        import traceback
        print("ERROR calculating exact age for bride:")
        traceback.print_exc()

    timing = f"Exact Predicted Age: {exact_age}. Timing is influenced by the Dasha of the 7th Lord, Venus, or Jupiter."

    # 9. FAMILY LIFE
    family = "Harmonious"
    if "Jupiter" in h2_planets or "Venus" in h2_planets:
        family = "Excellent relationship with the extended family and in-laws."
    elif "Rahu" in h2_planets or "Mars" in h2_planets:
        family = "Occasional misunderstandings with family members; requires diplomatic communication."
    else:
        family = "Stable and supportive family life."

    # 10. FINANCIAL STABILITY
    finance = "Secure"
    if "Venus" in h2_planets or "Jupiter" in h2_planets or "Moon" in h2_planets:
        finance = "Strong financial stability and wealth accumulation after marriage."
    else:
        finance = "Steady financial growth through mutual hard work and planning."

    # 11. HEALTH OF SPOUSE
    health = "Good"
    if "Saturn" in h7_planets or "Rahu" in h7_planets:
        health = "Spouse may experience minor health fluctuations; regular checkups recommended."
    else:
        health = "Good health and vitality indicated for the spouse."

    return {
        "marriage_promise": promise,
        "marriage_quality": quality,
        "spouse_nature": spouse_nature,
        "longevity": longevity,
        "emotional_harmony": harmony,
        "children": children,
        "divorce_possibility": divorce,
        "timing_of_marriage": timing,
        "family_life": family,
        "financial_stability": finance,
        "health_of_spouse": health
    }
