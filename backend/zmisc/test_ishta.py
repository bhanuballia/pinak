import json
import datetime as _dt
from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart
from charts.divisional import build_varga_chart
from core.analysis.ishta_devata import calculate_ishta_devata

def run_test():
    y, m, d = 1990, 5, 15
    hh, mm, ss = 12, 30, 0
    tz_offset = 5.5
    lat = 28.6139
    lon = 77.2090
    
    dt_local = _dt.datetime(y, m, d, hh, mm, ss)
    dt_utc = dt_local - _dt.timedelta(hours=float(tz_offset))
    jd_ut = datetime_to_julian(dt_utc)

    chart = build_rashi_chart(jd_ut, lat, lon, house_system="W", style="north")
    chart["jd_ut"] = jd_ut
    
    d9 = build_varga_chart(
        9, jd_ut, lat, lon, 
        house_system="W", 
        style="north",
        planet_positions=chart["planet_positions"]
    )
    
    res = calculate_ishta_devata(chart, d9)
    print(json.dumps(res, indent=2))

if __name__ == "__main__":
    run_test()
