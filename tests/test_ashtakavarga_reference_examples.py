# tests/test_ashtakavarga_variants.py
import datetime
from astronomy.julian import datetime_to_julian
from ashtakavarga.classical import compute_ashtakavarga_classical

def test_ashtakavarga_modes_produce_valid_structures():
    dt = datetime.datetime(2024,1,1,0,0)
    jd = datetime_to_julian(dt)
    lat, lon = 28.6139, 77.2090
    modes = ["PV_NARASIMHA", "CS_PATEL", "BV_RAMAN", "BPHS_SANthanam", "PARASHARA_LIGHT"]
    for m in modes:
        res = compute_ashtakavarga_classical(jd, lat, lon, mode=m)
        assert "bhinnashtakavarga" in res
        assert "sarvashtakavarga" in res
        sarva = res["sarvashtakavarga"]
        assert isinstance(sarva, list) and len(sarva) == 12
        # sanity range: total bindus typically around 300..400 (depends on method); accept 200..420
        total = sum(sarva)
        assert 200 <= total <= 420, f"unexpected total bindus {total} for mode {m}"

def test_custom_table_missing_raises():
    dt = datetime.datetime(2024,1,1,0,0)
    jd = datetime_to_julian(dt)
    lat, lon = 28.6139, 77.2090
    try:
        compute_ashtakavarga_classical(jd, lat, lon, mode="CUSTOM_DOES_NOT_EXIST")
        assert False, "Expected FileNotFoundError for missing custom table"
    except FileNotFoundError:
        assert True
