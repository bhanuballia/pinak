"""
Template: Seed a Four Planet Conjunction collection
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Mars-Jupiter Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Description 1",
        "Description 2",
        "Description 3"
    ],
    "planetRoles": {
        "Sun": "...",
        "Moon": "...",
        "Mars": "...",
        "Jupiter": "..."
    },
    "effects": {
        "powerfulSun": ["...", "..."],
        "powerfulMoon": ["...", "..."],
        "powerfulMars": ["...", "..."],
        "powerfulJupiter": ["...", "..."]
    },
    "nature": {
        "positive": ["...", "..."],
        "negative": ["...", "..."]
    },
    "housePlacements": [
        {"house": "1st House", "effect": "..."},
        {"house": "10th House", "effect": "..."}
    ],
    "keywords": ["sun", "moon", "mars", "jupiter", "conjunction", "vedic astrology"],
    
    # Detailed narrative fields for high-fidelity rendering
    "effectsDetail": {
        "powerfulSun": "Detailed narrative for Sun...",
        "powerfulMoon": "Detailed narrative for Moon...",
        "powerfulMars": "Detailed narrative for Mars...",
        "powerfulJupiter": "Detailed narrative for Jupiter..."
    },
    "positiveDetail": "Detailed positive overview...",
    "negativeDetail": "Detailed negative overview...",
    "housePlacementsDetail": [
        {"house": "1st House", "detail": "Extended detail for 1st house..."},
        {"house": "10th House", "detail": "Extended detail for 10th house..."}
    ]
}

async def seed():
    client = AsyncIOMotorClient(
        MONGO_URL,
        tlsCAFile=certifi.where(),
        tls=True,
        tlsAllowInvalidCertificates=True,
        tlsAllowInvalidHostnames=True
    )
    db = client["Four_Planet_Conjunction"]
    
    # Sort planets alphabetically for collection name
    planets = ["Sun", "Moon", "Mars", "Jupiter"] # Update these per conjunction
    planets.sort()
    col_name = "_".join(planets)
    
    col = db[col_name]
    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )
    
    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Four Planet Conjunction: {col_name} {action}.")
    print(f"     Total documents in {col_name}: {count}")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
