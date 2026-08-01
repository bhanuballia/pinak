from fastapi import APIRouter, HTTPException, Body, Query
from typing import Dict, Any
import datetime
from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart
from dasha.vimshottari import compute_vimshottari_full, VIM_ORDER, VIM_DUR
from core.analysis.shadbala_engine import compute_shadbala
from ashtakavarga.classical import compute_ashtakavarga_classical
from charts.divisional import build_varga_chart
from charts.divisional.d10 import build_d10_chart
from core.analysis.vimsopaka_pro_engine import run_vimsopaka_assessment

router = APIRouter()

def get_active_dasha(birth_jd: float, moon_lon: float, target_jd: float) -> str:
    dashas = compute_vimshottari_full(birth_jd, moon_lon, years_ahead=120.0)
    
    active_maha = None
    active_antar = None
    active_pratyantar = None
    
    for maha in dashas:
        if maha["start_jd"] <= target_jd < maha["end_jd"]:
            active_maha = maha["lord"]
            for antar in maha["antardashas"]:
                if antar["start_jd"] <= target_jd < antar["end_jd"]:
                    active_antar = antar["lord"]
                    
                    # Calculate pratyantardasha manually
                    pt_start = antar["start_jd"]
                    antar_dur = antar["duration_years"]
                    start_idx = VIM_ORDER.index(active_antar)
                    for i in range(9):
                        pt_lord = VIM_ORDER[(start_idx + i) % 9]
                        pt_frac = VIM_DUR[pt_lord] / 120.0
                        pt_dur = antar_dur * pt_frac
                        pt_end = pt_start + pt_dur * 365.2425
                        if pt_start <= target_jd < pt_end:
                            active_pratyantar = pt_lord
                            break
                        pt_start = pt_end
                    break
            break
            
    if not active_maha:
        return "Unknown"
        
    return f"{active_maha} - {active_antar} - {active_pratyantar}"

