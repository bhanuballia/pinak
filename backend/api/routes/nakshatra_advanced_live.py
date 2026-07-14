from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
import datetime
from charts.rashi_chart import build_rashi_chart
from panchang.nakshatra import compute_nakshatra_from_lon
from astronomy.julian import datetime_to_julian
from core.utils import ZODIAC_SIGNS, get_sign_index
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# --- NAKSHATRA MUHURAT CATEGORIZATIONS ---
NAKSHATRA_NATURES = {
    # Fixed / Sthira (Favorable for permanent things: Marriage, Griha Pravesh, Foundation, Planting)
    "Rohini": "Fixed/Sthira", "Uttara Phalguni": "Fixed/Sthira", "Uttara Ashadha": "Fixed/Sthira", "Uttara Bhadrapada": "Fixed/Sthira",
    # Movable / Chara (Favorable for vehicles, travel, starting new ventures, quick actions)
    "Punarvasu": "Movable/Chara", "Swati": "Movable/Chara", "Shravana": "Movable/Chara", "Dhanishta": "Movable/Chara", "Shatabhisha": "Movable/Chara",
    # Fierce / Ugra (Favorable for surgery, destruction, cutting, fire, aggressive actions)
    "Bharani": "Fierce/Ugra", "Magha": "Fierce/Ugra", "Purva Phalguni": "Fierce/Ugra", "Purva Ashadha": "Fierce/Ugra", "Purva Bhadrapada": "Fierce/Ugra",
    # Mixed / Misra (Favorable for Yajna/Pooja, Agnihotra, daily chores)
    "Krittika": "Mixed/Misra", "Vishakha": "Mixed/Misra",
    # Light / Kshipra (Favorable for Vehicles, Medicine, Namkaran, Business, Travel)
    "Ashwini": "Light/Kshipra", "Pushya": "Light/Kshipra", "Hasta": "Light/Kshipra",
    # Tender / Mridu (Favorable for Marriage, Namkaran, Fine Arts, Romance, Upnayan)
    "Mrigashira": "Tender/Mridu", "Chitra": "Tender/Mridu", "Anuradha": "Tender/Mridu", "Revati": "Tender/Mridu",
    # Sharp / Tikshna (Favorable for surgery, tantra, black magic, punishing enemies)
    "Ardra": "Sharp/Tikshna", "Ashlesha": "Sharp/Tikshna", "Jyeshtha": "Sharp/Tikshna", "Mula": "Sharp/Tikshna"
}

NATURE_ACTIVITIES = {
    "Fixed/Sthira": {"good": ["Marriage", "Grih Parvesh (House Warming)", "Laying Foundations", "Buying Land", "Planting Trees", "Starting long-term projects"], "bad": ["Travel", "Quick transactions"]},
    "Movable/Chara": {"good": ["Vehicle Purchase", "Travel", "Starting new business", "Quick actions", "Gardening"], "bad": ["Marriage", "Laying Foundations"]},
    "Fierce/Ugra": {"good": ["Surgery", "Demolition", "Lighting Fires", "Aggressive actions", "Weapon training"], "bad": ["Marriage", "Namkaran", "Grih Parvesh", "Travel"]},
    "Mixed/Misra": {"good": ["Yajna", "Pooja", "Agnihotra", "Daily routine tasks", "Buying furniture"], "bad": ["New Business", "Marriage", "Travel"]},
    "Light/Kshipra": {"good": ["Vehicle Purchase", "Medicine/Healing", "Namkaran", "Travel", "Business transactions", "Sports"], "bad": ["Long-term permanent projects"]},
    "Tender/Mridu": {"good": ["Marriage", "Namkaran", "Upnayan (Thread Ceremony)", "Fine Arts", "Romance", "New Clothes"], "bad": ["Surgery", "Aggressive actions"]},
    "Sharp/Tikshna": {"good": ["Surgery", "Tantra", "Divorce", "Punishing enemies", "Tearing down structures"], "bad": ["Marriage", "Namkaran", "Travel", "Vehicle Purchase"]}
}

