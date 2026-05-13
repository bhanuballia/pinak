import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def check_db():
    MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(MONGO_URL)
    
    print(f"Connecting to {MONGO_URL}...")
    
    # Check "study" database
    study_db = client["study"]
    collections = await study_db.list_collection_names()
    print(f"Collections in 'study' database: {collections}")
    
    for coll_name in collections:
        count = await study_db[coll_name].count_documents({})
        print(f" - {coll_name}: {count} documents")

    # Check "career" database
    career_db = client["career"]
    collections = await career_db.list_collection_names()
    print(f"Collections in 'career' database: {collections}")
    for coll_name in collections:
        count = await career_db[coll_name].count_documents({})
        print(f" - {coll_name}: {count} documents")

if __name__ == "__main__":
    asyncio.run(check_db())
