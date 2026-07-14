import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)

# Access the standalone 'study' database
db = client["study"]

# Create/Access the 'ninth_house_planets' collection
collection = db["ninth_house_planets"]

# Clear existing data
collection.delete_many({})

ninth_house_planets_data = [
    {
        "planet": "Sun",
        "knowledge": "Law, political science, administration, philosophy, leadership studies.",
        "impact": "Government jobs, politics, judiciary, leadership, teaching, spiritual guidance."
    },
    {
        "planet": "Moon",
        "knowledge": "Psychology, literature, nursing, social work, travel-related studies.",
        "impact": "Public relations, teaching, social service, hospitality, counseling."
    },
    {
        "planet": "Mars",
        "knowledge": "Engineering, military studies, law, sports, technical education.",
        "impact": "Defense, police, engineering, sports, law, administration."
    },
    {
        "planet": "Mercury",
        "knowledge": "Business studies, communication, commerce, journalism, IT, mathematics.",
        "impact": "Writing, business, teaching, marketing, finance, stock market."
    },
    {
        "planet": "Jupiter",
        "knowledge": "Philosophy, law, religious studies, higher education, spiritual sciences.",
        "impact": "Teaching, law, spiritual advisory, judiciary, research, priesthood."
    },
    {
        "planet": "Venus",
        "knowledge": "Arts, fashion, music, cinema, literature, hospitality, international business.",
        "impact": "Entertainment, luxury industry, event management, diplomacy, hotel management."
    },
    {
        "planet": "Saturn",
        "knowledge": "Technical education, mining, agriculture, economics, industrial studies.",
        "impact": "Government service, construction, judiciary, research, corporate sector."
    },
    {
        "planet": "Rahu",
        "knowledge": "IT, artificial intelligence, aviation, mass media, unconventional studies.",
        "impact": "Politics, digital media, foreign trade, film industry, research."
    },
    {
        "planet": "Ketu",
        "knowledge": "Occult sciences, research, philosophy, spiritual sciences, ancient texts.",
        "impact": "Mysticism, astrology, research, spiritual work, academic isolation."
    },
    
    # Additional Considerations
    {"type": "consideration", "title": "House Placement of 9th Lord", "content": "Modifies life philosophy and career direction."},
    {"type": "consideration", "title": "Aspects & Conjunctions", "content": "Influence personal beliefs and professional growth."},
    {"type": "consideration", "title": "D-24 (Education Chart) & D-10 (Career Chart)", "content": "Provide deeper insights into life outcomes."},
    {"type": "consideration", "title": "Nakshatra of 9th Lord", "content": "Adds further refinement in specialization and purpose."}
]

# Insert data
result = collection.insert_many(ninth_house_planets_data)
print(f"Successfully created 'ninth_house_planets' collection in 'study' database and added {len(result.inserted_ids)} records.")