@router.get("/live")
def get_live_nakshatra(target_datetime: Optional[str] = Query(None, description="ISO formatted datetime string (e.g. 2025-12-01T10:00:00Z)")):
    """Returns the live or historical Nakshatra position of all planets."""
    try:
        # Use provided time if any, else utcnow since Julian calculations expect UTC
        if target_datetime:
            try:
                # Parse ISO format, strip Z if present for fromisoformat
                cleaned_dt = target_datetime.replace('Z', '+00:00')
                now = datetime.datetime.fromisoformat(cleaned_dt)
                # Convert to naive UTC for julian calculation compatibility
                now = now.replace(tzinfo=None)
            except ValueError:
                now = datetime.datetime.utcnow()
        else:
            now = datetime.datetime.utcnow()
            
        jd_ut = datetime_to_julian(now)
        
        # We can just build a chart for Delhi to get planetary positions (house placement depends on location, but planetary longitudes are mostly universal at a given time)
        # We only care about longitudes here.
        chart = build_rashi_chart(jd_ut, lat=28.6139, lon=77.2090)
        
        results = []
        planet_positions = chart.get("planet_positions", {})
        
        # Include Lagna/Ascendant
        asc_lon = chart["ascendant_deg"]
        asc_nak = compute_nakshatra_from_lon(asc_lon)
        results.append({
            "planet": "Ascendant (Lagna)",
            "sign": ZODIAC_SIGNS[get_sign_index(asc_lon)],
            "degree": round(asc_lon, 2),
            "nakshatra": asc_nak["nakshatra_name"],
            "pada": asc_nak["pada"],
            "speed": 0.0,
            "ra": 0.0,
            "dec": 0.0
        })

        import swisseph as swe
        from astronomy.positions import get_sidereal_position, get_equatorial_position

        for planet, data in planet_positions.items():
            lon = data["sidereal"]["lon"]
            speed = data["sidereal"].get("speed_lon", 0.0)
            ra = data["equatorial"].get("ra", 0.0)
            dec = data["equatorial"].get("dec", 0.0)
            
            sign_name = ZODIAC_SIGNS[get_sign_index(lon)]
            nak = compute_nakshatra_from_lon(lon)
            
            p_name = planet.capitalize()
            if p_name == "Rahu":
                p_name = "Spashth Rahu (True Node)"
            elif p_name == "Ketu":
                p_name = "Spashth Ketu (True Node)"
            
            results.append({
                "planet": p_name,
                "sign": sign_name,
                "degree": round(lon, 2),
                "nakshatra": nak["nakshatra_name"],
                "pada": nak["pada"],
                "speed": round(speed, 4),
                "ra": round(ra, 2),
                "dec": round(dec, 2)
            })
            
        # Add outer planets
        outer_planets = [
            ("Arun (Uranus)", swe.URANUS),
            ("Varun (Neptune)", swe.NEPTUNE),
            ("Yam (Pluto)", swe.PLUTO)
        ]
        
        for name, planet_id in outer_planets:
            pos = get_sidereal_position(jd_ut, planet_id)
            equ_pos = get_equatorial_position(jd_ut, planet_id)
            
            lon = pos["lon"]
            speed = pos.get("speed_lon", 0.0)
            ra = equ_pos.get("ra", 0.0)
            dec = equ_pos.get("dec", 0.0)
            
            sign_name = ZODIAC_SIGNS[get_sign_index(lon)]
            nak = compute_nakshatra_from_lon(lon)
            
            results.append({
                "planet": name,
                "sign": sign_name,
                "degree": round(lon, 2),
                "nakshatra": nak["nakshatra_name"],
                "pada": nak["pada"],
                "speed": round(speed, 4),
                "ra": round(ra, 2),
                "dec": round(dec, 2)
            })
            
        # Calculate Muhurat Info based on the Moon's Nakshatra
        moon_data = next((item for item in results if item["planet"] == "Moon"), None)
        muhurat_info = {}
        
        if moon_data:
            moon_nak = moon_data["nakshatra"]
            # Look up the nature
            # Handle potential edge cases where Abhijit might be present or naming differences
            nature = NAKSHATRA_NATURES.get(moon_nak)
            
            if not nature and "Phalguni" in moon_nak:
                # Fallback for exact string matching issues
                if "Purva" in moon_nak: nature = "Fierce/Ugra"
                elif "Uttara" in moon_nak: nature = "Fixed/Sthira"
            if not nature and "Ashadha" in moon_nak:
                if "Purva" in moon_nak: nature = "Fierce/Ugra"
                elif "Uttara" in moon_nak: nature = "Fixed/Sthira"
            if not nature and "Bhadrapada" in moon_nak:
                if "Purva" in moon_nak: nature = "Fierce/Ugra"
                elif "Uttara" in moon_nak: nature = "Fixed/Sthira"
                
            if nature:
                activities = NATURE_ACTIVITIES.get(nature, {"good": [], "bad": []})
                muhurat_info = {
                    "current_moon_nakshatra": moon_nak,
                    "nature": nature,
                    "favorable_activities": activities["good"],
                    "unfavorable_activities": activities["bad"]
                }
            
        return {
            "timestamp": now.strftime("%Y-%m-%d %H:%M:%S"),
            "data": results,
            "muhurat": muhurat_info
        }

    except Exception as e:
        logger.error(f"Error computing live nakshatras: {e}")
        return {"error": str(e)}

