from fastapi import APIRouter, HTTPException, Body
from typing import Dict, List
import datetime
from astronomy.julian import datetime_to_julian

router = APIRouter()

CEREMONY_RULES = {
    "Marriage": {
        "nakshatras": ["Rohini", "Mrigashira", "Magha", "Hasta", "Swati", "Anuradha", "Mool", "Uttara Phalguni", "Uttarashada", "Uttara Bhadrapada", "Revati"],
        "tithis": [2, 3, 5, 7, 11, 13],
        "days": [0, 2, 3, 4] # Mon, Wed, Thu, Fri
    },
    "Namkaran": {
        "nakshatras": ["Rohini", "Mrigashira", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Anuradha", "Uttara Ashadha", "Uttara Bhadrapada", "Pushya", "Revati"],
        "tithis": [1, 2, 3, 5, 7, 10, 11, 12, 13], # Avoid Rikta (4, 9, 14)
        "days": [0, 2, 3, 4] # Mon, Wed, Thu, Fri
    },
    "Anna Prashan": {
        "nakshatras": ["Rohini", "Mrigashira", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Anuradha", "Revati"],
        "tithis": [1, 2, 3, 5, 7, 10, 11, 12, 13],
        "days": [0, 2, 3, 4]
    },
    "Mundan": {
        "nakshatras": ["Ashwini", "Mrigashira", "Pushya", "Hasta", "Punarvasu"],
        "tithis": [2, 3, 5, 7, 10, 11, 13],
        "days": [0, 2, 3, 4]
    },
    "Upnayan": {
        "nakshatras": ["Hasta", "Chitra", "Swati", "Anuradha", "Shravana", "Dhanishta", "Revati"],
        "tithis": [2, 3, 5, 10, 11, 12],
        "days": [0, 2, 3, 4, 6] # Sun, Mon, Wed, Thu, Fri
    },
    "Sagai": {
        "nakshatras": ["Ashwini", "Rohini", "Mrigashira", "Uttara Phalguni", "Hasta", "Swati", "Anuradha", "Mool", "Uttara Ashadha", "Uttara Bhadrapada", "Revati", "Pushya", "Shravana"],
        "tithis": [2, 3, 5, 7, 10, 11, 12, 13, 15],
        "days": [0, 2, 3, 4] # Mon, Wed, Thu, Fri
    },
    "Tilak": {
        "nakshatras": ["Rohini", "Hasta", "Swati", "Shravana", "Revati"],
        "tithis": [2, 3, 5, 7, 10, 11, 13],
        "days": [0, 2, 3, 4] # Mon, Wed, Thu, Fri
    },
    "Vadhu Pravesh": {
        "nakshatras": ["Rohini", "Uttara Phalguni", "Uttarashada", "Uttara Bhadrapada", "Punarvasu", "Shravana", "Dhanishta", "Shatabhisha", "Swati", "Hasta", "Chitra", "Anuradha", "Mrigashira", "Revati", "Ashwini", "Pushya"],
        "tithis": [2, 3, 5, 7, 10, 11, 13],
        "days": [0, 2, 3, 4] # Mon, Wed, Thu, Fri
    },
    "Grih Pravesh": {
        "nakshatras": ["Rohini", "Uttara Phalguni", "Uttara Ashadha", "Uttara Bhadrapada", "Dhanishta"],
        "tithis": [2, 3, 5, 7, 10, 11, 12, 13],
        "days": [0, 2, 3, 4] # Mon, Wed, Thu, Fri
    },
    "Vehicle Purchase": {
        "nakshatras": ["Pushya", "Punarvasu", "Swati", "Shravana", "Ashwini", "Revati"],
        "tithis": [2, 3, 5, 7, 8, 10, 11, 12, 13],
        "days": [0, 2, 3, 4] # Mon, Wed, Thu, Fri
    },
    "Bhoomi Pujan": {
        "nakshatras": ["Rohini", "Mrigashira", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Anuradha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Uttara Bhadrapada", "Revati"],
        "tithis": [2, 3, 5, 6, 7, 8, 10, 11],
        "days": [0, 2, 3, 4] # Mon, Wed, Thu, Fri
    },
    "Garbhadhana": {
        "nakshatras": ["Rohini", "Mrigashira", "Pushya", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Anuradha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Uttara Bhadrapada"],
        "tithis": [2, 3, 5, 7, 10, 12, 13], # Rikta Tithis, Amavasya, Purnima generally avoided
        "days": [0, 2, 3, 4] # Mon, Wed, Thu, Fri
    }
}

from panchang.tithi_yoga_karana import TITHI_NAMES, NAKS
from astronomy.positions import get_sun_moon_sidereal, get_all_planetary_positions
from astronomy.sidereal import set_ayanamsa
from astronomy.ascendant import get_ascendant_from_datetime
from astronomy.sun_calculations import calculate_noaa_sunrise_sunset
from api.routes.panchang import calculate_muhurta_periods

@router.post("/calculate")
async def calculate_muhurt(payload: Dict = Body(...)):
    try:
        # Pre-set ayanamsa for the whole batch
        set_ayanamsa()
        
        start_date_str = payload["start_date"] # YYYY-MM-DD
        end_date_str = payload.get("end_date") # YYYY-MM-DD
        days_to_check = int(payload.get("days", 30))
        
        start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%d")
        
        if end_date_str:
            end_date = datetime.datetime.strptime(end_date_str, "%Y-%m-%d")
            duration = (end_date - start_date).days + 1
            if duration > 0:
                days_to_check = min(duration, 365) # cap at 1 year
        
        tz = float(payload.get("tz", 5.5))
        ceremony = payload.get("ceremony", "Marriage")
        rules = CEREMONY_RULES.get(ceremony, CEREMONY_RULES["Marriage"])
        
        results = []
        TITHI_DEG = 12.0
        NAK_DEG = 13.333333333333334
        
        # Performance shortcut: Calculate base JD once and increment numerically
        base_jd_ut = datetime_to_julian(start_date.replace(hour=12) - datetime.timedelta(hours=tz))
        
        for i in range(days_to_check):
            jd_ut = base_jd_ut + i
            current_day = start_date + datetime.timedelta(days=i)
            
            # LIGHTWEIGHT FETCH
            pos = get_sun_moon_sidereal(jd_ut)
            sun_lon = pos["Sun"]
            moon_lon = pos["Moon"]
            
            # Tithi Calc
            elong = (moon_lon - sun_lon) % 360.0
            tithi_index = int(elong // TITHI_DEG)
            tithi_val = (tithi_index % 15) + 1
            paksha = "Shukla" if tithi_index < 15 else "Krishna"
            tithi_name = f"{paksha} {tithi_val}"
            
            # Nakshatra Calc
            nak_index = int(moon_lon // NAK_DEG) % 27
            nak_name = NAKS[nak_index]
            
            # 1. Base Criteria
            weekday = current_day.weekday() # 0 = Mon
            is_auspicious = (
                nak_name in rules["nakshatras"] and
                tithi_val in rules["tithis"] and
                weekday in rules["days"]
            )

            # 2. Specific Checks for Vehicle Purchase
            reasons = []
            if ceremony == "Vehicle Purchase" and is_auspicious:
                # Chandra Bala Check (Moon in 4, 8, or 12 house from owner's Rashi is bad)
                user_rashi = payload.get("rashi_index") # 0-indexed (Aries=0)
                if user_rashi is not None:
                    moon_rashi = int(moon_lon // 30.0)
                    house_from_rashi = (moon_rashi - user_rashi + 12) % 12 + 1
                    if house_from_rashi in [4, 8, 12]:
                        is_auspicious = False
                        reasons.append(f"Inauspicious Moon House ({house_from_rashi}) from your Rashi")

                # Bhadra Check (Vishti Karana)
                # Karana index 0..10 based on half-tithi (each 6 degrees of elongation)
                half_tithi = int(elong // 6.0)
                karana_idx = 0
                if half_tithi == 0: # Shukla 1, 1st half
                    karana_idx = 10 # Kimstughna
                elif 1 <= half_tithi <= 56: # Shukla 1, 2nd half to Krishna 14, 1st half
                    karana_idx = (half_tithi - 1) % 7 # Bava=0, ..., Vishti=6
                elif half_tithi == 57: # Krishna 14, 2nd half
                    karana_idx = 7 # Shakuni
                elif half_tithi == 58: # Krishna 15, 1st half
                    karana_idx = 8 # Chatushpada
                elif half_tithi == 59: # Krishna 15, 2nd half
                    karana_idx = 9 # Naga
                
                if karana_idx == 6: # Vishti Karana = Bhadra
                    is_auspicious = False
                    reasons.append("Bhadra Period (Vishti Karana)")

                # Panchak Check (Moon in Dhanishta last half to Revati: 300° to 360°)
                if 300.0 <= moon_lon <= 360.0:
                    is_auspicious = False
                    reasons.append("Panchak Influence")

            # 3. Existing Special Checks for Other Ceremonies
            if ceremony in ["Mundan", "Upnayan", "Tilak", "Marriage", "Vadhu Pravesh", "Grih Pravesh"] and is_auspicious:
                # Kharmas Check (Sun in Sagittarius or Pisces)
                if (240.0 <= sun_lon <= 270.0) or (330.0 <= sun_lon <= 360.0):
                    is_auspicious = False
                    reasons.append("Kharmas Period")
                
                # Marriage, Entry, and Mundan Specifics: Chaturmas
                if ceremony in ["Marriage", "Vadhu Pravesh", "Grih Pravesh", "Mundan"] and is_auspicious:
                    if (90.0 <= sun_lon <= 210.0):
                        is_auspicious = False
                        reasons.append("Chaturmas Period")

                # Upnayan Specific: Uttarayana (Northern Transit) is strictly required
                if ceremony == "Upnayan" and is_auspicious:
                    # Uttarayana is Sun in Makara to Mithuna (270 to 90 degrees)
                    # Dakshinayana is from Karka to Dhanu (90 to 270 degrees)
                    if 90.0 <= sun_lon < 270.0:
                        is_auspicious = False
                        reasons.append("Dakshinayana (Sun is not in Uttarayana)")

                # Combustion Check
                if ceremony in ["Upnayan", "Tilak", "Marriage", "Vadhu Pravesh", "Grih Pravesh"] and is_auspicious:
                    jup_diff = abs(pos["Jupiter"] - sun_lon)
                    if jup_diff > 180: jup_diff = 360 - jup_diff
                    ven_diff = abs(pos["Venus"] - sun_lon)
                    if ven_diff > 180: ven_diff = 360 - ven_diff
                    
                    if jup_diff < 11.0:
                        is_auspicious = False
                        reasons.append("Jupiter Combustion (Asta)")
                    if ven_diff < 10.0:
                        is_auspicious = False
                        reasons.append("Venus Combustion (Asta)")
            
            results.append({
                "date": current_day.strftime("%Y-%m-%d"),
                "tithi": tithi_name,
                "nakshatra": nak_name,
                "weekday": current_day.strftime("%A"),
                "is_auspicious": is_auspicious,
                "reasons": reasons,
                "score": 100 if is_auspicious else 20
            })
            
        return {"ceremony": ceremony, "dates": results}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search_advanced")
async def search_advanced_muhurt(payload: Dict = Body(...)):
    """
    Advanced Muhurta Search Engine.
    Filters days based on ceremony rules, Tara Bala, and Chandra Bala.
    Then scans auspicious days for the optimal Lagna (empty 8th house, avoiding Rahu Kaal).
    """
    try:
        set_ayanamsa()
        
        start_date_str = payload["start_date"] # YYYY-MM-DD
        end_date_str = payload.get("end_date") # YYYY-MM-DD
        days_to_check = int(payload.get("days", 30))
        
        start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%d")
        if end_date_str:
            end_date = datetime.datetime.strptime(end_date_str, "%Y-%m-%d")
            duration = (end_date - start_date).days + 1
            if duration > 0:
                days_to_check = min(duration, 60) # cap at 60 days
                
        tz = float(payload.get("tz", 5.5))
        lat = float(payload.get("lat", 28.6139))
        lon = float(payload.get("lon", 77.2090))
        ceremony = payload.get("ceremony", "Marriage")
        rules = CEREMONY_RULES.get(ceremony, CEREMONY_RULES["Marriage"])
        
        user_profile = payload.get("user_profile", {})
        natal_moon_lon = user_profile.get("moon_lon")
        natal_moon_rashi = int(natal_moon_lon // 30.0) if natal_moon_lon is not None else None
        natal_nak_index = int(natal_moon_lon // 13.333333) % 27 if natal_moon_lon is not None else None

        TITHI_DEG = 12.0
        NAK_DEG = 13.333333333333334
        
        base_jd_ut = datetime_to_julian(start_date.replace(hour=12) - datetime.timedelta(hours=tz))
        
        valid_days = []
        
        # Phase A: Day Level Filtration
        for i in range(days_to_check):
            jd_ut = base_jd_ut + i
            current_day = start_date + datetime.timedelta(days=i)
            
            pos = get_sun_moon_sidereal(jd_ut)
            sun_lon, moon_lon = pos["Sun"], pos["Moon"]
            
            elong = (moon_lon - sun_lon) % 360.0
            tithi_index = int(elong // TITHI_DEG)
            tithi_val = (tithi_index % 15) + 1
            
            nak_index = int(moon_lon // NAK_DEG) % 27
            nak_name = NAKS[nak_index]
            weekday = current_day.weekday()
            
            # Base Rules
            if nak_name not in rules["nakshatras"] or tithi_val not in rules["tithis"] or weekday not in rules["days"]:
                continue
                
            # Tara Bala
            if natal_nak_index is not None:
                tara_diff = (nak_index - natal_nak_index) % 27
                # Group into 9 Taras (0=Janma, 1=Sampat, 2=Vipat, 3=Kshema, 4=Pratyak, 5=Sadhaka, 6=Vadha, 7=Mitra, 8=Ati Mitra)
                tara_idx = tara_diff % 9
                if tara_idx in [2, 4, 6]: # Vipat, Pratyak, Vadha are inauspicious
                    continue
            
            # Chandra Bala
            if natal_moon_rashi is not None:
                moon_rashi = int(moon_lon // 30.0)
                house_from_rashi = (moon_rashi - natal_moon_rashi + 12) % 12 + 1
                if house_from_rashi in [4, 8, 12]:
                    continue
                    
            valid_days.append(current_day)
            
        # Phase B & C: Time Level Filtration & Scoring
        muhurtas = []
        
        for v_day in valid_days:
            # Get Sunrise and Sunset
            rise_time, set_time = calculate_noaa_sunrise_sunset(v_day.date(), lat, lon, tz)
            if not rise_time or not set_time:
                continue
                
            # Get Rahu Kaal
            periods = calculate_muhurta_periods(rise_time, set_time)
            rahu_start_str = periods["rahu_kaal"]["start"]
            rahu_end_str = periods["rahu_kaal"]["end"]
            
            # Convert Rahu Kaal strings back to datetime for comparison
            rahu_start = datetime.datetime.strptime(f"{v_day.strftime('%Y-%m-%d')} {rahu_start_str}", "%Y-%m-%d %I:%M %p")
            rahu_end = datetime.datetime.strptime(f"{v_day.strftime('%Y-%m-%d')} {rahu_end_str}", "%Y-%m-%d %I:%M %p")
            
            # Scan from sunrise to sunset in 30 minute intervals
            current_time = rise_time
            while current_time < set_time:
                end_time = current_time + datetime.timedelta(minutes=30)
                mid_time = current_time + datetime.timedelta(minutes=15)
                
                # Check Rahu Kaal overlap
                if (current_time < rahu_end and end_time > rahu_start):
                    current_time += datetime.timedelta(minutes=30)
                    continue
                
                # Get Ascendant at mid_time
                asc_data = get_ascendant_from_datetime(mid_time, lat, lon, tz)
                asc_sign_index = asc_data["ascendant_sign_index"]
                
                # Compute all planets to check 8th house
                mid_utc = mid_time - datetime.timedelta(hours=tz)
                mid_jd = datetime_to_julian(mid_utc)
                planets = get_all_planetary_positions(mid_jd)
                
                eighth_house_sign = (asc_sign_index + 7) % 12
                eighth_house_empty = True
                
                for p_name, p_data in planets.items():
                    if p_name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
                        p_sign = int(p_data["sidereal"]["lon"] // 30.0)
                        if p_sign == eighth_house_sign:
                            eighth_house_empty = False
                            break
                            
                if eighth_house_empty:
                    # Calculate exact Tithi and Nakshatra at this time
                    moon_lon_mid = planets["Moon"]["sidereal"]["lon"]
                    sun_lon_mid = planets["Sun"]["sidereal"]["lon"]
                    elong_mid = (moon_lon_mid - sun_lon_mid) % 360.0
                    tithi_index_mid = int(elong_mid // 12.0)
                    tithi_val_mid = (tithi_index_mid % 15) + 1
                    paksha_mid = "Shukla" if tithi_index_mid < 15 else "Krishna"
                    tithi_name_exact = f"{paksha_mid} {tithi_val_mid}"
                    nak_name_exact = planets["Moon"]["nakshatra"]["name"]

                    score = 80
                    
                    # Merge consecutive intervals
                    if muhurtas and muhurtas[-1]["end_time"] == current_time.isoformat() and muhurtas[-1]["score"] == score:
                        muhurtas[-1]["end_time"] = end_time.isoformat()
                        current_reason = f"Empty 8th House from {asc_data['ascendant_sign']} Lagna"
                        if current_reason not in muhurtas[-1]["reasons"]:
                            muhurtas[-1]["reasons"][0] = "Empty 8th House from Auspicious Lagnas"
                    else:
                        muhurtas.append({
                            "start_time": current_time.isoformat(),
                            "end_time": end_time.isoformat(),
                            "score": score,
                            "nakshatra": nak_name_exact,
                            "tithi": tithi_name_exact,
                            "reasons": [f"Empty 8th House from {asc_data['ascendant_sign']} Lagna", "Excellent Tara/Chandra Bala"]
                        })
                    
                current_time += datetime.timedelta(minutes=30)
                
        # Sort by score descending and take top 3
        muhurtas.sort(key=lambda x: x["score"], reverse=True)
        top_muhurtas = muhurtas[:3]
        
        return {"top_muhurtas": top_muhurtas}
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# Hour calculations
def calculate_horas_for_day(sunrise_dt, sunset_dt, next_sunrise_dt, weekday):
    HORA_ORDER = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"]
    WEEKDAY_TO_HORA_IDX = {
        6: 0, # Sunday -> Sun
        0: 3, # Monday -> Moon
        1: 6, # Tuesday -> Mars
        2: 2, # Wednesday -> Mercury
        3: 5, # Thursday -> Jupiter
        4: 1, # Friday -> Venus
        5: 4  # Saturday -> Saturn
    }
    first_hora_idx = WEEKDAY_TO_HORA_IDX[weekday]
    
    day_duration = (sunset_dt - sunrise_dt).total_seconds()
    night_duration = (next_sunrise_dt - sunset_dt).total_seconds()
    
    day_hora_secs = day_duration / 12.0
    night_hora_secs = night_duration / 12.0
    
    day_horas = []
    current_time = sunrise_dt
    for i in range(12):
        lord = HORA_ORDER[(first_hora_idx + i) % 7]
        end_time = current_time + datetime.timedelta(seconds=day_hora_secs)
        day_horas.append({
            "index": i + 1,
            "lord": lord,
            "start": current_time.strftime("%I:%M %p"),
            "end": end_time.strftime("%I:%M %p")
        })
        current_time = end_time
        
    night_horas = []
    current_time = sunset_dt
    for i in range(12):
        lord = HORA_ORDER[(first_hora_idx + 12 + i) % 7]
        end_time = current_time + datetime.timedelta(seconds=night_hora_secs)
        night_horas.append({
            "index": i + 1,
            "lord": lord,
            "start": current_time.strftime("%I:%M %p"),
            "end": end_time.strftime("%I:%M %p")
        })
        current_time = end_time
        
    return {
        "day": day_horas,
        "night": night_horas
    }

@router.post("/heatmap")
async def calculate_muhurt_heatmap(payload: Dict = Body(...)):
    try:
        from panchang.choghadiya import calculate_choghadiya
        set_ayanamsa()
        
        start_date_str = payload.get("start_date") or datetime.datetime.now().strftime("%Y-%m-%d")
        days_to_check = int(payload.get("days", 30))
        
        start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%d")
        tz = float(payload.get("tz", 5.5))
        lat = float(payload.get("lat", 28.6139))
        lon = float(payload.get("lon", 77.2090))
        ceremony = payload.get("ceremony", "Marriage")
        rules = CEREMONY_RULES.get(ceremony, CEREMONY_RULES["Marriage"])
        
        user_profile = payload.get("user_profile", {})
        natal_moon_lon = user_profile.get("moon_lon")
        natal_moon_rashi = int(natal_moon_lon // 30.0) if natal_moon_lon is not None else None
        natal_nak_index = int(natal_moon_lon // 13.333333) % 27 if natal_moon_lon is not None else None

        TITHI_DEG = 12.0
        NAK_DEG = 13.333333333333334
        
        base_jd_ut = datetime_to_julian(start_date.replace(hour=12) - datetime.timedelta(hours=tz))
        results = []
        
        for i in range(days_to_check):
            jd_ut = base_jd_ut + i
            current_day = start_date + datetime.timedelta(days=i)
            
            pos = get_sun_moon_sidereal(jd_ut)
            sun_lon, moon_lon = pos["Sun"], pos["Moon"]
            
            elong = (moon_lon - sun_lon) % 360.0
            tithi_index = int(elong // TITHI_DEG)
            tithi_val = (tithi_index % 15) + 1
            paksha = "Shukla" if tithi_index < 15 else "Krishna"
            tithi_name = f"{paksha} {tithi_val}"
            
            nak_index = int(moon_lon // NAK_DEG) % 27
            nak_name = NAKS[nak_index]
            weekday = current_day.weekday()
            
            base_match = (
                nak_name in rules["nakshatras"] and
                tithi_val in rules["tithis"] and
                weekday in rules["days"]
            )
            
            score = 40
            reasons = []
            
            if base_match:
                score += 30
                reasons.append("Tithi, Nakshatra, and Day match ceremony guidelines")
            else:
                reasons.append("Base Panchang criteria mismatch for ceremony")
                
            if natal_nak_index is not None:
                tara_diff = (nak_index - natal_nak_index) % 27
                tara_idx = tara_diff % 9
                tara_names = ["Janma", "Sampat", "Vipat", "Kshema", "Pratyak", "Sadhaka", "Vadha", "Mitra", "Ati Mitra"]
                tara_name = tara_names[tara_idx]
                if tara_idx in [2, 4, 6]:
                    score -= 20
                    reasons.append(f"Inauspicious Tara Bala: {tara_name} Tara")
                else:
                    score += 15
                    reasons.append(f"Auspicious Tara Bala: {tara_name} Tara")
            
            if natal_moon_rashi is not None:
                moon_rashi = int(moon_lon // 30.0)
                house_from_rashi = (moon_rashi - natal_moon_rashi + 12) % 12 + 1
                if house_from_rashi in [4, 8, 12]:
                    score -= 20
                    reasons.append(f"Inauspicious Moon House ({house_from_rashi}) from Janma Rashi")
                else:
                    score += 15
                    reasons.append(f"Auspicious Chandra Bala (Moon in house {house_from_rashi})")
            
            # Combustion checks
            jup_diff = abs(pos.get("Jupiter", 180.0) - sun_lon)
            if jup_diff > 180: jup_diff = 360 - jup_diff
            ven_diff = abs(pos.get("Venus", 180.0) - sun_lon)
            if ven_diff > 180: ven_diff = 360 - ven_diff
            
            if jup_diff < 11.0:
                score -= 15
                reasons.append("Jupiter Combustion (Guru Asta)")
            if ven_diff < 10.0:
                score -= 15
                reasons.append("Venus Combustion (Shukra Asta)")
                
            if (240.0 <= sun_lon <= 270.0) or (330.0 <= sun_lon <= 360.0):
                score -= 15
                reasons.append("Kharmas Period (Sun in Sagittarius/Pisces)")
                
            if (90.0 <= sun_lon <= 210.0) and ceremony in ["Marriage", "Vadhu Pravesh", "Grih Pravesh", "Mundan"]:
                score -= 10
                reasons.append("Chaturmas Period")
                
            score = max(10, min(100, score))
            
            if score >= 80:
                status = "Highly Auspicious"
            elif score >= 60:
                status = "Auspicious"
            elif score >= 40:
                status = "Neutral"
            else:
                status = "Inauspicious"
                
            rise_time, set_time = calculate_noaa_sunrise_sunset(current_day.date(), lat, lon, tz)
            if not rise_time or not set_time:
                rise_time = datetime.datetime.combine(current_day.date(), datetime.time(6, 0))
                set_time = datetime.datetime.combine(current_day.date(), datetime.time(18, 0))
                
            next_day = current_day + datetime.timedelta(days=1)
            next_rise_time, _ = calculate_noaa_sunrise_sunset(next_day.date(), lat, lon, tz)
            if not next_rise_time:
                next_rise_time = datetime.datetime.combine(next_day.date(), datetime.time(6, 0))
                
            choghadiya = calculate_choghadiya(rise_time, set_time, next_rise_time)
            horas = calculate_horas_for_day(rise_time, set_time, next_rise_time, weekday)
            
            results.append({
                "date": current_day.strftime("%Y-%m-%d"),
                "weekday": current_day.strftime("%A"),
                "tithi": tithi_name,
                "nakshatra": nak_name,
                "score": score,
                "status": status,
                "reasons": reasons,
                "choghadiya": choghadiya,
                "horas": horas
            })
            
        return {"ceremony": ceremony, "heatmap": results}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/garbhadhana")
async def calculate_garbhadhana(payload: Dict = Body(...)):
    """
    Calculates Garbhadhana Muhurta based on Ritu Kaal (menstruation start) 
    and Dual Tara Bala (Boy and Girl Nakshatras).
    """
    try:
        set_ayanamsa()
        
        cycle_start_str = payload.get("cycle_start_date")
        if not cycle_start_str:
            raise HTTPException(status_code=400, detail="cycle_start_date is required for Garbhadhana calculation.")
            
        cycle_start = datetime.datetime.strptime(cycle_start_str, "%Y-%m-%d")
        
        boy_nak_name = payload.get("boy_nakshatra")
        girl_nak_name = payload.get("girl_nakshatra")
        
        if not boy_nak_name or not girl_nak_name:
            raise HTTPException(status_code=400, detail="boy_nakshatra and girl_nakshatra are required.")
            
        try:
            boy_nak_idx = NAKS.index(boy_nak_name)
            girl_nak_idx = NAKS.index(girl_nak_name)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid Nakshatra name provided.")

        tz = float(payload.get("tz", 5.5))
        lat = float(payload.get("lat", 28.6))
        lon = float(payload.get("lon", 77.2))
        
        rules = CEREMONY_RULES["Garbhadhana"]
        TITHI_DEG = 12.0
        NAK_DEG = 13.333333333333334
        
        results = []
        
        # Check the 16 nights after the start of the cycle
        for day_offset in range(1, 17):
            current_date = cycle_start + datetime.timedelta(days=(day_offset - 1))
            jd_ut = datetime_to_julian(current_date.replace(hour=20) - datetime.timedelta(hours=tz)) # Target evening time (8 PM)
            
            # 1. Ritu Kaal Filtering: Avoid days 1-4, 11, 13
            if day_offset in [1, 2, 3, 4, 11, 13]:
                continue
                
            pos = get_all_planetary_positions(jd_ut)
            moon_lon = pos["Moon"]["sidereal"]["lon"]
            sun_lon = pos["Sun"]["sidereal"]["lon"]
            
            elong = moon_lon - sun_lon
            if elong < 0: elong += 360.0
            
            tithi_index = int(elong // TITHI_DEG)
            tithi_val = (tithi_index % 15) + 1
            
            nak_index = int(moon_lon // NAK_DEG) % 27
            nak_name = NAKS[nak_index]
            weekday = current_date.weekday()
            
            # 2. General Astrological Filters
            if nak_name not in rules["nakshatras"] or tithi_val not in rules["tithis"] or weekday not in rules["days"]:
                continue
                
            # 3. Dual Tara Bala
            boy_tara_diff = (nak_index - boy_nak_idx) % 27
            boy_tara_idx = boy_tara_diff % 9
            girl_tara_diff = (nak_index - girl_nak_idx) % 27
            girl_tara_idx = girl_tara_diff % 9
            
            # If either partner has an inauspicious Tara (Vipat, Pratyak, Vadha), reject the day
            if boy_tara_idx in [2, 4, 6] or girl_tara_idx in [2, 4, 6]:
                continue
                
            # It's an auspicious day!
            gender_prediction = "Male Child (Even Night)" if day_offset % 2 == 0 else "Female Child (Odd Night)"
            
            results.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "cycle_day": day_offset,
                "gender_prediction": gender_prediction,
                "nakshatra": nak_name,
                "tithi": tithi_val,
                "boy_tara": boy_tara_idx,
                "girl_tara": girl_tara_idx
            })
            
        return {"results": results, "cycle_start": cycle_start_str}
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
