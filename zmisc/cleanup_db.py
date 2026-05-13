"""
Cleanup: Drop duplicate/misnamed collections
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

async def cleanup():
    client = AsyncIOMotorClient(
        MONGO_URL,
        tlsCAFile=certifi.where(),
        tls=True,
        tlsAllowInvalidCertificates=True,
        tlsAllowInvalidHostnames=True
    )
    db = client["Triple_Planet_Conjunction"]
    
    # List of collections to drop
    to_drop = ["Sun_Moon_Mars"]
    
    for col_name in to_drop:
        print(f"[*] Dropping collection: {col_name}...")
        await db.drop_collection(col_name)
        print(f"[ok] Dropped {col_name}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(cleanup())
