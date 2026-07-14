import datetime

CHOGHADIYA_TYPES = ["Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"]

# Python's weekday(): 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
DAY_START_INDEX = {
    0: 3, # Monday: Amrit
    1: 6, # Tuesday: Rog
    2: 2, # Wednesday: Labh
    3: 5, # Thursday: Shubh
    4: 1, # Friday: Chal
    5: 4, # Saturday: Kaal
    6: 0  # Sunday: Udveg
}

def get_choghadiya_quality(name: str) -> str:
    if name in ["Amrit", "Shubh", "Labh"]:
        return "Good"
    elif name in ["Chal"]:
        return "Neutral"
    else:
        return "Bad"

def calculate_choghadiya(sunrise_dt: datetime.datetime, sunset_dt: datetime.datetime, next_sunrise_dt: datetime.datetime):
    """
    Calculates Day and Night Choghadiyas.
    Returns two lists of dictionaries for Day and Night.
    """
    weekday = sunrise_dt.weekday()
    
    # Calculate Dinamaan and Ratrimaan
    day_duration_secs = (sunset_dt - sunrise_dt).total_seconds()
    night_duration_secs = (next_sunrise_dt - sunset_dt).total_seconds()
    
    day_choghadiya_secs = day_duration_secs / 8.0
    night_choghadiya_secs = night_duration_secs / 8.0
    
    day_start_idx = DAY_START_INDEX[weekday]
    night_start_idx = (day_start_idx + 4) % 7
    
    day_choghadiyas = []
    current_time = sunrise_dt
    for i in range(8):
        name = CHOGHADIYA_TYPES[(day_start_idx + i) % 7]
        end_time = current_time + datetime.timedelta(seconds=day_choghadiya_secs)
        day_choghadiyas.append({
            "name": name,
            "quality": get_choghadiya_quality(name),
            "start": current_time.strftime("%I:%M %p"),
            "end": end_time.strftime("%I:%M %p")
        })
        current_time = end_time
        
    night_choghadiyas = []
    current_time = sunset_dt
    for i in range(8):
        name = CHOGHADIYA_TYPES[(night_start_idx + i) % 7]
        end_time = current_time + datetime.timedelta(seconds=night_choghadiya_secs)
        night_choghadiyas.append({
            "name": name,
            "quality": get_choghadiya_quality(name),
            "start": current_time.strftime("%I:%M %p"),
            "end": end_time.strftime("%I:%M %p")
        })
        current_time = end_time
        
    return {
        "day": day_choghadiyas,
        "night": night_choghadiyas
    }
