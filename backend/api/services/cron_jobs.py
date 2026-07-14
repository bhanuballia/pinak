import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from core.database import profiles_collection
from api.services.firebase_admin import send_push_notification
from astronomy.julian import datetime_to_julian
from astronomy.positions import get_all_planetary_positions
from dasha.vimshottari import compute_vimshottari_full

scheduler = AsyncIOScheduler()

async def check_daily_transits():
    """Run daily at midnight to check micro-transits for all subscribed profiles."""
    print("[CRON] Running daily micro-transit checks...")
    try:
        # Get current UTC midnight
        now = datetime.datetime.utcnow()
        jd = datetime_to_julian(now)
        current_planets = get_all_planetary_positions(jd)
        transit_moon_sign = int(current_planets["Moon"]["sidereal"]["lon"] // 30)

        # Iterate through profiles with FCM tokens
        cursor = profiles_collection.find({"fcm_token": {"$exists": True, "$ne": None}})
        async for profile in cursor:
            token = profile.get("fcm_token")
            # Need to get their natal ascendant or moon sign.
            # Assuming reportData has planets.
            report_data = profile.get("reportData", {})
            planets = report_data.get("planets", [])
            
            natal_moon_sign = None
            for p in planets:
                if p["name"] == "Moon":
                    natal_moon_sign = int(p["normDegree"] // 30)
                    break
                    
            if natal_moon_sign is not None:
                # Calculate transit house from natal moon
                house_from_moon = ((transit_moon_sign - natal_moon_sign + 12) % 12) + 1
                
                # Simple logic for interesting transits
                title = ""
                body = ""
                if house_from_moon == 7:
                    title = "Moon in your 7th House! 💖"
                    body = "The Moon just entered your 7th house. A great time to focus on relationships and partnerships."
                elif house_from_moon == 10:
                    title = "Career Focus Today 🚀"
                    body = "The Moon is transiting your 10th house. Professional matters and public image take center stage."
                elif house_from_moon == 1:
                    title = "Moon in your 1st House 🌙"
                    body = "The Moon has returned to your natal Moon sign! Emotional renewal and focus on yourself."
                
                if title and body:
                    send_push_notification(token, title, body)
                    
    except Exception as e:
        print(f"[CRON ERROR] Daily transits failed: {e}")

async def check_weekly_dashas():
    """Run weekly to alert users of upcoming Dasha changes."""
    print("[CRON] Running weekly Dasha checks...")
    try:
        now = datetime.datetime.utcnow()
        next_week = now + datetime.timedelta(days=7)
        
        cursor = profiles_collection.find({"fcm_token": {"$exists": True, "$ne": None}})
        async for profile in cursor:
            token = profile.get("fcm_token")
            report_data = profile.get("reportData", {})
            birth_dt_str = f"{profile.get('date')} {profile.get('time')}"
            
            # Find natal moon
            planets = report_data.get("planets", [])
            natal_moon_lon = None
            for p in planets:
                if p["name"] == "Moon":
                    natal_moon_lon = p["normDegree"]
                    break
                    
            if natal_moon_lon is not None:
                try:
                    # Parse birth date
                    b_date = datetime.datetime.strptime(birth_dt_str, "%Y-%m-%d %H:%M")
                    b_jd = datetime_to_julian(b_date)
                    
                    # Compute dasha
                    dashas = compute_vimshottari_full(natal_moon_lon, b_jd)
                    
                    # Check if any mahadasha or antardasha is starting in the next 7 days
                    for md in dashas:
                        md_start = datetime.datetime.fromisoformat(md["start"])
                        if now <= md_start <= next_week:
                            send_push_notification(
                                token, 
                                f"Major Period Change! ⏳", 
                                f"Your {md['lord']} Mahadasha begins on {md_start.strftime('%b %d')}. Prepare for a major shift in life themes!"
                            )
                            break # Only send one alert
                            
                        for ad in md.get("antardashas", []):
                            ad_start = datetime.datetime.fromisoformat(ad["start"])
                            if now <= ad_start <= next_week:
                                send_push_notification(
                                    token, 
                                    f"New Sub-Period 📅", 
                                    f"Your {ad['lord']} Antardasha (under {md['lord']}) starts on {ad_start.strftime('%b %d')}."
                                )
                except Exception as ex:
                    print(f"[CRON ERROR] Dasha check failed for profile: {ex}")
    except Exception as e:
        print(f"[CRON ERROR] Weekly dashas failed: {e}")

def setup_cron_jobs():
    """Initialize and start the scheduler."""
    # Add daily transit job
    scheduler.add_job(check_daily_transits, 'cron', hour=0, minute=0, id='daily_transits')
    
    # Add weekly dasha job (e.g., every Sunday at 1 AM)
    scheduler.add_job(check_weekly_dashas, 'cron', day_of_week='sun', hour=1, minute=0, id='weekly_dashas')
    
    scheduler.start()
    print("[CRON] APScheduler started successfully.")
