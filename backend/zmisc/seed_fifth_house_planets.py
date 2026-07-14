import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)

# Access the standalone 'study' database
db = client["study"]

# Create/Access the 'fifth_house_planets' collection
collection = db["fifth_house_planets"]

# Clear existing data
collection.delete_many({})

fifth_house_planets_data = [
    {
        "planet": "Sun",
        "tendencies": "Leadership, political science, law, government studies, philosophy, history.",
        "impact": "Authority, politics, government service, education, leadership roles."
    },
    {
        "planet": "Moon",
        "tendencies": "Psychology, nursing, literature, creative writing, hospitality, public relations.",
        "impact": "Teaching, writing, counseling, arts, medicine, diplomacy."
    },
    {
        "planet": "Mars",
        "tendencies": "Engineering, sports, military studies, law, technical education, defense.",
        "impact": "Military, police, engineering, competitive sports, litigation."
    },
    {
        "planet": "Mercury",
        "tendencies": "Commerce, business studies, IT, mathematics, finance, communication, journalism.",
        "impact": "Writing, business, accounting, stock market, media, analytics."
    },
    {
        "planet": "Jupiter",
        "tendencies": "Philosophy, law, religious studies, teaching, higher education, humanities.",
        "impact": "Teaching, law, spiritual advisory, judiciary, research."
    },
    {
        "planet": "Venus",
        "tendencies": "Arts, fashion, music, cinema, design, literature, hospitality, luxury management.",
        "impact": "Acting, entertainment, beauty industry, interior design, hotel management."
    },
    {
        "planet": "Saturn",
        "tendencies": "Technical education, engineering, labor studies, mining, agriculture, economics.",
        "impact": "Government jobs, labor unions, factory work, judiciary, construction."
    },
    {
        "planet": "Rahu",
        "tendencies": "IT, media, aviation, artificial intelligence, unconventional studies, psychology.",
        "impact": "Film industry, digital media, politics, technology, research."
    },
    {
        "planet": "Ketu",
        "tendencies": "Occult sciences, research, philosophy, astrology, spiritual sciences.",
        "impact": "Mysticism, astrology, research, medicine, isolated professions."
    },
    
    # Additional Considerations
    {"type": "consideration", "title": "House Placement of 5th Lord", "content": "Modifies educational and career paths."},
    {"type": "consideration", "title": "Aspects & Conjunctions", "content": "Influence subject selection and mental tendencies."},
    {"type": "consideration", "title": "D-24 (Education Chart) & D-10 (Career Chart)", "content": "Provide deeper insights into life outcomes."},
    {"type": "consideration", "title": "Nakshatra of 5th Lord", "content": "Adds further refinement in specialization."}
]

# Insert data
result = collection.insert_many(fifth_house_planets_data)
print(f"Successfully created 'fifth_house_planets' collection in 'study' database and added {len(result.inserted_ids)} records.")
