import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)

# Access the standalone 'study' database
db = client["study"]

# Create/Access the 'planets_in_fifth_house' collection
collection = db["planets_in_fifth_house"]

# Clear existing data
collection.delete_many({})

planets_in_fifth_data = [
    {
        "planet": "Sun",
        "intelligence": "Leadership, political science, law, administration, philosophy.",
        "creativity": "Strong willpower, authoritative expression, commanding personality.",
        "impact": "Government jobs, politics, leadership roles, judiciary, education."
    },
    {
        "planet": "Moon",
        "intelligence": "Psychology, literature, journalism, social work, nurturing professions.",
        "creativity": "Emotional depth, imagination, artistic talents, public appeal.",
        "impact": "Teaching, writing, counseling, acting, hospitality, child-related work."
    },
    {
        "planet": "Mars",
        "intelligence": "Engineering, sports, defense, law, technical education.",
        "creativity": "Aggressive creativity, competitive spirit, physical expression.",
        "impact": "Military, police, athletics, engineering, law, action-based careers."
    },
    {
        "planet": "Mercury",
        "intelligence": "Business, communication, journalism, mathematics, commerce.",
        "creativity": "Clever speech, analytical thinking, intellectual creativity.",
        "impact": "Writing, media, marketing, finance, stock market, public speaking."
    },
    {
        "planet": "Jupiter",
        "intelligence": "Philosophy, law, religious studies, higher education, teaching.",
        "creativity": "Wise, ethical, moral creativity, advisory nature.",
        "impact": "Teaching, law, spiritual advisory, judiciary, research."
    },
    {
        "planet": "Venus",
        "intelligence": "Arts, music, cinema, literature, fashion, luxury studies.",
        "creativity": "Romantic, aesthetic, artistic, expressive in emotions.",
        "impact": "Entertainment, beauty industry, event management, hospitality, luxury business."
    },
    {
        "planet": "Saturn",
        "intelligence": "Technical education, industrial studies, finance, conservative fields.",
        "creativity": "Reserved creativity, disciplined expression, long-term planning.",
        "impact": "Government jobs, research, engineering, finance, judiciary, administration."
    },
    {
        "planet": "Rahu",
        "intelligence": "IT, artificial intelligence, aviation, mass media, unconventional studies.",
        "creativity": "Unorthodox creativity, futuristic vision, rebellion in expression.",
        "impact": "Politics, digital media, foreign trade, research, technology."
    },
    {
        "planet": "Ketu",
        "intelligence": "Occult sciences, research, philosophy, astrology, ancient knowledge.",
        "creativity": "Detached from materialistic expression, mystical creativity.",
        "impact": "Mysticism, astrology, research, spiritual work, academic isolation."
    },
    
    # Additional Considerations
    {"type": "consideration", "title": "Sign Placement in the 5th House", "content": "Determines how the planet functions."},
    {"type": "consideration", "title": "Aspects & Conjunctions", "content": "Modify educational and creative tendencies."},
    {"type": "consideration", "title": "D-24 (Education Chart) & D-10 (Career Chart)", "content": "Provide deeper insights into life outcomes."},
    {"type": "consideration", "title": "Nakshatra of the Planet in 5th House", "content": "Adds further refinement in intelligence and creative fields."}
]

# Insert data
result = collection.insert_many(planets_in_fifth_data)
print(f"Successfully created 'planets_in_fifth_house' collection in 'study' database and added {len(result.inserted_ids)} records.")
