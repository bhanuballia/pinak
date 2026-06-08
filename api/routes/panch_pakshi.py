from fastapi import APIRouter, HTTPException, Body
from typing import Dict
import datetime
from astronomy.julian import datetime_to_julian
from panchang.tithi_yoga_karana import compute_nakshatra, compute_tithi
from panch_pakshi.sunrise_engine import get_sunrise_sunset
from panch_pakshi.bird_calculator import calculate_birth_bird
from panch_pakshi.ai_timing_engine import calculate_timing_score
from panch_pakshi.timing_alerts import generate_alert
from panch_pakshi.constants import (
    SHUKLA_DAY_BIRDS,
    SHUKLA_NIGHT_BIRDS,
    KRISHNA_DAY_BIRDS,
    KRISHNA_NIGHT_BIRDS,
    SHUKLA_DAY_ACTIVITIES,
    SHUKLA_NIGHT_ACTIVITIES,
    KRISHNA_DAY_ACTIVITIES,
    KRISHNA_NIGHT_ACTIVITIES,
    APAHARA_WEIGHTS
)

router = APIRouter()

def generate_period_timeline(
    start_dt: datetime.datetime,
    end_dt: datetime.datetime,
    birds_seq,
    acts_seq,
    ruling_act_idx: int,
    birth_bird: str,
    w: int
):
    duration = (end_dt - start_dt).total_seconds()
    yama_duration = duration / 5.0
    
    b_idx = birds_seq.index(birth_bird)
    
    timeline = []
    
    # Starting activity index for birth bird
    starting_act_idx = (b_idx + w) % 5
    
    # We have 5 major Yamas
    for j in range(5):
        yama_start = start_dt + datetime.timedelta(seconds=j * yama_duration)
        yama_end = start_dt + datetime.timedelta(seconds=(j + 1) * yama_duration)
        
        # Main activity of the birth bird in this yama
        main_act_idx = (starting_act_idx + j) % 5
        main_activity = acts_seq[main_act_idx]
        
        # Determine the ruling bird of this yama
        ruling_bird_idx = (ruling_act_idx - w - j) % 5
        ruling_bird_yama = birds_seq[ruling_bird_idx]
        
        # Sub-activities of our birth bird (cyclic shift starting with main_activity)
        sub_activities = [acts_seq[(main_act_idx + sub_idx) % 5] for sub_idx in range(5)]
        sub_weights = [APAHARA_WEIGHTS[act] for act in sub_activities]
        total_weight = sum(sub_weights) # always 12.0
        
        # Proportional durations of the 5 apaharas
        sub_durations = [yama_duration * (weight / total_weight) for weight in sub_weights]
        
        # Sub-birds (cyclic shift of birds_seq starting with ruling_bird_yama)
        sub_birds = [birds_seq[(ruling_bird_idx + sub_idx) % 5] for sub_idx in range(5)]
        
        current_time = yama_start
        for sub_idx in range(5):
            apahara_start = current_time
            apahara_end = current_time + datetime.timedelta(seconds=sub_durations[sub_idx])
            current_time = apahara_end
            
            sub_bird = sub_birds[sub_idx]
            sub_activity = sub_activities[sub_idx]
            
            # Determine relationship of birth bird to the sub_bird
            b_index_seq = birds_seq.index(birth_bird)
            sb_index_seq = birds_seq.index(sub_bird)
            diff = (sb_index_seq - b_index_seq) % 5
            
            if diff == 0:
                relationship = "Self"
            elif diff in [1, 4]:
                relationship = "Friend"
            else:
                relationship = "Enemy"
                
            score = calculate_timing_score(sub_activity, relationship)
            alert = generate_alert(sub_activity)
            
            timeline.append({
                "yama": j + 1,
                "apahara": sub_idx + 1,
                "start": apahara_start.isoformat(),
                "end": apahara_end.isoformat(),
                "sub_bird": sub_bird,
                "activity": sub_activity,
                "relationship": relationship,
                "score": score,
                "alert": alert
            })
            
    return timeline

