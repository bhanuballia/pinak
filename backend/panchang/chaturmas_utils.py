"""
Chaturmas Date Range Helper
Chaturmas begins on Ashadha Shukla Ekadashi (Devshayani Ekadashi) and concludes on Kartika Shukla Ekadashi (Devuthani / Prabodhini Ekadashi).
Verified Standard Dates for 2024–2030 (Drik Panchang / Traditional Vedic Almanac):
"""

import datetime
from typing import Optional

# Exact Gregorian Start and Concluding Dates for Chaturmas by Year
CHATURMAS_BOUNDS = {
    2024: (datetime.date(2024, 7, 17), datetime.date(2024, 11, 12)),
    2025: (datetime.date(2025, 7, 6),  datetime.date(2025, 11, 2)),
    2026: (datetime.date(2026, 7, 24), datetime.date(2026, 11, 20)),
    2027: (datetime.date(2027, 7, 14), datetime.date(2027, 11, 10)),
    2028: (datetime.date(2028, 7, 3),  datetime.date(2028, 10, 29)),
    2029: (datetime.date(2029, 7, 22), datetime.date(2029, 11, 17)),
    2030: (datetime.date(2030, 7, 11), datetime.date(2030, 11, 6)),
}

def is_date_in_chaturmas(check_date: datetime.date, sun_lon: Optional[float] = None) -> bool:
    """
    Returns True if check_date is strictly inside the Chaturmas period.
    Chaturmas is active from Devshayani Ekadashi up to and including Devuthani Ekadashi.
    After Devuthani Ekadashi concludes, sacred sanskars resume.
    """
    year = check_date.year
    if year in CHATURMAS_BOUNDS:
        start_d, end_d = CHATURMAS_BOUNDS[year]
        return start_d <= check_date <= end_d
    
    # Fallback using sidereal Sun longitude: 90° (Cancer entry / mid-July) to 215° (Scorpio entry / late-Nov)
    if sun_lon is not None:
        return 90.0 <= sun_lon <= 214.5
    return False
