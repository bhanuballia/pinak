import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(
    MONGO_URL, 
    serverSelectionTimeoutMS=5000,
    tlsCAFile=certifi.where(),
    tls=True,
    tlsAllowInvalidCertificates=True,
    tlsAllowInvalidHostnames=True,
    retryWrites=True
)
db = client.vedic_astrology

# Collections
profiles_collection = db.get_collection("profiles")
charts_collection = db.get_collection("charts")
yantra_collection = db.get_collection("yantra")

# Standalone Study Database
study_db = client["study"]
study_collection = study_db.get_collection("records")
key_houses_collection = study_db.get_collection("key_houses")
planet_roles_collection = study_db.get_collection("planet_roles")
fifth_house_analysis_collection = study_db.get_collection("fifth_house_analysis")
ninth_house_analysis_collection = study_db.get_collection("ninth_house_analysis")
fifth_house_planets_collection = study_db.get_collection("fifth_house_lord")
ninth_house_planets_collection = study_db.get_collection("ninth_house_lord")
planets_in_fifth_house_collection = study_db.get_collection("planets_in_fifth_house")
planets_in_ninth_house_collection = study_db.get_collection("planets_in_ninth_house")
nakshatras_collection = study_db.get_collection("nakshatras")

# Standalone Career Database
career_db = client["career"]
career_collection = career_db.get_collection("records")
tenth_house_lord_collection = career_db.get_collection("tenth_house_lord")
planets_in_tenth_house_collection = career_db.get_collection("planets_in_tenth_house")
career_planet_roles_collection = career_db.get_collection("planet_roles")
zodiac_signs_collection = career_db.get_collection("zodiac_signs")

# Standalone Finance Database
finance_db = client["finance"]
finance_collection = finance_db.get_collection("records")
second_house_lord_collection = finance_db.get_collection("second_house_lord")
eleventh_house_lord_collection = finance_db.get_collection("eleventh_house_lord")
planets_in_second_house_collection = finance_db.get_collection("planets_in_second_house")
planets_in_eleventh_house_collection = finance_db.get_collection("planets_in_eleventh_house")
dhana_yogas_collection = finance_db.get_collection("dhana_yogas")

async def test_connection():
    try:
        await client.admin.command('ping')
        print("Connected to MongoDB successfully!")
        return True
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        return False
