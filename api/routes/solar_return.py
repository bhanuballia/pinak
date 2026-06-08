from fastapi import APIRouter, HTTPException, Body
from typing import Dict
import datetime

from charts.rashi_chart import build_rashi_chart
from astronomy.julian import datetime_to_julian

router = APIRouter()

def get_chart_data(dt_local: datetime.datetime, tz_offset: float, lat: float, lon: float):
    dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
    jd_ut = datetime_to_julian(dt_utc)
    chart = build_rashi_chart(jd_ut, lat, lon, house_system="W", style="north")
    return chart["houses"]

def get_age_and_month(birth_dt: datetime.datetime, target_dt: datetime.datetime):
    age = target_dt.year - birth_dt.year
    try:
        birthday_this_year = datetime.datetime(target_dt.year, birth_dt.month, birth_dt.day, birth_dt.hour, birth_dt.minute, birth_dt.second)
    except ValueError:
        # Handle leap year
        birthday_this_year = datetime.datetime(target_dt.year, birth_dt.month, birth_dt.day - 1, birth_dt.hour, birth_dt.minute, birth_dt.second)
        
    if target_dt < birthday_this_year:
        age -= 1
        try:
            last_birthday = datetime.datetime(target_dt.year - 1, birth_dt.month, birth_dt.day, birth_dt.hour, birth_dt.minute, birth_dt.second)
        except ValueError:
            last_birthday = datetime.datetime(target_dt.year - 1, birth_dt.month, birth_dt.day - 1, birth_dt.hour, birth_dt.minute, birth_dt.second)
    else:
        last_birthday = birthday_this_year
        
    delta = target_dt - last_birthday
    month = int(delta.days / 30.436875) + 1
    
    return age, month

