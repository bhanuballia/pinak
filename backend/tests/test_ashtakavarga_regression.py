# tests/test_ashtakavarga_regression.py

import datetime
from astronomy.julian import datetime_to_julian
from ashtakavarga.classical import compute_ashtakavarga_classical

# ---------------------------------------------
# Expected Sarvashtakavarga totals (from provided example)
# ---------------------------------------------
EXPECTED_SARVA = [
    24, 30, 38, 32, 28, 28, 36, 31, 36, 40, 30, 35
]

# Expected Bhinnashtakavarga per sign, in the order [Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna]
EXPECTED_BHINNA = {
    "Aries": [2, 3, 1, 2, 4, 5, 3, 4],
    "Taurus": [3, 5, 4, 5, 5, 2, 1, 5],
    "Gemini": [5, 5, 4, 6, 7, 5, 2, 4],
    "Cancer": [6, 2, 5, 3, 2, 5, 5, 4],
    "Leo": [4, 3, 5, 6, 2, 3, 2, 3],
    "Virgo": [2, 5, 2, 2, 4, 5, 4, 4],
    "Libra": [4, 6, 2, 4, 5, 6, 5, 4],
    "Scorpio": [6, 3, 2, 6, 6, 3, 2, 3],
    "Sagittarius": [4, 4, 5, 6, 6, 5, 3, 3],
    "Capricorn": [6, 5, 4, 5, 5, 5, 6, 4],
    "Aquarius": [3, 4, 3, 7, 2, 3, 2, 6],
    "Pisces": [3, 4, 2, 5, 7, 5, 4, 5],
}

# Sign names in the same order as used in the computation
SIGNS = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
]

def test_ashtakavarga_regression_example():
    # Birth details from user
    dt_local = datetime.datetime(1987, 4, 2, 13, 40, 0)  # 01:40 PM local time
    tz_offset = 5.5  # IST = UTC + 5.5
    dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
    jd = datetime_to_julian(dt_utc)

    # Location: Ballia, Uttar Pradesh, India
    lat = 25.758503
    lon = 84.148911

    # Compute Ashtakavarga
    res = compute_ashtakavarga_classical(jd, lat, lon, mode="PV_NARASIMHA")

    # Check Sarvashtakavarga
    assert res["sarvashtakavarga"] == EXPECTED_SARVA, (
        f"Sarvashtakavarga mismatch: expected {EXPECTED_SARVA}, got {res['sarvashtakavarga']}"
    )

    # Check Bhinnashtakavarga for each sign and contributor
    for i, sign in enumerate(SIGNS):
        expected_row = EXPECTED_BHINNA[sign]
        # Build the computed row in the same contributor order
        computed = []
        for contributor in ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Lagna"]:
            computed.append(res["bhinnashtakavarga"][contributor][i])

        assert computed == expected_row, (
            f"Bhinnashtakavarga mismatch for sign {sign}: "
            f"expected {expected_row}, got {computed}"
        )
