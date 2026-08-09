from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.numerology_calculator import calculate_namank, get_compatibility_score, calculate_life_path_number, get_birth_compatibility_score, get_friendship_compatibility_score, get_personal_alignment_score, get_relationship_path_reading, get_master_number_reading

router = APIRouter(prefix="/api/numerology", tags=["Numerology"])

class NameCompatibilityRequest(BaseModel):
    name1: str
    name2: str

class BirthCompatibilityRequest(BaseModel):
    dob1: str
    dob2: str

@router.post("/compatibility/name")
async def get_name_compatibility(request: NameCompatibilityRequest):
    try:
        namank1 = calculate_namank(request.name1)
        namank2 = calculate_namank(request.name2)
        
        result = get_compatibility_score(namank1, namank2)
        
        return {
            "name1": request.name1,
            "name2": request.name2,
            "namank1": namank1,
            "namank2": namank2,
            "compatibilityScore": result["score"],
            "message": result["message"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compatibility/birth")
async def get_birth_compatibility(request: BirthCompatibilityRequest):
    try:
        lp1 = calculate_life_path_number(request.dob1)
        lp2 = calculate_life_path_number(request.dob2)
        
        result = get_birth_compatibility_score(lp1, lp2)
        
        return {
            "dob1": request.dob1,
            "dob2": request.dob2,
            "lifePath1": lp1,
            "lifePath2": lp2,
            "compatibilityScore": result["score"],
            "message": result["message"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compatibility/friendship")
async def get_friendship_compatibility(request: BirthCompatibilityRequest):
    try:
        lp1 = calculate_life_path_number(request.dob1)
        lp2 = calculate_life_path_number(request.dob2)
        
        result = get_friendship_compatibility_score(lp1, lp2)
        
        return {
            "dob1": request.dob1,
            "dob2": request.dob2,
            "lifePath1": lp1,
            "lifePath2": lp2,
            "compatibilityScore": result["score"],
            "message": result["message"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class PersonalAlignmentRequest(BaseModel):
    name: str
    dob: str

@router.post("/alignment")
async def get_personal_alignment(request: PersonalAlignmentRequest):
    try:
        destiny_num = calculate_namank(request.name)
        life_path_num = calculate_life_path_number(request.dob)
        
        result = get_personal_alignment_score(destiny_num, life_path_num)
        
        return {
            "name": request.name,
            "dob": request.dob,
            "destinyNumber": destiny_num,
            "lifePathNumber": life_path_num,
            "compatibilityScore": result["score"],
            "message": result["message"],
            "suggestion": result["suggestion"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RelationshipPathRequest(BaseModel):
    dob1: str
    dob2: str

@router.post("/relationship-path")
async def get_relationship_path(request: RelationshipPathRequest):
    try:
        lp1 = calculate_life_path_number(request.dob1)
        lp2 = calculate_life_path_number(request.dob2)
        
        result = get_relationship_path_reading(lp1, lp2)
        
        return {
            "dob1": request.dob1,
            "dob2": request.dob2,
            "lifePath1": lp1,
            "lifePath2": lp2,
            "relationshipNumber": result["relationshipNumber"],
            "title": result["title"],
            "message": result["message"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class MasterNumberRequest(BaseModel):
    dob1: str
    dob2: str

@router.post("/master-number")
async def get_master_number(request: MasterNumberRequest):
    try:
        result = get_master_number_reading(request.dob1, request.dob2)
        
        return {
            "dob1": request.dob1,
            "dob2": request.dob2,
            "hasMasterNumber": result["hasMasterNumber"],
            "message": result["message"],
            "details": result["details"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class DetailedNumerologyRequest(BaseModel):
    name: str
    dob: str  # YYYY-MM-DD

class FullNumerologyRequest(BaseModel):
    name: str
    dob: str


@router.post("/detailed-report")
async def get_detailed_report(request: DetailedNumerologyRequest):
    try:
        from api.numerology_calculator import (
            calculate_mulank,
            calculate_namank,
            calculate_pythagorean_namank,
            calculate_life_path_number,
            generate_loshu_grid,
            get_number_details,
            calculate_personal_year,
            get_loshu_planes_analysis,
            get_lucky_dates_matrix,
            calculate_domain_analytics
        )
        import datetime

        mulank = calculate_mulank(request.dob)
        bhagyank = calculate_life_path_number(request.dob)
        namank = calculate_namank(request.name)
        pythagorean_namank = calculate_pythagorean_namank(request.name)

        mulank_details = get_number_details(mulank)
        bhagyank_details = get_number_details(bhagyank)
        namank_details = get_number_details(namank)

        loshu_grid = generate_loshu_grid(request.dob, mulank, bhagyank)
        loshu_planes = get_loshu_planes_analysis(loshu_grid)
        lucky_dates = get_lucky_dates_matrix(mulank)
        domain_analytics = calculate_domain_analytics(loshu_grid, mulank, bhagyank)

        current_year = datetime.datetime.now().year
        personal_year = calculate_personal_year(request.dob, current_year)
        personal_year_details = get_number_details(personal_year)

        return {
            "name": request.name,
            "dob": request.dob,
            "mulank": mulank,
            "bhagyank": bhagyank,
            "namank": namank,
            "pythagoreanNamank": pythagorean_namank,
            "mulankDetails": mulank_details,
            "bhagyankDetails": bhagyank_details,
            "namankDetails": namank_details,
            "loshuGrid": loshu_grid,
            "loshuPlanes": loshu_planes,
            "luckyDates": lucky_dates,
            "personalYear": personal_year,
            "personalYearDetails": personal_year_details,
            "currentYear": current_year,
            "domainAnalytics": domain_analytics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/quantum/calculate")
async def get_quantum_numerology_analysis(request: FullNumerologyRequest):
    try:
        from api.quantum_numerology_engine import calculate_quantum_resonance
        res = calculate_quantum_resonance(request.dob, request.name)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


