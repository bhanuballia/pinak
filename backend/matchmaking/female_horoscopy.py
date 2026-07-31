from typing import Dict, Any
import datetime
from dateutil.parser import parse
from core.utils import ZODIAC_SIGNS

def calculate_stri_jatak(bride_data: Dict[str, Any], groom_data: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Evaluates Strī Jātak (Female Horoscopy) rules on the Bride's chart.
    """
    chart = bride_data.get("chart", {})
    houses = chart.get("houses", {})
    planets = chart.get("planet_positions", {})
    
    # Helper to get planets in a specific house
    def get_planets_in_house(h_num: int, h_data: Dict[int, Any]) -> list:
        house_info = h_data.get(h_num, {}) or h_data.get(str(h_num), {})
        return [p["name"] if isinstance(p, dict) else p for p in house_info.get("planets", [])]

    # --- 1. Odd/Even Sign Temperament (Verses 5-7) ---
    asc_sign = chart.get("ascendant_sign", "")
    moon_sign = bride_data.get("meta", {}).get("moon_sign", "")
    if not moon_sign and "Moon" in planets:
        # fallback
        moon_lon = planets["Moon"].get("sidereal", {}).get("lon", 0)
        from core.utils import get_sign_name
        moon_sign = get_sign_name(moon_lon)
        
    asc_even = asc_sign in ["Taurus", "Cancer", "Virgo", "Scorpio", "Capricorn", "Pisces"]
    moon_even = moon_sign in ["Taurus", "Cancer", "Virgo", "Scorpio", "Capricorn", "Pisces"]
    
    temperament_status = "Mixed"
    if asc_even and moon_even:
        temperament_status = "Truly Feminine"
        temperament_desc = "Both Ascendant and Moon are in Even Signs. Truly feminine character, excellent qualities, steadfastness, beauty, and physical fitness."
    elif (not asc_even) and (not moon_even):
        temperament_status = "Masculine / Assertive"
        temperament_desc = "Both Ascendant and Moon are in Odd Signs. Masculine form, bold bearing, and highly assertive presence."
    else:
        temperament_status = "Balanced / Dual"
        temperament_desc = "One of Ascendant or Moon is in an Even Sign, and the other is in an Odd Sign. Exhibits a balanced combination of soft feminine traits and active, assertive strengths."

    # --- 2. Trimsamsa Character Analysis (Verses 9-16) ---
    # We find the trimsamsa sign lord of Moon or Lagn (whichever is stronger). We'll analyze both.
    def get_trimsamsa_lord(lon: float) -> str:
        # Standard Parashara D30 Calculator from builder.py
        sign_idx = int(lon // 30)
        deg_in_sign = lon % 30
        if (sign_idx % 2 == 0): # Odd sign
            if deg_in_sign < 5: return "Mars"
            if deg_in_sign < 10: return "Saturn"
            if deg_in_sign < 18: return "Jupiter"
            if deg_in_sign < 25: return "Mercury"
            return "Venus"
        else: # Even sign
            if deg_in_sign < 5: return "Venus"
            if deg_in_sign < 12: return "Mercury"
            if deg_in_sign < 20: return "Jupiter"
            if deg_in_sign < 25: return "Saturn"
            return "Mars"

    moon_lon = planets.get("Moon", {}).get("sidereal", {}).get("lon", 0)
    asc_lon = chart.get("ascendant_lon", 0)
    
    moon_sign_idx = int(moon_lon // 30)
    moon_trimsamsa_lord = get_trimsamsa_lord(moon_lon)
    
    # Sign owner details
    SIGN_OWNERS = {
        0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
        4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
        8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"
    }
    moon_sign_owner = SIGN_OWNERS.get(moon_sign_idx, "Unknown")
    
    trimsamsa_outcome = "Capable and adaptable nature."
    # Classical matching rules (Verses 9-16)
    if moon_sign_owner == "Mars":
        if moon_trimsamsa_lord == "Mars":
            trimsamsa_outcome = "Independent spirit; may have passionate relations before marriage."
        elif moon_trimsamsa_lord == "Venus":
            trimsamsa_outcome = "Charming, love-seeking nature; requires caution regarding loyalty after marriage."
        elif moon_trimsamsa_lord == "Mercury":
            trimsamsa_outcome = "Guileful, clever, and adept in arts/conjuration."
        elif moon_trimsamsa_lord == "Jupiter":
            trimsamsa_outcome = "Highly worthy, chaste, and virtuous character."
        elif moon_trimsamsa_lord == "Saturn":
            trimsamsa_outcome = "Hard-working; may face menial, service-oriented settings."
    elif moon_sign_owner == "Mercury":
        if moon_trimsamsa_lord == "Mars":
            trimsamsa_outcome = "Full of guile and extremely hard-working."
        elif moon_trimsamsa_lord == "Venus":
            trimsamsa_outcome = "Possessed of good qualities and well-behaved."
        elif moon_trimsamsa_lord == "Mercury":
            trimsamsa_outcome = "Intellectual, diplomatic, dualistic mindset."
        elif moon_trimsamsa_lord == "Jupiter":
            trimsamsa_outcome = "Very chaste, virtuous, and dedicated partner."
        elif moon_trimsamsa_lord == "Saturn":
            trimsamsa_outcome = "Focused and disciplined nature."
    elif moon_sign_owner == "Venus":
        if moon_trimsamsa_lord == "Mars":
            trimsamsa_outcome = "Needs to protect self-esteem; sometimes deprived of simple comforts."
        elif moon_trimsamsa_lord == "Venus":
            trimsamsa_outcome = "Well-known, loved, and possessed of excellent qualities."
        elif moon_trimsamsa_lord == "Mercury":
            trimsamsa_outcome = "Highly skilled in all arts and crafts."
        elif moon_trimsamsa_lord == "Jupiter":
            trimsamsa_outcome = "Endowed with all good qualities, honor, and elegance."
        elif moon_trimsamsa_lord == "Saturn":
            trimsamsa_outcome = "Independent; classical texts indicate possibilities of remarriage."
    elif moon_sign_owner == "Moon":
        if moon_trimsamsa_lord == "Mars":
            trimsamsa_outcome = "Self-willed, emotional, and uncontrolled at times."
        elif moon_trimsamsa_lord == "Venus":
            trimsamsa_outcome = "Intense desire for love and romantic relationships."
        elif moon_trimsamsa_lord == "Mercury":
            trimsamsa_outcome = "Highly skilled in arts, handiworks, and creative details."
        elif moon_trimsamsa_lord == "Jupiter":
            trimsamsa_outcome = "Gifted with all excellent qualities and domestic happiness."
        elif moon_trimsamsa_lord == "Saturn":
            trimsamsa_outcome = "Prone to early hardships; requires care regarding husband's health."
    elif moon_sign_owner == "Sun":
        if moon_trimsamsa_lord == "Mars":
            trimsamsa_outcome = "Very talkative, bold, and expressive."
        elif moon_trimsamsa_lord == "Venus":
            trimsamsa_outcome = "Virtuous, warm, and highly respectable."
        elif moon_trimsamsa_lord == "Mercury":
            trimsamsa_outcome = "Possesses masculine physical features and strong determination."
        elif moon_trimsamsa_lord == "Jupiter":
            trimsamsa_outcome = "Extremely chaste, virtuous, and spiritually inclined."
        elif moon_trimsamsa_lord == "Saturn":
            trimsamsa_outcome = "Rebellious nature; needs self-discipline."
    elif moon_sign_owner == "Jupiter":
        if moon_trimsamsa_lord == "Mars":
            trimsamsa_outcome = "Endowed with many excellent qualities and bravery."
        elif moon_trimsamsa_lord == "Venus":
            trimsamsa_outcome = "Free-spirited; needs to direct energy constructively."
        elif moon_trimsamsa_lord == "Mercury":
            trimsamsa_outcome = "Well-versed in many sciences and philosophies."
        elif moon_trimsamsa_lord == "Jupiter":
            trimsamsa_outcome = "Blessed with high morality, progeny, and noble virtues."
        elif moon_trimsamsa_lord == "Saturn":
            trimsamsa_outcome = "Sober, quiet, and does not indulge in excess."
    elif moon_sign_owner == "Saturn":
        if moon_trimsamsa_lord == "Mars":
            trimsamsa_outcome = "Hard-working, works like a maid-servant, service oriented."
        elif moon_trimsamsa_lord == "Venus":
            trimsamsa_outcome = "Learned and practical; may have limited family/childbirth comforts."
        elif moon_trimsamsa_lord == "Mercury":
            trimsamsa_outcome = "Needs to keep speech soft; otherwise prone to conflicts."
        elif moon_trimsamsa_lord == "Jupiter":
            trimsamsa_outcome = "Deeply devoted to her husband and family."
        elif moon_trimsamsa_lord == "Saturn":
            trimsamsa_outcome = "Independent nature; prone to delay in marriage or unconventional choices."

    # --- 3. Visha Kanya Yoga & Cancellations (Verses 43-46) ---
    visha_kanya = False
    visha_kanya_details = []
    
    basic = bride_data.get("basic_details", {})
    birth_date_str = basic.get("birth_date", "") or bride_data.get("meta", {}).get("birth_datetime", "")
    
    if birth_date_str:
        try:
            b_dt = parse(birth_date_str, fuzzy=True)
            weekday = b_dt.weekday() # 0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday
            
            panchang = bride_data.get("panchang", {})
            nak_name = panchang.get("nakshatra", {}).get("nakshatra_name") or bride_data.get("meta", {}).get("nakshatra", "")
            tithi_idx = panchang.get("tithi", {}).get("tithi_index", -1) # 0-29
            
            # Sunday + Ashlesha + Dwitiya (tithi_index 1 or 16)
            if weekday == 6 and nak_name == "Ashlesha" and (tithi_idx % 15 == 1):
                visha_kanya = True
                visha_kanya_details.append("Sunday birth with Ashlesha Nakshatra and Dwitiya (2nd) Tithi.")
            
            # Saturday + Krittika + Saptami (tithi_index 6 or 21)
            elif weekday == 5 and nak_name == "Krittika" and (tithi_idx % 15 == 6):
                visha_kanya = True
                visha_kanya_details.append("Saturday birth with Krittika Nakshatra and Saptami (7th) Tithi.")
                
            # Tuesday + Shatabhisha + Dwadashi (tithi_index 11 or 26)
            elif weekday == 1 and nak_name == "Shatabhisha" and (tithi_idx % 15 == 11):
                visha_kanya = True
                visha_kanya_details.append("Tuesday birth with Shatabhisha Nakshatra and Dwadashi (12th) Tithi.")
        except:
            pass

    # Check for Visha Kanya Cancellation (Verse 46)
    cancellation = False
    cancellation_reason = ""
    if visha_kanya:
        h7_planets = get_planets_in_house(7, houses)
        # Benefics: Jupiter, Venus, Mercury
        benefics_in_7 = [p for p in h7_planets if p in ["Jupiter", "Venus", "Mercury"]]
        if benefics_in_7:
            cancellation = True
            cancellation_reason = f"Cancelled due to the presence of benefic planet(s) ({', '.join(benefics_in_7)}) in the 7th house."
        else:
            # check 7th lord is benefic
            seventh_house = houses.get(7) or houses.get("7")
            if seventh_house:
                sign = seventh_house.get("sign")
                SIGN_LORDS = {
                    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
                    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
                    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
                }
                lord = SIGN_LORDS.get(sign)
                if lord in ["Jupiter", "Venus", "Mercury"]:
                    cancellation = True
                    cancellation_reason = f"Cancelled as the 7th Lord ({lord}) is a benefic planet."

    # --- 4. 7th & 8th House Partner/Longevity (Verses 17-21, 30-33) ---
    h7_planets = get_planets_in_house(7, houses)
    h8_planets = get_planets_in_house(8, houses)
    
    h7_desc = "Good marital prospects."
    h7_status = "Benefic"
    
    if not h7_planets:
        h7_desc = "7th house is empty; spouse nature depends heavily on 7th Lord strength. If aspected by malefics, spouse could be humble."
        h7_status = "Neutral"
    else:
        malefics_7 = [p for p in h7_planets if p in ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]]
        if malefics_7:
            h7_status = "Malefic Influence"
            h7_desc = f"Contains malefic(s): {', '.join(malefics_7)}. Requires matching, otherwise prone to delays, friction, or health concerns."
            if "Saturn" in h7_planets and "Mercury" in h7_planets:
                h7_desc += " Impotency or cold behavior in partner indicated."
        else:
            h7_desc = f"Blessed with benefic(s): {', '.join(h7_planets)}. Excellent spousal characteristics and happiness."
            
    h8_desc = "Stable longevity."
    h8_status = "Benefic"
    if h8_planets:
        malefics_8 = [p for p in h8_planets if p in ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]]
        if malefics_8:
            h8_status = "Malefic Influence"
            h8_desc = f"Contains malefic(s): {', '.join(malefics_8)}. May bring sudden challenges or health concerns for spouse; check matching."
        else:
            h8_desc = f"Blessed with benefic(s): {', '.join(h8_planets)}. Ensures spouse's safety, longevity, and marital happiness."

    # --- 5. Mars Placements (Kuha/Mangal Dosha Matching) (Verses 47-49) ---
    # Verse 47: widowhood if Mars in 12, 4, 7, 8.
    # Check if groom also has matching Dosha
    bride_has_dosha = False
    groom_has_dosha = False
    
    # Mars houses: 1, 2, 4, 7, 8, 12
    for h in [4, 7, 8, 12]:
        p_list = get_planets_in_house(h, houses)
        if "Mars" in p_list:
            bride_has_dosha = True
            
    if groom_data:
        g_houses = groom_data.get("chart", {}).get("houses", {})
        for h in [4, 7, 8, 12]:
            house_info = g_houses.get(h) or g_houses.get(str(h), {})
            p_list = [p["name"] if isinstance(p, dict) else p for p in house_info.get("planets", [])]
            if "Mars" in p_list:
                groom_has_dosha = True
                
    mangal_matching_status = "Neutral"
    mangal_matching_desc = "No matching afflictions detected."
    
    if bride_has_dosha:
        if groom_has_dosha:
            mangal_matching_status = "Perfect Match / Cancelled"
            mangal_matching_desc = "The bride has Mars in the 4/7/8/12 axis, and the groom also has matching Mars placement. According to Verse 48-49, the afflictions cancel each other out completely."
        else:
            mangal_matching_status = "Afflicted"
            mangal_matching_desc = "Bride has Mars placement causing Dosha, but the groom's chart does not match it. Remedial measures or deep compatibility matching advised."
    
    # --- 6. Simple Explanations (Layperson-friendly translations) ---
    # Temperament
    simple_temp = "Exhibits a balanced combination of soft feminine traits and active, assertive strengths."
    if temperament_status == "Truly Feminine":
        simple_temp = "The bride shows high empathy, graceful presence, and emotionally stable qualities."
    elif temperament_status == "Masculine / Assertive":
        simple_temp = "The bride possesses high leadership qualities, independence, and a confident personality."

    # Trimsamsa
    outcome_lower = trimsamsa_outcome.lower()
    if any(k in outcome_lower for k in ["virtuous", "chaste", "worthy", "dedicate", "devot"]):
        simple_trim = "Values-driven, trustworthy, and holds high standards of integrity."
    elif any(k in outcome_lower for k in ["independent", "rebellious", "self-willed", "uncontrolled", "free-spirited"]):
        simple_trim = "Highly independent, self-motivated, and values personal freedom."
    elif any(k in outcome_lower for k in ["hard-work", "work", "menial", "maid", "service"]):
        simple_trim = "Down-to-earth, highly practical, and dedicated to achieving security through effort."
    elif any(k in outcome_lower for k in ["charming", "love", "romance", "passion", "damsel", "beautiful", "well-behaved"]):
        simple_trim = "Warm, affectionate, emotionally expressive, and highly romantic."
    elif any(k in outcome_lower for k in ["guile", "clever", "diplomatic", "art", "science", "philosophy", "learned", "intellectual"]):
        simple_trim = "Intellectually sharp, clever problem-solver, and highly talented in various fields."
    else:
        simple_trim = "Capable, balanced, and adaptable personality traits."

    # Visha Kanya
    if visha_kanya:
        if cancellation:
            simple_vk = "A challenging planetary alignment at birth was completely cancelled and neutralized by supportive planets."
        else:
            simple_vk = "A sensitive energy pattern exists. Conscious communication and relationship maturity will easily harmonize it."
    else:
        simple_vk = "No sensitive or heavy birth-time configurations detected. The birth energy is peaceful."

    # 7th House
    if h7_status == "Benefic":
        simple_h7 = "Indicates a highly supportive, loving, and reliable spouse who will bring joy to the relationship."
    elif h7_status == "Malefic Influence":
        simple_h7 = "Spousal relationship requires patience. The partner may be very ambitious, busy, or have strong opinions."
    else:
        simple_h7 = "Spousal qualities are balanced, indicating a normal and steady relationship foundation."

    # 8th House
    if h8_status == "Benefic":
        simple_h8 = "Ensures excellent long-term relationship stability, spousal well-being, and marital longevity."
    elif h8_status == "Malefic Influence":
        simple_h8 = "Prioritize routine health checks and stress management for the spouse to maintain high vitality."
    else:
        simple_h8 = "Normal longevity and general family support."

    # Manglik
    if mangal_matching_status == "Perfect Match / Cancelled":
        simple_mangal = "Mars intensities are perfectly balanced between both charts, neutralizing any friction."
    elif mangal_matching_status == "Afflicted":
        simple_mangal = "Active Mars energy is present. Patience and direct communication will easily keep relationship chemistry smooth."
    else:
        simple_mangal = "Gentle and soft Mars influence, supporting a peaceful and stable home life."

    return {
        "temperament": {
            "status": temperament_status,
            "description": temperament_desc,
            "simple_explanation": simple_temp
        },
        "trimsamsa": {
            "moon_sign_owner": moon_sign_owner,
            "trimsamsa_lord": moon_trimsamsa_lord,
            "outcome": trimsamsa_outcome,
            "simple_explanation": simple_trim
        },
        "visha_kanya": {
            "present": visha_kanya,
            "details": " ".join(visha_kanya_details) if visha_kanya else "No Visha Kanya configurations present.",
            "cancelled": cancellation,
            "cancellation_reason": cancellation_reason,
            "simple_explanation": simple_vk
        },
        "seventh_house": {
            "status": h7_status,
            "description": h7_desc,
            "simple_explanation": simple_h7
        },
        "eighth_house": {
            "status": h8_status,
            "description": h8_desc,
            "simple_explanation": simple_h8
        },
        "mangal_matching": {
            "status": mangal_matching_status,
            "description": mangal_matching_desc,
            "simple_explanation": simple_mangal
        }
    }
