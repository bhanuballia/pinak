import asyncio
import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def test():
    MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(
        MONGO_URL, 
        serverSelectionTimeoutMS=5000,
        tlsCAFile=certifi.where()
    )
    result = ""
    try:
        await client.admin.command('ping')
        result = "SUCCESS: Connected to MongoDB Atlas!"
    except Exception as e:
        result = f"FAILED: Still having issues: {e}"
    
    with open("db_test_result.txt", "w") as f:
        f.write(result)
    print(result)

if __name__ == "__main__":
    asyncio.run(test())
