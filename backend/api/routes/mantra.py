from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from datetime import datetime
from core.database import db

router = APIRouter()
mantra_logs = db.get_collection("mantra_logs")

@router.post("/log")
async def log_mantra_session(payload: Dict = Body(...)):
    """
    Saves a completed chanting session to the database.
    """
    try:
        user_id = payload.get("user_id") # Could be name + date or FCM token
        mantra_name = payload.get("mantra_name")
        count = payload.get("count", 0)
        duration_seconds = payload.get("duration_seconds", 0)
        
        if not all([user_id, mantra_name, count]):
            raise HTTPException(status_code=400, detail="user_id, mantra_name, and count are required.")
            
        now_utc = datetime.utcnow()
        
        session_doc = {
            "user_id": user_id,
            "mantra_name": mantra_name,
            "count": count,
            "duration_seconds": duration_seconds,
            "timestamp": now_utc.isoformat()
        }
        
        await mantra_logs.insert_one(session_doc)
        session_doc["_id"] = str(session_doc["_id"])
        return {"message": "Session logged successfully", "session": session_doc}
        
    except Exception as e:
        print(f"[MANTRA ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/{user_id}")
async def get_mantra_stats(user_id: str):
    """
    Retrieves total chant counts and statistics for a specific user.
    """
    try:
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {
                "_id": "$mantra_name",
                "total_chants": {"$sum": "$count"},
                "total_sessions": {"$sum": 1},
                "total_time_seconds": {"$sum": "$duration_seconds"}
            }}
        ]
        
        results = await mantra_logs.aggregate(pipeline).to_list(length=None)
        
        stats = {}
        grand_total = 0
        for r in results:
            mantra = r["_id"]
            stats[mantra] = {
                "total_chants": r["total_chants"],
                "total_sessions": r["total_sessions"],
                "total_time_seconds": r["total_time_seconds"]
            }
            grand_total += r["total_chants"]
            
        return {
            "user_id": user_id,
            "grand_total_chants": grand_total,
            "mantra_stats": stats
        }
        
    except Exception as e:
        print(f"[MANTRA STATS ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))
