from fastapi import APIRouter, HTTPException
from core.database import client

router = APIRouter()

@router.get("/remedies/{planet}")
async def get_lal_kitab_remedies(planet: str):
    """
    Fetch the Lal Kitab data for a specific planet.
    """
    try:
        # Connect to the Lal_Kitab database
        db = client["Lal_Kitab"]
        
        # We search with a regular expression because chapters are formatted like "2. Sun : Effects and Remedies"
        # We want everything related to the requested planet.
        query = {"title": {"$regex": f"(?i){planet}"}}
        
        cursor = db.Planet_Remedies.find(query)
        documents = await cursor.to_list(length=100)
        
        if not documents:
            # Fallback data if DB is empty but reachable
            fallback = get_fallback_remedies(planet)
            if fallback:
                return {"planet": planet.capitalize(), "data": fallback, "source": "fallback"}
            raise HTTPException(status_code=404, detail=f"No Lal Kitab data found for planet: {planet}")
            
        # Clean up ObjectId which is not JSON serializable natively in FastAPI without helpers
        for doc in documents:
            doc["_id"] = str(doc["_id"])
            
        return {
            "planet": planet.capitalize(),
            "data": documents
        }
    except Exception as e:
        print(f"[LAL KITAB ERROR] DB issue: {e}")
        fallback = get_fallback_remedies(planet)
        if fallback:
            return {"planet": planet.capitalize(), "data": fallback, "source": "fallback"}
        raise HTTPException(status_code=500, detail=str(e))

def get_fallback_remedies(planet: str):
    """Provides basic Lal Kitab remedies if database is unavailable"""
    fallbacks = {
        "sun": [
            {"chapter": "Sun General Remedies", "content": "Offer water to the Sun every morning. Respect your father. Avoid salt on Sundays."},
            {"chapter": "Sun in Lal Kitab", "content": "Keep a piece of copper in your pocket. Do not accept charity."}
        ],
        "moon": [
            {"chapter": "Moon General Remedies", "content": "Respect your mother and seek her blessings. Avoid drinking milk at night. Donate rice and milk on Mondays."},
            {"chapter": "Moon in Lal Kitab", "content": "Keep a silver coin with you. Avoid using silver for business."}
        ],
        "mars": [
            {"chapter": "Mars General Remedies", "content": "Help your siblings. Donate red lentils on Tuesdays. Avoid being aggressive."},
            {"chapter": "Mars in Lal Kitab", "content": "Carry a red handkerchief. Feed sweet bread to dogs."}
        ],
        "mercury": [
            {"chapter": "Mercury General Remedies", "content": "Help orphanages or green causes. Use green clothes on Wednesdays. Worship Goddess Durga."},
            {"chapter": "Mercury in Lal Kitab", "content": "Keep a copper coin with a hole in it. Avoid gambling."}
        ],
        "jupiter": [
            {"chapter": "Jupiter General Remedies", "content": "Respect your teachers and elders. Wear yellow on Thursdays. Donate turmeric."},
            {"chapter": "Jupiter in Lal Kitab", "content": "Apply saffron tilak on forehead. Do not cut hair on Thursdays."}
        ],
        "venus": [
            {"chapter": "Venus General Remedies", "content": "Maintain good hygiene. Respect your spouse. Donate white items on Fridays."},
            {"chapter": "Venus in Lal Kitab", "content": "Keep a silver piece in your wallet. Avoid wearing dirty clothes."}
        ],
        "saturn": [
            {"chapter": "Saturn General Remedies", "content": "Help the poor and laborers. Avoid alcohol and non-veg on Saturdays. Light a mustard oil lamp."},
            {"chapter": "Saturn in Lal Kitab", "content": "Feed crows and black dogs. Do not buy iron on Saturdays."}
        ],
        "rahu": [
            {"chapter": "Rahu General Remedies", "content": "Keep your home clean. Donate blankets to the needy. Respect your paternal grandfather."},
            {"chapter": "Rahu in Lal Kitab", "content": "Keep a piece of silver in your pocket. Wear a silver chain."}
        ],
        "ketu": [
            {"chapter": "Ketu General Remedies", "content": "Feed black and white dogs. Donate sesame seeds. Respect your maternal grandfather."},
            {"chapter": "Ketu in Lal Kitab", "content": "Wear a gold ring or chain. Avoid being deceitful."}
        ]
    }
    return fallbacks.get(planet.lower(), [])
