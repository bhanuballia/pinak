import asyncio
from core.database import finance_collection, second_house_lord_collection
import os

async def check_finance_data():
    try:
        count = await finance_collection.count_documents({})
        print(f"General Finance records: {count}")
        
        lord_count = await second_house_lord_collection.count_documents({})
        print(f"2nd House Lord records: {lord_count}")
        
    except Exception as e:
        print(f"Error checking finance data: {e}")

if __name__ == "__main__":
    asyncio.run(check_finance_data())
