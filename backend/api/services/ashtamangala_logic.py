import math
import datetime
from astronomy.julian import datetime_to_julian
from astronomy.ascendant import get_ascendant_from_datetime
from astronomy.positions import get_all_planetary_positions
from astronomy.sun_calculations import calculate_noaa_sunrise_sunset

SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
    "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

def get_sign_index(lon: float) -> int:
    return int(lon // 30) % 12

def get_sign_name(lon: float) -> str:
    return SIGNS[get_sign_index(lon)]

def get_nakshatra_info(lon: float):
    norm_lon = lon % 360.0
    nak_span = 360.0 / 27.0  # 13.333333333333334 degrees per nakshatra
    nak_idx = int(norm_lon / nak_span) % 27
    deg_in_nak = norm_lon - (nak_idx * nak_span)
    pada = int(deg_in_nak / (nak_span / 4.0)) + 1
    deg_in_sign = norm_lon % 30.0
    deg = int(deg_in_sign)
    minutes = int((deg_in_sign % 1) * 60)
    sign_name = get_sign_name(norm_lon)
    return {
        "nakshatra": NAKSHATRAS[nak_idx],
        "index": nak_idx,
        "pada": min(pada, 4),
        "sign": sign_name,
        "deg_str": f"{deg}° {minutes:02d}' {sign_name}",
        "raw_deg": norm_lon
    }

def check_gandanta(lon: float) -> bool:
    norm = lon % 360.0
    # Cancer-Leo (116.666 - 123.333), Scorpio-Sagittarius (236.666 - 243.333), Pisces-Aries (356.666 - 3.333)
    if (116.666 <= norm <= 123.333) or (236.666 <= norm <= 243.333) or (norm >= 356.666 or norm <= 3.333):
        return True
    return False

# Toxic Visha Ghati degree zones inside each nakshatra
VISHA_GHATI_RANGES = {
    0: (6.67, 8.27), 1: (5.33, 6.93), 2: (6.67, 8.27), 3: (8.89, 10.49),
    4: (3.11, 4.71), 5: (2.44, 4.04), 6: (6.67, 8.27), 7: (4.44, 6.04),
    8: (7.11, 8.71), 9: (6.67, 8.27), 10: (4.44, 6.04), 11: (4.00, 5.60),
    12: (4.67, 6.27), 13: (4.44, 6.04), 14: (3.11, 4.71), 15: (3.11, 4.71),
    16: (2.22, 3.82), 17: (3.11, 4.71), 18: (12.44, 14.04), 19: (5.33, 6.93),
    20: (4.44, 6.04), 21: (2.22, 3.82), 22: (2.22, 3.82), 23: (4.00, 5.60),
    24: (3.56, 5.16), 25: (5.33, 6.93), 26: (6.67, 8.27)
}

def check_visha_ghati(lon: float) -> bool:
    norm = lon % 360.0
    nak_span = 360.0 / 27.0
    nak_idx = int(norm / nak_span) % 27
    deg_in_nak = norm - (nak_idx * nak_span)
    r = VISHA_GHATI_RANGES.get(nak_idx, (0, 0))
    return r[0] <= deg_in_nak <= r[1]

ASHTAMANGALA_DEITIES = {
    1: {
        "number": 1,
        "planet": "Sun (Surya)",
        "symbol": "Garuda (Eagle)",
        "icon": "🦅",
        "quality": "Sattvic / Auspicious",
        "meaning": "High vitality, divine grace, government/authority support, radiant success.",
        "score": 2
    },
    2: {
        "number": 2,
        "planet": "Mars (Kuja)",
        "symbol": "Tiger (Vyaghra)",
        "icon": "🐅",
        "quality": "Rajasic / Fierce",
        "meaning": "Conflict, friction, tension, haste; courage and strategic caution required.",
        "score": -1
    },
    3: {
        "number": 3,
        "planet": "Jupiter (Guru)",
        "symbol": "Lion (Simha)",
        "icon": "🦁",
        "quality": "Sattvic / Highly Auspicious",
        "meaning": "Grand victory, expansion, wise counsel, righteousness; obstacles dissolve smoothly.",
        "score": 3
    },
    4: {
        "number": 4,
        "planet": "Mercury (Budha)",
        "symbol": "Snake (Sarpa)",
        "icon": "🐍",
        "quality": "Rajasic / Duality",
        "meaning": "Unexpected twists, hidden traps, duality; demands sharp intellect and verification.",
        "score": -1
    },
    5: {
        "number": 5,
        "planet": "Moon (Chandra)",
        "symbol": "Bow (Dhanus)",
        "icon": "🏹",
        "quality": "Sattvic / Auspicious",
        "meaning": "Target achieved, emotional fulfillment, peace of mind, auspicious journeys.",
        "score": 2
    },
    6: {
        "number": 6,
        "planet": "Venus (Shukra)",
        "symbol": "Elephant (Gaja)",
        "icon": "🐘",
        "quality": "Rajasic / Very Auspicious",
        "meaning": "Prosperity, high status, financial gains, harmony, auspicious alliances.",
        "score": 2
    },
    7: {
        "number": 7,
        "planet": "Saturn (Sani)",
        "symbol": "Pot / Pitcher (Kumbha)",
        "icon": "🏺",
        "quality": "Tamasic / Challenging",
        "meaning": "Depletion, delay, sorrow, heavy labor; calls for patience, humility, and penance.",
        "score": -2
    },
    8: {
        "number": 8,
        "planet": "Rahu",
        "symbol": "Dragon / Conch (Shankha)",
        "icon": "🐚",
        "quality": "Mystical / Karmic Shift",
        "meaning": "Sudden mysterious turn of events, illusions unmasked, deep spiritual transformation.",
        "score": 0
    }
}

TAMBULA_PLANETS = {
    1: {"planet": "Sun (Surya)", "icon": "☀️", "element": "Tejas (Fire)", "environment": "Authoritative, dignified surroundings, bright light, government/executive energy."},
    2: {"planet": "Moon (Chandra)", "icon": "🌙", "element": "Jala (Water)", "environment": "Peaceful, moist/flowing surroundings, maternal presence, fluid changing state."},
    3: {"planet": "Mars (Mangala)", "icon": "🔥", "element": "Tejas (Fire)", "environment": "Machinery, sharp tools, heat, urgent discussions, competitive atmosphere."},
    4: {"planet": "Mercury (Budha)", "icon": "📜", "element": "Prithvi (Earth)", "environment": "Commercial, books/documents, communication devices, financial papers, youth."},
    5: {"planet": "Jupiter (Guru)", "icon": "🪷", "element": "Akasha (Ether)", "environment": "Sacred shrine, preceptors, divine wisdom, auspicious counsel, spiritual tranquility."},
    6: {"planet": "Venus (Shukra)", "icon": "💎", "element": "Jala (Water)", "environment": "Luxuries, pleasing fragrance, female presence, artistic items, joyous comfort."},
    7: {"planet": "Saturn (Sani)", "icon": "⏳", "element": "Vayu (Air)", "environment": "Ancient/weathered structures, iron tools, dust, labor, delay, fatigue."}
}

NIMITTA_DIRECTIONS = {
    "East": {"deity": "Indra", "quality": "Auspicious", "score": 1, "meaning": "Purva Disha: Direct solar vitality, government support, radiant success."},
    "North": {"deity": "Kubera / Mercury", "quality": "Highly Auspicious", "score": 1, "meaning": "Uttara Disha: Blessings of Kubera, wealth preservation, intellectual victory."},
    "West": {"deity": "Varuna / Saturn", "quality": "Neutral / Deliberate", "score": 0, "meaning": "Paschima Disha: Saturn/Varuna realm; requires patience, steady contracts, and diligence."},
    "South": {"deity": "Yama / Mars", "quality": "Challenging / Caution", "score": -1, "meaning": "Dakshina Disha: Mars/Yama realm; warnings against rash conflict, legal hurdles, or health vulnerability."}
}

NIMITTA_MOODS = {
    "Calm": {"sanskrit": "Prasanna Chesta (शांत)", "score": 2, "meaning": "Lucid mind and positive astral receptivity. Decisions made now bear auspicious fruit."},
    "Anxious": {"sanskrit": "Chintita (चिंतित)", "score": -1, "meaning": "Subconscious apprehension clouding discernment. Emotional grounding required."},
    "Rushing": {"sanskrit": "Tvarita (त्वरित)", "score": -1, "meaning": "Hasty steps leading to errors and delays. The Prasna warns against rushed commitments."},
    "Tearful": {"sanskrit": "Dukhkha (शोकमय)", "score": -2, "meaning": "Deep emotional distress or sorrow indicating heavy karmic pressure requiring remedies."}
}

NIMITTA_SOUNDS = {
    "Temple bell": {"type": "auspicious", "score": 2, "meaning": "Ghanta Naad: Auspicious blessing of Ishta Devata; obstructions dissolve."},
    "Birds singing": {"type": "auspicious", "score": 1, "meaning": "Pakshi Kalrav: Arrival of good news, swift travel, or joyful celebration."},
    "Sacred chant": {"type": "auspicious", "score": 2, "meaning": "Mantra Dhwani: Protective divine grace surrounding the querent."},
    "Crying child": {"type": "inauspicious", "score": -2, "meaning": "Shishu Rodana: Apashakuna forewarning sudden grief or domestic disharmony."},
    "Dog barking": {"type": "inauspicious", "score": -1, "meaning": "Shvana Dhwani: Danger of theft, legal disputes, or hidden adversaries."},
    "Thunderstorm": {"type": "inauspicious", "score": -2, "meaning": "Vajra Garjana: Sudden volatile crisis or shocking turning point."},
    "Peaceful silence": {"type": "neutral", "score": 0, "meaning": "Shanta Dhwani: Balanced, neutral cosmic equilibrium."}
}

SIGN_MOBILITY = {
    "Aries": {"type": "Chara (Movable)", "code": "Chara", "speed": "Swift", "timeframe_unit": "days", "desc": "Dynamic kinetic movement; swift development and speedy fruition."},
    "Taurus": {"type": "Sthira (Fixed)", "code": "Sthira", "speed": "Delayed", "timeframe_unit": "months", "desc": "Fixed status quo, deep inertia; slow, deliberate development or chronic postponement."},
    "Gemini": {"type": "Dvisvabhava (Dual)", "code": "Dvisvabhava", "speed": "Moderate", "timeframe_unit": "weeks", "desc": "Dual-phased progress; requires an initial turning point followed by moderate fruition."},
    "Cancer": {"type": "Chara (Movable)", "code": "Chara", "speed": "Swift", "timeframe_unit": "days", "desc": "Dynamic kinetic movement; swift development and speedy fruition."},
    "Leo": {"type": "Sthira (Fixed)", "code": "Sthira", "speed": "Delayed", "timeframe_unit": "months", "desc": "Fixed status quo, deep inertia; slow, deliberate development or chronic postponement."},
    "Virgo": {"type": "Dvisvabhava (Dual)", "code": "Dvisvabhava", "speed": "Moderate", "timeframe_unit": "weeks", "desc": "Dual-phased progress; requires an initial turning point followed by moderate fruition."},
    "Libra": {"type": "Chara (Movable)", "code": "Chara", "speed": "Swift", "timeframe_unit": "days", "desc": "Dynamic kinetic movement; swift development and speedy fruition."},
    "Scorpio": {"type": "Sthira (Fixed)", "code": "Sthira", "speed": "Delayed", "timeframe_unit": "months", "desc": "Fixed status quo, deep inertia; slow, deliberate development or chronic postponement."},
    "Sagittarius": {"type": "Dvisvabhava (Dual)", "code": "Dvisvabhava", "speed": "Moderate", "timeframe_unit": "weeks", "desc": "Dual-phased progress; requires an initial turning point followed by moderate fruition."},
    "Capricorn": {"type": "Chara (Movable)", "code": "Chara", "speed": "Swift", "timeframe_unit": "days", "desc": "Dynamic kinetic movement; swift development and speedy fruition."},
    "Aquarius": {"type": "Sthira (Fixed)", "code": "Sthira", "speed": "Delayed", "timeframe_unit": "months", "desc": "Fixed status quo, deep inertia; slow, deliberate development or chronic postponement."},
    "Pisces": {"type": "Dvisvabhava (Dual)", "code": "Dvisvabhava", "speed": "Moderate", "timeframe_unit": "weeks", "desc": "Dual-phased progress; requires an initial turning point followed by moderate fruition."},
}

SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

def get_ashtamangala_rem(count: int) -> int:
    r = int(count) % 8
    return 8 if r == 0 else r

def calculate_janma_prasna_samvada(
    birth_data: dict,
    query_lat: float,
    query_lon: float,
    arudha_idx: int,
    udaya_idx: int,
    prasna_planets: dict,
    gulika_sign: str,
    mandi_sign: str
) -> dict:
    """
    Classical Kerala Janma-Prasna Samvada (Prasna Marga Chapters 14 & 15):
    Cross-examines the querent's Natal Moon (Janma Rasi) and Natal Lagna
    against the Horary Prasna Arudha, Udaya Lagna, and Gulika/Mandi transits.
    """
    if not birth_data:
        return None
        
    dob_str = birth_data.get("dob") or birth_data.get("birth_date")
    if not dob_str:
        return None
        
    tob_str = birth_data.get("tob") or birth_data.get("birth_time") or "12:00"
    b_lat = float(birth_data.get("lat") or birth_data.get("latitude") or query_lat)
    b_lon = float(birth_data.get("lon") or birth_data.get("longitude") or query_lon)
    b_city = birth_data.get("city") or birth_data.get("birth_city") or "Querent Birthplace"
    
    try:
        parts_date = [int(p) for p in str(dob_str).split("-")]
        time_parts = str(tob_str).split(":")
        hour = int(time_parts[0]) if len(time_parts) > 0 else 12
        minute = int(time_parts[1]) if len(time_parts) > 1 else 0
        
        natal_dt_local = datetime.datetime(parts_date[0], parts_date[1], parts_date[2], hour, minute)
        tz_offset = float(birth_data.get("tz_offset", b_lon / 15.0))
        natal_dt_utc = natal_dt_local - datetime.timedelta(hours=tz_offset)
        natal_jd_ut = datetime_to_julian(natal_dt_utc)
        
        natal_planets = get_all_planetary_positions(natal_jd_ut)
        natal_asc_info = get_ascendant_from_datetime(natal_dt_utc, b_lat, b_lon)
        
        natal_asc_lon = natal_asc_info.get("ascendant_degree", 0.0)
        natal_asc_idx = get_sign_index(natal_asc_lon)
        natal_asc_sign = SIGNS[natal_asc_idx]
        
        natal_moon_lon = natal_planets["Moon"]["sidereal"]["lon"]
        natal_moon_idx = get_sign_index(natal_moon_lon)
        natal_moon_sign = SIGNS[natal_moon_idx]
        natal_moon_nak = get_nakshatra_info(natal_moon_lon)
        
        natal_sun_lon = natal_planets["Sun"]["sidereal"]["lon"]
        natal_sun_idx = get_sign_index(natal_sun_lon)
        natal_sun_sign = SIGNS[natal_sun_idx]
        
        # 1. House of Prasna Arudha from Janma Rasi (Moon)
        house_from_moon = ((arudha_idx - natal_moon_idx + 12) % 12) + 1
        
        # 2. House of Prasna Arudha from Janma Lagna (Ascendant)
        house_from_lagna = ((arudha_idx - natal_asc_idx + 12) % 12) + 1
        
        # 3. House of Prasna Udaya from Janma Rasi
        udaya_from_moon = ((udaya_idx - natal_moon_idx + 12) % 12) + 1
        
        # 4. Cross-analysis scoring & Yoga detection
        resonance_score = 0.0
        samvada_points = []
        
        # Arudha from Moon
        if house_from_moon in [1, 5, 9]:
            resonance_score += 2.0
            moon_rel_text = f"Trikona ({house_from_moon}th House) — Divine Karmic Alignment (Bhagya Vriddhi)"
            samvada_points.append(f"Prasna Arudha falls in the {house_from_moon}th house (Trikona) from your Janma Rasi ({natal_moon_sign}), indicating soul-level resonance and natural karmic support for this enterprise.")
        elif house_from_moon in [4, 7, 10]:
            resonance_score += 1.5
            moon_rel_text = f"Kendra ({house_from_moon}th House) — Dynamic Action & Accomplishment"
            samvada_points.append(f"Prasna Arudha occupies the {house_from_moon}th house (Kendra) from your Natal Moon, signifying that conscious proactive steps will manifest tangible physical results.")
        elif house_from_moon == 11:
            resonance_score += 2.0
            moon_rel_text = f"Labha (11th House) — Fruitful Gains & Fulfillment"
            samvada_points.append(f"Prasna Arudha is seated in the 11th house of Gains (Labha Bhava) from Janma Rasi, marking high potential for profit, desire fulfillment, and auspicious gains.")
        elif house_from_moon in [2, 3]:
            resonance_score += 0.5
            moon_rel_text = f"Upachaya/Dhana ({house_from_moon}th House) — Progress Through Courage & Effort"
            samvada_points.append(f"Prasna Arudha in the {house_from_moon}th house from Moon requires personal perseverance, negotiation, and resource management.")
        elif house_from_moon == 6:
            resonance_score -= 1.5
            moon_rel_text = f"Ripu/Shatru (6th House) — Friction, Competition & Obstacles"
            samvada_points.append(f"Prasna Arudha falls in the 6th house of enemies and litigation from Janma Rasi, warning of resistance from competitors, paperwork hurdles, or health strains.")
        elif house_from_moon == 8:
            resonance_score -= 2.5
            moon_rel_text = f"Randhra (8th House) — Hidden Delays & Karmic Turbulence"
            samvada_points.append(f"Prasna Arudha in the 8th house (Ashtama) from Janma Rasi signals anxiety, sudden unanticipated delays, or vulnerability to hidden factors. Caution is strongly advised.")
        else:  # 12
            resonance_score -= 1.5
            moon_rel_text = f"Vyaya (12th House) — Expenditure & Relocation"
            samvada_points.append(f"Prasna Arudha in the 12th house indicates potential resource drain, unnecessary expenses, or displacement before the matter stabilizes.")
            
        # Arudha from Lagna
        if house_from_lagna in [1, 4, 5, 7, 9, 10, 11]:
            resonance_score += 1.0
            lagna_rel_text = f"Auspicious ({house_from_lagna}th House) — Physical Vitality & Manifestation Capacity"
        else:
            resonance_score -= 1.0
            lagna_rel_text = f"Challenging ({house_from_lagna}th House) — Strain on Energy & Bodily Stamina"
            
        # 5. Check Janma Gulika / Mandi transit afflictions
        mandi_affliction = False
        mandi_note = None
        if gulika_sign == natal_moon_sign or mandi_sign == natal_moon_sign:
            resonance_score -= 2.0
            mandi_affliction = True
            mandi_note = f"Janma Gulika Vedha: Horary Gulika/Mandi occupies your Janma Rasi ({natal_moon_sign}). This classic Kerala Prasna affliction warns of temporary subconscious lethargy, doubts, or unpacified ancestral debts."
            samvada_points.append(mandi_note)
        elif gulika_sign == natal_asc_sign or mandi_sign == natal_asc_sign:
            resonance_score -= 1.5
            mandi_affliction = True
            mandi_note = f"Deha Gulika Vedha: Horary Gulika/Mandi transits your Janma Lagna ({natal_asc_sign}), indicating physical fatigue or hesitation requiring Ganapathi/Tila Homam."
            samvada_points.append(mandi_note)
            
        # 6. Check Saturn transit (Gochar) relative to Natal Moon
        sat_lon = prasna_planets["Saturn"]["sidereal"]["lon"]
        sat_sign = SIGNS[get_sign_index(sat_lon)]
        sat_house_from_moon = ((get_sign_index(sat_lon) - natal_moon_idx + 12) % 12) + 1
        
        saturn_gochar_status = None
        if sat_house_from_moon == 1:
            saturn_gochar_status = f"Sade Sati (Janma Shani — Peak Period in {sat_sign})"
            resonance_score -= 1.0
            samvada_points.append(f"Current Saturn transit in your Janma Rasi ({sat_sign}) indicates heavy responsibilities, life restructuring, and tested patience.")
        elif sat_house_from_moon == 12:
            saturn_gochar_status = f"Sade Sati (Rising Phase / Vyaya Shani in {sat_sign})"
            resonance_score -= 0.5
        elif sat_house_from_moon == 2:
            saturn_gochar_status = f"Sade Sati (Setting Phase / Dhana Shani in {sat_sign})"
            resonance_score -= 0.5
        elif sat_house_from_moon == 8:
            saturn_gochar_status = f"Ashtama Shani (8th House Transit in {sat_sign})"
            resonance_score -= 1.5
            samvada_points.append(f"Prasna occurs during Ashtama Shani (Saturn in 8th from Moon), requiring extra vigilance in contracts and health.")
        elif sat_house_from_moon in [3, 6, 11]:
            saturn_gochar_status = f"Upachaya Shani ({sat_house_from_moon}th House in {sat_sign} — Fortunate Transit)"
            resonance_score += 1.0
            samvada_points.append(f"Saturn transits the {sat_house_from_moon}th house from your Moon, granting strength to overcome opponents.")
            
        # Categorize resonance
        if resonance_score >= 1.5:
            resonance_tone = "Harmonious Resonance (पूर्ण अनुकूलता)"
            badge_color = "emerald"
            summary_status = "High Karmic Harmony: Your natal chart strongly aligns with the current Prasna chart. The cosmic currents back your question."
        elif resonance_score >= -0.5:
            resonance_tone = "Moderate Alignment (मध्यम फल)"
            badge_color = "amber"
            summary_status = "Balanced Flow: Progress is achievable through active discipline, clear communication, and observance of the prescribed Parihara."
        else:
            resonance_tone = "Karmic Resistance (कर्मिक अवरोध)"
            badge_color = "rose"
            summary_status = "Karmic Friction: Current natal transits conflict with the horary Arudha. Performance of Tila Homam and patience before major commitments is strongly recommended."

        return {
            "birth_details": {
                "dob": dob_str,
                "tob": tob_str,
                "city": b_city,
                "lat": b_lat,
                "lon": b_lon
            },
            "natal_ascendant": {
                "sign": natal_asc_sign,
                "degree": round(natal_asc_lon % 30.0, 2),
                "deg_str": f"{int(natal_asc_lon % 30)}° {int(((natal_asc_lon % 30) % 1) * 60):02d}' {natal_asc_sign}"
            },
            "janma_rasi": {
                "sign": natal_moon_sign,
                "nakshatra": natal_moon_nak["nakshatra"],
                "pada": natal_moon_nak["pada"],
                "degree": round(natal_moon_lon % 30.0, 2),
                "deg_str": natal_moon_nak["deg_str"]
            },
            "janma_sun": {
                "sign": natal_sun_sign,
                "degree": round(natal_sun_lon % 30.0, 2)
            },
            "samvada_analysis": {
                "arudha_from_moon_house": house_from_moon,
                "arudha_from_moon_text": moon_rel_text,
                "arudha_from_lagna_house": house_from_lagna,
                "arudha_from_lagna_text": lagna_rel_text,
                "udaya_from_moon_house": udaya_from_moon,
                "mandi_affliction": mandi_affliction,
                "saturn_gochar_status": saturn_gochar_status,
                "resonance_score": round(resonance_score, 1),
                "resonance_tone": resonance_tone,
                "badge_color": badge_color,
                "summary_status": summary_status,
                "samvada_points": samvada_points
            }
        }
    except Exception as e:
        print(f"[JANMA SAMVADA ERROR] {e}")
        return None

def evaluate_ashtamangala(
    jd_ut: float,
    now_utc: datetime.datetime,
    lat: float,
    lon: float,
    arudha_sign_name: str,
    question: str,
    kavadi_data: dict = None,
    tambula_data: dict = None,
    nimitta_data: dict = None,
    birth_data: dict = None
):
    arudha_idx = SIGNS.index(arudha_sign_name) if arudha_sign_name in SIGNS else 0
    arudha_sign = SIGNS[arudha_idx]
    
    asc_info = get_ascendant_from_datetime(now_utc, lat, lon)
    udaya_lon = asc_info.get("ascendant_deg", asc_info.get("ascendant_degree", 0.0))
    udaya_idx = asc_info.get("ascendant_sign_index", get_sign_index(udaya_lon))
    udaya_sign = asc_info.get("ascendant_sign", SIGNS[udaya_idx])
    
    planets = get_all_planetary_positions(jd_ut)
    sun_lon = planets["Sun"]["sidereal"]["lon"]
    sun_idx = get_sign_index(sun_lon)
    sun_sign = SIGNS[sun_idx]
    
    count_sun_to_udaya = (udaya_idx - sun_idx) % 12
    chhatra_idx = (arudha_idx + count_sun_to_udaya) % 12
    chhatra_sign = SIGNS[chhatra_idx]
    
    date = now_utc.date()
    tz_offset = lon / 15.0
    sunrise, sunset = calculate_noaa_sunrise_sunset(date, lat, lon, tz_offset)
    
    if not sunrise or not sunset:
        sunrise = now_utc.replace(hour=6, minute=0, second=0)
        sunset = now_utc.replace(hour=18, minute=0, second=0)
        
    is_daytime = sunrise <= now_utc < sunset
    weekday = now_utc.weekday()
    vedic_weekday = (weekday + 1) % 7
    
    mandi_day_parts = [6, 5, 4, 3, 2, 1, 0]
    mandi_night_parts = [2, 1, 0, 6, 5, 4, 3]
    
    mandi_part = mandi_day_parts[vedic_weekday] if is_daytime else mandi_night_parts[vedic_weekday]
    gulika_part = (mandi_part - 1) % 7
    
    if is_daytime:
        duration = (sunset - sunrise).total_seconds()
        part_len = duration / 8
        mandi_time = sunrise + datetime.timedelta(seconds=mandi_part * part_len)
        gulika_time = sunrise + datetime.timedelta(seconds=gulika_part * part_len)
    else:
        next_date = date + datetime.timedelta(days=1)
        next_sunrise, _ = calculate_noaa_sunrise_sunset(next_date, lat, lon, tz_offset)
        if not next_sunrise: next_sunrise = sunset + datetime.timedelta(hours=12)
        duration = (next_sunrise - sunset).total_seconds()
        part_len = duration / 8
        mandi_time = sunset + datetime.timedelta(seconds=mandi_part * part_len)
        gulika_time = sunset + datetime.timedelta(seconds=gulika_part * part_len)
        
    mandi_asc = get_ascendant_from_datetime(mandi_time, lat, lon).get("ascendant_degree", 0.0)
    gulika_asc = get_ascendant_from_datetime(gulika_time, lat, lon).get("ascendant_degree", 0.0)
    
    mandi_sign = get_sign_name(mandi_asc)
    gulika_sign = get_sign_name(gulika_asc)
    
    # Process 108 Kavadi (Cowrie) Shells - Tri-Bhaga
    import random
    if kavadi_data and "past" in kavadi_data and "present" in kavadi_data and "future" in kavadi_data:
        try:
            k_past = int(kavadi_data["past"])
            k_present = int(kavadi_data["present"])
            k_future = int(kavadi_data["future"])
            if k_past + k_present + k_future != 108 or k_past <= 0 or k_present <= 0 or k_future <= 0:
                raise ValueError("Kavadi counts must sum to 108")
        except Exception:
            k_past = random.randint(22, 48)
            k_present = random.randint(22, 108 - k_past - 18)
            k_future = 108 - (k_past + k_present)
    else:
        k_past = random.randint(22, 48)
        k_present = random.randint(22, 108 - k_past - 18)
        k_future = 108 - (k_past + k_present)

    rem_past = get_ashtamangala_rem(k_past)
    rem_present = get_ashtamangala_rem(k_present)
    rem_future = get_ashtamangala_rem(k_future)

    deity_past = ASHTAMANGALA_DEITIES[rem_past]
    deity_present = ASHTAMANGALA_DEITIES[rem_present]
    deity_future = ASHTAMANGALA_DEITIES[rem_future]

    kavadi_summary = {
        "total_shells": 108,
        "past": {
            "name": "Bhuta (Past / Karmic Root)",
            "count": k_past,
            "remainder": rem_past,
            **deity_past
        },
        "present": {
            "name": "Vartamana (Present / Current State)",
            "count": k_present,
            "remainder": rem_present,
            **deity_present
        },
        "future": {
            "name": "Bhavishyat (Future / Final Outcome)",
            "count": k_future,
            "remainder": rem_future,
            **deity_future
        },
        "trajectory": f"{deity_past['symbol']} ({deity_past['planet']}) -> {deity_present['symbol']} ({deity_present['planet']}) -> {deity_future['symbol']} ({deity_future['planet']})"
    }

    # Extract Moon and Rahu for Special Sphuta calculations
    moon_lon = planets["Moon"]["sidereal"]["lon"]
    rahu_lon = planets.get("Rahu", {}).get("sidereal", {}).get("lon", 0.0)

    # 1. Trisphuta = (Lagna + Moon + Gulika) % 360
    trisphuta_lon = (udaya_lon + moon_lon + gulika_asc) % 360.0
    tri_info = get_nakshatra_info(trisphuta_lon)
    tri_sign_idx = get_sign_index(trisphuta_lon)
    tri_house_from_arudha = ((tri_sign_idx - arudha_idx) % 12) + 1
    tri_gandanta = check_gandanta(trisphuta_lon)
    tri_visha = check_visha_ghati(trisphuta_lon)

    # 2. Chatusphuta = (Trisphuta + Sun) % 360
    chatusphuta_lon = (trisphuta_lon + sun_lon) % 360.0
    chatu_info = get_nakshatra_info(chatusphuta_lon)
    chatu_sign_idx = get_sign_index(chatusphuta_lon)
    chatu_house_from_arudha = ((chatu_sign_idx - arudha_idx) % 12) + 1

    # 3. Panchasphuta = (Chatusphuta + Rahu) % 360
    panchasphuta_lon = (chatusphuta_lon + rahu_lon) % 360.0
    pancha_info = get_nakshatra_info(panchasphuta_lon)
    pancha_sign_idx = get_sign_index(panchasphuta_lon)
    pancha_house_from_arudha = ((pancha_sign_idx - arudha_idx) % 12) + 1

    # 4. Prana Sphuta = (Lagna * 5 + Gulika) % 360
    prana_lon = ((udaya_lon * 5.0) + gulika_asc) % 360.0
    prana_info = get_nakshatra_info(prana_lon)
    prana_sign_idx = get_sign_index(prana_lon)
    prana_house_from_arudha = ((prana_sign_idx - arudha_idx) % 12) + 1

    # 5. Deha Sphuta = (Moon * 8 + Gulika) % 360
    deha_lon = ((moon_lon * 8.0) + gulika_asc) % 360.0
    deha_info = get_nakshatra_info(deha_lon)
    deha_sign_idx = get_sign_index(deha_lon)
    deha_house_from_arudha = ((deha_sign_idx - arudha_idx) % 12) + 1

    # 6. Mrityu Sphuta = (Gulika * 7 + Sun) % 360
    mrityu_lon = ((gulika_asc * 7.0) + sun_lon) % 360.0
    mrityu_info = get_nakshatra_info(mrityu_lon)
    mrityu_sign_idx = get_sign_index(mrityu_lon)
    mrityu_house_from_arudha = ((mrityu_sign_idx - arudha_idx) % 12) + 1

    # Evaluate Prana vs Mrityu Strength
    prana_strength = 0
    if prana_house_from_arudha in [1, 4, 7, 10]:
        prana_strength += 2
    elif prana_house_from_arudha in [5, 9]:
        prana_strength += 2
    elif prana_house_from_arudha in [3, 6, 11]:
        prana_strength += 1

    mrityu_affliction = 0
    if mrityu_house_from_arudha in [1, 8]:
        mrityu_affliction += 3
    elif mrityu_house_from_arudha in [6, 12]:
        mrityu_affliction += 2
    elif mrityu_sign_idx == udaya_idx:
        mrityu_affliction += 2

    if prana_strength > mrityu_affliction:
        prana_mrityu_verdict = "Prana Dominates (Jeeva Pradhana)"
        prana_mrityu_desc = "Life breath and resolution (Prana) exceed obstruction (Mrityu). Recovery, triumph, or breakthrough is assured."
        prana_mrityu_status = "Auspicious"
    elif mrityu_affliction > prana_strength:
        prana_mrityu_verdict = "Mrityu Dominates (Mrityu Pradhana)"
        prana_mrityu_desc = "Point of obstruction (Mrityu) outweighs vitality. Severe resistance, delays, or critical hurdles indicated; remedial action advised."
        prana_mrityu_status = "Challenging"
    else:
        prana_mrityu_verdict = "Equilibrium (Sama Sphuta)"
        prana_mrityu_desc = "Prana and Mrityu forces are balanced. Outcome relies on deliberate effort and proper timing."
        prana_mrityu_status = "Neutral"

    # Process Tambula (Betel Leaf Pariksha)
    try:
        t_count = int(tambula_data.get("count", 12)) if tambula_data else 12
        if t_count < 1 or t_count > 108:
            t_count = 12
    except Exception:
        t_count = 12

    rem_tambula = (t_count * 10) % 7
    rem_tambula = 7 if rem_tambula == 0 else rem_tambula
    tambula_planet_info = TAMBULA_PLANETS[rem_tambula]

    t_parity = "Odd (Ayugma / Dynamic)" if (t_count % 2 != 0) else "Even (Yugma / Stable)"
    t_house = ((t_count % 12) + 1)

    tambula_summary = {
        "count": t_count,
        "parity": t_parity,
        "planet": tambula_planet_info["planet"],
        "icon": tambula_planet_info["icon"],
        "element": tambula_planet_info["element"],
        "environment": tambula_planet_info["environment"],
        "house_from_arudha": t_house,
        "formula": f"({t_count} × 10) mod 7 = {rem_tambula}"
    }

    # Process Nimitta (Omens at query moment)
    direction = "East"
    mood = "Calm"
    sounds = []
    if nimitta_data:
        direction = nimitta_data.get("direction", "East")
        mood = nimitta_data.get("mood", "Calm")
        sounds = nimitta_data.get("sounds", [])
        if isinstance(sounds, str):
            sounds = [sounds]

    dir_info = NIMITTA_DIRECTIONS.get(direction, NIMITTA_DIRECTIONS["East"])
    mood_info = NIMITTA_MOODS.get(mood, NIMITTA_MOODS["Calm"])

    sound_items = []
    sound_score = 0
    if sounds:
        for s_name in sounds:
            if s_name in NIMITTA_SOUNDS:
                s_info = NIMITTA_SOUNDS[s_name]
                sound_items.append({"name": s_name, **s_info})
                sound_score += s_info["score"]
    else:
        sound_items.append({"name": "Peaceful silence", **NIMITTA_SOUNDS["Peaceful silence"]})

    nimitta_score = dir_info["score"] + mood_info["score"] + sound_score

    nimitta_summary = {
        "direction": {"name": direction, **dir_info},
        "mood": {"name": mood, **mood_info},
        "sounds": sound_items,
        "score_contribution": nimitta_score
    }

    reasons = []
    score = deity_past["score"] + deity_present["score"] + (deity_future["score"] * 2) + nimitta_score
    if t_count % 2 != 0:
        score += 1  # Odd leaf count is auspicious in Kerala tradition (Jeeva Tambula)

    # 0. Tambula & Nimitta interpretation
    reasons.append(
        f"Tambula Lakshana: Querent offered {t_count} betel leaves ({t_parity}). "
        f"Multiplication by 10 reveals {tambula_planet_info['planet']} {tambula_planet_info['icon']} as significator of immediate surroundings ({tambula_planet_info['environment']})."
    )
    sounds_str = ", ".join([s["name"] for s in sound_items])
    reasons.append(
        f"Nimitta Omens: Facing {direction} ({dir_info['meaning']}); mind disposition is {mood_info['sanskrit']} ({mood_info['meaning']}); acoustic omens: [{sounds_str}]."
    )

    # Trisphuta Warnings & Alerts
    trisphuta_alerts = []
    if tri_house_from_arudha == 8:
        score -= 3
        trisphuta_alerts.append("Ashtama Trisphuta: Situated in the 8th house from Arudha, signaling severe hidden stumbling blocks.")
    elif tri_house_from_arudha in [1, 4, 5, 7, 9, 10, 11]:
        score += 2
        trisphuta_alerts.append(f"Trisphuta in {tri_house_from_arudha}th house from Arudha, indicating supportive grace for the query.")

    if tri_gandanta:
        score -= 2
        trisphuta_alerts.append("Trisphuta in Gandanta (Karmic Knot junction), indicating deep emotional and past-life entanglements.")

    if tri_visha:
        score -= 2
        trisphuta_alerts.append("Trisphuta in Visha Ghati (Toxic Degree), calling for vigilance against toxic advice or deceit.")

    # 1. Kavadi trajectory interpretation
    reasons.append(
        f"108 Kavadi Omen: The query emerges from past {deity_past['symbol']} energy ({deity_past['meaning']}), "
        f"operates currently through {deity_present['symbol']} dynamics ({deity_present['meaning']}), and moves toward "
        f"a {deity_future['symbol']} culmination ({deity_future['meaning']})."
    )

    # 2. Upagraha afflictions
    if gulika_sign == arudha_sign or mandi_sign == arudha_sign:
        score -= 3
        reasons.append(f"Gulika/Mandi is positioned in the Arudha Lagna ({arudha_sign}), indicating hidden karmic obstacles, chronic delays, or physical lethargy surrounding the matter.")
    elif gulika_sign == udaya_sign or mandi_sign == udaya_sign:
        score -= 2
        reasons.append(f"Gulika/Mandi touches the Udaya Lagna ({udaya_sign}), signaling immediate mental stress and apprehension for the querent.")

    # 3. Chhatra umbrella protection
    if chhatra_sign == arudha_sign:
        score += 3
        reasons.append(f"The protective Chhatra (Canopy of Grace) falls directly on Arudha Lagna ({arudha_sign}), offering strong divine shelter and high probability of triumph.")
    elif chhatra_sign == udaya_sign:
        score += 2
        reasons.append(f"The Chhatra covers the Udaya Lagna ({udaya_sign}), providing clarity of thought and timely assistance from benevolent mentors.")

    # Extract All Planetary Longitudes for Deva Prasna Diagnostics
    mars_lon = planets["Mars"]["sidereal"]["lon"]
    mercury_lon = planets["Mercury"]["sidereal"]["lon"]
    jupiter_lon = planets["Jupiter"]["sidereal"]["lon"]
    venus_lon = planets["Venus"]["sidereal"]["lon"]
    saturn_lon = planets["Saturn"]["sidereal"]["lon"]
    ketu_lon = (rahu_lon + 180.0) % 360.0

    # Sign indices
    sun_sign_idx = get_sign_index(sun_lon)
    mars_sign_idx = get_sign_index(mars_lon)
    jupiter_sign_idx = get_sign_index(jupiter_lon)
    saturn_sign_idx = get_sign_index(saturn_lon)
    rahu_sign_idx = get_sign_index(rahu_lon)
    ketu_sign_idx = get_sign_index(ketu_lon)
    gulika_sign_idx = get_sign_index(gulika_asc)
    mandi_sign_idx = get_sign_index(mandi_asc)

    def house_from_arudha(sign_idx):
        return ((sign_idx - arudha_idx) % 12) + 1

    def aspects_house(planet_sign_idx, target_house, planet_name):
        target_sign_idx = (arudha_idx + target_house - 1) % 12
        offset = (target_sign_idx - planet_sign_idx) % 12
        if offset == 0:
            return True
        if offset == 6:
            return True
        if planet_name == "Mars" and offset in [3, 7]:
            return True
        if planet_name == "Saturn" and offset in [2, 9]:
            return True
        if planet_name == "Jupiter" and offset in [4, 8]:
            return True
        return False

    sun_h = house_from_arudha(sun_sign_idx)
    mars_h = house_from_arudha(mars_sign_idx)
    jup_h = house_from_arudha(jupiter_sign_idx)
    sat_h = house_from_arudha(saturn_sign_idx)
    rahu_h = house_from_arudha(rahu_sign_idx)
    ketu_h = house_from_arudha(ketu_sign_idx)
    gulika_h = house_from_arudha(gulika_sign_idx)
    mandi_h = house_from_arudha(mandi_sign_idx)

    # 1. Deva Dosha (दैव दोष)
    deva_detected = False
    deva_triggers = []
    if gulika_h in [9, 12]:
        deva_detected = True
        deva_triggers.append(f"Gulika in {gulika_h}th house of Dharma/Spiritual lineage")
    if mandi_h in [9, 12]:
        deva_detected = True
        deva_triggers.append(f"Mandi in {mandi_h}th house of worship")
    if jupiter_sign_idx in [gulika_sign_idx, mandi_sign_idx]:
        deva_detected = True
        deva_triggers.append(f"Guru (Jupiter) afflicted by Gulika/Mandi in {SIGNS[jupiter_sign_idx]}")
    if sat_h == 9 and rahu_h == 9:
        deva_detected = True
        deva_triggers.append("Saturn and Rahu concurrently afflicting 9th house of Bhagya")

    deva_item = {
        "id": "deva_dosha",
        "name": "Deva Dosha (दैव दोष)",
        "sanskrit": "दैव दोष",
        "icon": "🛕",
        "detected": deva_detected,
        "severity": "High" if (jupiter_sign_idx in [gulika_sign_idx, mandi_sign_idx] or gulika_h == 9) else ("Moderate" if deva_detected else "None"),
        "trigger": "; ".join(deva_triggers) if deva_detected else "9th and 12th houses from Arudha are free from Upagraha taint.",
        "signification": "Displeasure of the family deity (Kuladevata), unfulfilled sacred vows (Vazhipadu), or desecration of prayer space.",
        "remedy": "Perform special Archana/Pooja to Kuladevata, light an Akhanda Deepam (ghee lamp), and conduct Ganapathi Homam."
    }

    # 2. Pitru Dosha (पितृ दोष)
    pitru_detected = False
    pitru_triggers = []
    if sun_sign_idx in [mandi_sign_idx, gulika_sign_idx]:
        pitru_detected = True
        pitru_triggers.append(f"Sun (Pitru-karaka) poisoned by conjunction with Gulika/Mandi in {SIGNS[sun_sign_idx]}")
    if sun_sign_idx in [saturn_sign_idx, rahu_sign_idx]:
        pitru_detected = True
        pitru_triggers.append(f"Sun afflicted by Saturn/Rahu in {SIGNS[sun_sign_idx]}")
    if 9 in [gulika_h, mandi_h, sat_h, rahu_h]:
        pitru_detected = True
        afflicting_planets = [p for p, h in [("Gulika", gulika_h), ("Mandi", mandi_h), ("Saturn", sat_h), ("Rahu", rahu_h)] if h == 9]
        pitru_triggers.append(f"9th house of ancestors afflicted by {', '.join(afflicting_planets)}")

    pitru_item = {
        "id": "pitru_dosha",
        "name": "Pitru Dosha (पितृ दोष)",
        "sanskrit": "पितृ दोष",
        "icon": "🌿",
        "detected": pitru_detected,
        "severity": "High" if (sun_sign_idx in [mandi_sign_idx, gulika_sign_idx] or 9 in [gulika_h, mandi_h]) else ("Moderate" if pitru_detected else "None"),
        "trigger": "; ".join(pitru_triggers) if pitru_detected else "Sun and 9th house are unblemished by malefic shadows.",
        "signification": "Unfulfilled ancestral rituals, forgotten Shraddha/Tarpanam ceremonies, or dissatisfaction of departed Pitrus.",
        "remedy": "Perform Tila Homam, Pinda Daanam / Tarpanam on Amavasya, feed black sesame to cows/crows, and offer food charity."
    }

    # 3. Sarpa Dosha / Naga Shapa (नाग शाप)
    sarpa_detected = False
    sarpa_triggers = []
    if rahu_sign_idx in [gulika_sign_idx, mandi_sign_idx] or ketu_sign_idx in [gulika_sign_idx, mandi_sign_idx]:
        sarpa_detected = True
        sarpa_triggers.append("Rahu/Ketu combined with Gulika/Mandi in the same sign")
    if rahu_h in [4, 8]:
        sarpa_detected = True
        sarpa_triggers.append(f"Rahu occupies the sensitive {rahu_h}th house from Arudha")
    if ketu_h in [4, 8]:
        sarpa_detected = True
        sarpa_triggers.append(f"Ketu occupies the sensitive {ketu_h}th house from Arudha")

    sarpa_item = {
        "id": "sarpa_dosha",
        "name": "Sarpa Dosha / Naga Shapa (नाग शाप)",
        "sanskrit": "नाग शाप",
        "icon": "🐍",
        "detected": sarpa_detected,
        "severity": "High" if (rahu_sign_idx in [gulika_sign_idx, mandi_sign_idx] or rahu_h == 8) else ("Moderate" if sarpa_detected else "None"),
        "trigger": "; ".join(sarpa_triggers) if sarpa_detected else "Serpent nodes (Rahu/Ketu) do not afflict sensitive Arudha axes.",
        "signification": "Serpent curse impacting fertility, skin/blood health, land transactions, or disturbance of sacred serpent groves (Sarpa Kavu).",
        "remedy": "Perform Sarpa Bali, offer Noorum Palum (milk and turmeric) at a serpent shrine, or conduct Rahu-Ketu Shanti."
    }

    # 4. Drishti Badha / Shatru Badha (दृष्टि बाधा)
    mars_on_6_or_7 = aspects_house(mars_sign_idx, 6, "Mars") or aspects_house(mars_sign_idx, 7, "Mars")
    saturn_on_6_or_7 = aspects_house(saturn_sign_idx, 6, "Saturn") or aspects_house(saturn_sign_idx, 7, "Saturn")
    drishti_detected = mars_on_6_or_7 or saturn_on_6_or_7
    drishti_triggers = []
    if aspects_house(mars_sign_idx, 6, "Mars"): drishti_triggers.append("Mars occupies/aspects 6th house of adversaries")
    if aspects_house(mars_sign_idx, 7, "Mars"): drishti_triggers.append("Mars occupies/aspects 7th house of competitors")
    if aspects_house(saturn_sign_idx, 6, "Saturn"): drishti_triggers.append("Saturn occupies/aspects 6th house of disputes/enmity")
    if aspects_house(saturn_sign_idx, 7, "Saturn"): drishti_triggers.append("Saturn occupies/aspects 7th house of public transactions")

    drishti_item = {
        "id": "drishti_badha",
        "name": "Drishti Badha / Shatru Badha (दृष्टि बाधा)",
        "sanskrit": "दृष्टि बाधा",
        "icon": "👁️",
        "detected": drishti_detected,
        "severity": "High" if (mars_on_6_or_7 and saturn_on_6_or_7) else ("Moderate" if drishti_detected else "None"),
        "trigger": "; ".join(drishti_triggers) if drishti_detected else "6th and 7th houses from Arudha are unencumbered by malefic gaze.",
        "signification": "Evil eye (Drishti Badha), intense competitor jealousy, covert enmity, malicious rumors, or toxic psychic interference.",
        "remedy": "Chant Sudarshana Ashtakam, perform Sudarshana Homam / Shatru Samhara Trishati, and wear an energized protective Raksha Kavacha."
    }

    # 5. Vastu Dosha (वास्तु दोष)
    vastu_detected = False
    vastu_triggers = []
    if gulika_h == 4:
        vastu_detected = True
        vastu_triggers.append("Gulika occupies the 4th house of home/dwelling from Arudha")
    if mandi_h == 4:
        vastu_detected = True
        vastu_triggers.append("Mandi occupies the 4th house of residence")
    if mars_h == 4:
        vastu_detected = True
        vastu_triggers.append("Mars (Bhoomi-karaka) occupies the 4th house of land/property")
    if sat_h == 4 or rahu_h == 4:
        vastu_detected = True
        vastu_triggers.append("Saturn/Rahu residing in 4th house, disturbing domestic harmony")
    if saturn_sign_idx == gulika_sign_idx or mars_sign_idx == gulika_sign_idx or rahu_sign_idx == gulika_sign_idx:
        vastu_detected = True
        vastu_triggers.append(f"Gulika's sign ({SIGNS[gulika_sign_idx]}) is afflicted by malefic conjunction (Mars/Saturn/Rahu)")

    vastu_item = {
        "id": "vastu_dosha",
        "name": "Vastu Dosha (वास्तु दोष)",
        "sanskrit": "वास्तु दोष",
        "icon": "🏡",
        "detected": vastu_detected,
        "severity": "High" if (gulika_h == 4 or mandi_h == 4) else ("Moderate" if vastu_detected else "None"),
        "trigger": "; ".join(vastu_triggers) if vastu_detected else "4th house of residence is clean and free of sub-planetary corruption.",
        "signification": "Geopathic disturbance, architectural flaws in dwelling/business, buried impure matter (Shalya Dosha), or disturbed land energy.",
        "remedy": "Perform Vastu Purusha Pooja, install a consecrated copper Vastu Yantra, and perform Ganapathi Homam on the premises."
    }

    doshas_list = [deva_item, pitru_item, sarpa_item, drishti_item, vastu_item]
    active_doshas = [d for d in doshas_list if d["detected"]]

    # Score adjustments for active doshas
    for d in active_doshas:
        score -= 2 if d["severity"] == "High" else 1

    # 4. Sphuta Insights
    if trisphuta_alerts:
        reasons.append(f"Trisphuta Analysis: {' '.join(trisphuta_alerts)}")
    reasons.append(f"Prana vs Mrityu: {prana_mrityu_desc}")

    # 5. Dosha Diagnostic Insights
    if active_doshas:
        dosha_names = ", ".join([d["name"] for d in active_doshas])
        reasons.append(f"Deva Prasna Root-Cause Diagnostics: Identified {len(active_doshas)} active karmic blockage(s) [{dosha_names}]. Prescribed Kerala Pariharas are recommended to dissolve these unseen impediments.")
    else:
        reasons.append("Deva Prasna Root-Cause Diagnostics: Nir-dosha (निर्दोष) — The query is spiritually unblemished by Deva, Pitru, Sarpa, Drishti, or Vastu afflictions; resolution is purely governed by physical effort and timing.")

    reasoning_text = " ".join(reasons)
    
    # Success determination
    if score >= 4:
        verdict = "Highly Auspicious (Sadhya)"
        verdict_desc = "The divine omens and planetary configurations strongly favor total fulfillment of the query."
    elif score >= 1:
        verdict = "Favorable with Effort (Krichra Sadhya)"
        verdict_desc = "The outcome is positive, though moderate persistence and focused remedies will be required."
    elif score >= -2:
        verdict = "Mixed / Delayed (Vilamba)"
        verdict_desc = "Conflicting omens suggest initial delays or partial results; patience and caution are essential."
    else:
        verdict = "Challenging / Adverse (Asadhya)"
        verdict_desc = "Heavy malefic influence and cautionary cowrie omens indicate serious impediments or alternative pathways needed."

    sphutas_summary = {
        "trisphuta": {
            "name": "Trisphuta (त्रिसपुट)",
            "formula": "Lagna + Moon + Gulika",
            "sign": tri_info["sign"],
            "nakshatra": tri_info["nakshatra"],
            "pada": tri_info["pada"],
            "deg_str": tri_info["deg_str"],
            "house_from_arudha": tri_house_from_arudha,
            "is_gandanta": tri_gandanta,
            "is_visha_ghati": tri_visha,
            "alerts": trisphuta_alerts
        },
        "chatusphuta": {
            "name": "Chatusphuta (चतुष्पुट)",
            "formula": "Trisphuta + Sun",
            "sign": chatu_info["sign"],
            "nakshatra": chatu_info["nakshatra"],
            "pada": chatu_info["pada"],
            "deg_str": chatu_info["deg_str"],
            "house_from_arudha": chatu_house_from_arudha
        },
        "panchasphuta": {
            "name": "Panchasphuta (पञ्चपुट)",
            "formula": "Chatusphuta + Rahu",
            "sign": pancha_info["sign"],
            "nakshatra": pancha_info["nakshatra"],
            "pada": pancha_info["pada"],
            "deg_str": pancha_info["deg_str"],
            "house_from_arudha": pancha_house_from_arudha
        },
        "prana": {
            "name": "Prana Sphuta (प्राण स्फुट)",
            "formula": "Lagna × 5 + Gulika",
            "sign": prana_info["sign"],
            "nakshatra": prana_info["nakshatra"],
            "pada": prana_info["pada"],
            "deg_str": prana_info["deg_str"],
            "house_from_arudha": prana_house_from_arudha
        },
        "deha": {
            "name": "Deha Sphuta (देह स्फुट)",
            "formula": "Moon × 8 + Gulika",
            "sign": deha_info["sign"],
            "nakshatra": deha_info["nakshatra"],
            "pada": deha_info["pada"],
            "deg_str": deha_info["deg_str"],
            "house_from_arudha": deha_house_from_arudha
        },
        "mrityu": {
            "name": "Mrityu Sphuta (मृत्यु स्फुट)",
            "formula": "Gulika × 7 + Sun",
            "sign": mrityu_info["sign"],
            "nakshatra": mrityu_info["nakshatra"],
            "pada": mrityu_info["pada"],
            "deg_str": mrityu_info["deg_str"],
            "house_from_arudha": mrityu_house_from_arudha
        },
        "prana_mrityu_balance": {
            "verdict": prana_mrityu_verdict,
            "description": prana_mrityu_desc,
            "status": prana_mrityu_status,
            "prana_strength": prana_strength,
            "mrityu_affliction": mrityu_affliction
        }
    }

    # Prepare Visual Prasna Chakra Data
    chart_planets = {}
    for p_name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu"]:
        if p_name in planets:
            p_lon = planets[p_name]["sidereal"]["lon"]
            chart_planets[p_name] = {
                "name": p_name,
                "lon": p_lon,
                "sign": get_sign_name(p_lon),
                "sign_idx": get_sign_index(p_lon),
                "deg": int(p_lon % 30),
                "min": int((p_lon % 1) * 60)
            }
    ketu_lon = (chart_planets.get("Rahu", {}).get("lon", 0.0) + 180.0) % 360.0
    chart_planets["Ketu"] = {
        "name": "Ketu",
        "lon": ketu_lon,
        "sign": get_sign_name(ketu_lon),
        "sign_idx": get_sign_index(ketu_lon),
        "deg": int(ketu_lon % 30),
        "min": int((ketu_lon % 1) * 60)
    }

    # Visual Badges to Pin:
    # A (Arudha Lagna - Gold), U (Udaya Lagna - Blue), Ch (Chhatra Lagna - Green),
    # Gu (Gulika - Crimson), Ma (Mandi - Crimson), Mo (Chandra - Silver)
    chart_special_points = [
        {"code": "A", "name": "Arudha Lagna", "sign": arudha_sign, "sign_idx": arudha_idx, "color": "gold", "bg": "#f59e0b", "text": "#78350f"},
        {"code": "U", "name": "Udaya Lagna", "sign": udaya_sign, "sign_idx": udaya_idx, "color": "blue", "bg": "#0284c7", "text": "#ffffff"},
        {"code": "Ch", "name": "Chhatra Lagna", "sign": chhatra_sign, "sign_idx": chhatra_idx, "color": "green", "bg": "#059669", "text": "#ffffff"},
        {"code": "Gu", "name": "Gulika", "sign": gulika_sign, "sign_idx": gulika_sign_idx, "color": "crimson", "bg": "#be123c", "text": "#ffffff"},
        {"code": "Ma", "name": "Mandi", "sign": mandi_sign, "sign_idx": mandi_sign_idx, "color": "crimson", "bg": "#991b1b", "text": "#ffffff"},
        {"code": "Mo", "name": "Chandra", "sign": chart_planets.get("Moon", {}).get("sign", ""), "sign_idx": chart_planets.get("Moon", {}).get("sign_idx", 0), "color": "silver", "bg": "#94a3b8", "text": "#0f172a"}
    ]

    # Aspect Rays (Drishti):
    # Benefic: Jupiter (5, 7, 9), Venus (7) in Emerald
    # Malefic: Mars (4, 7, 8), Saturn (3, 7, 10), Rahu (5, 7, 9) in Red
    aspect_rays = []
    
    # Jupiter rays
    jup_s = chart_planets["Jupiter"]["sign_idx"]
    for off in [4, 6, 8]:
        aspect_rays.append({"from_planet": "Jupiter", "from_sign_idx": jup_s, "to_sign_idx": (jup_s + off) % 12, "type": "benefic", "color": "#10b981", "nature": "Guru Drishti (Grace & Protection)"})

    # Venus rays
    ven_s = chart_planets["Venus"]["sign_idx"]
    aspect_rays.append({"from_planet": "Venus", "from_sign_idx": ven_s, "to_sign_idx": (ven_s + 6) % 12, "type": "benefic", "color": "#10b981", "nature": "Shukra Drishti (Harmony & Prosperity)"})

    # Mars rays
    mars_s = chart_planets["Mars"]["sign_idx"]
    for off in [3, 6, 7]:
        aspect_rays.append({"from_planet": "Mars", "from_sign_idx": mars_s, "to_sign_idx": (mars_s + off) % 12, "type": "malefic", "color": "#ef4444", "nature": "Kuja Drishti (Aggression & Friction)"})

    # Saturn rays
    sat_s = chart_planets["Saturn"]["sign_idx"]
    for off in [2, 6, 9]:
        aspect_rays.append({"from_planet": "Saturn", "from_sign_idx": sat_s, "to_sign_idx": (sat_s + off) % 12, "type": "malefic", "color": "#ef4444", "nature": "Sani Drishti (Delay & Obstacle)"})

    # Rahu rays
    rahu_s = chart_planets["Rahu"]["sign_idx"]
    for off in [4, 6, 8]:
        aspect_rays.append({"from_planet": "Rahu", "from_sign_idx": rahu_s, "to_sign_idx": (rahu_s + off) % 12, "type": "malefic", "color": "#ef4444", "nature": "Rahu Drishti (Confusion & Illusion)"})

    dosha_summary = {
        "active_count": len(active_doshas),
        "has_doshas": len(active_doshas) > 0,
        "status": "Afflicted" if len(active_doshas) > 0 else "Nir-dosha (Clear)",
        "items": doshas_list
    }

    # Phala Kala Nirnaya (Exact Timing of Fulfillment - Prasna Marga)
    arudha_mob = SIGN_MOBILITY.get(arudha_sign, SIGN_MOBILITY["Aries"])
    arudha_lord_name = SIGN_LORDS.get(arudha_sign, "Mars")
    arudha_lord_lon = chart_planets.get(arudha_lord_name, {}).get("lon", 0.0)

    # Degrees traversed in current Rasi
    moon_deg_in_sign = moon_lon % 30.0
    moon_deg_remaining = 30.0 - moon_deg_in_sign

    lord_deg_in_sign = arudha_lord_lon % 30.0
    lord_deg_remaining = 30.0 - lord_deg_in_sign

    # Identify nearest favorable house from Arudha (1, 4, 5, 7, 9, 10, 11)
    favorable_house_offsets = [0, 3, 4, 6, 8, 9, 10]
    house_names = {
        1: "Tanu (Arudha)", 4: "Sukha (Stability)", 5: "Purva Punya (Resolution)",
        7: "Jaya (Manifestation)", 9: "Bhagya (Divine Grace)", 10: "Karma (Accomplishment)", 11: "Labha (Fulfillment)"
    }
    min_dist_to_fav = 360.0
    target_house_num = 11
    for off in favorable_house_offsets:
        h_num = off + 1
        h_center = ((arudha_idx + off) * 30.0 + 15.0) % 360.0
        dist = (h_center - moon_lon) % 360.0
        if 0.5 < dist < min_dist_to_fav:
            min_dist_to_fav = dist
            target_house_num = h_num

    effective_deg = min_dist_to_fav if min_dist_to_fav <= 30.0 else moon_deg_remaining
    effective_deg = max(3.0, min(28.5, effective_deg))

    # Calculate timeframe based on Arudha Mobility:
    # Movable (Chara): Quick results (within days/weeks)
    # Dual (Dvisvabhava): Moderate results (within months)
    # Fixed (Sthira): Long delays or permanent status quo (within years)
    if arudha_mob["code"] == "Chara":
        days_min = max(3, int(round(effective_deg * 0.7)))
        days_max = max(days_min + 5, int(round(effective_deg * 1.5)))
        expected_fruit_str = f"Within {days_min} to {days_max} days"
        speed_category = "Swift Fruition (Days to Weeks)"
        timeframe_badge = "Quick Results • Chara Rasi"
        cal_start = now_utc + datetime.timedelta(days=days_min)
        cal_end = now_utc + datetime.timedelta(days=days_max)
    elif arudha_mob["code"] == "Dvisvabhava":
        weeks_min = max(2, int(round(effective_deg * 0.25)))
        weeks_max = max(weeks_min + 2, int(round(effective_deg * 0.55)))
        months_approx = round(weeks_max / 4.3, 1)
        expected_fruit_str = f"Within {weeks_min} to {weeks_max} weeks (~{months_approx} months)"
        speed_category = "Moderate Fruition (Weeks to Months)"
        timeframe_badge = "Moderate Results • Dvisvabhava Rasi"
        cal_start = now_utc + datetime.timedelta(days=weeks_min * 7)
        cal_end = now_utc + datetime.timedelta(days=weeks_max * 7)
    else:  # Sthira
        months_min = max(3, int(round(effective_deg * 0.35)))
        months_max = max(months_min + 3, int(round(effective_deg * 0.85)))
        expected_fruit_str = f"Within {months_min} to {months_max} months (Prolonged / Chronic Delay)"
        speed_category = "Delayed Fruition (Months to Years)"
        timeframe_badge = "Delayed Status Quo • Sthira Rasi"
        cal_start = now_utc + datetime.timedelta(days=months_min * 30)
        cal_end = now_utc + datetime.timedelta(days=months_max * 30)

    cal_window_str = f"{cal_start.strftime('%b %d, %Y')} – {cal_end.strftime('%b %d, %Y')}"

    # Paksha evaluation
    moon_sun_diff = (moon_lon - sun_lon) % 360.0
    is_shukla = moon_sun_diff < 180.0
    paksha_name = "Shukla Paksha (Waxing / Accelerating Light)" if is_shukla else "Krishna Paksha (Waning / Steady Consolidation)"

    phala_kala_summary = {
        "expected_fruit": expected_fruit_str,
        "calendar_window": cal_window_str,
        "arudha_sign": arudha_sign,
        "arudha_mobility": arudha_mob["type"],
        "arudha_code": arudha_mob["code"],
        "arudha_speed": arudha_mob["speed"],
        "speed_category": speed_category,
        "timeframe_badge": timeframe_badge,
        "mobility_desc": arudha_mob["desc"],
        "degrees_remaining": round(effective_deg, 1),
        "moon_degrees_remaining": round(moon_deg_remaining, 1),
        "lord_degrees_remaining": round(lord_deg_remaining, 1),
        "lagna_lord": arudha_lord_name,
        "target_house": f"{target_house_num}th House ({house_names.get(target_house_num, 'Kendra/Trikona')})",
        "paksha": paksha_name,
        "is_shukla": is_shukla,
        "reasoning": f"Arudha Lagna is in {arudha_sign} ({arudha_mob['type']}). {arudha_mob['desc']} With {round(effective_deg, 1)}° remaining for the significator to reach the {target_house_num}th house cusp, expected fruition is: {expected_fruit_str} ({cal_window_str})."
    }

    # Authentic Kerala Parihara (Prescribed Remedies - Prasna Marga)
    q_lower = (question or "").lower()
    if any(w in q_lower for w in ["health", "sick", "disease", "surgery", "cure", "hospital", "pain", "recover", "medical", "doctor", "body"]):
        query_theme = "health"
        query_context_label = "Health & Longevity (Arogya)"
    elif any(w in q_lower for w in ["legal", "court", "dispute", "land", "property", "case", "fight", "enemy", "competitor", "adversary", "lawsuit", "police"]):
        query_theme = "legal_land"
        query_context_label = "Legal, Property & Adversary Resolution"
    elif any(w in q_lower for w in ["wealth", "money", "business", "financial", "debt", "loan", "gain", "profit", "income", "investment", "rich", "poverty", "loss"]):
        query_theme = "wealth"
        query_context_label = "Wealth, Business & Prosperity (Dhana)"
    elif any(w in q_lower for w in ["career", "job", "promotion", "work", "profession", "interview", "exam", "study", "education", "rank", "hire"]):
        query_theme = "career"
        query_context_label = "Career, Status & Academic Elevation (Karma)"
    elif any(w in q_lower for w in ["marriage", "relationship", "partner", "love", "wedding", "divorce", "family", "children", "child", "pregnancy", "son", "daughter"]):
        query_theme = "relationship"
        query_context_label = "Marriage, Family & Relationship Harmony (Kalyana)"
    else:
        query_theme = "general"
        query_context_label = "General Obstacle Removal & Divine Alignment"

    # 1. Homam Selection
    has_mandi_affliction = (gulika_sign == arudha_sign or mandi_sign == arudha_sign or any(d.get("id") == "pitru" for d in active_doshas))
    has_sarpa_affliction = any(d.get("id") == "sarpa" for d in active_doshas)
    has_drishti_affliction = any(d.get("id") == "drishti" for d in active_doshas)

    if has_mandi_affliction:
        homam_title = "Tila Homam & Maha Ganapathi Homam"
        homam_subtitle = "Neutralizing Mandi/Gulika Delays & Pitru Ancestral Debts"
        homam_dravya = "Conducted at sunrise with black sesame seeds (Tila), 8 coconuts, Modakas, pure cow ghee, and sacred Samidha."
        homam_timing = "Auspicious Saturday or Amavasya dawn"
        homam_mantra = "Om Gam Ganapataye Namaha • Om Mandeswaraya Vidmahe Mandi Sutaaya Dheemahi Tanno Mandi Prachodayat"
        homam_purpose = "Clears stubborn subconscious delays, pacifies angry ancestral spirits (Pitrus), and neutralizes the toxic heat of Mandi/Gulika."
        homam_target = "Mandi, Gulika, Saturn, and Ancestral Pitrus"
    elif has_sarpa_affliction:
        homam_title = "Sarpa Bali & Maha Ganapathi Homam"
        homam_subtitle = "Appeasing Naga Devatas & Dissolving Serpent Karmic Knots"
        homam_dravya = "Sacred milk oblations (Noorum Palum), Kadali bananas, ghee, rice flour, and turmeric paste."
        homam_timing = "Tuesday, Saturday, or Ayilyam (Ashlesha) Nakshatra"
        homam_mantra = "Om Namostu Sarpebhyo Ye Ke Cha Prithiveemanu Ye Antarikshe Ye Divi Tebhyah Sarpebhyo Namaha"
        homam_purpose = "Neutralizes Naga Shapa / Sarpa Dosha, clears land and skin afflictions, and restores generational harmony."
        homam_target = "Nagaraja, Nagayakshi, Rahu, and Ketu"
    elif has_drishti_affliction or query_theme == "legal_land":
        homam_title = "Sudarshana & Maha Ganapathi Homam"
        homam_subtitle = "Dismantling Evil Eye (Drishti Badha) & Hostile Competitor Envy"
        homam_dravya = "108 Sudarshana herbs, white mustard seeds (Siddhartha), dried red chilies, Guggulu, and cow ghee."
        homam_timing = "Tuesday or Friday evening at twilight (Pradosha)"
        homam_mantra = "Om Kleem Krishnaya Govindaya Gopijanavallabhaya Paraya Parama Purushaya Paramatmane Parakarma Mantra Yantra Tantra Aushadha Astra Shastrani Samhara Samhara"
        homam_purpose = "An impenetrable psychic armor (Kavacha) dispelling evil eyes, competitive sabotage, and adversary lawsuits."
        homam_target = "Mars, Saturn, Evil Eye, and Legal Adversaries"
    elif query_theme == "health":
        homam_title = "Maha Mrityunjaya & Ayushya Homam"
        homam_subtitle = "Infusing Vital Life-Force (Prana) & Overcoming Sickness"
        homam_dravya = "Sacred Amrita (Giloy) twigs, Durva grass, lotus seeds, cow milk, honey, and cow ghee."
        homam_timing = "Monday morning during Shiva Hora"
        homam_mantra = "Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat"
        homam_purpose = "Strengthens Prana Sphuta over Mrityu Sphuta, speeds physical recovery, and wards off critical health hazards."
        homam_target = "Lord Shiva, Lord Dhanvantari, and the Sun"
    else:
        homam_title = "Ashta Dravya Maha Ganapathi Homam"
        homam_subtitle = "Primary Kerala Horary Rite for Total Obstacle Clearance"
        homam_dravya = "8 sacred ingredients: fresh coconuts, sugarcane, unniyappam, modaka, puffed paddy (Malar), sesame, pure honey, and cow ghee."
        homam_timing = "Wednesday or Friday dawn at sunrise"
        homam_mantra = "Om Shreem Hreem Kleem Glaum Gam Ganapataye Vara Varada Sarva Janam Me Vashamanaya Swaha"
        homam_purpose = "The supreme foundational remedy in Kerala Prasna Marga to shatter unseen roadblocks and invite auspicious fortune."
        homam_target = "Lord Maha Ganapathi (Vighnaharta)"

    # 2. Deepa Samarpanam (Ghee Lamp Direction at Sunset)
    if query_theme in ["wealth", "career"]:
        deepam_direction = "North (Uttara)"
        deepam_reason = "Facing the realm of Lord Kubera and Budha (Mercury) to attract liquidity, career growth, and wealth accumulation."
    elif query_theme in ["health", "relationship"]:
        deepam_direction = "East (Purva)"
        deepam_reason = "Facing Indra and Surya to receive invigorating solar vitality, mental clarity, and harmonious beginnings."
    elif query_theme == "legal_land" or has_drishti_affliction:
        deepam_direction = "South-East (Agneya)"
        deepam_reason = "Facing Lord Agni and Subrahmanya to instill decisive valor, legal resolution, and competitive dominance."
    elif has_mandi_affliction:
        deepam_direction = "West (Paschima)"
        deepam_reason = "Facing Varuna and Saturn to pacify Mandi, dissolve chronic stagnation, and cleanse heavy karmic burdens."
    else:
        deepam_direction = "North-East (Ishanya)"
        deepam_reason = "Facing the auspicious Ishanya (Shiva) corner to awaken Kuladevata blessings and pure divine grace."

    # 3. Charity / Daanam Selection based on Afflicted Planet
    if has_mandi_affliction:
        daanam_planet = "Mandi / Gulika"
        daanam_reason = "Upagraha Mandi residing in or afflicting the query requires immediate propitiation."
    elif has_sarpa_affliction:
        daanam_planet = "Rahu"
        daanam_reason = "Active Sarpa Dosha requires appeasement of the North Lunar Node."
    elif has_drishti_affliction or query_theme == "legal_land":
        daanam_planet = "Mars"
        daanam_reason = "Fierce Kuja energies require cooling through charitable offerings."
    elif query_theme == "health":
        daanam_planet = "Sun"
        daanam_reason = "Lord of Vitality (Surya) must be energized to restore radiant health."
    elif query_theme == "wealth":
        daanam_planet = "Jupiter"
        daanam_reason = "Brihaspati (Dhana-karaka) propitiation opens channels for sustained wealth."
    elif query_theme == "career":
        daanam_planet = "Mercury"
        daanam_reason = "Budha controls professional agreements, intellect, and trade success."
    else:
        daanam_planet = "Saturn"
        daanam_reason = "Lord of Karma (Sani) governs delays and structural stability."

    DAANAM_CATALOG = {
        "Sun": {
            "planet": "Sun (Surya)",
            "grain": "Whole Wheat (Godhuma)",
            "cloth": "Ruby-red silk or copper-toned unstitched cloth",
            "dravya": "Jaggery (Gud), pure cow ghee, and a small copper utensil",
            "timing": "Sunday noon during Abhijit Muhurta (approx. 12:00 PM)",
            "recipient": "Vedic temple priests, spiritual preceptors, or paternal elders",
            "significance": "Boosts executive vitality, government patronage, and paternal health."
        },
        "Moon": {
            "planet": "Moon (Chandra)",
            "grain": "Raw White Rice (Tandula)",
            "cloth": "Pearl-white cotton cloth or silver-bordered fabric",
            "dravya": "Cow's milk, sugar, curd, and a silver coin",
            "timing": "Monday evening at twilight (Sandhya Kala)",
            "recipient": "Elderly mothers, destitute women, or Go-Shala (cow shelter)",
            "significance": "Soothes psychological turmoil, removes depression, and heals domestic unrest."
        },
        "Mars": {
            "planet": "Mars (Mangala / Kuja)",
            "grain": "Split Red Lentils (Masoor Dal)",
            "cloth": "Bright scarlet or saffron-red cotton cloth",
            "dravya": "Jaggery, red sandalwood paste, and copper coins",
            "timing": "Tuesday midday during Kuja Hora",
            "recipient": "Young laborers, uniformed soldiers, surgeons, or Muruga temple",
            "significance": "Neutralizes court battles, protects real estate, and cures blood/skin heat."
        },
        "Mercury": {
            "planet": "Mercury (Budha)",
            "grain": "Whole Green Gram (Moong Dal)",
            "cloth": "Emerald-green cloth or light-green shawl",
            "dravya": "Educational books, pens, notebooks, and fresh green vegetables/fruits",
            "timing": "Wednesday morning at sunrise",
            "recipient": "Underprivileged students, orphanages, or young scholars",
            "significance": "Breaks commercial stagnancy, clarifies legal contracts, and enhances memory."
        },
        "Jupiter": {
            "planet": "Jupiter (Guru / Brihaspati)",
            "grain": "Yellow Split Chickpeas (Chana Dal)",
            "cloth": "Golden-yellow silk or turmeric-dyed cloth",
            "dravya": "Turmeric fingers, pure cow ghee, yellow flowers, and brass items",
            "timing": "Thursday morning during Guru Hora",
            "recipient": "Spiritual preceptors, temple scholars, or elderly teachers",
            "significance": "Attracts divine grace, eliminates debts, and resolves delayed progeny/marriage."
        },
        "Venus": {
            "planet": "Venus (Shukra)",
            "grain": "White Rice Flour or White Chickpeas",
            "cloth": "Pure white silk, silver-embroidered or variegated fabric",
            "dravya": "Sugar candy (Mishri), scented sandalwood, dairy sweets, and cow feed",
            "timing": "Friday morning during Shukra Hora",
            "recipient": "Underprivileged women, young brides, or classical artists",
            "significance": "Revitalizes luxury income, restores spousal bliss, and facilitates vehicle acquisition."
        },
        "Saturn": {
            "planet": "Saturn (Sani)",
            "grain": "Black Sesame Seeds (Tila)",
            "cloth": "Dark navy-blue or black coarse blanket/cloth",
            "dravya": "Cold-pressed mustard/sesame oil in iron bowl, iron nails, and cooked black gram",
            "timing": "Saturday evening after sunset",
            "recipient": "Elderly manual laborers, sweepers, or hospice care trusts",
            "significance": "Eradicates chronic obstacles, stops perpetual delays, and washes past-life karma."
        },
        "Rahu": {
            "planet": "Rahu (Serpent Shadow)",
            "grain": "Black Urad Dal (Minumulu)",
            "cloth": "Smoky blue, slate-grey, or multi-hued dark fabric",
            "dravya": "Whole coconut, blue flowers, mustard seeds, and lead coin",
            "timing": "Saturday evening during Rahu Kala",
            "recipient": "Bhairava or Naga temple priests, or leprosy/disability welfare shelters",
            "significance": "Dissolves illusions, shields from black magic/malicious gaze, and cures chronic anxiety."
        },
        "Mandi / Gulika": {
            "planet": "Gulika & Mandi (Saturn's Toxic Sons)",
            "grain": "Black Sesame Seeds (Tila) drenched in Pure Cow Ghee",
            "cloth": "Charcoal or unwashed black cloth piece",
            "dravya": "Earthen pot with sesame oil, small iron nail, and jaggery piece",
            "timing": "Saturday twilight (Pradosha Kala)",
            "recipient": "Sacred flowing river (Jala Visarjan) or Shani/Bhairava altar",
            "significance": "The classical Kerala antidote to unburden the querent from Mandi's fatal lethargy and curses."
        }
    }
    daanam_info = DAANAM_CATALOG.get(daanam_planet, DAANAM_CATALOG["Saturn"])

    # 4. Deity Propitiation (Prasna Karyesh & Query Theme Adhidevata)
    if query_theme == "health":
        deity_name = "Lord Shiva & Lord Dhanvantari"
        deity_title = "Sacred Healing Propitiation (Arogya Raksha)"
        deity_offerings = "Dhara (continuous stream of cold milk/tender coconut water over Shiva Lingam), Bilva leaf Archana, and offering Dhanvantari Lehyam."
        deity_mantra = "Om Namah Shivaya • Om Namo Bhagavate Vasudevaya Dhanvantaraye Amrita Kalasha Hasthaya Sarvamaya Vinashanaya Trailokya Nathaya Sri Mahavishnave Namaha"
        deity_kshethram = "Ancient Shiva Temple (e.g. Vadakkunnathan, Ettumanoor, or Vaikom Mahadeva) or a Dhanvantari Kshethram"
        deity_significance = "Dispels illness, strengthens bodily prana, and grants longevity and medical breakthrough."
    elif query_theme == "legal_land":
        deity_name = "Lord Subrahmanya (Muruga) & Lord Veerabhadra"
        deity_title = "Valor & Victory Propitiation (Shatru Samhara)"
        deity_offerings = "Panchamrita Abhishekam, red oleander (Sevvarali / Thechi) flower garland, Vel Archana, and lighting ghee lamps on Tuesdays."
        deity_mantra = "Om Saravana Bhavaya Namaha • Om Hreem Shatru Samhara Subrahmanyaya Namaha"
        deity_kshethram = "Subrahmanya Kshethram (e.g. Haripad, Payyanur, or Udayanapuram Subrahmanya Temple)"
        deity_significance = "Decimates adversary sabotage, guarantees triumph in property/court disputes, and confers fearlessness."
    elif query_theme == "wealth":
        deity_name = "Goddess Mahalakshmi & Lord Kubera"
        deity_title = "Abundance & Fortune Propitiation (Aishwarya Siddhi)"
        deity_offerings = "Kumkuma Archana with 108 red lotus petals, offering sweet Pal Payasam, lighting cow ghee lamps, and offering fragrant green cardamom."
        deity_mantra = "Om Shreem Hreem Kleem Maha Lakshmyai Namaha • Om Yakshaya Kuberaya Vaishravanaya Dhana Dhanyadhipataye Dhana Dhanya Samriddhim Me Dehi Dapaya Swaha"
        deity_kshethram = "Sri Padmanabhaswamy Temple or an ancient Bhagavathy Kshethram (Chottanikkara / Attukal)"
        deity_significance = "Unlocks cash liquidity, clears outstanding dues, and establishes lasting domestic wealth."
    elif query_theme == "career":
        deity_name = "Lord Surya & Goddess Saraswati"
        deity_title = "Intellectual & Authority Propitiation (Vidya & Tejas)"
        deity_offerings = "Arghya offering with water, kumkum, and red flowers to the rising Sun; offering white lotus and Payasam to Goddess Saraswati."
        deity_mantra = "Om Hram Hreem Hroum Sah Suryaya Namaha • Om Aim Saraswatyai Namaha"
        deity_kshethram = "Suryanar Kovil or Saraswati Shrine (e.g. Panachikkadu Dakshina Mookambika)"
        deity_significance = "Bestows promotional breakthrough, public prestige, executive authority, and academic brilliance."
    elif query_theme == "relationship":
        deity_name = "Goddess Parvathi & Lord Parameshwara"
        deity_title = "Marital Bliss & Progeny Propitiation (Kalyana Varada)"
        deity_offerings = "Swayamvara Parvathi Pushpanjali, offering yellow silk (Pattu), lighting 5-wick ghee lamp, and sweet coconut milk pudding."
        deity_mantra = "Om Hreem Yoginim Yogini Yogeswari Yoga Bhayankari Sakala Sthavara Jangamasya Mukha Hridayam Mama Vasham Akarshaya Akarshaya Swaha"
        deity_kshethram = "Bhagavathy Temple (e.g. Attukal, Kadampuzha, or Chottanikkara)"
        deity_significance = "Removes marital blockages, pacifies relationship friction, and facilitates auspicious alliances."
    else:
        deity_name = "Lord Maha Ganapathi & Lord Hanuman"
        deity_title = "Supreme Obstacle Removal (Sarva Vighna Nivarana)"
        deity_offerings = "Otta Appam / Unniyappam offering, 8 coconut breaking, Modakam samarpanam, and offering Sindoor and betel leaf garland."
        deity_mantra = "Om Gam Ganapataye Namaha • Om Hum Hanumate Rudratmakaya Phat Swaha"
        deity_kshethram = "Kottarakkara Sree Mahaganapathi Kshethram or Pazhavangadi Ganapathi Temple"
        deity_significance = "The supreme Kerala horary remedy to dissolve invisible stumbling blocks and grant total success."

    parihara_summary = {
        "query_theme": query_context_label,
        "homam": {
            "title": homam_title,
            "subtitle": homam_subtitle,
            "dravya": homam_dravya,
            "timing": homam_timing,
            "mantra": homam_mantra,
            "purpose": homam_purpose,
            "target": homam_target
        },
        "deepam": {
            "title": "Deepa Samarpanam (Sandhya Ghee Lamp)",
            "direction": deepam_direction,
            "direction_reason": deepam_reason,
            "lamp_type": "Traditional Kerala Brass Nilavilakku with pure cow ghee & 2 cotton wicks",
            "timing": "Daily at sunset (Sandhya twilight, ~6:00 PM)",
            "sloka": "Deepajyotir Parabrahma Deepajyotir Janardhana, Deepo Haratu Me Papam Sandhyadeepa Namostute",
            "duration": "Minimum 48 minutes (1 Ghati) continuous illumination"
        },
        "daanam": {
            "title": f"Graha Daanam ({daanam_info['planet']})",
            "planet": daanam_info["planet"],
            "grain": daanam_info["grain"],
            "cloth": daanam_info["cloth"],
            "dravya": daanam_info["dravya"],
            "timing": daanam_info["timing"],
            "recipient": daanam_info["recipient"],
            "significance": daanam_info["significance"],
            "trigger_reason": daanam_reason
        },
        "deity": {
            "title": deity_title,
            "deity_name": deity_name,
            "query_context": query_context_label,
            "offerings": deity_offerings,
            "mantra": deity_mantra,
            "kshethram": deity_kshethram,
            "significance": deity_significance
        },
        "checklist": [
            f"Schedule or sponsor {homam_title} on an auspicious {homam_timing.split()[0]} morning at sunrise.",
            f"Light a pure cow ghee Nilavilakku facing {deepam_direction} daily at sunset (Sandhya Kala).",
            f"Offer {daanam_info['grain']} and {daanam_info['cloth']} to {daanam_info['recipient']} on {daanam_info['timing']}.",
            f"Perform archana and recite sacred mantra for {deity_name} at a consecrated temple shrine."
        ]
    }

    # Structured Daivajna Consultation Report (Summary Layout)
    # 0. Janma-Prasna Samvada (Cross-Examination with Natal Kundali)
    janma_samvada = calculate_janma_prasna_samvada(
        birth_data=birth_data,
        query_lat=lat,
        query_lon=lon,
        arudha_idx=arudha_idx,
        udaya_idx=udaya_idx,
        prasna_planets=planets,
        gulika_sign=gulika_sign,
        mandi_sign=mandi_sign
    )

    # 1. Success Probability & Verdict
    base_prob = 50 + (score * 6.5)
    if prana_strength > mrityu_affliction:
        base_prob += 10
    elif mrityu_affliction > prana_strength:
        base_prob -= 10

    if janma_samvada and "samvada_analysis" in janma_samvada:
        sam_score = janma_samvada["samvada_analysis"]["resonance_score"]
        base_prob += (sam_score * 4.0)

    prob_pct = int(min(95, max(15, round(base_prob))))

    if prob_pct >= 75:
        verdict_sanskrit = "Sadhya (साध्य — Readily Accomplished)"
        verdict_tone = "Highly Favorable"
        verdict_category = "Sadhya"
    elif prob_pct >= 50:
        verdict_sanskrit = "Kashta-Sadhya (कष्टसाध्य — Accomplished with Effort & Parihara)"
        verdict_tone = "Moderate / Conditional"
        verdict_category = "Kashta-Sadhya"
    else:
        verdict_sanskrit = "Asadhya (असाध्य — Severe Resistance / Exhaustive Remedies Required)"
        verdict_tone = "Challenging / Obstructed"
        verdict_category = "Asadhya"

    # 2. Current Situation & Hindrances
    hindrances = []
    if gulika_sign == arudha_sign or mandi_sign == arudha_sign:
        hindrances.append(f"Mandi/Gulika positioned directly in Arudha ({arudha_sign}) causing subconscious procrastination, mental fog, or unseen delays.")
    if gulika_sign == udaya_sign or mandi_sign == udaya_sign:
        hindrances.append(f"Gulika/Mandi touching Udaya Lagna ({udaya_sign}), signaling immediate apprehension and fatigue in the querent's mindset.")
    if mrityu_affliction > prana_strength:
        hindrances.append("Mrityu Sphuta forces outweigh Prana Sphuta forces, creating acute friction between effort invested and tangible returns.")
    if len(active_doshas) > 0:
        d_names = ", ".join([d["name"] for d in active_doshas])
        hindrances.append(f"Active root-cause dosha afflictions detected: {d_names}.")
    if nimitta_score < 0:
        hindrances.append("Ambient acoustic or directional omens at query moment indicate psychic turbulence in the surrounding space.")
    if janma_samvada and janma_samvada.get("samvada_analysis", {}).get("mandi_affliction"):
        hindrances.append(f"Janma-Prasna Affliction: Horary Gulika/Mandi directly transits your Natal Moon/Lagna ({janma_samvada['janma_rasi']['sign']}/{janma_samvada['natal_ascendant']['sign']}), casting a shadow on decision clarity.")
    if janma_samvada and janma_samvada.get("samvada_analysis", {}).get("arudha_from_moon_house") in [6, 8, 12]:
        h_no = janma_samvada["samvada_analysis"]["arudha_from_moon_house"]
        hindrances.append(f"Prasna Arudha occupies the {h_no}th house (Dusthana) from your Natal Moon, signaling an uphill battle or friction against current personal desires.")
    if not hindrances:
        hindrances.append("No severe structural afflictions found. Current hurdles are temporal and will resolve naturally as transits progress.")

    # 3. Karmic Origin (Prarabdha / Ancestral / Environment)
    karmic_origins = [
        {
            "category": "Prarabdha Karma (Individual Past Actions)",
            "title": "Past Karmic Trajectory",
            "icon": "☸️",
            "description": f"The query emerges from {deity_past['symbol']} ({deity_past['planet']}) energy representing {deity_past['quality'].lower()}. Trisphuta degree at {tri_info['deg_str']} reveals individual karmic impressions now maturing for resolution."
        },
        {
            "category": "Pitru Karma (Ancestral Lineage)",
            "title": "Ancestral & Lineage Current",
            "icon": "🛕",
            "description": "Ancestral channels are peaceful and supportive; family lineage offers unencumbered backing." if not has_mandi_affliction else "Unfulfilled ancestral rites (Pitru Dosha) or unresolved vows made by elders are creating psychic friction in the family sphere."
        },
        {
            "category": "Prakriti / Environmental Dynamics",
            "title": "Ambient Immediate Field",
            "icon": "🏡",
            "description": f"Immediate environment is governed by {tambula_planet_info['planet']} ({tambula_planet_info['environment']}) reflecting {t_parity}. Surrounding directional and acoustic omens contribute {nimitta_score:+d} points to the consultation."
        }
    ]

    # 4. Time of Resolution
    time_of_resolution = {
        "expected_fruit": phala_kala_summary["expected_fruit"],
        "calendar_window": phala_kala_summary["calendar_window"],
        "mobility": phala_kala_summary["arudha_mobility"],
        "degrees_remaining": phala_kala_summary["degrees_remaining"],
        "speed": phala_kala_summary["speed_category"],
        "summary": f"Fulfillment is projected {phala_kala_summary['expected_fruit']} ({phala_kala_summary['calendar_window']}) as the significator covers {phala_kala_summary['degrees_remaining']}° to reach the favorable house cusp."
    }

    # 5. Prescribed Santhi & Parihara
    prescribed_remedies_summary = {
        "homam": parihara_summary["homam"]["title"],
        "deepam": f"{parihara_summary['deepam']['title']} facing {parihara_summary['deepam']['direction']}",
        "daanam": f"{parihara_summary['daanam']['title']} ({parihara_summary['daanam']['grain']})",
        "deity": f"{parihara_summary['deity']['deity_name']} ({parihara_summary['deity']['title']})",
        "checklist": parihara_summary["checklist"]
    }

    consultation_report = {
        "probability_percent": prob_pct,
        "verdict_sanskrit": verdict_sanskrit,
        "verdict_category": verdict_category,
        "verdict_tone": verdict_tone,
        "current_hindrances": hindrances,
        "karmic_origins": karmic_origins,
        "time_of_resolution": time_of_resolution,
        "prescribed_remedies": prescribed_remedies_summary,
        "daivajna_benediction": f"May Lord Maha Ganapathi and {parihara_summary['deity']['deity_name']} dissolve all obstructions. By performing the prescribed {parihara_summary['homam']['title']} and daily Deepa Samarpanam facing {parihara_summary['deepam']['direction']}, the querent will transition from obstacle to victory.",
        "janma_samvada": janma_samvada
    }

    return {
        "arudha_sign": arudha_sign,
        "udaya_sign": udaya_sign,
        "sun_sign": sun_sign,
        "chhatra_sign": chhatra_sign,
        "gulika_sign": gulika_sign,
        "mandi_sign": mandi_sign,
        "score": score,
        "verdict": verdict,
        "verdict_desc": verdict_desc,
        "kavadi": kavadi_summary,
        "tambula": tambula_summary,
        "nimitta": nimitta_summary,
        "sphutas": sphutas_summary,
        "doshas": dosha_summary,
        "phala_kala": phala_kala_summary,
        "parihara": parihara_summary,
        "consultation_report": consultation_report,
        "janma_samvada": janma_samvada,
        "chart_planets": chart_planets,
        "chart_special_points": chart_special_points,
        "aspect_rays": aspect_rays,
        "reasoning": reasoning_text,
        "gulika_lon": gulika_asc,
        "mandi_lon": mandi_asc,
        "udaya_lon": udaya_lon,
        "planets": planets
    }

