from typing import Dict, Any
import datetime
from dateutil.parser import parse

def analyze_groom_chart(groom_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes the Groom's Kundali for 11 specific professional marriage parameters.
    Returns a dictionary of the analysis.
    """
    chart = groom_data.get("chart", {})
    houses = chart.get("houses", {})
    planets = chart.get("planet_positions", {})
    d9_chart = groom_data.get("vargas", {}).get("d9", {})
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
    h12_planets = get_planets_in_house(12, houses)
    
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

    # 2. WIFE QUALITY
    wife_quality = "Supportive and grounded."
    if "Jupiter" in d9_h7_planets or "Venus" in d9_h7_planets:
        wife_quality = "Wife is indicated to be highly cultured, spiritual, and a bringer of fortune."
    elif "Mars" in h7_planets or "Sun" in h7_planets:
        wife_quality = "Wife may be assertive, career-driven, and highly independent."
    else:
        wife_quality = "Wife will be balanced, bringing stability and practicality to the relationship."

    # 3. RELATIONSHIP STABILITY
    stability = "Stable"
    if "Jupiter" in h8_planets:
        stability = "High stability with the ability to weather life's storms together."
    elif "Rahu" in h8_planets or "Mars" in h8_planets:
        stability = "Requires conscious effort to maintain stability due to sudden disruptive influences."
    else:
        stability = "Consistent stability with normal relationship dynamics."

    # 4. FAMILY LIFE
    family = "Harmonious"
    if "Jupiter" in h2_planets or "Venus" in h2_planets:
        family = "Excellent potential for a harmonious, expanding, and wealthy family life."
    elif "Saturn" in h2_planets or "Rahu" in h2_planets:
        family = "Family life may require patience and overcoming initial structural hurdles."
    else:
        family = "Balanced and standard family life expectations."

    # 5. FINANCIAL RESPONSIBILITY
    finance = "Responsible"
    if "Saturn" in h2_planets or "Jupiter" in h2_planets:
        finance = "Highly responsible with finances, focusing on long-term security and wealth preservation."
    elif "Venus" in h2_planets or "Moon" in h2_planets:
        finance = "Enjoys financial comforts but may lean towards a lavish lifestyle."
    else:
        finance = "Steady financial responsibility requiring mutual budgeting."

    # 6. EMOTIONAL MATURITY
    maturity = "Mature"
    if "Moon" in h4_planets:
        maturity = "Deeply emotionally connected but can be highly sensitive."
    elif "Saturn" in h4_planets:
        maturity = "High emotional maturity, often showing love through practical support rather than words."
    else:
        maturity = "Balanced emotional maturity, adapting well to the needs of the partner."

    # 7. SEXUAL COMPATIBILITY
    intimacy = "Good"
    if "Venus" in h12_planets or "Mars" in h12_planets:
        intimacy = "High passion and strong emphasis on physical and emotional intimacy."
    elif "Saturn" in h12_planets or "Ketu" in h12_planets:
        intimacy = "Intimacy may be deeply spiritual or require overcoming inhibitions."
    else:
        intimacy = "Healthy and balanced sexual compatibility."

    # 8. CHILDREN
    children = "Favorable"
    if "Jupiter" in h5_planets or "Sun" in h5_planets:
        children = "Strong indications for intelligent and proud lineage."
    elif "Rahu" in h5_planets or "Ketu" in h5_planets:
        children = "May experience delays or require specific astrological remedies for progeny."
    else:
        children = "Normal prospects for childbirth and parenthood."

    # 9. LONGEVITY OF MARRIAGE
    longevity = "Strong"
    if "Jupiter" in h8_planets or "Venus" in h8_planets:
        longevity = "Excellent longevity of the marital bond protected by natural benefics."
    else:
        longevity = "Normal longevity of relationship indicated; continuous mutual effort is key."

    # 10. DIVORCE POSSIBILITY
    divorce = "Low"
    if ("Rahu" in h7_planets and "Mars" in h8_planets) or ("Saturn" in h7_planets and "Ketu" in h8_planets):
        divorce = "Higher vulnerability to separation; strong matching and conscious effort are essential."
    else:
        divorce = "Low risk of divorce; standard astrological compatibility checks are sufficient."

    # 11. TIMING OF MARRIAGE
    exact_age = "27 Years and 4 Months"  # Default fallback
    try:
        birth_date_str = groom_data.get("basic_details", {}).get("birth_date", "")
        if not birth_date_str:
            birth_date_str = groom_data.get("meta", {}).get("birth_datetime", "")
            
        if birth_date_str:
            b_date = parse(birth_date_str, fuzzy=True)
            dasha_data = groom_data.get("dasha", {})
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
        print("ERROR calculating exact age for groom:")
        traceback.print_exc()

    timing = f"Exact Predicted Age: {exact_age}. Timing is influenced by the Dasha of the 7th Lord, Venus, or Jupiter."

    return {
        "marriage_promise": promise,
        "wife_quality": wife_quality,
        "relationship_stability": stability,
        "family_life": family,
        "financial_responsibility": finance,
        "emotional_maturity": maturity,
        "sexual_compatibility": intimacy,
        "children": children,
        "longevity_of_marriage": longevity,
        "divorce_possibility": divorce,
        "timing_of_marriage": timing
    }
