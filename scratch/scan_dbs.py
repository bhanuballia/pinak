import asyncio
from core.database import client

async def list_all_dbs_and_collections():
    try:
        dbs = await client.list_database_names()
        print(f"Databases: {dbs}")
        for db_name in dbs:
            db = client[db_name]
            colls = await db.list_collection_names()
            print(f"DB: {db_name} | Colls: {colls}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(list_all_dbs_and_collections())
