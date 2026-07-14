from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any

router = APIRouter()

@router.get("")
async def get_marriage_insights():
    """
    Fetch general marriage-related astrological insights and remedies.
    """
    insights = [
        {
            "category": "Foundation",
            "title": "The 7th House: Gateway to Union",
            "content": "In Vedic Astrology, the 7th house represents your partner and the quality of your marriage. A clean 7th house ensures a transparent and supportive relationship.",
            "icon": "💍"
        },
        {
            "category": "Harmony",
            "title": "Venus: The Planet of Love",
            "content": "Venus is the primary significator of love and marriage for everyone. Its strength determines the romantic depth and aesthetic comfort in a relationship.",
            "icon": "💖"
        },
        {
            "category": "Stability",
            "title": "Jupiter's Blessing",
            "content": "For a lasting and traditional bond, Jupiter's influence is crucial. It brings wisdom, ethics, and long-term commitment to the marital union.",
            "icon": "⚖️"
        },
        {
            "category": "Remedy",
            "title": "Gauri-Shankar Worship",
            "content": "Worshipping the divine couple Lord Shiva and Goddess Parvati is the supreme remedy for resolving marital delays and conflicts.",
            "icon": "🕉️"
        }
    ]
    return insights

@router.post("/personal")
async def get_personal_marriage_analysis(payload: Dict[str, Any] = Body(...)):
    """
    This is a placeholder for personal marriage analysis if needed via API.
    However, the app currently calculates this in life_oracle.py and 
    passes it via worksheetData.
    """
    return []
