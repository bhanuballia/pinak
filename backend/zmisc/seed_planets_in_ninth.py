import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)

# Access the standalone 'study' database
db = client["study"]

# Create/Access the 'planets_in_ninth_house' collection
collection = db["planets_in_ninth_house"]

# Clear existing data
collection.delete_many({})

planets_in_ninth_data = [
    {
        "planet": "Sun",
        "knowledge": "Law, political science, administration, philosophy, leadership studies.",
        "views": "Strong morals, authoritative religious beliefs, respect for traditions.",
        "impact": "Government jobs, politics, judiciary, administration, leadership roles."
    },
    {
        "planet": "Moon",
        "knowledge": "Psychology, literature, journalism, travel-related studies.",
        "views": "Emotionally driven beliefs, adaptable spirituality, love for pilgrimages.",
        "impact": "Teaching, writing, social service, hospitality, counseling."
    },
    {
        "planet": "Mars",
        "knowledge": "Engineering, military studies, law, sports, technical education.",
        "views": "Fiery beliefs, passionate about justice and righteousness.",
        "impact": "Defense, police, engineering, law, sports, administration."
    },
    {
        "planet": "Mercury",
        "knowledge": "Business studies, communication, commerce, journalism, IT, mathematics.",
        "views": "Logical approach to religion, loves debating and questioning traditions.",
        "impact": "Writing, business, teaching, marketing, finance, media."
    },
    {
        "planet": "Jupiter",
        "knowledge": "Philosophy, law, religious studies, higher education, spiritual sciences.",
        "views": "Deep wisdom, strong ethics, natural inclination towards teaching and dharma.",
        "impact": "Teaching, law, spiritual advisory, judiciary, research, priesthood."
    },
    {
        "planet": "Venus",
        "knowledge": "Arts, fashion, music, cinema, literature, hospitality, international business.",
        "views": "Balanced, luxurious spiritual outlook, belief in harmony and beauty in life.",
        "impact": "Entertainment, luxury industry, event management, diplomacy, international trade."
    },
    {
        "planet": "Saturn",
        "knowledge": "Technical education, mining, agriculture, economics, industrial studies.",
        "views": "Traditional beliefs, strict discipline in religious and moral conduct.",
        "impact": "Government service, construction, judiciary, research, corporate sector."
    },
    {
        "planet": "Rahu",
        "knowledge": "IT, artificial intelligence, aviation, mass media, unconventional studies.",
        "views": "Unorthodox spiritual beliefs, attraction to foreign or mystical philosophies.",
        "impact": "Politics, digital media, foreign trade, research, technology, unconventional careers."
    },
    {
        "planet": "Ketu",
        "knowledge": "Occult sciences, research, philosophy, astrology, ancient knowledge.",
        "views": "Detachment from material religion, mystical and deep spiritual outlook.",
        "impact": "Mysticism, astrology, research, spiritual work, academic isolation."
    },
    
    # Additional Considerations
    {"type": "consideration", "title": "Sign Placement in the 9th House", "content": "Determines how the planet functions."},
    {"type": "consideration", "title": "Aspects & Conjunctions", "content": "Modify spiritual, educational, and career tendencies."},
    {"type": "consideration", "title": "D-24 (Education Chart) & D-10 (Career Chart)", "content": "Provide deeper insights into higher education and career specialization."},
    {"type": "consideration", "title": "Nakshatra of the Planet in 9th House", "content": "Adds further refinement in wisdom, spirituality, and professional path."}
]

# Insert data
result = collection.insert_many(planets_in_ninth_data)
print(f"Successfully created 'planets_in_ninth_house' collection in 'study' database and added {len(result.inserted_ids)} records.")
