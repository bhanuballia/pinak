
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

tenth_lord_data = [
    {
        "placement": "1st House",
        "features": ["Self-made Career", "Strong ambition", "self-driven", "Entrepreneurial mindset", "Leadership roles", "Public recognition"],
        "summary": "You build your own path",
        "icon": "⭐"
    },
    {
        "placement": "2nd House",
        "features": ["Career linked to finance", "speech", "family business", "Banking", "teaching", "consulting"],
        "summary": "Income stability through profession",
        "icon": "⭐"
    },
    {
        "placement": "3rd House",
        "features": ["Media", "communication", "marketing", "Writing", "sales", "travel-related jobs"],
        "summary": "Success through courage + effort",
        "icon": "⭐"
    },
    {
        "placement": "4th House",
        "features": ["Real estate", "vehicles", "education", "Work connected to homeland"],
        "summary": "Career tied to comfort & assets",
        "icon": "⭐"
    },
    {
        "placement": "5th House",
        "features": ["Creative Career", "Education", "arts", "speculation", "entertainment", "Strong intelligence-based work"],
        "summary": "Fame through creativity",
        "icon": "⭐"
    },
    {
        "placement": "6th House",
        "features": ["Jobs", "service sector", "government", "litigation", "Competitive environment", "Hard work + struggle → success"],
        "summary": "Success through service & competition",
        "icon": "⭐"
    },
    {
        "placement": "7th House",
        "features": ["Business", "partnerships", "consulting", "Public-facing roles"],
        "summary": "Success through dealing with people",
        "icon": "⭐"
    },
    {
        "placement": "8th House",
        "features": ["Research", "occult", "insurance", "investigation", "Sudden ups and downs"],
        "summary": "Hidden or transformative career path",
        "icon": "⚠️"
    },
    {
        "placement": "9th House",
        "features": ["Teaching", "law", "spirituality", "higher knowledge", "Luck supports career"],
        "summary": "Dharma supports Karma",
        "icon": "⭐"
    },
    {
        "placement": "10th House",
        "features": ["Peak career strength", "Authority", "leadership", "recognition", "Stable profession"],
        "summary": "Born for success",
        "icon": "⭐"
    },
    {
        "placement": "11th House",
        "features": ["Networking", "large organizations", "High earnings potential"],
        "summary": "Career brings gains & connections",
        "icon": "⭐"
    },
    {
        "placement": "12th House",
        "features": ["Foreign lands", "hospitals", "NGOs", "research", "Expenses linked to profession"],
        "summary": "Career away from homeland",
        "icon": "⭐"
    }
]

async def seed_tenth_lord():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client["career"]
    collection = db.get_collection("tenth_house_lord")
    
    # Clear existing data
    await collection.delete_many({})
    
    # Insert new data
    result = await collection.insert_many(tenth_lord_data)
    print(f"Inserted {len(result.inserted_ids)} 10th house lord placement records.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_tenth_lord())
