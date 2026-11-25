import datetime
from dateutil import parser
from astronomy.julian import datetime_to_julian

def parse_flexible_datetime(date_val, time_val, default_time=(12, 0, 0)):
    """
    Robustly parses various date and time formats including ISO strings,
    slashes, timestamps, and 12-hour AM/PM formats into a naive local datetime.
    """
    # 1. Parse date
    d_obj = None
    if isinstance(date_val, (datetime.date, datetime.datetime)):
        d_obj = date_val
    elif isinstance(date_val, str):
        date_clean = date_val.strip()
        # Handle ISO with T (e.g. 1990-01-01T00:00:00.000Z)
        if 'T' in date_clean:
            date_clean = date_clean.split('T')[0]
        try:
            d_obj = parser.parse(date_clean, dayfirst=False)
        except Exception:
            try:
                d_obj = parser.parse(date_clean, dayfirst=True)
            except Exception:
                d_obj = datetime.datetime(1990, 1, 1)
    else:
        d_obj = datetime.datetime(1990, 1, 1)

    # 2. Parse time
    h, m, s = default_time
    if isinstance(time_val, datetime.time):
        h, m, s = time_val.hour, time_val.minute, time_val.second
    elif isinstance(time_val, str):
        t_clean = time_val.strip()
        try:
            t_parsed = parser.parse(t_clean).time()
            h, m, s = t_parsed.hour, t_parsed.minute, t_parsed.second
        except Exception:
            pass

    return datetime.datetime(d_obj.year, d_obj.month, d_obj.day, h, m, s)
