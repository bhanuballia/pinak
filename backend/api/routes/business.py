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
            "category": "Main Houses",
            "title": "Core Business Pillars (1st, 2nd, 3rd, 5th, 7th, 10th, 11th)",
            "content": "In Jyotish, self-employment & trade require alignment of the 1st (self), 2nd (wealth), 3rd (courage & initiative), 5th (intellect & risk), 7th (market & clients), 10th (career direction), and 11th (gains).",
            "icon": "🏛️"
        },
        {
            "category": "Main Planets",
            "title": "Key Business Significators (Saturn, Mercury, Rahu, Lagna Lord)",
            "content": "Mercury governs trading intellect; Saturn grants long-term endurance & discipline; Rahu brings innovation & startup drive; the Lagna Lord determines personal vitality and resilience.",
            "icon": "🪐"
        },
        {
            "category": "10th Lord Placement",
            "title": "10th Lord Placement in D1 & D-10 Dasamsa",
            "content": "Placement of the 10th Lord in the 3rd, 5th, 7th, 8th, 9th, or 12th house in Lagna (D1) chart, and 3rd, 7th, or 11th in D-10 Dasamsa chart creates a strong astrological signature for independent business.",
            "icon": "🎯"
        },
        {
            "category": "Key Conjunctions",
            "title": "Venus + Mercury Conjunction (Laxmi-Narayan Trade Yoga)",
            "content": "Conjunction of Venus and Mercury combines commercial intellect with aesthetic appeal and client attraction, forming an ideal yoga for entrepreneurship.",
            "icon": "✨"
        },
        {
            "category": "Self-Employment",
            "title": "Influence of Saturn, Mercury & Rahu",
            "content": "Conjunction or individual placement of Saturn, Mercury, or Rahu in 3rd, 7th, 10th, or 11th houses directly impacts the Lagna and 10th Lords, favoring self-employment over corporate jobs.",
            "icon": "⚡"
        },
        {
            "category": "Wealth vs Status",
            "title": "Dhan Yogas Dominance Over Rajyogas",
            "content": "Having more active Dhan Yogas (Wealth combinations) than Rajyogas (Status/Power combinations) in D1, D9, and D10 charts leans the life path toward profit-driven enterprise rather than salaried position.",
            "icon": "💰"
        },
        {
            "category": "Remedy",
            "title": "Lord Ganesha & Mercury Alignment",
            "content": "Worshipping Lord Ganesha before launching ventures or signing contracts and chanting Mercury mantras ensures smooth transactions and removal of trade hurdles.",
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
