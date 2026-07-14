# backend/api/muhurat_routes.py

from fastapi import APIRouter, HTTPException, Body
from enterprise_astrology.backend.muhurat.marriage_muhurat import MarriageMuhuratEvaluator
from enterprise_astrology.backend.muhurat.panchaka_engine import PanchakaEngine
from enterprise_astrology.backend.muhurat.electional_engine import ElectionalEngine

router = APIRouter()
marriage_eval = MarriageMuhuratEvaluator()
panchaka_eval = PanchakaEngine()
electional_eval = ElectionalEngine()

@router.post("/marriage")
def evaluate_marriage(payload: dict = Body(...)):
    try:
        bride_moon_sign = int(payload["bride_moon_sign"])
        bride_nakshatra = int(payload["bride_nakshatra"])
        groom_moon_sign = int(payload["groom_moon_sign"])
        groom_nakshatra = int(payload["groom_nakshatra"])
        transit_moon_sign = int(payload["transit_moon_sign"])
        transit_nakshatra = int(payload["transit_nakshatra"])
        venus_combust = bool(payload.get("venus_combust", False))
        jupiter_combust = bool(payload.get("jupiter_combust", False))
        
        result = marriage_eval.evaluate_marriage_day(
            bride_moon_sign=bride_moon_sign,
            bride_nakshatra=bride_nakshatra,
            groom_moon_sign=groom_moon_sign,
            groom_nakshatra=groom_nakshatra,
            transit_moon_sign=transit_moon_sign,
            transit_nakshatra=transit_nakshatra,
            venus_combust=venus_combust,
            jupiter_combust=jupiter_combust
        )
        return result
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing key: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate-panchaka")
def evaluate_panchaka(payload: dict = Body(...)):
    try:
        tithi_idx = int(payload["tithi_idx"])
        day_idx = int(payload["day_idx"])
        nakshatra_idx = int(payload["nakshatra_idx"])
        lagna_idx = int(payload["lagna_idx"])
        
        result = panchaka_eval.evaluate_panchaka(
            tithi_idx=tithi_idx,
            day_idx=day_idx,
            nakshatra_idx=nakshatra_idx,
            lagna_idx=lagna_idx
        )
        return result
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing key: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/electional")
def evaluate_electional(payload: dict = Body(...)):
    try:
        activity_type = payload["activity_type"]
        day_of_week = int(payload["day_of_week"])
        tithi = int(payload["tithi"])
        active_planets = payload.get("active_planets", [])
        
        result = electional_eval.evaluate_activity(
            activity_type=activity_type,
            day_of_week=day_of_week,
            tithi=tithi,
            active_planets=active_planets
        )
        return result
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing key: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
