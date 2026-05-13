from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any

router = APIRouter()

@router.get("/parents")
async def get_parents_health_insights():
    """
    Fetch general astrological insights related to parents' health and well-being.
    """
    insights = [
        {
            "category": "Foundation",
            "title": "Sun & Moon: The Parental Karakas",
            "content": "The Sun represents the Father (Pitra Karaka), and the Moon represents the Mother (Matra Karaka). Their strength in your chart directly reflects your parents' vitality.",
            "icon": "👨‍👩‍👧"
        },
        {
            "category": "Diagnostics",
            "title": "The 4th & 9th Houses",
            "content": "The 4th house governs the mother's happiness and health, while the 9th house reflects the father's fortune and longevity. Benefics here ensure their long-term well-being.",
            "icon": "🏠"
        },
        {
            "category": "Protection",
            "title": "Jupiter's Aspect",
            "content": "Jupiter's aspect on the 4th or 9th house acts as a protective shield, mitigating various health risks for your parents even in difficult periods.",
            "icon": "✨"
        },
        {
            "category": "Remedy",
            "title": "Service & Donation",
            "content": "Serving one's parents is the highest remedy. Additionally, donating silver (for mother) or copper (for father) on Mondays/Sundays brings peace and health to them.",
            "icon": "🎁"
        }
    ]
    return insights

@router.get("/spouse")
async def get_spouse_health_insights():
    """
    Fetch general astrological insights related to spouse's health.
    """
    insights = [
        {
            "category": "Foundation",
            "title": "The 7th House: Partner's Vitality",
            "content": "The 7th house governs the spouse. Its lord's strength and the planets residing there indicate the overall physical resilience of your partner.",
            "icon": "💍"
        },
        {
            "category": "Diagnostics",
            "title": "Venus & Jupiter: The Sustainers",
            "content": "Venus (for wife) and Jupiter (for husband) are the primary karakas. Their dignity ensures longevity and health for the spouse.",
            "icon": "💖"
        },
        {
            "category": "Energy",
            "title": "The 2nd House: Spouse's Longevity",
            "content": "The 2nd house (being the 8th from the 7th) is critical for the spouse's longevity. Benefic aspects here are highly auspicious.",
            "icon": "⏳"
        },
        {
            "category": "Remedy",
            "title": "Shared Spiritual Practice",
            "content": "Performing joint spiritual practices or donating sweets on Fridays helps in maintaining harmony and physical vitality for the spouse.",
            "icon": "🙏"
        }
    ]
    return insights

@router.get("/children")
async def get_children_health_insights():
    """
    Fetch general astrological insights related to children's health.
    """
    insights = [
        {
            "category": "Foundation",
            "title": "The 5th House: Progeny & Joy",
            "content": "The 5th house represents children, creativity, and past life merits. A strong 5th house ensures healthy and joyful offspring.",
            "icon": "👶"
        },
        {
            "category": "Diagnostics",
            "title": "Jupiter: The Putrakaraka",
            "content": "Jupiter is the natural significator for children (Putrakaraka). Its well-placed dignity in the chart acts as a protective shield for the children's well-being.",
            "icon": "🌟"
        },
        {
            "category": "Energy",
            "title": "The Saptamsha (D7) Chart",
            "content": "For a deeper understanding of children's vitality, the D7 divisional chart is analyzed. Benefics in key houses of D7 promote longevity and health.",
            "icon": "📜"
        },
        {
            "category": "Remedy",
            "title": "Nurturing Knowledge",
            "content": "Supporting the education of underprivileged children or chanting the Santan Gopal Mantra are powerful Vedic remedies to strengthen the 5th house energies.",
            "icon": "📚"
        }
    ]
    return insights

@router.post("/personal")
async def get_personal_family_health_analysis(payload: Dict[str, Any] = Body(...)):
    """
    Placeholder for personal family health analysis.
    """
    return []
