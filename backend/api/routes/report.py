from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.numerology_calculator import (
    calculate_namank, 
    get_compatibility_score, 
    calculate_life_path_number, 
    get_birth_compatibility_score, 
    get_friendship_compatibility_score,
    get_relationship_path_reading,
    get_master_number_reading,
    get_personal_alignment_score
)
from api.astrology_compatibility import (
    get_moon_sign_compatibility,
    get_sun_sign_compatibility_score,
    get_passion_compatibility_score,
    get_zodiac_from_name
)

router = APIRouter(prefix="/api/report", tags=["Complete Report"])

class CompleteReportRequest(BaseModel):
    name1: str
    dob1: str
    sun1: str
    moon1: str
    venus1: str
    mars1: str
    
    name2: str
    dob2: str
    sun2: str
    moon2: str
    venus2: str
    mars2: str

@router.post("/compatibility")
async def generate_complete_report(request: CompleteReportRequest):
    try:
        # Numerology Calculations
        destiny1 = calculate_namank(request.name1)
        destiny2 = calculate_namank(request.name2)
        destiny_comp = get_compatibility_score(destiny1, destiny2)
        
        lp1 = calculate_life_path_number(request.dob1)
        lp2 = calculate_life_path_number(request.dob2)
        lp_comp = get_birth_compatibility_score(lp1, lp2)
        
        friendship_comp = get_friendship_compatibility_score(lp1, lp2)
        relationship_path = get_relationship_path_reading(lp1, lp2)
        master_number = get_master_number_reading(request.dob1, request.dob2)
        
        align1 = get_personal_alignment_score(destiny1, lp1)
        align2 = get_personal_alignment_score(destiny2, lp2)
        
        # Astrology Calculations
        sun_comp = get_sun_sign_compatibility_score(request.sun1, request.sun2)
        moon_comp = get_moon_sign_compatibility(request.moon1, request.moon2)
        passion_comp = get_passion_compatibility_score(request.venus1, request.mars1, request.venus2, request.mars2)
        
        name_zodiac1 = get_zodiac_from_name(request.name1)
        name_zodiac2 = get_zodiac_from_name(request.name2)
        name_horoscope_comp = get_moon_sign_compatibility(name_zodiac1, name_zodiac2)
        
        # Overall Score Calculation (Average of the main 5 components)
        overall_score = sum([
            destiny_comp["score"],
            lp_comp["score"],
            sun_comp["score"],
            moon_comp["score"],
            passion_comp["score"]
        ]) // 5
        
        return {
            "inputs": {
                "person1": {
                    "name": request.name1,
                    "dob": request.dob1,
                    "sun": request.sun1,
                    "moon": request.moon1,
                    "venus": request.venus1,
                    "mars": request.mars1,
                    "destinyNumber": destiny1,
                    "lifePathNumber": lp1,
                    "nameZodiac": name_zodiac1
                },
                "person2": {
                    "name": request.name2,
                    "dob": request.dob2,
                    "sun": request.sun2,
                    "moon": request.moon2,
                    "venus": request.venus2,
                    "mars": request.mars2,
                    "destinyNumber": destiny2,
                    "lifePathNumber": lp2,
                    "nameZodiac": name_zodiac2
                }
            },
            "overallScore": overall_score,
            "numerology": {
                "nameCompatibility": destiny_comp,
                "birthDateCompatibility": lp_comp,
                "friendship": friendship_comp,
                "relationshipPath": relationship_path,
                "masterNumber": master_number,
                "alignment1": align1,
                "alignment2": align2
            },
            "astrology": {
                "sunSign": sun_comp,
                "moonSign": moon_comp,
                "passion": passion_comp,
                "nameHoroscope": name_horoscope_comp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
