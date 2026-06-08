import asyncio
from core.database import profiles_collection

async def main():
    try:
        count = await profiles_collection.count_documents({})
        print(f"Total profiles: {count}")
        async for doc in profiles_collection.find().limit(5):
            print("Profile:", doc.get("name"), doc.get("date"), doc.get("time"))
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(main())
