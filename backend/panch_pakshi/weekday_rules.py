# panch_pakshi/weekday_rules.py

from datetime import datetime

def get_weekday(dt: datetime) -> int:
    return dt.weekday()
