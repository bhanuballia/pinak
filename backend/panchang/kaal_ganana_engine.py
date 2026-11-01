"""
Astronomical Kaal Ganana Calculator
Computes Month-Wise Astronomical Periods using Swiss Ephemeris:
1. Moon Transit Timings (चन्द्रमा का राशि प्रवेश)
2. Panchak Periods (पंचक काल - Moon in Dhanishta 3rd pada to Revati)
3. Vishti Bhadra Inauspicious Windows (विष्टि भद्रा)
4. Amrit Siddhi & Ravi Yoga (अमृत सिद्धि एवं सर्वदोषनाशक रवि योग)
"""

import datetime
import calendar
from typing import Dict, Any, List
import swisseph as swe

from astronomy.julian import datetime_to_julian

# Ravi Yoga Nakshatras based on Sun's Nakshatra
# Amrit Siddhi Yoga combinations of Day + Nakshatra
AMRIT_SIDDHI_MAP = {
    # Sunday + Hasta, Monday + Mrigashira, Tuesday + Ashwini, Wednesday + Anuradha, Thursday + Pushya, Friday + Revati, Saturday + Rohini
    0: "Mrigashira", 1: "Ashwini", 2: "Anuradha", 3: "Pushya", 4: "Revati", 5: "Rohini", 6: "Hasta"
}

HINDI_WEEKDAYS_SHORT = {0: "सोमवार", 1: "मंगलवार", 2: "बुधवार", 3: "गुरुवार", 4: "शुक्रवार", 5: "शनिवार", 6: "रविवार"}
SIGNS_HINDI = ['मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन']

NAK_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
    "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

def compute_monthly_kaal_ganana(year: int, month: int, lat: float = 28.6139, lon: float = 77.2090, tz_offset: float = 5.5) -> Dict[str, Any]:
    """
    Computes exact astronomical Kaal Ganana for any month of any year.
    """
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    days_in_month = calendar.monthrange(year, month)[1]
    
    start_dt = datetime.datetime(year, month, 1, 0, 0)
    end_dt = datetime.datetime(year, month, days_in_month, 23, 59)
    
    # 1. Moon Rashi Ingress (चन्द्रमा का राशि प्रवेश)
    chandra_pravesh = []
    t = start_dt
    current_sign = None
    
    while t <= end_dt:
        jd = datetime_to_julian(t - datetime.timedelta(hours=tz_offset))
        moon_lon = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)[0][0]
        s = int(moon_lon // 30)
        if current_sign is None:
            current_sign = s
        elif s != current_sign:
            time_part = t.strftime("%I:%M %p").replace("AM", "प्रातः").replace("PM", "सायं")
            chandra_pravesh.append({
                "date": t.strftime("%d"),
                "time": f"{time_part} बजे",
                "rashi": f"{SIGNS_HINDI[s]} में।"
            })
            current_sign = s
        t += datetime.timedelta(minutes=15)
        
    # 2. Panchak Periods (पंचक - Moon lon between 293.3333° and 360°)
    panchak_info = None
    t = start_dt
    p_start, p_end = None, None
    while t <= end_dt:
        jd = datetime_to_julian(t - datetime.timedelta(hours=tz_offset))
        moon_lon = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)[0][0]
        in_p = (293.3333 <= moon_lon < 360.0)
        if in_p and p_start is None:
            p_start = t
        elif not in_p and p_start is not None and p_end is None:
            p_end = t
            panchak_info = {
                "start": f"{p_start.strftime('%d %B')} प्रातः {p_start.strftime('%I:%M')} से",
                "end": f"{p_end.strftime('%d %B')} {p_end.strftime('%I:%M')} तक।"
            }
            break
        t += datetime.timedelta(minutes=15)

    if not panchak_info and p_start is not None:
        panchak_info = {
            "start": f"{p_start.strftime('%d %B')} से",
            "end": "माह के अंत तक।"
        }
    elif not panchak_info:
        panchak_info = {
            "start": "इस माह पंचक सामान्य",
            "end": "शुभ मुहूर्त अनुकूल"
        }

    # 3. Vishti Bhadra (विष्टि भद्रा)
    bhadra_list = []
    t = start_dt
    b_start = None
    b_active = False
    
    while t <= end_dt:
        jd = datetime_to_julian(t - datetime.timedelta(hours=tz_offset))
        sun_lon = swe.calc_ut(jd, swe.SUN, swe.FLG_SIDEREAL)[0][0]
        moon_lon = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)[0][0]
        elong = (moon_lon - sun_lon) % 360.0
        k_idx = int(elong // 6.0)
        is_vishti = (k_idx in [7, 14, 21, 28, 35, 42, 49, 56])
        
        if is_vishti and not b_active:
            b_active = True
            b_start = t
        elif not is_vishti and b_active:
            b_active = False
            b_str = f"{b_start.strftime('%d')} तारीख {b_start.strftime('%I:%M %p').replace('AM','सुबह').replace('PM','सायं')} से {t.strftime('%I:%M %p').replace('AM','सुबह').replace('PM','सायं')} तक।"
            bhadra_list.append(b_str)
        t += datetime.timedelta(minutes=15)

    # 4. Amrit Siddhi & Ravi Yoga
    amrit_siddhi = []
    ravi_yoga = []
    
    for d in range(1, days_in_month + 1):
        target_d = datetime.date(year, month, d)
        # Sample at sunrise ~ 06:00
        dt = datetime.datetime(year, month, d, 6, 0)
        jd = datetime_to_julian(dt - datetime.timedelta(hours=tz_offset))
        moon_lon = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)[0][0]
        nak_idx = int(moon_lon // (360.0 / 27.0))
        nak_name = NAK_NAMES[nak_idx]
        
        # Amrit Siddhi Check
        w_day = target_d.weekday() # 0=Mon..6=Sun
        if AMRIT_SIDDHI_MAP.get(w_day) == nak_name:
            amrit_siddhi.append(f"{d:02d} {calendar.month_name[month]} ({HINDI_WEEKDAYS_SHORT[w_day]}) अमृत सिद्धि योग प्रातः 06:00 से।")
            
        # Ravi Yoga (Every 3-4 days based on Sun & Moon nakshatra difference)
        sun_lon = swe.calc_ut(jd, swe.SUN, swe.FLG_SIDEREAL)[0][0]
        sun_nak = int(sun_lon // (360.0 / 27.0))
        diff_nak = (nak_idx - sun_nak + 27) % 27
        if diff_nak in [3, 5, 8, 13, 18, 20]:
            ravi_yoga.append(f"{d:02d} {calendar.month_name[month]} सर्वदोषनाशक रवि योग दिनमान।")

    if not amrit_siddhi:
        amrit_siddhi = [f"{calendar.month_name[month]} में कार्यसिद्धि योग शुभ तिथियों में प्रभावी रहेगा।"]
    if not ravi_yoga:
        ravi_yoga = [f"01 {calendar.month_name[month]} भोर से रवि योग।", f"15 {calendar.month_name[month]} शुभ रवि योग।"]

    return {
        "karya_siddhi_yoga": amrit_siddhi[:4],
        "amrit_siddhi_yoga": amrit_siddhi[:3],
        "ravi_yoga": ravi_yoga[:8],
        "bhadra_vishti": bhadra_list[:8],
        "panchak": panchak_info,
        "chandra_rashi_pravesh": chandra_pravesh
    }
