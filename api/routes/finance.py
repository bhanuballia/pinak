from fastapi import APIRouter, HTTPException, Body
from core.database import client, finance_collection, second_house_lord_collection, eleventh_house_lord_collection, planets_in_second_house_collection, planets_in_eleventh_house_collection, dhana_yogas_collection
from typing import Dict, Any
from reports.report_data import assemble_report_data

router = APIRouter()

@router.get("")
async def get_finance_insights():
    """
    Fetch all general finance-related astrological insights and remedies from MongoDB.
    Returns fallback data if the database is unreachable or empty.
    """
    fallback_insights = [
        {
            "category": "Wealth Foundation",
            "title": "Jupiter: The Karaka of Wealth",
            "content": "Jupiter is the primary significator for prosperity and expansion. A well-placed Jupiter ensures a steady flow of divine grace in financial matters.",
            "icon": "💰"
        },
        {
            "category": "Abundance",
            "title": "Venus: Luxury & Comfort",
            "content": "Venus governs material comforts, luxury, and artistic assets. It represents the quality of wealth and the ability to enjoy physical resources.",
            "icon": "💎"
        },
        {
            "category": "Remedy",
            "title": "Mahalakshmi Mantra",
            "content": "Chanting 'Om Shreem Hreem Shreem Kamale Kamalalaye Praseed Praseed' helps in attracting financial stability and removing poverty consciousness.",
            "icon": "🕉️"
        }
    ]
    try:
        cursor = finance_collection.find({})
        results = await cursor.to_list(length=100)
        
        if not results:
            return fallback_insights

        # Format the ObjectId
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        print(f"Finance API Error (falling back to defaults): {e}")
        return fallback_insights

SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

def get_house_str(house_num):
    if not house_num: return "Unknown House"
    suffixes = {1: "st", 2: "nd", 3: "rd"}
    suffix = suffixes.get(house_num if house_num <= 3 else 0, "th")
    return f"{house_num}{suffix} House"

@router.post("/personal")
async def get_personal_finance_analysis(payload: Dict[str, Any] = Body(...)):
    """
    Calculate personalized financial insights based on birth data, 
    pulling deep analysis from the specialized finance database.
    """
    try:
        name = payload.get("name", "Native")
        date = payload.get("date")
        time = payload.get("time", "12:00:00")
        
        try:
            lat = float(payload.get("lat", 0))
            lon = float(payload.get("lon", 0))
            tz_offset = float(payload.get("tz_offset", 0.0))
        except (ValueError, TypeError):
            return []

        if not date:
            return []

        # Assemble report data to get planetary positions
        data = assemble_report_data(
            name=name,
            date=date,
            time=time,
            tz_offset=tz_offset,
            lat=lat,
            lon=lon
        )

        planets = data.get("planet_positions", [])
        houses_data = data.get("charts", {}).get("houses", {})
        
        analysis = []
        
        # --- 1. 2ND HOUSE (ACCUMULATED WEALTH) ---
        h2_info = houses_data.get("2") or houses_data.get(2)
        if h2_info:
            h2_sign = h2_info.get("sign_name")
            h2_lord = SIGN_LORDS.get(h2_sign)
            
            lord_pos = next((p for p in planets if p["planet"] == h2_lord), None)
            if lord_pos:
                lord_house = lord_pos.get("house")
                house_str = get_house_str(lord_house)
                
                # Fetch analysis for 2nd lord placement
                lord_type_doc = await second_house_lord_collection.find_one({"planet": h2_lord})
                if lord_type_doc:
                    analysis.append({
                        "category": "Wealth Accumulation",
                        "title": f"2nd Lord ({h2_lord}) Analysis",
                        "content": f"Financial Status: {lord_type_doc.get('status', 'Moderate')} | Wealth Source: {lord_type_doc.get('source', 'Self-earned')}",
                        "icon": "🏦"
                    })

            # Check planets actually IN the 2nd house
            p_in_2 = h2_info.get("planets", [])
            for p_dict in p_in_2:
                p_name = p_dict["name"] if isinstance(p_dict, dict) else p_dict
                p_doc = await planets_in_second_house_collection.find_one({"planet": p_name})
                if p_doc:
                    analysis.append({
                        "category": "Asset Dynamics",
                        "title": f"{p_name} in 2nd House",
                        "content": f"Impact on Savings: {p_doc.get('impact', 'Variable')} | Prosperity: {p_doc.get('prosperity', 'Average')}",
                        "icon": "💸"
                    })

        # --- 2. 11TH HOUSE (GAINS & INCOME) ---
        h11_info = houses_data.get("11") or houses_data.get(11)
        if h11_info:
            h11_sign = h11_info.get("sign_name")
            h11_lord = SIGN_LORDS.get(h11_sign)
            
            lord_pos = next((p for p in planets if p["planet"] == h11_lord), None)
            if lord_pos:
                lord_type_doc = await eleventh_house_lord_collection.find_one({"planet": h11_lord})
                if lord_type_doc:
                    analysis.append({
                        "category": "Income Streams",
                        "title": f"11th Lord ({h11_lord}) Analysis",
                        "content": f"Gain Potential: {lord_type_doc.get('potential', 'High')} | Social Network Impact: {lord_type_doc.get('network', 'Supportive')}",
                        "icon": "📈"
                    })

            # Check planets actually IN the 11th house
            p_in_11 = h11_info.get("planets", [])
            for p_dict in p_in_11:
                p_name = p_dict["name"] if isinstance(p_dict, dict) else p_dict
                p_doc = await planets_in_eleventh_house_collection.find_one({"planet": p_name})
                if p_doc:
                    analysis.append({
                        "category": "Profitability",
                        "title": f"{p_name} in 11th House",
                        "content": f"Earnings: {p_doc.get('earnings', 'Growing')} | Fulfillment of Desires: {p_doc.get('fulfillment', 'Good')}",
                        "icon": "🤑"
                    })

        # --- 3. DHANA YOGA CHECK (Basic) ---
        # If 2nd lord is in 11th or 11th lord is in 2nd
        h2_sign = houses_data.get("2", {}).get("sign_name")
        h11_sign = houses_data.get("11", {}).get("sign_name")
        h2_lord = SIGN_LORDS.get(h2_sign)
        h11_lord = SIGN_LORDS.get(h11_sign)
        
        lord2_pos = next((p for p in planets if p["planet"] == h2_lord), None)
        lord11_pos = next((p for p in planets if p["planet"] == h11_lord), None)
        
        if (lord2_pos and lord2_pos.get("house") == 11) or (lord11_pos and lord11_pos.get("house") == 2):
            analysis.append({
                "category": "Divine Wealth",
                "title": "Dhana Yoga Detected",
                "content": "A strong connection between the house of savings (2nd) and house of gains (11th) creates a Dhana Yoga, indicating great wealth potential.",
                "icon": "🔱"
            })

        return analysis
    except Exception as e:
        print(f"Personal Finance Analysis Error: {e}")
        return []
