# tests/test_panchang.py
from panchang.tithi_yoga_karana import compute_tithi, compute_nakshatra, compute_yoga
from astronomy.julian import datetime_to_julian
import datetime

def test_panchang_basic():
    # Example: 1987-04-02 08:10 UTC (adjusted) - this is only a smoke test
    dt = datetime.datetime(1987, 4, 2, 8, 10)
    jd = datetime_to_julian(dt)
    t = compute_tithi(jd)
    n = compute_nakshatra(jd)
    y = compute_yoga(jd)
    assert "tithi_index" in t
    assert "nakshatra_index" in n
    assert "yoga_index" in y
