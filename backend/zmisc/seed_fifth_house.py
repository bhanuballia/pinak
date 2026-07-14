import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)

# Access the standalone 'study' database
db = client["study"]

# Create/Access the 'fifth_house_analysis' collection
collection = db["fifth_house_analysis"]

# Clear existing data
collection.delete_many({})

fifth_house_data = [
    {"placement": "1st House", "field": "Strong intellect, self-driven learning, leadership studies, philosophy, teaching, self-research-based subjects."},
    {"placement": "2nd House", "field": "Finance, commerce, accounting, banking, literature, speech-related studies, linguistics, economics."},
    {"placement": "3rd House", "field": "Journalism, mass communication, media studies, marketing, public relations, creative writing, performing arts."},
    {"placement": "4th House", "field": "Real estate, architecture, home sciences, psychology, teaching, agriculture, vehicle technology."},
    {"placement": "5th House", "field": "Pure academics, research, literature, mathematics, astrology, political science, performing arts."},
    {"placement": "6th House", "field": "Medicine, law, nursing, defense studies, competitive exam preparation, forensic science, litigation."},
    {"placement": "7th House", "field": "Business management, diplomacy, international relations, law, entrepreneurship, trade, marketing."},
    {"placement": "8th House", "field": "Occult sciences, astrology, psychology, research-oriented subjects, biotechnology, genetics, surgery."},
    {"placement": "9th House", "field": "Higher studies, philosophy, religious studies, foreign languages, history, law, spiritual sciences."},
    {"placement": "10th House", "field": "Government administration, politics, leadership courses, management, law, engineering, authoritative roles."},
    {"placement": "11th House", "field": "Economics, business studies, finance, IT, networking, social sciences, statistics, future technology."},
    {"placement": "12th House", "field": "Spirituality, psychology, medical sciences, foreign languages, philosophy, research, humanitarian studies."},
    
    # Additional Considerations
    {"type": "consideration", "title": "5th Lord’s Nakshatra", "content": "Adds a deeper layer to specific subjects."},
    {"type": "consideration", "title": "5th Lord’s Connection with Mercury or Jupiter", "content": "Enhances intellectual fields like teaching, writing, and philosophy."},
    {"type": "consideration", "title": "Influence of Rahu/Ketu on 5th Lord", "content": "Indicates unconventional or research-based education."},
    {"type": "consideration", "title": "D-24 (Chaturvimshamsha) Chart", "content": "Crucial for fine-tuning education-related predictions."}
]

# Insert data
result = collection.insert_many(fifth_house_data)
print(f"Successfully created 'fifth_house_analysis' collection in 'study' database and added {len(result.inserted_ids)} records.")
