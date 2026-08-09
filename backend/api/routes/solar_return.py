from fastapi import APIRouter, HTTPException, Body
from typing import Dict, List
import datetime
from astronomy.julian import datetime_to_julian
from solar_returns.solar_return_engine import SolarReturnEngine
from solar_returns.muntha_calculator import MunthaCalculator
import swisseph as swe

router = APIRouter()

@router.post("/annual")
@router.post("/calculate")
def api_solar_return_annual(payload: Dict = Body(...)):
    try:
        date_str = payload["date"]
        time_str = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
        years = int(payload.get("years", 6)) # Default to 6 years
        start_age = int(payload.get("start_age", 1))
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")

    # Calculate Birth JD
    y, m, d = [int(x) for x in date_str.split("-")]
    tp = [int(x) for x in time_str.split(":")]
    dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
    jd_birth_ut = datetime_to_julian(dt_utc)

    # Initialize Engines
    engine = SolarReturnEngine()
    muntha_calc = MunthaCalculator()
    from solar_returns.details_calculator import get_full_astrological_details

    # Get Birth Details
    birth_details = get_full_astrological_details(jd_birth_ut, lat, lon, tz_offset)

    # Get Natal Ascendant (for Muntha)
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    cusps, ascmc = swe.houses_ex(jd_birth_ut, lat, lon, b'W', swe.FLG_SIDEREAL)
    natal_ascendant_deg = ascmc[0]
    natal_ascendant_sign_index = int(natal_ascendant_deg / 30)

    # Get Natal Sun Longitude
    natal_sun_longitude = engine.get_natal_sun_longitude(jd_birth_ut)

    # Generate charts for requested years
    results = []
    for age in range(start_age, start_age + years):
        chart_data = engine.generate_return_data(
            jd_birth_ut=jd_birth_ut,
            natal_sun_longitude=natal_sun_longitude,
            lat=lat,
            lon=lon,
            age=age
        )
        
        # Calculate Muntha
        muntha_data = muntha_calc.calculate(
            natal_ascendant_sign_index=natal_ascendant_sign_index,
            age=age,
            return_ascendant_sign_index=chart_data["ascendant_sign"]
        )
        
        # Calculate Varshaphala return details
        return_details = get_full_astrological_details(chart_data["jd_ut"], lat, lon, tz_offset)
        
        houses_dict = {}
        for h in range(1, 13):
            sign_idx = (chart_data["ascendant_sign"] + h - 1) % 12
            signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
            
            h_planets = []
            for p in chart_data["planets"]:
                if p["house"] == h:
                    h_planets.append(p["planet"])
            
            if muntha_data["house"] == h:
                h_planets.append("Mun")
                
            houses_dict[str(h)] = {
                "sign": sign_idx + 1,
                "sign_index": sign_idx,
                "sign_name": signs[sign_idx],
                "planets": h_planets
            }

        chart_data["charts"] = {"houses": houses_dict}
        chart_data["muntha"] = muntha_data
        chart_data["varshaphala_details"] = return_details
        
        results.append(chart_data)

    return {
        "birth_details": birth_details,
        "charts": results
    }

@router.post("/detailed_year")
def api_solar_return_detailed_year(payload: Dict = Body(...)):
    try:
        date_str = payload["date"]
        time_str = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
        target_age = int(payload.get("age", 1))
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")

    # Calculate Birth JD
    y, m, d = [int(x) for x in date_str.split("-")]
    tp = [int(x) for x in time_str.split(":")]
    dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
    jd_birth_ut = datetime_to_julian(dt_utc)

    engine = SolarReturnEngine()
    natal_sun_longitude = engine.get_natal_sun_longitude(jd_birth_ut)

    from solar_returns.detailed_year_calculator import calculate_detailed_year_data
    detailed_data = calculate_detailed_year_data(
        jd_birth_ut=jd_birth_ut,
        natal_sun_longitude=natal_sun_longitude,
        target_age=target_age,
        lat=lat,
        lon=lon,
        tz_offset=tz_offset
    )

    return detailed_data

