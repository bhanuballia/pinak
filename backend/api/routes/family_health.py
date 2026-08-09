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
            "content": "The Sun represents the Father (Pitra Karaka), and the Moon represents the Mother (Matru Karaka). Their strength in your natal chart directly reflects your parents' core vitality.",
            "icon": "👨‍👩‍👧"
        },
        {
            "category": "Diagnostics",
            "title": "The 4th & 9th Houses & D12 Chart",
            "content": "The 4th house governs Mother's happiness and health, while the 9th house reflects Father's vitality. Dwadasamsha (D12 Varga Chart) gives deeper ancestral insights.",
            "icon": "🏠"
        },
        {
            "category": "Transits",
            "title": "Saturn & Rahu Transit Sensitivity",
            "content": "Saturn transit over the 4th house (Kantaka Shani) or 9th house can cause health fluctuations. Rahu transits bring unexpected or hard-to-diagnose symptoms.",
            "icon": "🪐"
        },
        {
            "category": "Protection",
            "title": "Jupiter's Grace & Aspect",
            "content": "Jupiter's aspect on the 4th or 9th house acts as a divine protective shield, mitigating severe health risks for parents even during tough Dashas.",
            "icon": "✨"
        },
        {
            "category": "Ayurveda",
            "title": "Elemental Dosha Balance",
            "content": "Water element afflictions to 4th house affect Mother's lungs/fluid balance. Fire element afflictions to 9th house affect Father's blood pressure & cardiac health.",
            "icon": "🌿"
        },
        {
            "category": "Remedy",
            "title": "Matru & Pitru Seva & Charity",
            "content": "Serving one's parents is the highest Vedic remedy. Donating silver & rice on Mondays for Mother and wheat & copper on Sundays for Father enhances longevity.",
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
            "title": "7th House & 7th Lord: Partner's Physical Base",
            "content": "The 7th house represents your partner's Lagna (body). Its lord's placement and elemental strength dictate their immunity, vitality, and physical constitution.",
            "icon": "💍"
        },
        {
            "category": "Karakas",
            "title": "Venus, Jupiter & Darakaraka (DK)",
            "content": "Venus (Shukra) governs wife/harmony, Jupiter (Guru) governs husband/protection, and Jaimini Darakaraka (DK) reveals partner's karmic health blueprint.",
            "icon": "💖"
        },
        {
            "category": "Diagnostics",
            "title": "2nd & 12th Houses (8th & 6th from 7th)",
            "content": "The 2nd house (8th from 7th) determines spouse's longevity, while the 12th house (6th from 7th) highlights potential acute illnesses & hospital visits.",
            "icon": "⏳"
        },
        {
            "category": "Varga Chart",
            "title": "Navamsha (D9) Partner Confirmation",
            "content": "Navamsha (D9) chart cross-verifies spouse health. A well-placed 7th lord in D9 shields partner from chronic conditions even if D1 shows temporary afflictions.",
            "icon": "☸️"
        },
        {
            "category": "Transits",
            "title": "Saturn & Rahu/Ketu 1st/7th Axis Transits",
            "content": "Saturn transiting 7th house causes chronic fatigue or joint pain for spouse. Rahu/Ketu transits across 1st/7th axis bring sudden stress or diagnostic confusion.",
            "icon": "🪐"
        },
        {
            "category": "Remedy",
            "title": "Friday/Thursday Seva & Gauri Shankar Puja",
            "content": "Donating white items on Fridays (for wife) or yellow lentils on Thursdays (for husband), and chanting Swayamvara Parvathi or Maha Mrityunjaya Jaap protects partner health.",
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
            "title": "5th House & 5th Lord: Progeny Base",
            "content": "The 5th house governs children, intellect, and physical vitality of offspring. Benefic planets here promote robust health and strong immunity.",
            "icon": "👶"
        },
        {
            "category": "Karakas",
            "title": "Jupiter (Putrakaraka) & Mercury",
            "content": "Jupiter acts as natural Putrakaraka (protector of children), while Mercury rules brain development, nervous system resilience, and communication.",
            "icon": "🌟"
        },
        {
            "category": "Diagnostics",
            "title": "10th & 12th Houses (6th & 8th from 5th)",
            "content": "The 10th house (6th from 5th) indicates acute illness or fever risks for children, while the 12th house (8th from 5th) governs chronic longevity.",
            "icon": "🩺"
        },
        {
            "category": "Varga Chart",
            "title": "Saptamsha (D7) Child Blueprint",
            "content": "Saptamsha (D7) divisional chart cross-confirms children's well-being. Benefics in D7 Lagna or 5th house protect progeny against severe afflictions.",
            "icon": "📜"
        },
        {
            "category": "Transits",
            "title": "Saturn & Rahu 5th House Transits",
            "content": "Saturn transit over 5th house causes academic fatigue or sluggish digestion for child. Rahu transit over 5th house causes emotional restlessness or sudden fever.",
            "icon": "🪐"
        },
        {
            "category": "Remedy",
            "title": "Santana Gopala & Ganesha Seva",
            "content": "Chanting Santana Gopala Mantra or Gayatri Mantra daily, offering Durva grass to Lord Ganesha on Wednesdays, and donating books on Thursdays protects children.",
            "icon": "🙏"
        }
    ]
    return insights

