from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from datetime import datetime
from astronomy.julian import datetime_to_julian
from core.database import db

from api.services.prashna_logic import evaluate_prashna
from reports.ai_text.prashna_explainer import guess_target_house, generate_prashna_reading

router = APIRouter()
prashna_collection = db.get_collection("prashna")

@router.post("/ask")
async def ask_prashna(payload: Dict = Body(...)):
    """
    Accepts latitude, longitude, and question text.
    Casts a horary chart and returns AI reading.
    """
    try:
        lat = payload.get("latitude")
        lon = payload.get("longitude")
        question = payload.get("question")
        category = payload.get("category", "Other")
        
        if lat is None or lon is None or not question:
            raise HTTPException(status_code=400, detail="Latitude, longitude, and question are required.")
            
        # Get exact UTC time of the request
        now_utc = datetime.utcnow()
        jd_ut = datetime_to_julian(now_utc)
        
        # 1. Determine target house
        if category == "Other":
            target_house = guess_target_house(question)
        else:
            # Map categories to houses
            cat_map = {
                "Marriage / Relationship": 7,
                "Career / Job": 10,
                "Wealth / Finance": 2,
                "Health / Disease": 6,
                "Missing Item / Property": 4,
                "Children": 5,
                "Travel / Education": 9,
                "Litigation / Enemies": 6
            }
            target_house = cat_map.get(category, 1)
            
        # 2. Evaluate Prashna Logic
        lagna_sign, lagna_lord, target_lord, score, reasoning = evaluate_prashna(
            jd_ut=jd_ut,
            lat=float(lat),
            lon=float(lon),
            target_house=target_house
        )
        
        # 3. Generate AI Reading
        final_reading = generate_prashna_reading(
            question=question,
            lagna_sign=lagna_sign,
            lagna_lord=lagna_lord,
            target_house=target_house,
            target_lord=target_lord,
            math_score=score,
            reasoning=reasoning
        )
        
        # 4. Save to DB
        prashna_doc = {
            "timestamp": now_utc.isoformat(),
            "latitude": lat,
            "longitude": lon,
            "question": question,
            "category": category,
            "target_house": target_house,
            "lagna_sign": lagna_sign,
            "lagna_lord": lagna_lord,
            "target_lord": target_lord,
            "score": score,
            "reasoning": reasoning,
            "reading": final_reading
        }
        await prashna_collection.insert_one(prashna_doc)
        
        # Remove objectId for JSON response
        if "_id" in prashna_doc:
            prashna_doc["id"] = str(prashna_doc["_id"])
            del prashna_doc["_id"]
            
        return prashna_doc
        
    except Exception as e:
        print(f"[PRASHNA ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))