@router.post("/calculate_daily")
def api_solar_return_daily(payload: Dict = Body(...)):
    try:
        date_str = payload.get("date", "2000-01-01")
        time_str = payload.get("time", "12:00:00")
        tz_offset = float(payload.get("tz_offset", 5.5))
        lat = float(payload.get("lat", 28.6139))
        lon = float(payload.get("lon", 77.209))
        name = payload.get("name", "Native")
        location_name = payload.get("location_name", "Unknown")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    from charts.rashi_chart import build_rashi_chart

    # Birth Chart
    y, m, d = [int(x) for x in date_str.split("-")]
    tp = [int(x) for x in time_str.split(":")]
    dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
    jd_birth_ut = datetime_to_julian(dt_utc)
    
    birth_data = build_rashi_chart(jd_birth_ut, lat, lon)
    
    # Yesterday, Today, Tomorrow (using current time or transit time)
    now = datetime.datetime.utcnow()
    
    prog_charts = []
    local_charts = []
    
    days = [("Yesterday", -1), ("Today", 0), ("Tomorrow", 1)]
    for title, offset in days:
        target_date = now + datetime.timedelta(days=offset)
        jd_target = datetime_to_julian(target_date)
        
        # Simple transit charts for mock
        prog_data = build_rashi_chart(jd_target, lat, lon)
        prog_charts.append({
            "title": f"{title} ({target_date.strftime('%d %b')})",
            "houses": prog_data["houses"]
        })
        
        local_data = build_rashi_chart(jd_target, lat, lon)
        local_charts.append({
            "title": f"Local {title}",
            "houses": local_data["houses"]
        })

    return {
        "birth_chart": {
            "title": "Birth Chart",
            "houses": birth_data["houses"]
        },
        "progression_charts": prog_charts,
        "local_charts": local_charts,
        "user_info": f"{name} | {date_str} {time_str} | {location_name}"
    }

@router.post("/varshaphala_strengths")
def api_solar_return_strengths(payload: Dict = Body(...)):
    try:
        date_str = payload["date"]
        time_str = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
        target_age = int(payload.get("start_age", 1))
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")

    # Calculate Birth JD
    y, m, d = [int(x) for x in date_str.split("-")]
    tp = [int(x) for x in time_str.split(":")]
    dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
    jd_birth_ut = datetime_to_julian(dt_utc)

    # Initialize Engines
    engine = SolarReturnEngine()
    muntha_calc = MunthaCalculator()
    
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    cusps, ascmc = swe.houses_ex(jd_birth_ut, lat, lon, b'W', swe.FLG_SIDEREAL)
    natal_ascendant_deg = ascmc[0]
    natal_ascendant_sign_index = int(natal_ascendant_deg / 30)

    natal_sun_longitude = engine.get_natal_sun_longitude(jd_birth_ut)

    # Return calculation
    chart_data = engine.generate_return_data(
        jd_birth_ut=jd_birth_ut,
        natal_sun_longitude=natal_sun_longitude,
        lat=lat,
        lon=lon,
        age=target_age
    )
    
    muntha_data = muntha_calc.calculate(
        natal_ascendant_sign_index=natal_ascendant_sign_index,
        age=target_age,
        return_ascendant_sign_index=chart_data["ascendant_sign"]
    )

    from solar_returns.varshaphala_strengths import calculate_harsha_bala, calculate_panchavargeeya_bala, calculate_panchadhikari
    
    planet_positions_deg = {}
    for p in chart_data["planets"]:
        planet_positions_deg[p["planet"]] = p["degree"]
        
    harsha_bala, harsha_total = calculate_harsha_bala(planet_positions_deg, chart_data["ascendant_sign"], True) # Default day birth for simplicity
    panchavargeeya_bala, panchavargeeya_total = calculate_panchavargeeya_bala(planet_positions_deg, chart_data["ascendant_sign"])
    
    officers, varshesha = calculate_panchadhikari(
        planet_positions_deg,
        natal_ascendant_sign_index,
        muntha_data["sign_index"],
        True,
        chart_data["ascendant_sign"],
        panchavargeeya_total
    )

    return {
        "harsha_bala": harsha_bala,
        "harsha_total": harsha_total,
        "panchavargeeya_bala": panchavargeeya_bala,
        "panchavargeeya_total": panchavargeeya_total,
        "panchadhikari": officers,
        "varshesha": varshesha,
        "muntha": muntha_data,
        "year_lord": varshesha
    }

