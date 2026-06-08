from fastapi import APIRouter
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
def get_live_nakshatra():
    """Returns the live, real-time Nakshatra position of all planets."""
    try:
        # Use utcnow since Julian calculations expect UTC
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
