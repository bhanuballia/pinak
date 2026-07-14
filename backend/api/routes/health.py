from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any

router = APIRouter()

@router.get("")
async def get_health_insights():
    """
    Fetch general health-related astrological insights and wellness principles.
    """
    insights = [
        {
            "category": "Foundation",
            "title": "The Ascendant (1st House): Vitality",
            "content": "The 1st house represents your physical body and overall constitution. A strong Ascendant lord ensures high immunity and the ability to recover quickly from illness.",
            "icon": "🧘"
        },
        {
            "category": "Diagnostics",
            "title": "The 6th House: Debt & Disease",
            "content": "In Vedic Astrology, the 6th house governs routine health issues and the body's defense mechanisms. Understanding its placement helps in proactive wellness management.",
            "icon": "🏥"
        },
        {
            "category": "Energy",
            "title": "Sun & Moon: The Vital Luminaries",
            "content": "The Sun represents your soul's vitality, while the Moon governs your mind and bodily fluids. Balance between these two ensures holistic health.",
            "icon": "☀️"
        },
        {
            "category": "Remedy",
            "title": "Ayurveda & Sun Worship",
            "content": "Offering water to the Sun (Surya Arghya) and following an Ayurvedic lifestyle based on your Doshas are powerful ways to maintain long-term vitality.",
            "icon": "🌿"
        }
    ]
    return insights

@router.post("/personal")
async def get_personal_health_analysis(payload: Dict[str, Any] = Body(...)):
    """
    Placeholder for personal health analysis.
    Computed in life_oracle.py.
    """
    return []
