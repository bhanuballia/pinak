from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, List
from core.database import profiles_collection
from bson import ObjectId

router = APIRouter()

def serialize_dict(a) -> dict:
    if "_id" in a:
        a["id"] = str(a["_id"])
        del a["_id"]
    return a

@router.post("/")
async def create_profile(payload: Dict = Body(...)):
    """Store a new profile/chart in the database"""
    print(f"[DEBUG] create_profile called with payload keys: {list(payload.keys())}")
    try:
        # Check if identical profile already exists
        name = payload.get("name")
        date = payload.get("date")
        time = payload.get("time")
        print(f"[DEBUG] Checking for existing profile: {name}, {date}, {time}")
        
        existing = await profiles_collection.find_one({"name": name, "date": date, "time": time})
        if existing:
            print(f"[DEBUG] Existing profile found with ID: {existing['_id']}")
            # Update the existing profile data instead
            await profiles_collection.update_one({"_id": existing["_id"]}, {"$set": payload})
            existing_id = str(existing["_id"])
            print(f"[DEBUG] Profile updated successfully")
            return {"message": "Profile updated successfully", "id": existing_id}

        print(f"[DEBUG] No existing profile found. Inserting new one...")
        result = await profiles_collection.insert_one(payload)
        print(f"[DEBUG] Profile inserted with ID: {result.inserted_id}")
        return {"message": "Profile saved successfully", "id": str(result.inserted_id)}
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[ERROR] Database error in create_profile: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/")
async def get_profiles():
    """Retrieve all saved profiles without the large chart payload"""
    try:
        profiles = []
        # Return only basic metadata to save bandwidth, not the whole generated chart
        cursor = profiles_collection.find({}, {"name": 1, "date": 1, "time": 1, "lat": 1, "lon": 1, "location_name": 1})
        async for document in cursor:
            profiles.append(serialize_dict(document))
        return profiles
    except Exception as e:
        print(f"[PROFILES ERROR] Could not fetch profiles: {e}")
        # Return empty list instead of 500 to allow app to function
        return []

@router.get("/{profile_id}")
async def get_profile_by_id(profile_id: str):
    """Retrieve a specific complete profile with all chart data"""
    try:
        if not ObjectId.is_valid(profile_id):
            raise HTTPException(status_code=400, detail="Invalid profile ID")
        document = await profiles_collection.find_one({"_id": ObjectId(profile_id)})
        if not document:
            raise HTTPException(status_code=404, detail="Profile not found")
        document["_id"] = str(document["_id"])
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.delete("/{profile_id}")
async def delete_profile(profile_id: str):
    """Delete a saved profile"""
    try:
        if not ObjectId.is_valid(profile_id):
            raise HTTPException(status_code=400, detail="Invalid profile ID")
        result = await profiles_collection.delete_one({"_id": ObjectId(profile_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
        return {"message": "Profile deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/subscribe")
async def subscribe_profile_by_details(payload: Dict = Body(...)):
    """Link an FCM token to a profile by matching name, date, and time"""
    try:
        token = payload.get("fcm_token")
        name = payload.get("name")
        date = payload.get("date")
        time = payload.get("time")
        
        if not all([token, name, date, time]):
            raise HTTPException(status_code=400, detail="fcm_token, name, date, and time are required")
            
        result = await profiles_collection.update_one(
            {"name": name, "date": date, "time": time},
            {"$set": {"fcm_token": token}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Profile not found in database. Please generate and save a report first.")
            
        return {"message": "Successfully subscribed to alerts"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
