from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any
from services.face_analyzer import analyze_face_image, validate_face_image
from services.samudrika_rules import get_face_reading

router = APIRouter()

@router.post("/validate-face", response_model=Dict[str, Any])
async def validate_face(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        return {"valid": False, "reason": "Not an image"}
    try:
        image_bytes = await image.read()
        is_valid = validate_face_image(image_bytes)
        return {"valid": is_valid}
    except Exception:
        return {"valid": False}

@router.post("/analyze-face", response_model=Dict[str, Any])
async def analyze_face(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
        
    try:
        # Read image bytes
        image_bytes = await image.read()
        
        # 1. Analyze face to get geometric ratios, landmarks, and processed image using MediaPipe
        ratios, landmarks, processed_image = analyze_face_image(image_bytes)
        
        # 2. Map ratios to Vedic traits using Samudrika Shastra rules
        reading = get_face_reading(ratios)
        
        return {
            "status": "success",
            "ratios": ratios,
            "reading": reading,
            "landmarks": landmarks,
            "processed_image": processed_image
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during analysis: {str(e)}")
