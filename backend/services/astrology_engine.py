import datetime
import swisseph as swe
from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder
import pytz

# Constants for swisseph planets
PLANETS = {
    swe.SUN: "Sun",
    swe.MOON: "Moon",
    swe.MARS: "Mars",
    swe.MERCURY: "Mercury",
    swe.JUPITER: "Jupiter",
    swe.VENUS: "Venus",
    swe.SATURN: "Saturn",
    swe.MEAN_NODE: "Rahu", # We use Mean Node for Rahu
}

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

def get_zodiac_sign(longitude):
    """Convert a 360-degree longitude to a zodiac sign."""
    sign_index = int(longitude / 30)
    return ZODIAC_SIGNS[sign_index]

def calculate_birth_chart(dob_str: str, tob_str: str, city: str):
    """
    Calculates the Vedic birth chart (Ascendant and core planets)
    using Lahiri Ayanamsa.
    
    dob_str: "YYYY-MM-DD"
    tob_str: "HH:MM" (24-hour format)
    city: "City, Country"
    """
    try:
        # 1. Geocoding
        geolocator = Nominatim(user_agent="vedic_astrology_app")
        location = geolocator.geocode(city)
        if not location:
            return {"error": f"Could not find coordinates for {city}"}
        
        lat = location.latitude
        lon = location.longitude
        
        # 2. Timezone
        tf = TimezoneFinder()
        tz_str = tf.timezone_at(lng=lon, lat=lat)
        if not tz_str:
            return {"error": f"Could not determine timezone for {city}"}
            
        tz = pytz.timezone(tz_str)
        
        # 3. Parse Date & Time
        year, month, day = map(int, dob_str.split("-"))
        hour, minute = map(int, tob_str.split(":"))
        
        local_time = tz.localize(datetime.datetime(year, month, day, hour, minute))
        utc_time = local_time.astimezone(pytz.utc)
        
        # 4. Swisseph Setup
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        
        # Julian Day in UTC
        jd = swe.julday(utc_time.year, utc_time.month, utc_time.day, 
                        utc_time.hour + utc_time.minute/60.0 + utc_time.second/3600.0)
        
        # 5. Calculate Ascendant (Lagna)
        # 0 corresponds to Placidus system, but Ascendant is the same across most systems
        houses, ascmc = swe.houses_ex(jd, lat, lon, b'P', flags=swe.FLG_SIDEREAL)
        ascendant_longitude = ascmc[0] # Ascendant is the 1st element
        ascendant_sign = get_zodiac_sign(ascendant_longitude)
        
        # 6. Calculate Planetary Positions
        placements = {}
        for p_id, p_name in PLANETS.items():
            # Calculate planet position
            pos, ret = swe.calc_ut(jd, p_id, swe.FLG_SIDEREAL)
            p_long = pos[0] # Longitude
            placements[p_name] = get_zodiac_sign(p_long)
            
        return {
            "ascendant": ascendant_sign,
            "planets": placements,
            "details": {
                "lat": lat,
                "lon": lon,
                "utc_time": str(utc_time)
            }
        }
        
    except Exception as e:
        print(f"Error calculating birth chart: {e}")
        return {"error": str(e)}

# For quick testing
if __name__ == "__main__":
    print(calculate_birth_chart("1995-10-15", "14:30", "New Delhi, India"))
