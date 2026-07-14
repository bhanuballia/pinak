# solar_returns/solar_return_engine.py

import swisseph as swe
from astronomy.julian import julian_to_datetime
import datetime

class SolarReturnEngine:
    """
    Calculates exact Solar Return using pyswisseph.
    """
    
    def __init__(self):
        # Ensure sidereal mode is set to Lahiri
        swe.set_sid_mode(swe.SIDM_LAHIRI)

    def _get_sun_longitude(self, jd_ut):
        sun_pos, _ = swe.calc_ut(jd_ut, swe.SUN, swe.FLG_SIDEREAL)
        return sun_pos[0]

    def get_natal_sun_longitude(self, jd_birth):
        return self._get_sun_longitude(jd_birth)

    def calculate_exact_return(self, jd_birth_ut, natal_sun_longitude, target_year):
        """
        Iteratively finds the exact Julian Day when the Sun reaches natal_sun_longitude.
        """
        # Estimate: Add exactly target_year * 365.25 days to birth JD
        jd_estimate = jd_birth_ut + (target_year * 365.2425)
        
        for _ in range(15):
            sun_lon_now = self._get_sun_longitude(jd_estimate)
            diff = natal_sun_longitude - sun_lon_now
            
            if diff > 180: diff -= 360
            if diff < -180: diff += 360
                
            if abs(diff) < 0.000001:
                break
                
            jd_estimate += diff / 0.9856  # Sun moves ~0.9856 degrees/day
            
        return jd_estimate

    def generate_return_data(self, jd_birth_ut, natal_sun_longitude, lat, lon, age):
        jd_return = self.calculate_exact_return(jd_birth_ut, natal_sun_longitude, age)
        
        # Calculate house cusps for the return time, using birth location
        cusps, ascmc = swe.houses_ex(jd_return, lat, lon, b'W', swe.FLG_SIDEREAL)
        ascendant_degree = ascmc[0]
        ascendant_sign = int(ascendant_degree / 30)
        
        # Calculate planetary positions
        planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
        swe_planets = [swe.SUN, swe.MOON, swe.MARS, swe.MERCURY, swe.JUPITER, swe.VENUS, swe.SATURN, swe.MEAN_NODE]
        
        positions = []
        for i, p_name in enumerate(planets):
            if p_name == "Ketu":
                # Ketu is exactly 180 degrees from Rahu
                rahu_pos = next(p for p in positions if p["planet"] == "Rahu")
                lon_deg = (rahu_pos["degree"] + 180) % 360
                is_retro = True
            else:
                p_id = swe_planets[i]
                pos, _ = swe.calc_ut(jd_return, p_id, swe.FLG_SIDEREAL)
                lon_deg = pos[0]
                is_retro = pos[3] < 0 if len(pos) > 3 else False
                
            sign_index = int(lon_deg / 30)
            signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
            
            # House relative to ascendant sign
            house = ((sign_index - ascendant_sign + 12) % 12) + 1
            
            positions.append({
                "planet": p_name,
                "degree": lon_deg,
                "sign": signs[sign_index],
                "sign_index": sign_index,
                "house": house,
                "is_retrograde": is_retro,
                "is_combust": False # Can implement later if needed
            })
            
        dt_utc = julian_to_datetime(jd_return)
        
        return {
            "age": age,
            "jd_ut": jd_return,
            "return_date_utc": dt_utc.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "ascendant": ascendant_degree,
            "ascendant_sign": ascendant_sign,
            "planets": positions
        }