class PersonalizedOracleRequest(BaseModel):
    date: str
    time: str
    lat: float
    lon: float
    tz_offset: float
    question: str
    category: str = "General"
    target_datetime: Optional[str] = None
    days: int = 7

NAKSHATRAS_LIST = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", 
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", 
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

TARA_MEANINGS = {
    1: {"name": "Janma", "meaning": "Danger to body, mental stress, unfavorable for new beginnings.", "quality": "Inauspicious"},
    2: {"name": "Sampat", "meaning": "Wealth, prosperity, highly favorable for financial matters.", "quality": "Extremely Auspicious"},
    3: {"name": "Vipat", "meaning": "Losses, accidents, obstacles. Avoid important tasks.", "quality": "Inauspicious"},
    4: {"name": "Kshema", "meaning": "Well-being, safety, prosperity, success in endeavors.", "quality": "Auspicious"},
    5: {"name": "Pratyak", "meaning": "Obstacles, hurdles, delays in work. Proceed with caution.", "quality": "Neutral"},
    6: {"name": "Sadhaka", "meaning": "Achievement of goals, success, very favorable for ambitions.", "quality": "Extremely Auspicious"},
    7: {"name": "Naidhana", "meaning": "Extreme danger, severe failures. Strictly avoid important work.", "quality": "Inauspicious"},
    8: {"name": "Mitra", "meaning": "Friendship, help from others, favorable for social interactions.", "quality": "Auspicious"},
    0: {"name": "Ati-Mitra", "meaning": "Great friendship, ultimate success, highly favorable.", "quality": "Extremely Auspicious"} # 9 % 9 == 0
}

