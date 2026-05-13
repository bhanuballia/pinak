import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
import os

async def check_db():
    mongo_uri = "mongodb+srv://bhanuiitgcs:bhanu361@vedicastro.ahwyvxo.mongodb.net/?appName=vedicastro"
    client = AsyncIOMotorClient(
        mongo_uri,
        tlsCAFile=certifi.where(),
        tls=True,
        tlsAllowInvalidCertificates=True,
        tlsAllowInvalidHostnames=True
    )
    
    print("Listing all databases...")
    dbs = await client.list_database_names()
    print(f"Databases: {dbs}")
    
    for db_name in dbs:
        if "Conjunction" in db_name:
            db = client[db_name]
            cols = await db.list_collection_names()
            print(f"\nDatabase: {db_name} ({len(cols)} collections)")
            if len(cols) < 50:
                print(f"Collections: {sorted(cols)}")
            else:
                print(f"Sample collections: {sorted(cols)[:10]}...")

if __name__ == "__main__":
    asyncio.run(check_db())
