from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any

router = APIRouter()

@router.get("")
async def get_marriage_insights():
    """
    Fetch general marriage-related astrological insights and remedies.
    """
    insights = [
        {
            "category": "Foundation",
            "title": "The 7th House: Gateway to Union",
            "content": "In Vedic Astrology, the 7th house represents your partner and the quality of your marriage. A clean 7th house ensures a transparent and supportive relationship.",
            "icon": "💍"
        },
        {
            "category": "Harmony",
            "title": "Venus: The Planet of Love",
            "content": "Venus is the primary significator of love and marriage for everyone. Its strength determines the romantic depth and aesthetic comfort in a relationship.",
            "icon": "💖"
        },
        {
            "category": "Stability",
            "title": "Jupiter's Blessing",
            "content": "For a lasting and traditional bond, Jupiter's influence is crucial. It brings wisdom, ethics, and long-term commitment to the marital union.",
            "icon": "⚖️"
        },
        {
            "category": "Remedy",
            "title": "Gauri-Shankar Worship",
            "content": "Worshipping the divine couple Lord Shiva and Goddess Parvati is the supreme remedy for resolving marital delays and conflicts.",
            "icon": "🕉️"
        }
    ]
    return insights

from reports.report_data import assemble_report_data
from core.analysis.life_oracle import _analyze_marriage

@router.post("/personal")
async def get_personal_marriage_analysis(payload: Dict[str, Any] = Body(...)):
    """
    Calculate personalized marriage analysis & rules dynamically from birth details.
    """
    try:
        name = payload.get("name", "Native")
        date = payload.get("date")
        time = payload.get("time", "12:00:00")
        lat = float(payload.get("lat", 0))
        lon = float(payload.get("lon", 0))
        tz_offset = float(payload.get("tz_offset", 0.0))

        if not date:
            return {}

        report_data = assemble_report_data(
            name=name, date=date, time=time,
            tz_offset=tz_offset, lat=lat, lon=lon
        )

        d1 = report_data.get("chart", {})
        houses = d1.get("houses", {})
        _raw_planets = report_data.get("planet_positions", {})
        if isinstance(_raw_planets, list):
            planets = {p["planet"]: p for p in _raw_planets if isinstance(p, dict) and "planet" in p}
        else:
            planets = _raw_planets

        strength = report_data.get("strength", {}).get("planets", {})
        dasha = report_data.get("dasha", {}).get("current", {})
        vargas = report_data.get("vargas", {})
        d9 = vargas.get("d9", {})

        result = _analyze_marriage(houses, planets, strength, d9=d9, dasha=dasha)
        return result
    except Exception as e:
        print("Personal Marriage Analysis Error:", e)
        return {}