@router.get("/mental-peace")
async def get_mental_peace_insights():
    """
    Fetch general astrological insights related to mental peace, emotional stability, and sleep.
    """
    insights = [
        {
            "category": "Foundation",
            "title": "Moon (Manas Karaka) & Emotional Base",
            "content": "The Moon governs mind, emotions, and internal peace. A well-fortified Moon (Waxing/Paksha Bala) grants emotional resilience and psychological balance.",
            "icon": "🌙"
        },
        {
            "category": "Karakas",
            "title": "4th House & Heart Peace",
            "content": "The 4th house rules emotional grounding, domestic tranquility, and peace of heart. Benefics here insulate against anxiety and chronic worry.",
            "icon": "🧘"
        },
        {
            "category": "Diagnostics",
            "title": "Vish Yoga & Grahan Afflictions",
            "content": "Moon conjunction with Saturn (Vish Yoga) induces melancholia or emotional heaviness. Moon conjunction with Rahu/Ketu triggers panic or overthinking.",
            "icon": "⚡"
        },
        {
            "category": "Subconscious",
            "title": "12th House & Shayana Sukha (Sleep)",
            "content": "The 12th house controls subconscious processing and restful sleep. Malefics in 12th cause insomnia, nocturnal restlessness, or racing thoughts.",
            "icon": "🛌"
        },
        {
            "category": "Transits",
            "title": "Sade Sati & Lunar Cycles",
            "content": "Saturn transit over Moon (Sade Sati) or 4th house (Kantaka Shani) creates mental pressure. New/Full Moon cycles heighten emotional sensitivity.",
            "icon": "🪐"
        },
        {
            "category": "Remedy",
            "title": "Pranayama & Silver Water Therapy",
            "content": "Practicing Anulom Vilom Pranayama, drinking water from a Silver Cup, and chanting Om Namah Shivaya pacify Rahu/Ketu and stabilize Moon's water element.",
            "icon": "🌿"
        }
    ]
    return insights

@router.get("/home-peace")
async def get_home_peace_insights():
    """
    Fetch general astrological insights related to domestic peace, family harmony, and Vastu.
    """
    insights = [
        {
            "category": "Foundation",
            "title": "4th House: The Seat of Griha Sukha",
            "content": "The 4th house represents home, vehicle, emotional security, and domestic tranquility. Benefics here ensure a loving, peaceful household environment.",
            "icon": "🏡"
        },
        {
            "category": "Karakas",
            "title": "Venus, Moon & Jupiter Roles",
            "content": "Venus provides aesthetic comfort and domestic harmony, Moon rules the emotional vibe of the family, and Jupiter brings divine protection & elder blessings.",
            "icon": "🌟"
        },
        {
            "category": "Diagnostics",
            "title": "Grah Kalesh: 4th House Afflictions",
            "content": "Mars in 4th triggers sharp temper/property conflicts; Saturn causes emotional distance or heaviness; Rahu introduces sudden domestic misunderstandings.",
            "icon": "⚡"
        },
        {
            "category": "Vastu Shastra",
            "title": "North-East (Ishaan Kon) & Brahmasthan",
            "content": "Keeping North-East light and sacred preserves spiritual energy flow. Leaving the Brahmasthan (central room) open allows positive prana to circulate freely.",
            "icon": "☸️"
        },
        {
            "category": "Transits",
            "title": "Kantaka Shani & Rahu Transits",
            "content": "Saturn transiting the 4th house (Kantaka Shani) tests household patience and residential stability. Rahu transits necessitate open, honest family dialog.",
            "icon": "🪐"
        },
        {
            "category": "Remedy",
            "title": "Ghee Lamp & Camphor Cleansing",
            "content": "Lighting a Cow Ghee lamp in Ishaan Kon during dusk, burning Camphor (Kapoor) with Ganga-jal, and reciting Satyanarayan Katha dissolve domestic friction.",
            "icon": "🪔"
        }
    ]
    return insights

@router.post("/personal")
async def get_personal_family_health_analysis(payload: Dict[str, Any] = Body(...)):
    """
    Placeholder for personal family health analysis.
    """
    return []
