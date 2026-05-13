import sys; sys.path.insert(0, '.')
import time
print('Loading module...', flush=True)
from reports.report_data import *
print('Loaded!', flush=True)
name='FreshUser'; date='2000-05-05'; time_str='08:30:00'; tz_offset=5.5; lat=18.52; lon=73.85
hh, mm, ss = 8, 30, 0
import datetime as _dt
from astronomy.julian import datetime_to_julian
dt_utc = _dt.datetime(2000, 5, 5, hh, mm, ss) - _dt.timedelta(hours=tz_offset)
jd_ut = datetime_to_julian(dt_utc)

print('build_rashi_chart...', flush=True)
chart = build_rashi_chart(jd_ut, lat, lon, house_system='W', style='north')
print('compute_numerology...', flush=True)
numerology = compute_numerology(name, date, get_sign_name(chart['planet_positions']['Moon']['sidereal']['lon']))

print('calculate_all_doshas...', flush=True)
dosha = calculate_all_doshas(chart)
print('compute_shadbala_new...', flush=True)
strength = compute_shadbala_new(chart)
print('detect_yogas...', flush=True)
yogas = detect_yogas(chart)
print('summarize_dasha...', flush=True)
dasha = summarize_dasha(jd_ut, chart)
print('build_5d_life_map...', flush=True)
life_map = build_5d_life_map(chart, dasha, dosha, strength)
print('run_master_engine...', flush=True)
master_results = run_master_engine(chart, dasha)

print('build_pro_predictions...', flush=True)
pro_data = build_pro_predictions(chart, dasha, dosha, strength)

print('build_ultra_predictions...', flush=True)
ultra = build_ultra_predictions(chart, dasha, dosha, strength)

print('build_supreme_engine...', flush=True)
supreme = build_supreme_engine(chart, {}, strength, dosha, dasha)

print('build_cosmic_engine...', flush=True)
cosmic = build_cosmic_engine(chart, strength, dosha, dasha, supreme)

print('run_sentient_engine...', flush=True)
sentient = run_sentient_engine(chart, strength, dosha, cosmic)

print('run_akashic_engine...', flush=True)
akashic = run_akashic_engine(chart, strength, dosha, cosmic, sentient)

print('ALL ISOLATED OK!', flush=True)
