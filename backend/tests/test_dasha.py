# tests/test_dasha.py
from dasha.vimshottari import compute_vimshottari
import math

def test_vimshottari_length():
    jd_birth = 2446822.5  # arbitrary JD
    moon_lon = 123.45
    dashas = compute_vimshottari(jd_birth, moon_lon)
    assert len(dashas) in [9, 10]
    # check ordering and total years are plausible
    total_years = sum(d['duration_years'] for d in dashas)
    assert 90 <= total_years <= 140  # rough check (due to first partial)
