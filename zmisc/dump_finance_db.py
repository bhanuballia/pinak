import asyncio
import json
from bson import ObjectId
from core.database import client

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

async def dump_finance_db():
    finance_db = client["finance"]
    collections = [
        "records",
        "second_house_lord",
        "eleventh_house_lord",
        "planets_in_second_house",
        "planets_in_eleventh_house",
        "dhana_yogas"
    ]
    
    data = {}
    
    for coll_name in collections:
        collection = finance_db.get_collection(coll_name)
        cursor = collection.find({})
        docs = await cursor.to_list(length=1000)
        data[coll_name] = docs
        print(f"Dumped {len(docs)} documents from {coll_name}")
        
    with open("finance_db_dump.json", "w", encoding="utf-8") as f:
        json.dump(data, f, cls=JSONEncoder, indent=2, ensure_ascii=False)
        
    print("Database dumped to finance_db_dump.json successfully.")

if __name__ == "__main__":
    asyncio.run(dump_finance_db())
