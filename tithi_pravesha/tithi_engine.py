# tithi_pravesha/tithi_engine.py

from datetime import datetime
from astronomy.positions import get_sun_moon_sidereal, get_all_planetary_positions
from astronomy.julian import datetime_to_julian, julian_to_datetime
from astronomy.sidereal import set_ayanamsa
from astronomy.ascendant import get_ascendant
from tithi_pravesha.lunar_phase_engine import LunarPhaseEngine

def normalize_degrees(deg):
    return deg % 360.0

class TithiEngine:

    TITHI_SIZE = 12

    def calculate(
        self,
        sun_longitude,
        moon_longitude
    ):

        difference = (
            moon_longitude
            -
            sun_longitude
        ) % 360

        tithi = int(
            difference
            /
            self.TITHI_SIZE
        ) + 1

        return {

            "difference": round(
                difference,
                2
            ),

            "tithi": tithi

        }

    def calculate_exact_tithi_pravesha(self, natal_dt: datetime, target_year: int, lat: float, lon: float) -> dict:
        """
        Calculates the exact Tithi Pravesha details for a given year.
        """
        natal_jd_ut = datetime_to_julian(natal_dt)
        set_ayanamsa()
        
        natal_pos = get_sun_moon_sidereal(natal_jd_ut)
        natal_sun = natal_pos["Sun"]
        natal_moon = natal_pos["Moon"]
        natal_diff = normalize_degrees(natal_moon - natal_sun)
        natal_tithi_num = int(natal_diff / 12) + 1
        
        approx_dt = datetime(target_year, natal_dt.month, natal_dt.day, natal_dt.hour, natal_dt.minute)
        approx_jd = datetime_to_julian(approx_dt)
        
        start_jd = approx_jd - 35
        end_jd = approx_jd + 35
        
        best_jd = None
        min_diff_err = 999.0
        
        jd = start_jd
        while jd <= end_jd:
            pos = get_sun_moon_sidereal(jd)
            sun_lon = pos["Sun"]
            moon_lon = pos["Moon"]
            
            diff = normalize_degrees(moon_lon - sun_lon)
            tithi_num = int(diff / 12) + 1
            
            sun_sign = int(sun_lon / 30)
            natal_sun_sign = int(natal_sun / 30)
            
            if sun_sign == natal_sun_sign and tithi_num == natal_tithi_num:
                err = abs(normalize_degrees(diff - natal_diff + 180) - 180)
                if err < min_diff_err:
                    min_diff_err = err
                    best_jd = jd
            jd += 0.1

        if best_jd is None:
            jd = start_jd
            while jd <= end_jd:
                pos = get_sun_moon_sidereal(jd)
                sun_lon = pos["Sun"]
                moon_lon = pos["Moon"]
                diff = normalize_degrees(moon_lon - sun_lon)
                tithi_num = int(diff / 12) + 1
                if tithi_num == natal_tithi_num:
                    err = abs(normalize_degrees(diff - natal_diff + 180) - 180)
                    if err < min_diff_err:
                        min_diff_err = err
                        best_jd = jd
                jd += 0.1
                
        if best_jd is None:
            tp_jd = approx_jd
        else:
            t0 = best_jd - 0.5
            t1 = best_jd + 0.5
            def f(t):
                p = get_sun_moon_sidereal(t)
                d = normalize_degrees(p["Moon"] - p["Sun"])
                return normalize_degrees(d - natal_diff + 180) - 180
                
            for _ in range(40):
                tm = (t0 + t1) / 2
                fm = f(tm)
                f0 = f(t0)
                if f0 * fm <= 0:
                    t1 = tm
                else:
                    t0 = tm
            tp_jd = (t0 + t1) / 2
            
        tp_dt_utc = julian_to_datetime(tp_jd)
        
        # Calculate full planetary positions
        planets = get_all_planetary_positions(tp_jd)
        asc = get_ascendant(tp_jd, lat, lon)
        
        # Vaaresh calculation (Day lord)
        # Sunday=Sun, Monday=Moon, Tuesday=Mars, Wednesday=Mercury, Thursday=Jupiter, Friday=Venus, Saturday=Saturn
        day_lords = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        lord_map = {
            "Sunday": "Sun", "Monday": "Moon", "Tuesday": "Mars",
            "Wednesday": "Mercury", "Thursday": "Jupiter", "Friday": "Venus", "Saturday": "Saturn"
        }
        weekday_name = day_lords[tp_dt_utc.weekday()]
        vaaresh = lord_map[weekday_name]
        
        # Hora Lord Calculation
        # Hora repeats every hour from sunrise. We use a rough approximation of 6 AM for sunrise.
        hours_since_sunrise = (tp_dt_utc.hour - 6) % 24
        if hours_since_sunrise < 0:
            hours_since_sunrise += 24
            
        hora_order = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"]
        # Find start index based on vaaresh
        start_idx = hora_order.index(vaaresh)
        hora_lord = hora_order[(start_idx + hours_since_sunrise) % 7]
        
        # Samvatsara (Vedic Year) rough calculation
        samvatsara = target_year + 18  # Rough offset for testing
        
        # Format chart houses data for ZodicChart
        # We'll pack the chart nicely
        asc_sign = asc["ascendant_sign_index"] + 1
        
        houses = {}
        for i in range(1, 13):
            houses[str(i)] = {"sign_index": (asc_sign + i - 2) % 12, "planets": []}
            
        # Build standard output structure
        chart_planets = []
        for p_name, p_data in planets.items():
            if p_name in ["Ascendant"] or not p_data: continue
            sign_idx = int(p_data["sidereal"]["lon"] / 30) + 1
            chart_planets.append({
                "name": p_name,
                "sign": sign_idx,
                "lon": p_data["sidereal"]["lon"]
            })
            house_idx = (sign_idx - asc_sign) % 12 + 1
            houses[str(house_idx)]["planets"].append(p_name)
            
        # Put ascendant
        chart_planets.append({
            "name": "Ascendant",
            "sign": asc_sign,
            "lon": asc["ascendant_deg"]
        })
        
        phase = LunarPhaseEngine().calculate(natal_tithi_num)

        return {
            "true_birthday": tp_dt_utc.strftime("%Y-%m-%d %H:%M:%S"),
            "true_birthday_display": tp_dt_utc.strftime("%dth %B, %Y"),
            "true_birthday_time": tp_dt_utc.strftime("%H:%M"),
            "tithi": natal_tithi_num,
            "phase": phase,
            "month_phase": "Phalguna . " + phase, # using a placeholder month for demo as per user request
            "nakshatra": planets["Moon"]["nakshatra"]["name"],
            "samvatsara": samvatsara,
            "vaaresh": vaaresh,
            "hora_lord": hora_lord,
            "lagna_sign": asc["ascendant_sign"],
            "lagna_index": asc_sign,
            "planets": chart_planets,
            "houses": houses
        }
