import asyncio
from core.database import client
import os

async def list_finance_collections():
    try:
        finance_db = client["finance"]
        collections = await finance_db.list_collection_names()
        print(f"Collections in 'finance' database: {collections}")
        
        # Also check 'study' and 'career' just in case
        study_db = client["study"]
        study_collections = await study_db.list_collection_names()
        print(f"Collections in 'study' database: {study_collections}")
        
        career_db = client["career"]
        career_collections = await career_db.list_collection_names()
        print(f"Collections in 'career' database: {career_collections}")

        # Check 'vedic_astrology' main db
        main_db = client["vedic_astrology"]
        main_collections = await main_db.list_collection_names()
        print(f"Collections in 'vedic_astrology' database: {main_collections}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(list_finance_collections())
