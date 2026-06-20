import datetime
from astronomy.julian import julian_to_datetime
import swisseph as swe
from dasha_engine.vimshottari_balance import VimshottariBalanceCalculator
from core.utils import get_sign_name
from matchmaking.guna_milan.nakshatra_data import NAKSHATRA_ATTRIBUTES
from panchang.tithi_yoga_karana import compute_nakshatra
from solar_returns.solar_return_engine import SolarReturnEngine
from charts.rashi_chart import build_rashi_chart

SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"]

def format_dms(deg):
    d = int(deg)
    m = int((deg - d) * 60)
    s = int((((deg - d) * 60) - m) * 60)
    return f"{d:02d}:{m:02d}:{s:02d}"

def calculate_detailed_year_data(jd_birth_ut: float, natal_sun_longitude: float, target_age: int, lat: float, lon: float, tz_offset: float):
    engine = SolarReturnEngine()
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    
    # Get exact return JD
    jd_return = engine.calculate_exact_return(jd_birth_ut, natal_sun_longitude, target_age)
    dt_utc = julian_to_datetime(jd_return)
    dt_local = dt_utc + datetime.timedelta(hours=tz_offset)
    
    # 1. VARSHAPHALA (D1) CHART AND PLANETARY DETAILS
    planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    swe_planets = [swe.SUN, swe.MOON, swe.MARS, swe.MERCURY, swe.JUPITER, swe.VENUS, swe.SATURN, swe.MEAN_NODE]
    
    cusps, ascmc = swe.houses_ex(jd_return, lat, lon, b'W', swe.FLG_SIDEREAL)
    ascendant_degree = ascmc[0]
    ascendant_sign_index = int(ascendant_degree / 30)
    
    planet_details = []
    
    # Ascendant row
    nak_data_asc = compute_nakshatra(jd_return, manual_lon=ascendant_degree)
    planet_details.append({
        "planet": "Lagna",
        "rc": "",
        "sign": SIGNS[ascendant_sign_index][:3],
        "degree": format_dms(ascendant_degree % 30),
        "speed": "",
        "nakshatra": nak_data_asc["nakshatra_name"],
        "pada": nak_data_asc["pada"],
        "sign_lord": SIGN_LORDS[ascendant_sign_index][:3],
        "nak_lord": NAKSHATRA_ATTRIBUTES.get(nak_data_asc["nakshatra_name"], {}).get("lord", "")[:3],
        "status": "",
        "sb": ""
    })
    
    rahu_deg = 0
    moon_deg = 0
    
    for i, p_name in enumerate(planets):
        if p_name == "Ketu":
            lon_deg = (rahu_deg + 180) % 360
            speed = -0.053  # Approx daily motion
        else:
            p_id = swe_planets[i]
            pos, _ = swe.calc_ut(jd_return, p_id, swe.FLG_SIDEREAL | swe.FLG_SPEED)
            lon_deg = pos[0]
            speed = pos[3]
            if p_name == "Rahu":
                rahu_deg = lon_deg
            if p_name == "Moon":
                moon_deg = lon_deg
                
        sign_index = int(lon_deg / 30)
        
        # Calculate Nakshatra
        nak_data = compute_nakshatra(jd_return, manual_lon=lon_deg)
        nak_name = nak_data["nakshatra_name"]
        
        # R/C
        rc = ""
        if speed < 0 and p_name not in ["Rahu", "Ketu", "Sun", "Moon"]:
            rc = "R"
        # Combust logic (simple: within 8 degrees of sun, excluding Rahu/Ketu/Moon)
        if p_name not in ["Sun", "Moon", "Rahu", "Ketu"]:
            sun_pos, _ = swe.calc_ut(jd_return, swe.SUN, swe.FLG_SIDEREAL)
            sun_lon = sun_pos[0]
            diff = abs(sun_lon - lon_deg)
            if diff > 180: diff = 360 - diff
            if diff < 8:
                rc += "C"
                
        # Status (Simplified Dignity)
        status = ""
        # Extremely simplified mapping for visualization
        if p_name == "Sun" and sign_index == 0: status = "Exalt."
        elif p_name == "Moon" and sign_index == 1: status = "Exalt."
        elif p_name == "Mars" and sign_index == 9: status = "Exalt."
        elif p_name == "Mercury" and sign_index == 5: status = "Exalt."
        elif p_name == "Jupiter" and sign_index == 3: status = "Exalt."
        elif p_name == "Venus" and sign_index == 11: status = "Exalt."
        elif p_name == "Saturn" and sign_index == 6: status = "Exalt."
        elif p_name == "Rahu" and sign_index == 1: status = "Exalt."
        elif p_name == "Ketu" and sign_index == 7: status = "Exalt."
        
        elif p_name == "Sun" and sign_index == 6: status = "Debil."
        elif p_name == "Moon" and sign_index == 7: status = "Debil."
        elif p_name == "Mars" and sign_index == 3: status = "Debil."
        elif p_name == "Mercury" and sign_index == 11: status = "Debil."
        elif p_name == "Jupiter" and sign_index == 9: status = "Debil."
        elif p_name == "Venus" and sign_index == 5: status = "Debil."
        elif p_name == "Saturn" and sign_index == 0: status = "Debil."
        
        elif SIGN_LORDS[sign_index] == p_name: status = "Own"
        else: status = "Neutr." # Fallback

        planet_details.append({
            "planet": p_name,
            "rc": rc,
            "sign": SIGNS[sign_index][:3],
            "degree": format_dms(lon_deg % 30),
            "speed": format_dms(abs(speed)) if speed >= 0 else f"-{format_dms(abs(speed))}",
            "nakshatra": nak_name,
            "pada": nak_data["pada"],
            "sign_lord": SIGN_LORDS[sign_index][:3],
            "nak_lord": NAKSHATRA_ATTRIBUTES.get(nak_name, {}).get("lord", "")[:3],
            "status": status,
            "sb": "" # Omitted for performance
        })
        
    # Generate 4 Charts
    varshaphala_chart_raw = build_rashi_chart(jd_return, lat, lon)
    
    # Format varshaphala chart for ZodiacVrasphalChart (expects simple string lists)
    formatted_varshaphala = {}
    for h, h_data in varshaphala_chart_raw["houses"].items():
        sign_idx = (ascendant_sign_index + int(h) - 1) % 12
        formatted_planets = []
        if int(h) == 1:
            formatted_planets.append("Ascendant")
        for p in h_data.get("planets", []):
            if isinstance(p, dict):
                formatted_planets.append(p["name"])
            else:
                formatted_planets.append(p)
                
        formatted_varshaphala[str(h)] = {
            "sign_index": sign_idx,
            "sign": sign_idx + 1,
            "planets": formatted_planets
        }
    
    # Bhava Chart (Chalit) - For simplicity, returning Rashi for now, typically Bhava shifts planets based on cusps
    # Let's approximate Bhava by using Sripat system cusps
    bhava_houses = {str(i): {"sign_index": (ascendant_sign_index + i - 1) % 12, "sign": (ascendant_sign_index + i - 1) % 12 + 1, "planets": []} for i in range(1, 13)}
    # Assign planets to Bhava houses
    for h, h_data in formatted_varshaphala.items():
        for planet in h_data["planets"]:
            # Basic approximation: House = (Planet Lon - Ascendant Lon + 15) / 30
            p_lon = 0
            if planet == "Ascendant":
                bhava_houses["1"]["planets"].append("Ascendant")
                continue
                
            p_idx = planets.index(planet) if planet in planets else -1
            if p_idx == -1: continue
            
            if planet == "Ketu":
                p_lon = (rahu_deg + 180) % 360
            else:
                p_id = swe_planets[p_idx]
                pos, _ = swe.calc_ut(jd_return, p_id, swe.FLG_SIDEREAL)
                p_lon = pos[0]
                
            house_shift = int((p_lon - ascendant_degree + 15) % 360 / 30) + 1
            if house_shift < 1: house_shift += 12
            if house_shift > 12: house_shift -= 12
            bhava_houses[str(house_shift)]["planets"].append(planet)

    # Moon Chart
    moon_sign_index = int(moon_deg / 30)
    moon_houses = {}
    for h in range(1, 13):
        sign_idx = (moon_sign_index + h - 1) % 12
        moon_houses[str(h)] = {
            "sign_index": sign_idx,
            "sign": sign_idx + 1,
            "planets": []
        }
    for h_str, h_data in formatted_varshaphala.items():
        sign_idx = h_data["sign"] - 1
        # which house is this sign from moon?
        house_from_moon = ((sign_idx - moon_sign_index) % 12) + 1
        moon_houses[str(house_from_moon)]["planets"] = h_data["planets"]

    # Navamsha Chart (D9)
    navamsha_houses = {str(i): {"sign": i, "planets": []} for i in range(1, 13)}
    
    # Calculate D9 signs
    d9_asc_sign = int(((ascendant_degree * 9) % 360) / 30)
    
    # Re-map houses based on D9 Ascendant
    navamsha_houses = {}
    for h in range(1, 13):
        sign_idx = (d9_asc_sign + h - 1) % 12
        navamsha_houses[str(h)] = {
            "sign_index": sign_idx,
            "sign": sign_idx + 1,
            "planets": []
        }
        
    navamsha_houses["1"]["planets"].append("Ascendant")

    for i, p_name in enumerate(planets):
        if p_name == "Ketu":
            lon_deg = (rahu_deg + 180) % 360
        else:
            p_id = swe_planets[i]
            pos, _ = swe.calc_ut(jd_return, p_id, swe.FLG_SIDEREAL)
            lon_deg = pos[0]
            
        d9_sign = int(((lon_deg * 9) % 360) / 30)
        house_from_d9_asc = ((d9_sign - d9_asc_sign) % 12) + 1
        navamsha_houses[str(house_from_d9_asc)]["planets"].append(p_name)

    return {
        "return_time": dt_local.strftime("%A, %d %B %Y, %H:%M:%S hrs"),
        "table": planet_details,
        "charts": {
            "varshaphala": {"houses": formatted_varshaphala},
            "bhava": {"houses": bhava_houses},
            "moon": {"houses": moon_houses},
            "navamsha": {"houses": navamsha_houses}
        }
    }
