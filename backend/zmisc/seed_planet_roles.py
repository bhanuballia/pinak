import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)

# Access the standalone 'study' database
db = client["study"]

# Create/Access the 'planet_roles' collection
collection = db["planet_roles"]

# Clear existing data
collection.delete_many({})

planet_roles_data = [
    {
        "planet": "Sun",
        "title": "Sun (Surya) – Administration, Law, Government Studies",
        "subjects": ["Political Science", "Public Administration", "Law", "Defense Studies"],
        "strong_placements": [1, 5, 9, 10],
        "professions": ["Government officers", "civil services (IAS, IPS)", "law", "politics"],
        "example": "Sun in the 10th house may indicate a career in public administration or law."
    },
    {
        "planet": "Moon",
        "title": "Moon (Chandra) – Psychology, Literature, Arts, Nursing",
        "subjects": ["Psychology", "Sociology", "Literature", "Poetry", "Nursing", "Hospitality"],
        "strong_placements": [4, 5, 9, 12],
        "professions": ["Teacher", "counselor", "social worker", "writer", "nurse"],
        "example": "Moon in the 5th house makes a person inclined towards literature or psychology."
    },
    {
        "planet": "Mars",
        "title": "Mars (Mangal) – Engineering, Military, Surgery",
        "subjects": ["Engineering (Mechanical, Civil, Electrical)", "Military Sciences", "Surgery"],
        "strong_placements": [1, 6, 10],
        "professions": ["Engineers", "surgeons", "defense officers", "police"],
        "example": "Mars in the 10th house makes a person inclined towards mechanical engineering or military service."
    },
    {
        "planet": "Mercury",
        "title": "Mercury (Budh) – Commerce, Business, Communication",
        "subjects": ["Commerce", "Mathematics", "Journalism", "Writing", "Marketing", "IT"],
        "strong_placements": [2, 4, 5, 10],
        "professions": ["Business executives", "accountants", "writers", "IT professionals"],
        "example": "Mercury in the 5th house indicates analytical skills, making a person inclined toward finance or data science."
    },
    {
        "planet": "Jupiter",
        "title": "Jupiter (Guru) – Law, Teaching, Research, Finance",
        "subjects": ["Law", "Finance", "Teaching", "Philosophy", "Religious Studies"],
        "strong_placements": [2, 5, 9],
        "professions": ["Professors", "lawyers", "spiritual leaders", "investment analysts"],
        "example": "Jupiter in the 9th house indicates a scholar or philosopher."
    },
    {
        "planet": "Venus",
        "title": "Venus (Shukra) – Arts, Fashion, Media, Entertainment",
        "subjects": ["Fine Arts", "Music", "Dance", "Fashion Designing", "Film Studies"],
        "strong_placements": [2, 4, 5, 12],
        "professions": ["Artists", "actors", "musicians", "fashion designers"],
        "example": "Venus in the 5th house makes a person inclined towards performing arts."
    },
    {
        "planet": "Saturn",
        "title": "Saturn (Shani) – Law, Science, Research, Industrial Work",
        "subjects": ["Law", "Agriculture", "Industrial Management", "Mining", "History"],
        "strong_placements": [1, 9, 10],
        "professions": ["Judges", "industrialists", "historians", "researchers"],
        "example": "Saturn in the 9th house supports legal studies or research work."
    },
    {
        "planet": "Rahu",
        "title": "Rahu – Technology, Politics, Unconventional Studies",
        "subjects": ["Artificial Intelligence", "Politics", "Aviation", "Space Research", "IT"],
        "strong_placements": [3, 10, 12],
        "professions": ["Scientists", "hackers", "politicians", "media analysts"],
        "example": "Rahu in the 10th house can indicate an inclination toward cybersecurity or space research."
    },
    {
        "planet": "Ketu",
        "title": "Ketu – Spirituality, Mathematics, Occult Sciences",
        "subjects": ["Astrology", "Mysticism", "Philosophy", "Mathematics"],
        "strong_placements": [9, 12],
        "professions": ["Astrologers", "monks", "researchers", "mathematicians"],
        "example": "Ketu in the 12th house gives an interest in spirituality and meditation."
    }
]

# Insert data
result = collection.insert_many(planet_roles_data)
print(f"Successfully created 'planet_roles' collection in 'study' database and added {len(result.inserted_ids)} records.")