@router.post("/")
def api_panch_pakshi(payload: Dict = Body(...)):
    try:
        # Transit details
        date = payload["date"]
        time = payload.get("time", "12:00:00")
        tz_offset = float(payload.get("tz_offset", 5.5))
        lat = float(payload.get("lat", 28.6139))
        lon = float(payload.get("lon", 77.2090))
        
        # Birth details (default to transit details if not provided)
        birth_date = payload.get("birth_date", date)
        birth_time = payload.get("birth_time", time)
        birth_tz_offset = float(payload.get("birth_tz_offset", tz_offset))
    except (KeyError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Invalid payload details: {e}")

    # 1. Compute Birth Nakshatra and Birth Paksha to determine Birth Bird
    try:
        by, bm, bd = [int(x) for x in birth_date.split("-")]
        btp = [int(x) for x in birth_time.split(":")]
        bdt_local = datetime.datetime(by, bm, bd, btp[0], btp[1], btp[2] if len(btp) > 2 else 0)
        bdt_utc = bdt_local - datetime.timedelta(hours=birth_tz_offset)
        jd_birth = datetime_to_julian(bdt_utc)
        
        nak_info = compute_nakshatra(jd_birth)
        nak_num = nak_info["nakshatra_index"] + 1
        
        tithi_info = compute_tithi(jd_birth)
        birth_tithi_idx = tithi_info["tithi_index"]
        birth_paksha = "Shukla" if birth_tithi_idx < 15 else "Krishna"
        
        birth_bird = calculate_birth_bird(nak_num, birth_paksha)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate birth details: {e}")

    # 2. Compute dynamic solar boundaries (Sunrise / Sunset) for query location & date
    try:
        qy, qm, qd = [int(x) for x in date.split("-")]
        query_date_local = datetime.date(qy, qm, qd)
        
        sunrise_dt, sunset_dt = get_sunrise_sunset(lat, lon, query_date_local, tz_offset)
        
        # Night bounds: sunset of query date to sunrise of next day
        next_date_local = query_date_local + datetime.timedelta(days=1)
        sunrise_next_dt, _ = get_sunrise_sunset(lat, lon, next_date_local, tz_offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate solar boundaries: {e}")

    # 3. Determine query Paksha and weekday
    try:
        # We check Paksha at the query time
        qtp = [int(x) for x in time.split(":")]
        qdt_local = datetime.datetime(qy, qm, qd, qtp[0], qtp[1], qtp[2] if len(qtp) > 2 else 0)
        qdt_utc = qdt_local - datetime.timedelta(hours=tz_offset)
        jd_query = datetime_to_julian(qdt_utc)
        
        query_tithi_info = compute_tithi(jd_query)
        query_tithi_idx = query_tithi_info["tithi_index"]
        query_paksha = "Shukla" if query_tithi_idx < 15 else "Krishna"
        
        # Sunday-based weekday index (0=Sun, 6=Sat)
        w = (query_date_local.weekday() + 1) % 7
        WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        query_weekday_name = WEEKDAY_NAMES[w]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate query astrometrics: {e}")

    # 4. Determine overall Ruling/Dying Birds for Day and Night
    if query_paksha == "Shukla":
        day_birds = SHUKLA_DAY_BIRDS
        day_acts = SHUKLA_DAY_ACTIVITIES
        day_ruling_bird = SHUKLA_DAY_BIRDS[w % 5]
        day_dying_bird = SHUKLA_DAY_BIRDS[(w + 1) % 5]
        
        night_birds = SHUKLA_NIGHT_BIRDS
        night_acts = SHUKLA_NIGHT_ACTIVITIES
        night_ruling_bird = SHUKLA_NIGHT_BIRDS[(w + 4) % 5]
        night_dying_bird = SHUKLA_NIGHT_BIRDS[w % 5]
    else:
        day_birds = KRISHNA_DAY_BIRDS
        day_acts = KRISHNA_DAY_ACTIVITIES
        day_ruling_bird = KRISHNA_DAY_BIRDS[(1 - w) % 5]
        day_dying_bird = KRISHNA_DAY_BIRDS[(4 - w) % 5]
        
        night_birds = KRISHNA_NIGHT_BIRDS
        night_acts = KRISHNA_NIGHT_ACTIVITIES
        night_ruling_bird = KRISHNA_NIGHT_BIRDS[(0 - w) % 5]
        night_dying_bird = KRISHNA_NIGHT_BIRDS[(4 - w) % 5]

    # 5. Generate parallel Day & Night Timelines
    day_timeline = generate_period_timeline(
        sunrise_dt,
        sunset_dt,
        day_birds,
        day_acts,
        day_acts.index("Ruling"),
        birth_bird,
        w
    )
    
    night_timeline = generate_period_timeline(
        sunset_dt,
        sunrise_next_dt,
        night_birds,
        night_acts,
        night_acts.index("Ruling"),
        birth_bird,
        w
    )

    return {
        "birth_bird": birth_bird,
        "nakshatra_name": nak_info["nakshatra_name"],
        "birth_paksha": birth_paksha,
        "query_paksha": query_paksha,
        "query_date": date,
        "query_time": time,
        "query_weekday": query_weekday_name,
        "sunrise": sunrise_dt.isoformat(),
        "sunset": sunset_dt.isoformat(),
        "sunrise_next": sunrise_next_dt.isoformat(),
        "day_ruling_bird": day_ruling_bird,
        "day_dying_bird": day_dying_bird,
        "night_ruling_bird": night_ruling_bird,
        "night_dying_bird": night_dying_bird,
        "day_timeline": day_timeline,
        "night_timeline": night_timeline
    }

