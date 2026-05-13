"""
Initialize: Triple_Planet_Conjunction database in MongoDB
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

# Example schema for a Triple Conjunction (Sun-Moon-Mars)
sample_triple = {
    "combination": "Sun-Moon-Mars Conjunction",
    "category": "Triple Planetary Combination",
    "planets": ["Sun", "Moon", "Mars"],
    "overview": [
        "A volatile mix of ego (Sun), emotion (Moon), and action (Mars).",
        "Indicates a highly energetic but potentially impulsive personality.",
        "The native may possess great courage but struggle with emotional stability."
    ],
    "effects": {
        "dominantSun": ["Strong leadership, but can be overly dominating in family matters."],
        "dominantMoon": ["High emotional intensity; actions are driven by feelings rather than logic."],
        "dominantMars": ["Extreme bravery and competitive spirit; potential for aggressive outbursts."]
    },
    "nature": {
        "positive": ["Tremendous willpower", "Rapid execution of ideas", "Protective nature"],
        "negative": ["Impulsiveness", "Ego clashes", "Emotional exhaustion"]
    },
    "housePlacements": [
        {"house": "1st House", "effect": "Commanding presence but prone to headaches or high blood pressure."},
        {"house": "10th House", "effect": "Great success in administrative or military roles."}
    ],
    "keywords": ["triple conjunction", "sun", "moon", "mars", "energy", "impulse"]
}

async def init_db():
    client = AsyncIOMotorClient(
        MONGO_URL,
        tlsCAFile=certifi.where(),
        tls=True,
        tlsAllowInvalidCertificates=True,
        tlsAllowInvalidHostnames=True
    )
    
    # This creates the database and collection upon insertion
    db = client["Triple_Planet_Conjunction"]
    collection_name = "Mars_Moon_Sun"
    col = db[collection_name]
    
    await col.update_one(
        {"combination": sample_triple["combination"]},
        {"$set": sample_triple},
        upsert=True
    )
    
    print(f"[ok] Database 'Triple_Planet_Conjunction' initialized.")
    print(f"[ok] Collection '{collection_name}' created with sample data.")
    client.close()

if __name__ == "__main__":
    asyncio.run(init_db())
