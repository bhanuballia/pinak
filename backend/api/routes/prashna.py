from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from datetime import datetime
from astronomy.julian import datetime_to_julian
from astronomy.ascendant import get_ascendant_from_datetime
from astronomy.positions import get_nakshatra_info
from core.database import db
import json
import os
import sys

try:
    from core.astrology.kp_horary import KP_249_TABLE
except Exception:
    try:
        from core.astrology.generate_249 import KP_249_TABLE
    except Exception:
        KP_249_TABLE = []

from charts.rashi_chart import build_rashi_chart
from api.services.prashna_logic import evaluate_prashna
from api.services.ashtamangala_logic import evaluate_ashtamangala
from reports.ai_text.prashna_explainer import guess_target_house, generate_prashna_reading, generate_kp_reading

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
        chart_data = build_rashi_chart(jd_ut, float(lat), float(lon))
        
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
        
        # Add the chart for the frontend response, but AFTER saving to DB to avoid BSON integer key error
        prashna_doc["chart"] = chart_data
        
        # Remove objectId for JSON response
        if "_id" in prashna_doc:
            prashna_doc["id"] = str(prashna_doc["_id"])
            del prashna_doc["_id"]
            
        return prashna_doc
        
    except Exception as e:
        print(f"[PRASHNA ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/kp-ask")
async def ask_kp_prashna(payload: Dict = Body(...)):
    """
    Accepts latitude, longitude, and question text.
    Uses strict KP Astrology principles (Nakshatra and Sub-lord) to generate AI reading.
    """
    try:
        lat = payload.get("latitude")
        lon = payload.get("longitude")
        question = payload.get("question")
        category = payload.get("category", "Other")
        horary_number = payload.get("horary_number")
        
        if lat is None or lon is None or not question:
            raise HTTPException(status_code=400, detail="Latitude, longitude, and question are required.")
            
        now_utc = datetime.utcnow()
        jd_ut = datetime_to_julian(now_utc)
        
        # 1. Get Ascendant Data
        asc_lon = None
        if horary_number:
            try:
                h_num = int(horary_number)
                if 1 <= h_num <= 249:
                    target_entry = next((item for item in KP_249_TABLE if item.get('num') == h_num), None)
                    if target_entry:
                        asc_lon = target_entry.get('start_deg')
            except Exception as e:
                print(f"[API WARN] Failed to process horary number: {e}")
                
        if asc_lon is None:
            asc_info = get_ascendant_from_datetime(now_utc, float(lat), float(lon))
            asc_lon = asc_info.get("ascendant_degree", 0.0)
        
        nak_info = get_nakshatra_info(asc_lon)
        nak_name = nak_info.get("name", "Unknown")
        sub_lord = nak_info.get("sub_lord", "Unknown")
        
        # 2. Determine Target House & Evaluate Prashna Rules
        if category == "Other":
            target_house = guess_target_house(question)
        else:
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

        lagna_sign, lagna_lord, target_lord, score, reasoning = evaluate_prashna(
            jd_ut=jd_ut,
            lat=float(lat),
            lon=float(lon),
            target_house=target_house
        )
        outcome_status = "YES / FAVORABLE" if score > 0 else "NO / OBSTACLES" if score < 0 else "MAYBE / DELAYED"

        # 3. Get KP Details from DB/JSON
        kp_data = {}
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        kp_path = os.path.join(backend_dir, "data", "kp_nakshatra_data.json")
        if not os.path.exists(kp_path):
            kp_path = os.path.join("data", "kp_nakshatra_data.json")
        if os.path.exists(kp_path):
            with open(kp_path, "r", encoding="utf-8") as f:
                kp_data = json.load(f)
                
        nak_kp_context = kp_data.get(nak_name, {})
        if not nak_kp_context:
            norm_name = nak_name.lower().replace("sh", "s").replace("th", "t").replace("w", "v")
            for k, v in kp_data.items():
                norm_k = k.lower().replace("sh", "s").replace("th", "t").replace("w", "v")
                if norm_name in norm_k or norm_k in norm_name:
                    nak_kp_context = v
                    break

        kp_context_str = ""
        if nak_kp_context:
            if "professions" in nak_kp_context:
                kp_context_str += f"Professions: {', '.join(nak_kp_context['professions'])}. "
            if "diseases" in nak_kp_context:
                kp_context_str += f"Diseases: {', '.join(nak_kp_context['diseases'])}. "
            if "mental_qualities" in nak_kp_context:
                kp_context_str += f"Mental Qualities: {', '.join(nak_kp_context['mental_qualities'])}. "
        
        # 4. Generate KP Reading (AI or Classical Fallback)
        final_reading = generate_kp_reading(
            question=question,
            category=category,
            ascendant_degree=asc_lon,
            nakshatra_name=nak_name,
            sub_lord=sub_lord,
            kp_context=kp_context_str,
            reasoning=reasoning,
            target_house=target_house,
            lagna_lord=lagna_lord,
            target_lord=target_lord,
            score=score
        )
        
        # 5. Save to DB
        kp_doc = {
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
            "outcome": outcome_status,
            "simple_analysis": reasoning,
            "reasoning": reasoning,
            "ascendant_degree": asc_lon,
            "nakshatra": nak_name,
            "sub_lord": sub_lord,
            "reading": final_reading
        }
        try:
            await prashna_collection.insert_one(kp_doc)
        except Exception as dbe:
            print(f"[DB WARN] Could not save KP doc: {dbe}")
        
        if "_id" in kp_doc:
            kp_doc["id"] = str(kp_doc["_id"])
            del kp_doc["_id"]
            
        return kp_doc
        
    except Exception as e:
        print(f"[KP PRASHNA ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/current-ascendant")
