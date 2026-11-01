# api/routes/hundred_page_bridge.py
"""
High-Speed 100-Page Kundali Engine Bridge.
Computes deterministic astronomical calculations (Swiss Ephemeris):
- Pages 1-10: Basic Info, Lagna (D1), Moon, Navamsha (D9), Planetary Degrees & Dignities
- Pages 11-30: All 16 Divisional Charts (D1-D60), Bhava Chalit, Ashtakavarga & Sarvashtakavarga
- Pages 31-45: Complete 120-Year Vimshottari Dasha Hierarchy
- Pages 46-65: Classical Planetary & House Analysis
- Context Summary for Gemini Flash prompts (Pages 66-100)
"""

from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from reports.report_data import assemble_report_data

router = APIRouter()

@router.post("/full-calculation")
def get_full_100_page_astro_calculation(payload: Dict[str, Any] = Body(...)):
    try:
        name = payload.get("name", "Native")
        date = payload.get("date") or payload.get("dateOfBirth")
        time = payload.get("time") or payload.get("timeOfBirth")
        
        if not date or not time:
            raise HTTPException(status_code=400, detail="Missing date/dateOfBirth or time/timeOfBirth")

        # Parse coordinates
        lat = payload.get("lat")
        lon = payload.get("lon")
        if lat is None or lon is None:
            coords = payload.get("coordinates", "28.61,77.21")
            parts = [c.strip() for c in str(coords).split(",")]
            lat = float(parts[0])
            lon = float(parts[1]) if len(parts) > 1 else 77.21
        else:
            lat = float(lat)
            lon = float(lon)

        tz_offset = float(payload.get("tz_offset", 5.5))
        gender = payload.get("gender", "male")
        location_name = payload.get("placeOfBirth") or payload.get("location_name", "New Delhi, India")

        # Generate complete astronomical data structure
        report_data = assemble_report_data(
            name=name,
            date=date,
            time=time,
            tz_offset=tz_offset,
            lat=lat,
            lon=lon,
            gender=gender,
            location_name=location_name,
            language=payload.get("language", "en")
        )

        # Extract focused context package specifically optimized for Gemini Flash (Pages 66-100)
        chart = report_data.get("chart", {})
        planets = chart.get("planet_positions", {})
        houses = chart.get("houses", {})
        panchang = report_data.get("panchang", {})
        dasha = report_data.get("dasha", {})
        vargas = report_data.get("vargas", {})
        doshas = report_data.get("dosha", {})
        ashtakavarga = report_data.get("ashtakavarga", {})
        
        meta = report_data.get("meta", {})
        basic = report_data.get("basic_details", {})
        
        # Prepare clean, lightweight synthesis summary for AI prompts
        ai_synthesis_context = {
            "native": {
                "name": name,
                "gender": gender,
                "dob": date,
                "tob": time,
                "place": location_name,
                "ascendant_sign": meta.get("ascendant") or chart.get("ascendant_sign"),
                "moon_sign": meta.get("moon_sign") or basic.get("sign"),
                "sun_sign": planets.get("Sun", {}).get("sidereal", {}).get("sign_name") or planets.get("Sun", {}).get("sign_name"),
                "nakshatra": meta.get("nakshatra") or panchang.get("nakshatra", {}).get("nakshatra_name"),
                "nakshatra_lord": panchang.get("nakshatra", {}).get("lord") or None,
                "tithi": panchang.get("tithi", {}).get("name") if isinstance(panchang.get("tithi"), dict) else panchang.get("tithi"),
                "yoga": panchang.get("yoga", {}).get("name") if isinstance(panchang.get("yoga"), dict) else panchang.get("yoga"),
                "karana": panchang.get("karana", {}).get("name") if isinstance(panchang.get("karana"), dict) else panchang.get("karana"),
            },
            "planetary_summary": {
                p: {
                    "sign": pdata.get("sidereal", {}).get("sign_name") or pdata.get("sign_name"),
                    "house": pdata.get("house"),
                    "degree": round(pdata.get("sidereal", {}).get("lon", 0) % 30, 2),
                    "is_retrograde": pdata.get("is_retrograde", False),
                    "dignity": pdata.get("dignity", "Neutral")
                }
                for p, pdata in planets.items() if isinstance(pdata, dict)
            },
            "current_dasha": {
                "active_mahadasha": dasha.get("current_mahadasha") or (dasha.get("vimshottari_periods", [{}])[0].get("lord") if isinstance(dasha.get("vimshottari_periods"), list) and dasha.get("vimshottari_periods") else None),
                "active_antardasha": dasha.get("current_antardasha"),
                "active_pratyantardasha": dasha.get("current_pratyantardasha"),
                "major_timeline": dasha.get("vimshottari_periods", [])[:5] if isinstance(dasha.get("vimshottari_periods"), list) else []
            },
            "key_houses": {
                "1st_lagna": houses.get(1, {}),
                "2nd_wealth": houses.get(2, {}),
                "4th_home": houses.get(4, {}),
                "5th_intellect_children": houses.get(5, {}),
                "6th_enemies_disease": houses.get(6, {}),
                "7th_marriage": houses.get(7, {}),
                "8th_longevity": houses.get(8, {}),
                "9th_dharma_fortune": houses.get(9, {}),
                "10th_career": houses.get(10, {}),
                "11th_gains": houses.get(11, {}),
                "12th_expenses_moksha": houses.get(12, {})
            },
            "navamsha_d9_summary": {
                "ascendant": vargas.get("d9", {}).get("ascendant_sign"),
                "planets": {
                    p: vargas.get("d9", {}).get("planet_positions", {}).get(p, {}).get("sign_name")
                    for p in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
                    if p in vargas.get("d9", {}).get("planet_positions", {})
                } if "d9" in vargas else {}
            },
            "dashamamsha_d10_summary": {
                "ascendant": vargas.get("d10", {}).get("ascendant_sign"),
                "10th_house_sign": vargas.get("d10", {}).get("houses", {}).get(10, {}).get("sign_name")
            } if "d10" in vargas else {},
            "doshas": doshas,
            "sarvashtakavarga_totals": ashtakavarga.get("sarvashtakavarga", {})
        }

        return {
            "status": "success",
            "meta": {
                "engine": "Swiss Ephemeris PyEphem Local Engine",
                "report_title": "100-Page Comprehensive Vedic Kundali Report",
                "client": name
            },
            "raw_astronomical_data": report_data,
            "ai_synthesis_context": ai_synthesis_context
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Astronomical calculation failed: {str(e)}")
