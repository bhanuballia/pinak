import pymongo
import re
import sys
import os
from dotenv import load_dotenv

load_dotenv()

try:
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    print(f"Connecting to MongoDB at {mongo_url}...")
    client = pymongo.MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
    client.server_info() # verify connection
    print("Connected.")
except Exception as e:
    print(f"MongoDB not running or accessible: {e}")
    sys.exit(1)

db = client["Lal_Kitab"]
collection = db["Planet_Remedies"]

texts = []
for i in [1, 2, 3]:
    with open(f"d:/vedic-astrology-app/lal_kitab_raw_{i}.txt", "r", encoding="utf-8") as f:
        texts.append(f.read())

full_text = "\n\n".join(texts)

# Regex to find chapters
sections = re.split(r'(?m)^(\d+\.\s+.+?)(?:\r?\n)', full_text)

docs = []
for i in range(1, len(sections), 2):
    title = sections[i].strip()
    content = sections[i+1].strip()
    if len(content) > 100:
        docs.append({"chapter": title, "content": content})

collection.drop()
if docs:
    collection.insert_many(docs)
    print(f"Inserted {len(docs)} documents into Lal_Kitab.Planet_Remedies.")
else:
    print("No documents parsed.")

if len(docs) < 8:
    print("Warning: Might not have matched all planets. Using fallback structure.")
    collection.drop()
    collection.insert_one({"chapter": "Complete_Lal_Kitab", "content": full_text})
    print("Inserted all as a single document instead.")
