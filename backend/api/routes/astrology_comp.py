from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.astrology_compatibility import get_moon_sign_compatibility, get_zodiac_from_name, get_passion_compatibility_score, get_sun_sign_compatibility_score

router = APIRouter(prefix="/api/astrology/compatibility", tags=["Astrology Compatibility"])

class MoonSignCompatibilityRequest(BaseModel):
    sign1: str
    sign2: str

class NameHoroscopeRequest(BaseModel):
    name1: str
    name2: str

@router.post("/moon")
async def get_moon_compatibility(request: MoonSignCompatibilityRequest):
    try:
        result = get_moon_sign_compatibility(request.sign1, request.sign2)
        
        return {
            "sign1": request.sign1,
            "sign2": request.sign2,
            "compatibilityScore": result["score"],
            "message": result["message"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/name-horoscope")
async def get_name_horoscope_compatibility(request: NameHoroscopeRequest):
    try:
        sign1 = get_zodiac_from_name(request.name1)
        sign2 = get_zodiac_from_name(request.name2)
        
        result = get_moon_sign_compatibility(sign1, sign2) # Reuse elemental logic
        
        return {
            "name1": request.name1,
            "name2": request.name2,
            "sign1": sign1,
            "sign2": sign2,
            "compatibilityScore": result["score"],
            "message": result["message"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class PassionRequest(BaseModel):
    venus1: str
    mars1: str
    venus2: str
    mars2: str

@router.post("/passion")
async def get_passion_compatibility(request: PassionRequest):
    try:
        result = get_passion_compatibility_score(request.venus1, request.mars1, request.venus2, request.mars2)
        
        return {
            "venus1": request.venus1,
            "mars1": request.mars1,
            "venus2": request.venus2,
            "mars2": request.mars2,
            "compatibilityScore": result["score"],
            "message": result["message"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SunSignCompatibilityRequest(BaseModel):
    sign1: str
    sign2: str

@router.post("/sun")
async def get_sun_compatibility(request: SunSignCompatibilityRequest):
    try:
        result = get_sun_sign_compatibility_score(request.sign1, request.sign2)
        
        return {
            "sign1": request.sign1,
            "sign2": request.sign2,
            "compatibilityScore": result["score"],
            "message": result["message"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