async def get_current_ascendant(lat: float = 19.0760, lon: float = 72.8777):
    """
    Returns the real-time sidereal Ascendant (Udaya Lagna) sign and degree
    for the current moment at the given coordinates.
    """
    try:
        from api.services.ashtamangala_logic import get_sign_name
        now_utc = datetime.utcnow()
        asc_info = get_ascendant_from_datetime(now_utc, lat, lon)
        sign = asc_info.get("ascendant_sign", "Aries")
        in_sign_deg = asc_info.get("ascendant_in_sign_deg", 0.0)
        total_deg = asc_info.get("ascendant_deg", 0.0)
        return {
            "sign": sign,
            "degree": round(in_sign_deg, 2),
            "total_lon": round(total_deg, 2),
            "lat": lat,
            "lon": lon
        }
    except Exception as e:
        print(f"[CURRENT ASCENDANT ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ashtamangala-ask")
async def ask_ashtamangala_prashna(payload: Dict = Body(...)):
    """
    Accepts latitude, longitude, question text, and arudha_sign.
    Casts a Kerala horary chart and returns Ashtamangala reading.
    """
    try:
        lat = payload.get("latitude")
        lon = payload.get("longitude")
        question = payload.get("question")
        arudha_sign = payload.get("arudha_sign")
        
        if lat is None or lon is None or not question or not arudha_sign:
            raise HTTPException(status_code=400, detail="Latitude, longitude, question, and arudha_sign are required.")
            
        now_utc = datetime.utcnow()
        jd_ut = datetime_to_julian(now_utc)
        
        kavadi_data = payload.get("kavadi") or payload.get("kavadi_data")
        tambula_data = payload.get("tambula") or payload.get("tambula_data")
        nimitta_data = payload.get("nimitta") or payload.get("nimitta_data")
        birth_data = payload.get("birth_data") or payload.get("birth")
        
        # 1. Evaluate Ashtamangala Logic
        result = evaluate_ashtamangala(
            jd_ut=jd_ut,
            now_utc=now_utc,
            lat=float(lat),
            lon=float(lon),
            arudha_sign_name=arudha_sign,
            question=question,
            kavadi_data=kavadi_data,
            tambula_data=tambula_data,
            nimitta_data=nimitta_data,
            birth_data=birth_data
        )
        
        # 2. Save to DB
        doc = {
            "timestamp": now_utc.isoformat(),
            "latitude": lat,
            "longitude": lon,
            "question": question,
            "arudha_sign": arudha_sign,
            "kavadi": kavadi_data,
            "tambula": tambula_data,
            "nimitta": nimitta_data,
            "birth_data": birth_data,
            "result": result
        }
        await prashna_collection.insert_one(doc)
        
        if "_id" in doc:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            
        return doc
        
    except Exception as e:
        print(f"[ASHTAMANGALA PRASHNA ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))
