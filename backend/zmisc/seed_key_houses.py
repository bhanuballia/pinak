import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)

# Access the standalone 'study' database
db = client["study"]

# Create/Access the 'key_houses' collection
collection = db["key_houses"]

# Clear existing data
collection.delete_many({})

key_houses_data = [
    # Houses
    {"type": "house", "name": "2nd House", "significance": "Basic education, communication skills, speech"},
    {"type": "house", "name": "4th House", "significance": "Formal education, schooling, grasping ability"},
    {"type": "house", "name": "5th House", "significance": "Intelligence, memory, analytical skills"},
    {"type": "house", "name": "9th House", "significance": "Higher education, philosophy, wisdom"},
    {"type": "house", "name": "10th House", "significance": "Career-oriented education, practical knowledge"},
    
    # Planets
    {"type": "planet", "name": "Mercury", "significance": "Intelligence, analytical skills, commerce, writing"},
    {"type": "planet", "name": "Jupiter", "significance": "Wisdom, philosophy, law, higher education"},
    {"type": "planet", "name": "Moon", "significance": "Imagination, creativity, psychology"},
    {"type": "planet", "name": "Sun", "significance": "Leadership, authority, administration"},
    {"type": "planet", "name": "Venus", "significance": "Arts, fashion, creativity, music"},
    {"type": "planet", "name": "Mars", "significance": "Engineering, technology, defense"},
    {"type": "planet", "name": "Saturn", "significance": "Law, research, discipline, labor-intensive fields"},
    {"type": "planet", "name": "Rahu/Ketu", "significance": "Unconventional fields, technology, spirituality"}
]

# Insert data
result = collection.insert_many(key_houses_data)
print(f"Successfully created 'key_houses' collection in 'study' database and added {len(result.inserted_ids)} records.")
