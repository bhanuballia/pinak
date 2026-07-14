import math
import datetime
import swisseph as swe

class ChaitraEngine:
    def __init__(self):
        pass

    def get_planet_pos(self, jd, planet_id):
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        pos, _ = swe.calc_ut(jd, planet_id, swe.FLG_SIDEREAL)
        return pos[0]

    def get_ascendant(self, jd, lat, lon):
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        houses, ascmc = swe.houses_ex(jd, lat, lon, b'P', swe.FLG_SIDEREAL)
        return ascmc[0]  # Ascendant

    def find_new_moon_before_mesha(self, year):
        """
        Finds the exact Julian Day of the New Moon (Sun and Moon conjunct) 
        before Mesha Sankranti (mid-April).
        """
        # Start searching around March 1st to April 15th
        start_date = datetime.datetime(year, 3, 1)
        start_jd = swe.julday(start_date.year, start_date.month, start_date.day, 0)
        
        # Step day by day to find where Moon passes the Sun
        prev_diff = None
        approx_jd = None
        for i in range(45):
            jd = start_jd + i
            sun_pos = self.get_planet_pos(jd, swe.SUN)
            moon_pos = self.get_planet_pos(jd, swe.MOON)
            
            # Distance between Moon and Sun (0 to 360)
            diff = (moon_pos - sun_pos) % 360
            
            if prev_diff is not None:
                # Moon moves ~13 deg/day, Sun ~1 deg/day. 
                # If diff drops from ~350 to ~10, a conjunction happened!
                if prev_diff > 300 and diff < 60:
                    approx_jd = jd - 1 # Conjunction happened between jd-1 and jd
                    break
            prev_diff = diff

        if not approx_jd:
            return None

        # Binary search for exact conjunction to the nearest minute
        low = approx_jd
        high = approx_jd + 1
        exact_jd = low
        
        for _ in range(20):
            mid = (low + high) / 2.0
            sun_p = self.get_planet_pos(mid, swe.SUN)
            moon_p = self.get_planet_pos(mid, swe.MOON)
            diff = (moon_p - sun_p) % 360
            
            if diff > 180: # Moon is behind Sun
                low = mid
            else: # Moon is ahead of Sun
                high = mid
            exact_jd = mid

        return exact_jd

    def find_sun_degree(self, year, target_deg, start_month):
        """
        Finds exact JD of Sun reaching a specific sidereal degree.
        """
        start_jd = swe.julday(year, start_month, 1, 0)
        low = start_jd
        high = start_jd + 60 # Check within 2 months
        exact_jd = low

        for _ in range(30):
            mid = (low + high) / 2.0
            sun_p = self.get_planet_pos(mid, swe.SUN)
            
            # Handle the 0/360 wrap-around if target is 0
            diff = (sun_p - target_deg) % 360
            if diff > 180: # Sun is behind target
                low = mid
            else: # Sun is ahead of target
                high = mid
            exact_jd = mid

        return exact_jd
        
    def find_mesha_sankranti(self, year):
        return self.find_sun_degree(year, 0, 4)
        
    def get_weekday_from_jd(self, jd):
        """
        JD 0 was a Monday. We add 1.5 to align properly to local sunrise weekday roughly.
        Vedic weekday starts at sunrise, but mathematically JD + 1.5 modulo 7 gives Standard Weekday:
        0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
        """
        # UTC weekday approximation for the event moment
        dt = self.jd_to_utc_datetime(jd)
        # Using standard gregorian weekday for simplicity, although strictly it should be sunrise-based.
        # dt.isoweekday() returns 1=Mon, 7=Sun. 
        # Convert to 0=Sun, 1=Mon
        return dt.isoweekday() % 7

    def get_planet_from_weekday(self, wd_idx):
        days = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
        return days[wd_idx]

    def jd_to_utc_datetime(self, jd):
        # Base JD 2440587.5 is 1970-01-01 00:00:00 UTC
        ts = (jd - 2440587.5) * 86400.0
        return datetime.datetime.utcfromtimestamp(ts)

    def calculate_chaitra_chart(self, year: int, lat: float, lon: float):
        csp_jd = self.find_new_moon_before_mesha(year)
        
        # Calculate Sankrantis
        mesha_jd = self.find_sun_degree(year, 0, 4)        # Mantri
        vrishabha_jd = self.find_sun_degree(year, 30, 5)    # Phalesh
        ardra_jd = self.find_sun_degree(year, 66.6667, 6)   # Meghesh
        karka_jd = self.find_sun_degree(year, 90, 7)        # Shasyesh
        simha_jd = self.find_sun_degree(year, 120, 8)       # Durgesh
        kanya_jd = self.find_sun_degree(year, 150, 9)       # Dhanesh
        tula_jd = self.find_sun_degree(year, 180, 10)       # Rasesh
        dhanu_jd = self.find_sun_degree(year, 240, 12)      # Dhanyesh
        
        # Makara Sankranti happens in Jan of the NEXT year, or we use the current year's Jan?
        # The cabinet is for the Vedic Year starting in Chaitra. 
        # Makara Sankranti for this Vedic year will happen in Jan of (year + 1).
        makara_jd = self.find_sun_degree(year + 1, 270, 1)  # Neeresh

        csp_dt = self.jd_to_utc_datetime(csp_jd)
        
        cabinet = {
            "King (Raja)": self.get_planet_from_weekday(self.get_weekday_from_jd(csp_jd)),
            "Minister (Mantri)": self.get_planet_from_weekday(self.get_weekday_from_jd(mesha_jd)),
            "Shasyesh (Agriculture)": self.get_planet_from_weekday(self.get_weekday_from_jd(karka_jd)),
            "Dhanyesh (Food and grains)": self.get_planet_from_weekday(self.get_weekday_from_jd(dhanu_jd)),
            "Meghesh (Rainfall)": self.get_planet_from_weekday(self.get_weekday_from_jd(ardra_jd)),
            "Rasesh (Liquids, medicines, sugar)": self.get_planet_from_weekday(self.get_weekday_from_jd(tula_jd)),
            "Neeresh (Minerals, metals, petroleum)": self.get_planet_from_weekday(self.get_weekday_from_jd(makara_jd)),
            "Phalesh (Fruits, vegetation, gardens)": self.get_planet_from_weekday(self.get_weekday_from_jd(vrishabha_jd)),
            "Dhanesh (Finance and treasury)": self.get_planet_from_weekday(self.get_weekday_from_jd(kanya_jd)),
            "Durgesh (Defence and security)": self.get_planet_from_weekday(self.get_weekday_from_jd(simha_jd)),
        }

        planets = {
            "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS,
            "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER, 
            "Venus": swe.VENUS, "Saturn": swe.SATURN,
            "Rahu": swe.MEAN_NODE
        }
        
        planet_positions = []
        for name, p_id in planets.items():
            pos = self.get_planet_pos(csp_jd, p_id)
            planet_positions.append({"planet": name, "fullDegree": pos})
            
        rahu_pos = next(p["fullDegree"] for p in planet_positions if p["planet"] == "Rahu")
        planet_positions.append({"planet": "Ketu", "fullDegree": (rahu_pos + 180.0) % 360.0})

        asc_deg = self.get_ascendant(csp_jd, lat, lon)
        planet_positions.append({"planet": "Ascendant", "fullDegree": asc_deg})

        return {
            "year": year,
            "csp_datetime_utc": csp_dt.isoformat(),
            "mesha_sankranti_utc": self.jd_to_utc_datetime(mesha_jd).isoformat(),
            "cabinet": cabinet,
            "planet_positions": planet_positions
        }
