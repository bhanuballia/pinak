from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any

router = APIRouter()

@router.get("")
async def get_business_insights():
    """
    Fetch general business and entrepreneurship related astrological insights.
    """
    insights = [
        {
            "category": "Foundation",
            "title": "Mercury: The Cosmic Merchant",
            "content": "Mercury is the primary planet for trade, commerce, and communication. A strong Mercury provides the analytical mind required for successful business dealings.",
            "icon": "📊"
        },
        {
            "category": "Strategy",
            "title": "The 7th House: Partner & Market",
            "content": "While the 10th house is for career, the 7th house governs independent business and partnerships. Its strength indicates your ability to attract clients and maintain trade.",
            "icon": "🤝"
        },
        {
            "category": "Gains",
            "title": "The 11th House: Accumulation of Profits",
            "content": "Business success is measured by the 11th house of gains. Benefic influences here ensure that your hard work translates into sustainable financial growth.",
            "icon": "📈"
        },
        {
            "category": "Remedy",
            "title": "Ganesha: The Obstacle Remover",
            "content": "Worshipping Lord Ganesha before starting any new venture or signing contracts is the most effective way to ensure smooth business operations.",
            "icon": "🐘"
        }
    ]
    return insights

@router.post("/personal")
async def get_personal_business_analysis(payload: Dict[str, Any] = Body(...)):
    """
    Placeholder for personal business analysis. 
    Computed in life_oracle.py.
    """
    return []
