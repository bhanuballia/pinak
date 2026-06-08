from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from api.services.synastry_logic import compute_synastry_matrix
from reports.ai_text.synastry_explainer import generate_synastry_reading

from reports.report_data import assemble_report_data

router = APIRouter()

@router.post("/analyze")
async def analyze_synastry(payload: Dict = Body(...)):
    """
    Receives either planet_positions directly, OR raw birth data for both profiles.
    Calculates the synastry geometric matrix and generates an AI reading.
    """
    try:
        p1_name = payload.get("p1_name", "Person 1")
        p2_name = payload.get("p2_name", "Person 2")
        
        p1_positions = payload.get("p1_positions")
        p2_positions = payload.get("p2_positions")
        
        p1_data = payload.get("p1_data")
        p2_data = payload.get("p2_data")
        
        # If raw data provided instead of positions, calculate them
        if p1_data and not p1_positions:
            rep = assemble_report_data(
                p1_data.get("name", p1_name), p1_data["birth_date"], p1_data["birth_time"],
                float(p1_data.get("tz_offset", 5.5)), float(p1_data["lat"]), float(p1_data["lon"])
            )
            p1_positions = rep.get("planet_positions", [])
            asc_deg = rep.get("chart", {}).get("ascendant_degree")
            if asc_deg is not None:
                p1_positions.append({"planet": "Ascendant", "lon": asc_deg})
            
        if p2_data and not p2_positions:
            rep = assemble_report_data(
                p2_data.get("name", p2_name), p2_data["birth_date"], p2_data["birth_time"],
                float(p2_data.get("tz_offset", 5.5)), float(p2_data["lat"]), float(p2_data["lon"])
            )
            p2_positions = rep.get("planet_positions", [])
            asc_deg = rep.get("chart", {}).get("ascendant_degree")
            if asc_deg is not None:
                p2_positions.append({"planet": "Ascendant", "lon": asc_deg})
            
        if not p1_positions or not p2_positions:
            raise HTTPException(status_code=400, detail="Missing planet_positions or birth data for one or both profiles.")
            
        # Compute geometric matrix
        matrix_result = compute_synastry_matrix(p1_positions, p2_positions)
        matrix = matrix_result["matrix"]
        top_hits = matrix_result["hits"]
        
        # Generate empathetic reading
        reading_markdown = generate_synastry_reading(p1_name, p2_name, top_hits)
        
        return {
            "p1_name": p1_name,
            "p2_name": p2_name,
            "matrix": matrix,
            "top_hits": top_hits,
            "reading": reading_markdown
        }
        
    except Exception as e:
        import traceback
        print(f"[SYNASTRY ERROR] {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
