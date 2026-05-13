import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)

# Access the standalone 'study' database
db = client["study"]

# Create/Access the 'ninth_house_analysis' collection
collection = db["ninth_house_analysis"]

# Clear existing data
collection.delete_many({})

ninth_house_data = [
    {"placement": "1st House", "effect": "Higher education, self-driven learning, strong moral values, philosophy, law, teaching, leadership roles."},
    {"placement": "2nd House", "effect": "Wealth from knowledge, finance-related studies, literature, history, economics, speech-based careers."},
    {"placement": "3rd House", "effect": "Writing, journalism, publishing, marketing, communication, media, short-term travel for education."},
    {"placement": "4th House", "effect": "Academic excellence, teaching, real estate, psychology, homeland-based education, parental influence."},
    {"placement": "5th House", "effect": "Strong intellect, research, higher studies, astrology, mathematics, political science, deep knowledge."},
    {"placement": "6th House", "effect": "Law, medical studies, defense, government service, competitive exams, social justice fields."},
    {"placement": "7th House", "effect": "Business studies, international relations, diplomacy, law, foreign trade, advisory roles."},
    {"placement": "8th House", "effect": "Research, occult sciences, astrology, forensic science, surgery, deep transformative knowledge."},
    {"placement": "9th House", "effect": "Higher learning, wisdom, spiritual studies, law, philosophy, religious texts, international education."},
    {"placement": "10th House", "effect": "Government jobs, politics, administration, law, judiciary, authoritative positions."},
    {"placement": "11th House", "effect": "Finance, economics, social sciences, technology, networking, future studies, business analytics."},
    {"placement": "12th House", "effect": "Spirituality, philosophy, foreign education, psychology, humanitarian work, foreign settlement."},
    
    # Additional Considerations
    {"type": "consideration", "title": "Jupiter/Mercury Influence", "content": "Enhances education, wisdom, and advisory roles."},
    {"type": "consideration", "title": "Mars/Saturn Influence", "content": "Practical or technical education like engineering or law."},
    {"type": "consideration", "title": "Venus Influence", "content": "Arts, literature, luxury industry, international business."},
    {"type": "consideration", "title": "Rahu/Ketu Influence", "content": "Unconventional knowledge, foreign education, mysticism."},
    {"type": "consideration", "title": "Nakshatra of 9th Lord", "content": "Adds specificity to subject choices."},
    {"type": "consideration", "title": "D-24 (Chaturvimshamsha) Chart", "content": "Crucial for precise education predictions."}
]

# Insert data
result = collection.insert_many(ninth_house_data)
print(f"Successfully created 'ninth_house_analysis' collection in 'study' database and added {len(result.inserted_ids)} records.")