@router.post("/time_machine")
def transit_time_machine(payload: Dict[str, Any] = Body(...)):
    try:
        b_date = payload["birth_date"]
        b_time = payload["birth_time"]
        b_lat = float(payload["lat"])
        b_lon = float(payload["lon"])
        b_tz = float(payload.get("tz_offset", 0.0))
        
        t_date = payload["transit_date"]
        t_time = payload.get("transit_time", "12:00:00")
        
        # Birth JD
        by, bm, bd = [int(x) for x in b_date.split("-")]
        btp = [int(x) for x in b_time.split(":")]
        b_dt_local = datetime.datetime(by, bm, bd, btp[0], btp[1], btp[2] if len(btp) > 2 else 0)
        b_dt_utc = b_dt_local - datetime.timedelta(hours=b_tz)
        b_jd_ut = datetime_to_julian(b_dt_utc)
        
        # Transit JD
        ty, tm, td = [int(x) for x in t_date.split("-")]
        ttp = [int(x) for x in t_time.split(":")]
        t_dt_local = datetime.datetime(ty, tm, td, ttp[0], ttp[1], ttp[2] if len(ttp) > 2 else 0)
        # Using birth tz offset for transit location since it's a simplification
        t_dt_utc = t_dt_local - datetime.timedelta(hours=b_tz)
        t_jd_ut = datetime_to_julian(t_dt_utc)
        
        # We only need transit houses and planets
        transit_chart = build_rashi_chart(t_jd_ut, b_lat, b_lon)
        birth_chart = build_rashi_chart(b_jd_ut, b_lat, b_lon)
        
        moon_lon = birth_chart["planet_positions"]["Moon"]["sidereal"]["lon"]
        dasha_string = get_active_dasha(b_jd_ut, moon_lon, t_jd_ut)
        
        varga_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 16, 20, 24, 27, 30, 40, 45, 60]
        b_vargas = {}
        b_vargas["d10"] = build_d10_chart(b_jd_ut, b_lat, b_lon, house_system="W", style="north")
        for d in varga_list:
            b_vargas[f"d{d}"] = build_varga_chart(
                d, b_jd_ut, b_lat, b_lon, 
                house_system="W", style="north",
                planet_positions=birth_chart["planet_positions"]
            )
            
        birth_vimsopaka = run_vimsopaka_assessment(b_vargas, birth_chart, {})
        
        return {
            "transit_houses": transit_chart.get("houses", {}),
            "transit_planets": transit_chart.get("planet_positions", {}),
            "birth_houses": birth_chart.get("houses", {}),
            "birth_planets": birth_chart.get("planet_positions", {}),
            "active_dasha": dasha_string,
            "transit_shadbala": compute_shadbala(transit_chart),
            "birth_shadbala": compute_shadbala(birth_chart),
            "birth_av": compute_ashtakavarga_classical(b_jd_ut, b_lat, b_lon),
            "birth_vimsopaka": birth_vimsopaka
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/predictions_advanced")
def get_predictions_advanced(
    date: str = Query(None, description="Start date YYYY-MM-DD"),
    days_ahead: int = Query(30, description="Days ahead to forecast")
):
    try:
        # Resolve start date
        if date:
            start_dt = datetime.datetime.fromisoformat(date)
        else:
            start_dt = datetime.datetime.utcnow()
            
        from astronomy.positions import get_all_planetary_positions
        from astronomy.julian import datetime_to_julian
        
        RASHI_INFO = {
            1: {"en": "Aries", "hi": "मेष"},
            2: {"en": "Taurus", "hi": "वृषभ"},
            3: {"en": "Gemini", "hi": "मिथुन"},
            4: {"en": "Cancer", "hi": "कर्क"},
            5: {"en": "Leo", "hi": "सिंह"},
            6: {"en": "Virgo", "hi": "कन्या"},
            7: {"en": "Libra", "hi": "तुला"},
            8: {"en": "Scorpio", "hi": "वृश्चिक"},
            9: {"en": "Sagittarius", "hi": "धनु"},
            10: {"en": "Capricorn", "hi": "मकर"},
            11: {"en": "Aquarius", "hi": "कुंभ"},
            12: {"en": "Pisces", "hi": "मीन"}
        }

        # Daily scanning
        daily_yogas = []
        for d in range(days_ahead):
            current_dt = start_dt + datetime.timedelta(days=d)
            # Set to noon to avoid boundary shifts
            noon_dt = datetime.datetime(current_dt.year, current_dt.month, current_dt.day, 12, 0, 0)
            jd = datetime_to_julian(noon_dt)
            
            try:
                positions = get_all_planetary_positions(jd)
            except Exception:
                continue
                
            # Map planet to sign index (0-11)
            planet_signs = {}
            for p_name, p_data in positions.items():
                lon = p_data.get("sidereal", {}).get("lon")
                if lon is not None:
                    planet_signs[p_name] = int(lon // 30)
            
            # Detect yogas for this day
            active_today = []
            
            planets_list = ["Sun", "Mars", "Mercury", "Venus", "Jupiter", "Saturn", "Rahu", "Ketu", "Moon"]
            
            for i in range(len(planets_list)):
                for j in range(i + 1, len(planets_list)):
                    p1 = planets_list[i]
                    p2 = planets_list[j]
                    if p1 not in planet_signs or p2 not in planet_signs:
                        continue
                        
                    s1 = planet_signs[p1]
                    s2 = planet_signs[p2]
                    
                    diff = (s2 - s1) % 12
                    diff_reverse = (s1 - s2) % 12
                    
                    # 1. Shadashtak Yoga (6/8)
                    if (diff == 5 or diff == 7) and p1 != "Moon" and p2 != "Moon":
                        active_today.append({
                            "type": "Shadashtak",
                            "name_en": f"Shadashtak Yoga ({p1}-{p2})",
                            "name_hi": f"षडाष्टक योग ({p1}-{p2})",
                            "p1": p1,
                            "p2": p2,
                            "s1": s1,
                            "s2": s2,
                            "is_benefic": False,
                            "desc_en": f"A challenging 6/8 relationship forms between {p1} and {p2}, suggesting friction and warning signs.",
                            "desc_hi": f"{p1} और {p2} के बीच ६/८ का सम्बन्ध बन रहा है, जो आपसी तनाव और सतर्कता का संकेत देता है।"
                        })
                        
                    # 2. Dwishwirdhan (2/12)
                    elif (diff == 1 or diff == 11) and p1 != "Moon" and p2 != "Moon":
                        active_today.append({
                            "type": "Dwishwirdhan",
                            "name_en": f"Dwishwirdhan Yoga ({p1}-{p2})",
                            "name_hi": f"द्विद्वादश योग ({p1}-{p2})",
                            "p1": p1,
                            "p2": p2,
                            "s1": s1,
                            "s2": s2,
                            "is_benefic": False,
                            "desc_en": f"A 2/12 relationship between {p1} and {p2} can trigger sudden expenses or shifts.",
                            "desc_hi": f"{p1} और {p2} के बीच २/१२ का सम्बन्ध अचानक खर्च या बदलाव को दर्शा सकता है।"
                        })
                        
                    # 3. Conjunction (Yuti)
                    elif diff == 0:
                        # Specific yogas
                        if (p1 == "Jupiter" and p2 == "Rahu") or (p1 == "Rahu" and p2 == "Jupiter"):
                            active_today.append({
                                "type": "GuruChandal",
                                "name_en": "Guru Chandal Yoga",
                                "name_hi": "गुरु चांडाल योग",
                                "p1": p1,
                                "p2": p2,
                                "s1": s1,
                                "s2": s2,
                                "is_benefic": False,
                                "desc_en": "Jupiter and Rahu join in the same sign, indicating ethical checks and spiritual lessons.",
                                "desc_hi": "बृहस्पति और राहु एक ही राशि में स्थित हैं, जो नैतिक और आध्यात्मिक परीक्षाओं की ओर इशारा करता है।"
                            })
                        elif (p1 == "Mars" and p2 == "Rahu") or (p1 == "Rahu" and p2 == "Mars"):
                            active_today.append({
                                "type": "Angarak",
                                "name_en": "Angarak Yoga",
                                "name_hi": "अंगारक योग",
                                "p1": p1,
                                "p2": p2,
                                "s1": s1,
                                "s2": s2,
                                "is_benefic": False,
                                "desc_en": "Mars and Rahu create impulsive energy. Avoid disputes and accidents.",
                                "desc_hi": "मंगल और राहु आक्रामक ऊर्जा पैदा करते हैं। विवादों और दुर्घटनाओं से बचें।"
                            })
                        elif (p1 == "Mercury" and p2 == "Venus") or (p1 == "Venus" and p2 == "Mercury"):
                            active_today.append({
                                "type": "LaxmiNarayan",
                                "name_en": "Laxmi Narayan Yoga",
                                "name_hi": "लक्ष्मी नारायण योग",
                                "p1": p1,
                                "p2": p2,
                                "s1": s1,
                                "s2": s2,
                                "is_benefic": True,
                                "desc_en": "A highly auspicious conjunction of Mercury and Venus bringing creativity, luxury, and success.",
                                "desc_hi": "बुध और शुक्र की अत्यंत शुभ युति जो रचनात्मकता, सुख-सुविधा और सफलता लाती है।"
                            })
                        elif (p1 == "Sun" and p2 == "Mercury") or (p1 == "Mercury" and p2 == "Sun"):
                            active_today.append({
                                "type": "Budhaditya",
                                "name_en": "Budhaditya Yoga",
                                "name_hi": "बुधादित्य योग",
                                "p1": p1,
                                "p2": p2,
                                "s1": s1,
                                "s2": s2,
                                "is_benefic": True,
                                "desc_en": "Sun and Mercury join, boosting intellect, career recognition, and wisdom.",
                                "desc_hi": "सूर्य और बुध की युति बुद्धि, मान-सम्मान और ज्ञान को बढ़ाती है।"
                            })
                            
                    # 4. Gaja Kesari (Moon - Jupiter Kendra)
                    if (p1 == "Moon" and p2 == "Jupiter") or (p1 == "Jupiter" and p2 == "Moon"):
                        if diff in [0, 3, 6, 9]:
                            active_today.append({
                                "type": "GajaKesari",
                                "name_en": "Gaja Kesari Yoga",
                                "name_hi": "गज केसरि योग",
                                "p1": p1,
                                "p2": p2,
                                "s1": s1,
                                "s2": s2,
                                "is_benefic": True,
                                "desc_en": "Jupiter and Moon are in mutual Kendra, bringing wisdom, stability, and fortune.",
                                "desc_hi": "गुरु और चंद्र एक-दूसरे से केंद्र में हैं, जो बुद्धि, मानसिक स्थिरता और भाग्य लाते हैं।"
                            })
            
            daily_yogas.append({
                "date": current_dt.strftime("%Y-%m-%d"),
                "yogas": active_today
            })
            
        # Group contiguous yogas
        events = []
        active_events = {} # key -> event data
        
        for day_idx, day_data in enumerate(daily_yogas):
            day_str = day_data["date"]
            today_keys = set()
            
            for y in day_data["yogas"]:
                # Unique key for tracking
                key = f"{y['type']}_{y['p1']}_{y['p2']}_{y['s1']}_{y['s2']}"
                today_keys.add(key)
                
                if key in active_events:
                    # Update end date
                    active_events[key]["end_date"] = day_str
                else:
                    # Create new event
                    active_events[key] = {
                        "type": y["type"],
                        "name_en": y["name_en"],
                        "name_hi": y["name_hi"],
                        "p1": y["p1"],
                        "p2": y["p2"],
                        "s1": y["s1"],
                        "s2": y["s2"],
                        "is_benefic": y["is_benefic"],
                        "desc_en": y["desc_en"],
                        "desc_hi": y["desc_hi"],
                        "start_date": day_str,
                        "end_date": day_str
                    }
                    
            # Finalize events that are no longer active
            finished_keys = [k for k in active_events.keys() if k not in today_keys]
            for k in finished_keys:
                events.append(active_events.pop(k))
                
        # Finalize remaining active events
        for k, ev in active_events.items():
            events.append(ev)
            
        # Sort events by start_date
        events.sort(key=lambda x: x["start_date"])
        
        # Calculate Rashi impacts for each event
        for ev in events:
            s1 = ev["s1"]
            s2 = ev["s2"]
            is_benefic = ev["is_benefic"]
            
            rashi_impacts = {}
            for r_idx in range(1, 13):
                r_val = r_idx - 1 # 0-indexed sign
                h1 = (s1 - r_val) % 12 + 1
                h2 = (s2 - r_val) % 12 + 1
                
                # Check life areas
                areas = []
                if h1 in [2, 5, 11, 12] or h2 in [2, 5, 11, 12]:
                    areas.append({"en": "Finance", "hi": "आर्थिक"})
                if h1 in [5, 7, 8, 12] or h2 in [5, 7, 8, 12]:
                    areas.append({"en": "Relationships", "hi": "प्रेम और संबंध"})
                if h1 in [1, 6, 8, 12] or h2 in [1, 6, 8, 12]:
                    areas.append({"en": "Health", "hi": "स्वास्थ्य"})
                if h1 in [3, 10, 11] or h2 in [3, 10, 11]:
                    areas.append({"en": "Career", "hi": "करियर"})
                    
                # Determine alert status
                status = "Neutral"
                status_hi = "सामान्य"
                if not is_benefic:
                    if h1 in [6, 8, 12] or h2 in [6, 8, 12]:
                        status = "Caution"
                        status_hi = "सतर्क रहें"
                else:
                    if h1 in [1, 5, 9, 10, 11] or h2 in [1, 5, 9, 10, 11]:
                        status = "Favorable"
                        status_hi = "शुभ और लाभकारी"
                        
                rashi_impacts[str(r_idx)] = {
                    "rashi_name_en": RASHI_INFO[r_idx]["en"],
                    "rashi_name_hi": RASHI_INFO[r_idx]["hi"],
                    "status": status,
                    "status_hi": status_hi,
                    "areas": areas
                }
            ev["rashi_impacts"] = rashi_impacts
            
        return {"success": True, "forecast": events}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
