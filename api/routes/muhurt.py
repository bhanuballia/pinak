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
    }
}

from panchang.tithi_yoga_karana import TITHI_NAMES, NAKS
from astronomy.positions import get_sun_moon_sidereal
from astronomy.sidereal import set_ayanamsa

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
