# tests/test_vimshottari.py
from dasha.vimshottari import compute_vimshottari_full
def test_vim_basic():
    # Moon at 100 deg sidereal
    res = compute_vimshottari_full(2446822.5, 100.0, years_ahead=60)
    assert len(res) > 0
    assert "antardashas" in res[0]
