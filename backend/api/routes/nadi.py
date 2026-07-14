from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any

from api.services.nadi_logic import get_nadi_yogas
from reports.ai_text.nadi_explainer import generate_nadi_reading

router = APIRouter()

@router.post("/analyze")
async def analyze_nadi(payload: Dict = Body(...)):
    """
    Accepts planetary positions and gender, returning Nadi Yogas and AI reading.
    """
    try:
        planet_positions = payload.get("planet_positions")
        gender = payload.get("gender", "Male")
        
        if not planet_positions:
            raise HTTPException(status_code=400, detail="planet_positions is required.")
            
        # Calculate Nadi Yogas
        nadi_data = get_nadi_yogas(planet_positions)
        
        # Generate AI Reading
        reading = generate_nadi_reading(nadi_data, gender)
        
        return {
            "nadi_data": nadi_data,
            "reading": reading,
            "gender_used": gender
        }
    except Exception as e:
        print(f"[NADI ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))

from reports.ai_text.nadi_explainer import generate_nadi_qa_reading

@router.post("/ask")
async def ask_nadi_question(payload: Dict = Body(...)):
    """
    Accepts planetary positions, gender, and a question.
    Returns an AI reading specifically answering the question using Nadi rules.
    """
    try:
        planet_positions = payload.get("planet_positions")
        gender = payload.get("gender", "Male")
        question = payload.get("question")
        
        if not planet_positions or not question:
            raise HTTPException(status_code=400, detail="planet_positions and question are required.")
            
        # Calculate Nadi Yogas
        nadi_data = get_nadi_yogas(planet_positions)
        
        # Generate QA AI Reading
        answer = generate_nadi_qa_reading(nadi_data, gender, question)
        
        return {
            "nadi_data": nadi_data,
            "answer": answer,
            "question_asked": question,
            "gender_used": gender
        }
    except Exception as e:
        print(f"[NADI QA ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))
