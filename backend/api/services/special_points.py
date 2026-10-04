import datetime
import math
from astronomy.ascendant import get_ascendant
from astronomy.julian import datetime_to_julian
import swisseph as swe

# Basic upagrahas
def compute_upagrahas(sun_lon):
    dhooma = (sun_lon + 133.333333333) % 360.0
    vyatipata = (360.0 - dhooma) % 360.0
    parivesha = (vyatipata + 180.0) % 360.0
    indra_chapa = (360.0 - parivesha) % 360.0
    upaketu = (indra_chapa + 16.666666667) % 360.0
    
    return {
        "Dhooma": dhooma,
        "Vyatipata": vyatipata,
        "Parivesha": parivesha,
        "Indra Chapa": indra_chapa,
        "Upaketu": upaketu
    }

def get_ascendant_from_dt(dt_local, tz_offset, lat, lon):
    dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
    jd_ut = datetime_to_julian(dt_utc)
    res = get_ascendant(jd_ut, lat, lon)
    if "ascendant_deg" in res:
        return res["ascendant_deg"]
    elif "ascendant" in res:
        return res["ascendant"]
    return 0.0

def compute_all_special_points(dt_local, tz_offset, lat, lon, sun_lon, moon_lon, asc_lon, rahu_lon):
    from panch_pakshi.sunrise_engine import get_sunrise_sunset
    from datetime import timedelta
    
    date_val = dt_local.date()
    # Mocking sunrise/sunset if engine not perfectly aligned
    sr, ss = get_sunrise_sunset(lat, lon, date_val, tz_offset)
    
    if not sr or not ss:
        sr = datetime.datetime.combine(date_val, datetime.time(6, 0))
        ss = datetime.datetime.combine(date_val, datetime.time(18, 0))
        
    is_day = sr <= dt_local < ss
    
    if is_day:
        start_time = sr
        duration = (ss - sr).total_seconds()
    else:
        start_time = ss
        next_date = date_val + timedelta(days=1)
        nsr, _ = get_sunrise_sunset(lat, lon, next_date, tz_offset)
        if not nsr: nsr = ss + timedelta(hours=12)
        duration = (nsr - ss).total_seconds()

    time_elapsed = (dt_local - sr).total_seconds()
    
    # 1. Bhava Lagna: 1 sign per 2 hours (7200 sec)
    bhava_lagna = (asc_lon + (time_elapsed / 7200.0) * 30.0) % 360.0
    
    # 2. Hora Lagna: 1 sign per hour (3600 sec)
    hora_lagna = (asc_lon + (time_elapsed / 3600.0) * 30.0) % 360.0
    
    # 3. Ghati Lagna: 1 sign per 24 minutes (1440 sec)
    ghati_lagna = (asc_lon + (time_elapsed / 1440.0) * 30.0) % 360.0
    
    # 4. Vighati Lagna: 1 sign per 24 seconds
    vighati_lagna = (asc_lon + (time_elapsed / 24.0) * 30.0) % 360.0
    
    # 5. Pranapada Lagna: 1 sign per 6 minutes (360 sec)
    pranapada_lagna = (asc_lon + (time_elapsed / 360.0) * 30.0) % 360.0
    
    # Bhrigu Bindu
    bhrigu_bindu = (moon_lon + rahu_lon) / 2.0
    
    # Kunda
    kunda = (asc_lon * 81.0) % 360.0
    
    # Calculate parts for Upagrahas (Gulika, Maandi, etc.)
    wd = dt_local.weekday() # 0 = Monday
    v_wd = (wd + 1) % 7 # 0 = Sunday
    
    mandi_day = [6, 5, 4, 3, 2, 1, 0]
    mandi_night = [2, 1, 0, 6, 5, 4, 3]
    
    mp = mandi_day[v_wd] if is_day else mandi_night[v_wd]
    gp = (mp - 1) % 7
    yp = (mp - 2) % 7 # Yama
    ap = (mp - 3) % 7 # Artha Prahara
    kp = (mp - 4) % 7 # Kaala
    mrp = (mp - 5) % 7 # Mrityu
    
    part_len = duration / 8
    
    def get_part_asc(part_idx):
        t = start_time + timedelta(seconds=part_idx * part_len)
        return get_ascendant_from_dt(t, tz_offset, lat, lon)
        
    mandi = get_part_asc(mp)
    gulika = get_part_asc(gp)
    yama = get_part_asc(yp)
    artha = get_part_asc(ap)
    kaala = get_part_asc(kp)
    mrityu = get_part_asc(mrp)
    
    upagrahas_1 = compute_upagrahas(sun_lon)
    
    upagrahas = {
        **upagrahas_1,
        "Maandi": mandi,
        "Gulika": gulika,
        "Yama Ghantaka": yama,
        "Artha Prahara": artha,
        "Kaala": kaala,
        "Mrityu": mrityu
    }
    
    special_lagnas = {
        "Bhava Lagna": bhava_lagna,
        "Hora Lagna": hora_lagna,
        "Ghati Lagna": ghati_lagna,
        "Vighati Lagna": vighati_lagna,
        "Pranapada Lagna": pranapada_lagna,
        "Bhrigu Bindu": bhrigu_bindu,
        "Kunda": kunda,
        "Sree Lagna": asc_lon, # Approximation for now
        "Indu Lagna": asc_lon  # Approximation for now
    }
    
    return {"special_lagnas": special_lagnas, "upagrahas": upagrahas}