@router.post("/tajika_yogas")
def api_solar_return_tajika_yogas(payload: Dict = Body(...)):
    try:
        date_str = payload["date"]
        time_str = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
        target_age = int(payload.get("start_age", 1))
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")

    # Calculate Birth JD
    y, m, d = [int(x) for x in date_str.split("-")]
    tp = [int(x) for x in time_str.split(":")]
    dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
    jd_birth_ut = datetime_to_julian(dt_utc)

    # Initialize Engines
    engine = SolarReturnEngine()
    muntha_calc = MunthaCalculator()
    
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    cusps, ascmc = swe.houses_ex(jd_birth_ut, lat, lon, b'W', swe.FLG_SIDEREAL)
    natal_ascendant_deg = ascmc[0]
    natal_ascendant_sign_index = int(natal_ascendant_deg / 30)

    natal_sun_longitude = engine.get_natal_sun_longitude(jd_birth_ut)

    chart_data = engine.generate_return_data(
        jd_birth_ut=jd_birth_ut,
        natal_sun_longitude=natal_sun_longitude,
        lat=lat,
        lon=lon,
        age=target_age
    )
    
    muntha_data = muntha_calc.calculate(
        natal_ascendant_sign_index=natal_ascendant_sign_index,
        age=target_age,
        return_ascendant_sign_index=chart_data["ascendant_sign"]
    )

    from solar_returns.varshaphala_strengths import calculate_panchavargeeya_bala, calculate_panchadhikari
    from solar_returns.tajika_yogas import calculate_16_yogas
    
    planet_positions_deg = {}
    for p in chart_data["planets"]:
        planet_positions_deg[p["planet"]] = p["degree"]
        
    panchavargeeya_bala, panchavargeeya_total = calculate_panchavargeeya_bala(planet_positions_deg, chart_data["ascendant_sign"])
    
    officers, varshesha = calculate_panchadhikari(
        planet_positions_deg,
        natal_ascendant_sign_index,
        muntha_data["sign_index"],
        True,
        chart_data["ascendant_sign"],
        panchavargeeya_total
    )

    signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    sign_lords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"]

    lagnesh = sign_lords[chart_data["ascendant_sign"]]
    karyesh = varshesha

    planet_pos_dict = {}
    for p in chart_data["planets"]:
        planet_pos_dict[p["planet"]] = p

    yogas = calculate_16_yogas(planet_pos_dict, lagnesh, karyesh)

    return {
        "yogas": yogas,
        "lagnesh": lagnesh,
        "karyesh": karyesh
    }

@router.post("/tripataki_chakra")
def api_solar_return_tripataki_chakra(payload: Dict = Body(...)):
    try:
        date_str = payload["date"]
        time_str = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
        target_age = int(payload.get("start_age", 1))
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")

    # Calculate Birth JD
    y, m, d = [int(x) for x in date_str.split("-")]
    tp = [int(x) for x in time_str.split(":")]
    dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
    jd_birth_ut = datetime_to_julian(dt_utc)

    # Initialize Engines
    engine = SolarReturnEngine()
    
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    cusps, ascmc = swe.houses_ex(jd_birth_ut, lat, lon, b'W', swe.FLG_SIDEREAL)
    natal_ascendant_deg = ascmc[0]
    natal_ascendant_sign_index = int(natal_ascendant_deg / 30)

    natal_sun_longitude = engine.get_natal_sun_longitude(jd_birth_ut)

    chart_data = engine.generate_return_data(
        jd_birth_ut=jd_birth_ut,
        natal_sun_longitude=natal_sun_longitude,
        lat=lat,
        lon=lon,
        age=target_age
    )

    from solar_returns.tripataki_chakra import calculate_tripataki_vedhas
    
    planet_pos_dict = {}
    for p in chart_data["planets"]:
        planet_pos_dict[p["planet"]] = p

    tripataki_data = calculate_tripataki_vedhas(planet_pos_dict, chart_data["ascendant_sign"])

    return tripataki_data
