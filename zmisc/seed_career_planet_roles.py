
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

planet_roles_data = [
    {
        "planet": "Sun",
        "signification": "Authority & Government",
        "roles": ["Leadership roles", "Administration", "politics"],
        "icon": "☀️"
    },
    {
        "planet": "Moon",
        "signification": "Public Interaction",
        "roles": ["Hospitality", "caregiving", "Mass connection jobs"],
        "icon": "🌙"
    },
    {
        "planet": "Mars",
        "signification": "Action & Engineering",
        "roles": ["Military", "sports", "mechanics", "High-energy careers"],
        "icon": "♂️"
    },
    {
        "planet": "Mercury",
        "signification": "Business & Communication",
        "roles": ["IT", "trading", "writing", "analytics", "Multi-skill professions"],
        "icon": "☿"
    },
    {
        "planet": "Jupiter",
        "signification": "Knowledge & Guidance",
        "roles": ["Teaching", "law", "consulting", "Finance & ethics"],
        "icon": "♃"
    },
    {
        "planet": "Venus",
        "signification": "Luxury & Creativity",
        "roles": ["Fashion", "film", "beauty industry", "Design", "entertainment"],
        "icon": "♀️"
    },
    {
        "planet": "Saturn",
        "signification": "Labor & Structure",
        "roles": ["Government jobs", "Engineering", "administration", "Mass workforce management"],
        "icon": "♄"
    },
    {
        "planet": "Rahu",
        "signification": "Technology & Foreign",
        "roles": ["IT", "AI", "digital", "politics", "Foreign or unconventional careers"],
        "icon": "☊"
    },
    {
        "planet": "Ketu",
        "signification": "Spiritual & Research",
        "roles": ["Astrology", "occult", "research", "Isolation-based professions"],
        "icon": "☋"
    }
]

async def seed_planet_roles():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client["career"]
    collection = db.get_collection("planet_roles")
    
    # Clear existing data
    await collection.delete_many({})
    
    # Insert new data
    result = await collection.insert_many(planet_roles_data)
    print(f"Inserted {len(result.inserted_ids)} career planet role records.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_planet_roles())
