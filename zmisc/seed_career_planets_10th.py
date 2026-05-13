
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

planets_10th_data = [
    {
        "planet": "Sun",
        "traits": ["Authority", "leadership", "government", "administration"],
        "reputation": "Strong reputation; desire for recognition",
        "best_for": ["IAS/IPS", "management", "politics"],
        "summary": "Natural leader",
        "icon": "☀️"
    },
    {
        "planet": "Moon",
        "traits": ["Public popularity", "people-oriented work"],
        "reputation": "Changeable career; visibility",
        "best_for": ["hospitality", "media", "public relations"],
        "summary": "Emotionally connected to work",
        "icon": "🌙"
    },
    {
        "planet": "Mars",
        "traits": ["Action", "courage", "technical or defense roles"],
        "reputation": "Competitive and bold",
        "best_for": ["engineering", "military", "police", "surgery"],
        "summary": "Doer and fighter",
        "icon": "♂️"
    },
    {
        "planet": "Mercury",
        "traits": ["Communication", "intellect", "business"],
        "reputation": "Analytical + versatile career",
        "best_for": ["IT", "marketing", "writing", "trading"],
        "summary": "Smart professional",
        "icon": "☿"
    },
    {
        "planet": "Jupiter",
        "traits": ["Wisdom", "ethics", "teaching", "advisory roles"],
        "reputation": "Respect and guidance-based career",
        "best_for": ["teacher", "lawyer", "consultant", "guru"],
        "summary": "Guide and mentor",
        "icon": "♃"
    },
    {
        "planet": "Venus",
        "traits": ["Creativity", "luxury", "design", "beauty"],
        "reputation": "Strong public appeal",
        "best_for": ["fashion", "film", "art", "hospitality"],
        "summary": "Creative success",
        "icon": "♀️"
    },
    {
        "planet": "Saturn",
        "traits": ["Hard work", "discipline", "long-term success"],
        "reputation": "Slow rise but very stable",
        "best_for": ["government", "engineering", "administration"],
        "summary": "Late but powerful success",
        "icon": "♄"
    },
    {
        "planet": "Rahu",
        "traits": ["Ambition", "unconventional career", "sudden rise"],
        "reputation": "Foreign connections, technology",
        "best_for": ["politics", "media", "AI", "foreign business"],
        "summary": "Obsessive success drive",
        "icon": "☊"
    },
    {
        "planet": "Ketu",
        "traits": ["Detachment from career"],
        "reputation": "Spiritual or unusual professions",
        "best_for": ["research", "occult", "spirituality"],
        "summary": "Non-material career path",
        "icon": "☋"
    }
]

async def seed_planets_10th():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client["career"]
    collection = db.get_collection("planets_in_tenth_house")
    
    # Clear existing data
    await collection.delete_many({})
    
    # Insert new data
    result = await collection.insert_many(planets_10th_data)
    print(f"Inserted {len(result.inserted_ids)} planets in 10th house records.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_planets_10th())
