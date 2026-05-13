# tests/test_positions.py
import datetime
from astronomy.julian import datetime_to_julian
from astronomy.positions import get_all_planetary_positions

def test_positions_basic():
    dt = datetime.datetime(2024, 1, 1, 0, 0)
    jd = datetime_to_julian(dt)
    res = get_all_planetary_positions(jd)
    # Check keys and numeric values
    assert "Sun" in res
    assert "Moon" in res
    assert isinstance(res["Sun"]["sidereal"]["lon"], float)
    assert 0.0 <= res["Sun"]["sidereal"]["lon"] < 360.0