@router.post("/personalized_oracle")
def get_personalized_oracle(req: PersonalizedOracleRequest):
    """
    Calculates the Tara Bala (Star Strength) based on user's birth data
    and live transit data to answer a personalized question.
    """
    try:
        # 1. Calculate Natal Moon Nakshatra
        import datetime as _dt
        y, m, d = [int(x) for x in req.date.split("-")]
        tp = [int(x) for x in req.time.split(":")]
        dt_local = _dt.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
        dt_utc = dt_local - _dt.timedelta(hours=req.tz_offset)
        birth_jd_ut = datetime_to_julian(dt_utc)
        
        birth_chart = build_rashi_chart(birth_jd_ut, lat=req.lat, lon=req.lon)
        natal_moon_lon = birth_chart["planet_positions"]["Moon"]["sidereal"]["lon"]
        natal_nak_info = compute_nakshatra_from_lon(natal_moon_lon)
        natal_nak_name = natal_nak_info["nakshatra_name"]
        
        # Determine index (1-27)
        # Handle spelling variations like "Purva Phalguni" vs "Purva Phalguni"
        def get_nak_index(name):
            for i, n in enumerate(NAKSHATRAS_LIST):
                if n.lower() in name.lower() or name.lower() in n.lower():
                    return i + 1
            return 1 # Fallback

        natal_idx = get_nak_index(natal_nak_name)

        # 2. Calculate Live (or Target) Moon Nakshatra
        import datetime
        if req.target_datetime:
            try:
                cleaned_dt = req.target_datetime.replace('Z', '+00:00')
                now = datetime.datetime.fromisoformat(cleaned_dt)
                now = now.replace(tzinfo=None)
            except ValueError:
                now = datetime.datetime.utcnow()
        else:
            now = datetime.datetime.utcnow()
            
        live_jd_ut = datetime_to_julian(now)
        live_chart = build_rashi_chart(live_jd_ut, lat=req.lat, lon=req.lon)
        live_moon_lon = live_chart["planet_positions"]["Moon"]["sidereal"]["lon"]
        live_moon_speed = live_chart["planet_positions"]["Moon"]["sidereal"].get("speed_lon", 13.176)
        live_nak_info = compute_nakshatra_from_lon(live_moon_lon)
        live_nak_name = live_nak_info["nakshatra_name"]
        
        live_idx = get_nak_index(live_nak_name)
        
        # Calculate approximate end time of the current Nakshatra
        NAKSHATRA_SIZE_DEG = 360.0 / 27.0
        end_deg = (int(live_moon_lon // NAKSHATRA_SIZE_DEG) + 1) * NAKSHATRA_SIZE_DEG
        degrees_left = end_deg - live_moon_lon
        days_left = degrees_left / live_moon_speed if live_moon_speed > 0 else 0
        end_time_utc = now + datetime.timedelta(days=days_left)
        end_time_local = end_time_utc + datetime.timedelta(hours=req.tz_offset)
        end_time_str = end_time_local.strftime("%I:%M %p on %b %d")

        # 3. Calculate Tara Bala
        # Formula: (Live Index - Natal Index + 1) % 9
        # Wait, the classical formula is counting from Natal to Live inclusive.
        # So if Natal is Ashwini(1) and Live is Bharani(2), distance is 2. (2 - 1 + 1) = 2 (Sampat)
        tara_index = (live_idx - natal_idx + 1) % 9
        # If the index is negative because live_idx < natal_idx, we add 27 before modulo
        if live_idx < natal_idx:
            tara_index = ((live_idx + 27) - natal_idx + 1) % 9

        tara_info = TARA_MEANINGS.get(tara_index, TARA_MEANINGS[0])

        # 4. Construct Response
        response_text = f"Astrological Analysis for: '{req.question}'\n\n"
        response_text += f"Your Birth Star (Janma Nakshatra) is {natal_nak_name}. "
        response_text += f"The current transiting Moon is in {live_nak_name} (active until {end_time_str}).\n"
        response_text += f"This forms a **{tara_info['name']} Tara** relationship for you today.\n\n"
        
        # Contextual advice based on Tara
        q_lower = req.question.lower()
        if tara_info["quality"] == "Extremely Auspicious" or tara_info["quality"] == "Auspicious":
            response_text += f"✨ **Highly Favorable!** The stars are aligned in your favor. {tara_info['meaning']} "
            if any(k in q_lower for k in ["property", "house", "land", "real estate", "griha", "home"]):
                response_text += "This is an excellent time for property investments, registrations, and real estate matters."
            elif any(k in q_lower for k in ["job", "interview", "career", "profession", "promotion", "employment", "workplace"]):
                response_text += "It is a fantastic time for career advancements, interviews, or professional meetings."
            elif any(k in q_lower for k in ["love", "marriage", "relationship", "propose", "engagement", "dating"]):
                response_text += "Relationships and romantic pursuits will bring joy and harmony today."
            elif any(k in q_lower for k in ["money", "invest", "business", "finance", "wealth"]):
                response_text += "Financial transactions and business deals are highly supported."
            elif any(k in q_lower for k in ["travel", "journey", "trip", "flight", "relocate", "moving"]):
                response_text += "Travel undertaken today will be safe, pleasant, and successful."
            elif any(k in q_lower for k in ["health", "surgery", "medical", "treatment", "healing", "therapy", "doctor"]):
                response_text += "The cosmic energy strongly supports healing, treatments, and swift recoveries."
            else:
                response_text += "Whatever you initiate today has a high probability of success."
                
        elif tara_info["quality"] == "Inauspicious":
            response_text += f"⚠️ **Exercise Caution.** The current planetary energy is challenging. {tara_info['meaning']} "
            if any(k in q_lower for k in ["property", "house", "land", "real estate", "griha", "home"]):
                response_text += "Postpone property purchases, registrations, and moving into a new house."
            elif any(k in q_lower for k in ["job", "interview", "career", "profession", "promotion", "employment", "workplace"]):
                response_text += "Expect delays or tough questions. Postpone important career moves if possible."
            elif any(k in q_lower for k in ["love", "marriage", "relationship", "propose", "engagement", "dating"]):
                response_text += "Misunderstandings are likely. Avoid arguments and major relationship decisions."
            elif any(k in q_lower for k in ["money", "invest", "business", "finance", "wealth"]):
                response_text += "Avoid financial risks or signing new contracts today."
            elif any(k in q_lower for k in ["travel", "journey", "trip", "flight", "relocate", "moving"]):
                response_text += "Travel is not advised today as obstacles or accidents could occur."
            elif any(k in q_lower for k in ["health", "surgery", "medical", "treatment", "healing", "therapy", "doctor"]):
                response_text += "Exercise extra caution regarding health. Avoid elective surgeries if possible."
            else:
                response_text += "It is best to maintain a low profile and avoid initiating major new activities."
        else:
            response_text += f"⚖️ **Neutral Energy.** The cosmic weather is mixed. {tara_info['meaning']} "
            response_text += "Success depends on your own hard work rather than cosmic support today. Proceed carefully and be prepared for minor delays."

        return {
            "natal_nakshatra": natal_nak_name,
            "live_nakshatra": live_nak_name,
            "tara_name": tara_info["name"],
            "tara_quality": tara_info["quality"],
            "response": response_text,
            "quality": tara_info["quality"]
        }

    except Exception as e:
        logger.error(f"Error computing personalized oracle: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/personalized_oracle_future")
def get_personalized_oracle_future(req: PersonalizedOracleRequest):
    """
    Calculates the Tara Bala (Star Strength) for the requested days based on user's birth data.
    """
    try:
        import datetime as _dt
        y, m, d = [int(x) for x in req.date.split("-")]
        tp = [int(x) for x in req.time.split(":")]
        dt_local = _dt.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
        dt_utc = dt_local - _dt.timedelta(hours=req.tz_offset)
        birth_jd_ut = datetime_to_julian(dt_utc)
        
        birth_chart = build_rashi_chart(birth_jd_ut, lat=req.lat, lon=req.lon)
        natal_moon_lon = birth_chart["planet_positions"]["Moon"]["sidereal"]["lon"]
        natal_nak_info = compute_nakshatra_from_lon(natal_moon_lon)
        natal_nak_name = natal_nak_info["nakshatra_name"]
        
        def get_nak_index(name):
            for i, n in enumerate(NAKSHATRAS_LIST):
                if n.lower() in name.lower() or name.lower() in n.lower():
                    return i + 1
            return 1

        natal_idx = get_nak_index(natal_nak_name)

        if req.target_datetime:
            try:
                cleaned_dt = req.target_datetime.replace('Z', '+00:00')
                now = _dt.datetime.fromisoformat(cleaned_dt)
                now = now.replace(tzinfo=None)
            except ValueError:
                now = _dt.datetime.utcnow()
        else:
            now = _dt.datetime.utcnow()
            
        future_data = []
        # Calculate for today + next (req.days) days
        for i in range(1, req.days + 1):
            target_day = now + _dt.timedelta(days=i)
            target_jd_ut = datetime_to_julian(target_day)
            target_chart = build_rashi_chart(target_jd_ut, lat=req.lat, lon=req.lon)
            target_moon_lon = target_chart["planet_positions"]["Moon"]["sidereal"]["lon"]
            target_moon_speed = target_chart["planet_positions"]["Moon"]["sidereal"].get("speed_lon", 13.176)
            target_nak_info = compute_nakshatra_from_lon(target_moon_lon)
            target_nak_name = target_nak_info["nakshatra_name"]
            
            target_idx = get_nak_index(target_nak_name)
            
            # Calculate end time
            NAKSHATRA_SIZE_DEG = 360.0 / 27.0
            end_deg = (int(target_moon_lon // NAKSHATRA_SIZE_DEG) + 1) * NAKSHATRA_SIZE_DEG
            degrees_left = end_deg - target_moon_lon
            days_left = degrees_left / target_moon_speed if target_moon_speed > 0 else 0
            end_time_utc = target_day + _dt.timedelta(days=days_left)
            end_time_local = end_time_utc + _dt.timedelta(hours=req.tz_offset)
            end_time_str = end_time_local.strftime("%I:%M %p")
            
            tara_index = (target_idx - natal_idx + 1) % 9
            if target_idx < natal_idx:
                tara_index = ((target_idx + 27) - natal_idx + 1) % 9

            tara_info = TARA_MEANINGS.get(tara_index, TARA_MEANINGS[0])
            
            future_data.append({
                "date": target_day.strftime("%b %d"),
                "nakshatra": target_nak_name,
                "end_time": end_time_str,
                "tara_name": tara_info["name"],
                "quality": tara_info["quality"]
            })

        return {
            "natal_nakshatra": natal_nak_name,
            "future_days": future_data
        }

    except Exception as e:
        logger.error(f"Error computing personalized oracle future: {e}")
        raise HTTPException(status_code=500, detail=str(e))