@router.post("/calculate")
def calculate_solar_return(payload: Dict = Body(...)):
    try:
        date = payload.get("date", "2000-01-01")
        time = payload.get("time", "12:00:00")
        lat = float(payload.get("lat", 28.6139))
        lon = float(payload.get("lon", 77.2090))
        tz_offset = float(payload.get("tz_offset", 5.5))
        
        y, m, d = [int(x) for x in date.split("-")]
        tp = [int(x) for x in time.split(":")]
        birth_dt = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
        
        # 1. Birth Chart
        birth_chart = {
            "title": "Birth Chart",
            "houses": get_chart_data(birth_dt, tz_offset, lat, lon)
        }

        # Calculate for "now"
        now = datetime.datetime.now()
        
        # 2. Progression Charts (Last month, Current, Next)
        last_month = now - datetime.timedelta(days=30)
        current_month = now
        next_month = now + datetime.timedelta(days=30)

        fmt = "%d %b %Y %H:%M:%S"
        
        last_y, last_m = get_age_and_month(birth_dt, last_month)
        curr_y, curr_m = get_age_and_month(birth_dt, current_month)
        next_y, next_m = get_age_and_month(birth_dt, next_month)
        
        prog_charts = [
            {
                "title": f"Progression ({last_y}/{last_m}m) {last_month.strftime(fmt)}",
                "houses": get_chart_data(last_month, tz_offset, lat, lon)
            },
            {
                "title": f"Progression ({curr_y}/{curr_m}m) {current_month.strftime(fmt)}",
                "houses": get_chart_data(current_month, tz_offset, lat, lon)
            },
            {
                "title": f"Progression ({next_y}/{next_m}m) {next_month.strftime(fmt)}",
                "houses": get_chart_data(next_month, tz_offset, lat, lon)
            }
        ]

        # 3. Local Progression Charts
        location_name = payload.get("location_name", "Delhi")
        
        local_charts = [
            {
                "title": f"Progression ({location_name} {last_y}/{last_m}m) {last_month.strftime(fmt)}",
                "houses": get_chart_data(last_month, tz_offset, lat, lon)
            },
            {
                "title": f"Progression ({location_name} {curr_y}/{curr_m}m) {current_month.strftime(fmt)}",
                "houses": get_chart_data(current_month, tz_offset, lat, lon)
            },
            {
                "title": f"Progression ({location_name} {next_y}/{next_m}m) {next_month.strftime(fmt)}",
                "houses": get_chart_data(next_month, tz_offset, lat, lon)
            }
        ]
        
        return {
            "birth_chart": birth_chart,
            "progression_charts": prog_charts,
            "local_charts": local_charts,
            "user_info": f"{payload.get('name', 'Native')}  {date} {time}"
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate_daily")
def calculate_daily_return(payload: Dict = Body(...)):
    try:
        date = payload.get("date", "2000-01-01")
        time = payload.get("time", "12:00:00")
        lat = float(payload.get("lat", 28.6139))
        lon = float(payload.get("lon", 77.2090))
        tz_offset = float(payload.get("tz_offset", 5.5))
        
        y, m, d = [int(x) for x in date.split("-")]
        tp = [int(x) for x in time.split(":")]
        birth_dt = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
        
        # 1. Birth Chart
        birth_chart = {
            "title": "Birth Chart",
            "houses": get_chart_data(birth_dt, tz_offset, lat, lon)
        }

        # Calculate for "now"
        now = datetime.datetime.now()
        
        # 2. Daily Progression Charts (Yesterday, Today, Tomorrow)
        yesterday = now - datetime.timedelta(days=1)
        today = now
        tomorrow = now + datetime.timedelta(days=1)

        fmt = "%d %b %Y %H:%M:%S"
        
        last_y, last_m = get_age_and_month(birth_dt, yesterday)
        curr_y, curr_m = get_age_and_month(birth_dt, today)
        next_y, next_m = get_age_and_month(birth_dt, tomorrow)
        
        # Instead of '38/4m', we can just use the actual date label as requested: 'Daily Progression Yesterday', etc.
        # But to match format exactly:
        
        prog_charts = [
            {
                "title": f"Progression (Yesterday) {yesterday.strftime(fmt)}",
                "houses": get_chart_data(yesterday, tz_offset, lat, lon)
            },
            {
                "title": f"Progression (Today) {today.strftime(fmt)}",
                "houses": get_chart_data(today, tz_offset, lat, lon)
            },
            {
                "title": f"Progression (Tomorrow) {tomorrow.strftime(fmt)}",
                "houses": get_chart_data(tomorrow, tz_offset, lat, lon)
            }
        ]

        # 3. Local Progression Charts
        location_name = payload.get("location_name", "Delhi")
        
        local_charts = [
            {
                "title": f"Progression ({location_name} Yesterday) {yesterday.strftime(fmt)}",
                "houses": get_chart_data(yesterday, tz_offset, lat, lon)
            },
            {
                "title": f"Progression ({location_name} Today) {today.strftime(fmt)}",
                "houses": get_chart_data(today, tz_offset, lat, lon)
            },
            {
                "title": f"Progression ({location_name} Tomorrow) {tomorrow.strftime(fmt)}",
                "houses": get_chart_data(tomorrow, tz_offset, lat, lon)
            }
        ]
        
        return {
            "birth_chart": birth_chart,
            "progression_charts": prog_charts,
            "local_charts": local_charts,
            "user_info": f"{payload.get('name', 'Native')}  {date} {time}"
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate_annual")
def calculate_annual_return(payload: Dict = Body(...)):
    try:
        date = payload.get("date", "2000-01-01")
        time = payload.get("time", "12:00:00")
        lat = float(payload.get("lat", 28.6139))
        lon = float(payload.get("lon", 77.2090))
        tz_offset = float(payload.get("tz_offset", 5.5))
        location_name = payload.get("location_name", "Delhi")
        
        y, m, d = [int(x) for x in date.split("-")]
        tp = [int(x) for x in time.split(":")]
        birth_dt = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
        
        # 1. Birth Chart
        birth_chart = {
            "title": "Birth Chart",
            "houses": get_chart_data(birth_dt, tz_offset, lat, lon)
        }

        # Calculate for "now"
        now = datetime.datetime.now()
        
        # We need 8 charts: 3 years back to 4 years forward
        # Let's approximate the solar return by just adding/subtracting years from current year
        
        fmt = "%d %b %Y %H:%M:%S"
        
        annual_charts = []
        
        for offset in range(-3, 5):
            target_year = now.year + offset
            try:
                target_dt = datetime.datetime(target_year, birth_dt.month, birth_dt.day, birth_dt.hour, birth_dt.minute, birth_dt.second)
            except ValueError:
                target_dt = datetime.datetime(target_year, birth_dt.month, birth_dt.day - 1, birth_dt.hour, birth_dt.minute, birth_dt.second)
                
            age, month_val = get_age_and_month(birth_dt, target_dt)
            
            annual_charts.append({
                "title": f"Progression ({location_name} {age}) {target_dt.strftime(fmt)}",
                "houses": get_chart_data(target_dt, tz_offset, lat, lon)
            })
        
        return {
            "birth_chart": birth_chart,
            "annual_charts": annual_charts,
            "user_info": f"{payload.get('name', 'Native')}  {date} {time}"
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
