import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)

# Access the standalone 'study' database
db = client["study"]

# Create/Access the 'nakshatras' collection
collection = db["nakshatras"]

# Clear existing data
collection.delete_many({})

nakshatras_data = [
    {"name": "Ashwini", "tendencies": "Medicine, surgery, Ayurveda, sports science, fast decision-making fields.", "impact": "Doctors, surgeons, emergency services, paramedics, pilots, athletes."},
    {"name": "Bharani", "tendencies": "Law, forensic sciences, arts, business, media, psychology.", "impact": "Lawyers, judges, actors, entrepreneurs, psychologists, journalists."},
    {"name": "Krittika", "tendencies": "Military studies, leadership, politics, literature, management.", "impact": "Military officers, politicians, professors, authors, CEOs."},
    {"name": "Rohini", "tendencies": "Agriculture, food sciences, finance, luxury goods, creative arts.", "impact": "Bankers, designers, musicians, actors, farmers, business owners."},
    {"name": "Mrigashira", "tendencies": "Journalism, travel, research, anthropology, communication.", "impact": "Journalists, writers, travelers, researchers, detectives."},
    {"name": "Ardra", "tendencies": "Engineering, technology, artificial intelligence, psychology.", "impact": "IT professionals, psychologists, researchers, scientists, crisis management experts."},
    {"name": "Punarvasu", "tendencies": "Philosophy, teaching, spiritual studies, environmental sciences.", "impact": "Teachers, philosophers, environmentalists, motivational speakers."},
    {"name": "Pushya", "tendencies": "Medicine, finance, religious studies, management, public service.", "impact": "Doctors, bankers, religious scholars, administrators, teachers."},
    {"name": "Ashlesha", "tendencies": "Law, occult sciences, secret services, psychology, pharmacy.", "impact": "Lawyers, investigators, researchers, astrologers, chemists, politicians."},
    {"name": "Magha", "tendencies": "Politics, administration, history, government studies, law.", "impact": "Kings, politicians, historians, high-rank officers, diplomats."},
    {"name": "Purva Phalguni", "tendencies": "Arts, cinema, music, entertainment, luxury business.", "impact": "Actors, musicians, models, fashion designers, event managers."},
    {"name": "Uttara Phalguni", "tendencies": "Business management, finance, social work, politics.", "impact": "Business executives, HR managers, politicians, social workers."},
    {"name": "Hasta", "tendencies": "Handicrafts, medicine, massage therapy, architecture.", "impact": "Doctors, architects, designers, physiotherapists, craftsmen."},
    {"name": "Chitra", "tendencies": "Architecture, arts, fashion, photography, engineering.", "impact": "Architects, designers, engineers, photographers, stylists."},
    {"name": "Swati", "tendencies": "Business, commerce, entrepreneurship, law, aviation.", "impact": "Business owners, traders, diplomats, airline pilots, lawyers."},
    {"name": "Vishakha", "tendencies": "Politics, business, media, philosophy, religious studies.", "impact": "Politicians, journalists, businessmen, teachers, priests."},
    {"name": "Anuradha", "tendencies": "Psychology, philosophy, social sciences, diplomacy.", "impact": "Psychologists, diplomats, social activists, human resource managers."},
    {"name": "Jyeshtha", "tendencies": "Secret services, research, law enforcement, occult sciences.", "impact": "Detectives, intelligence officers, astrologers, forensic experts."},
    {"name": "Moola", "tendencies": "Ayurveda, occult sciences, surgery, deep research.", "impact": "Surgeons, genetic researchers, mystics, spiritual healers."},
    {"name": "Purva Ashadha", "tendencies": "Philosophy, law, international studies, literature.", "impact": "Professors, lawyers, diplomats, authors, foreign relations experts."},
    {"name": "Uttara Ashadha", "tendencies": "Government studies, public administration, leadership.", "impact": "Politicians, bureaucrats, high-ranking officials, strategists."},
    {"name": "Shravana", "tendencies": "Teaching, linguistics, music, history, religious studies.", "impact": "Teachers, historians, musicians, scholars, translators."},
    {"name": "Dhanishta", "tendencies": "Music, performing arts, finance, engineering.", "impact": "Musicians, actors, financial analysts, engineers, military personnel."},
    {"name": "Shatabhisha", "tendencies": "Astrology, astronomy, medicine, IT, aviation, research.", "impact": "Scientists, astrologers, programmers, doctors, pilots."},
    {"name": "Purva Bhadrapada", "tendencies": "Philosophy, occult sciences, research, mysticism.", "impact": "Astrologers, monks, philosophers, deep researchers, strategists."},
    {"name": "Uttara Bhadrapada", "tendencies": "Yoga, spirituality, ancient wisdom, marine sciences.", "impact": "Yogis, spiritual teachers, marine biologists, mystics, meditation guides."},
    {"name": "Revati", "tendencies": "Travel, international business, arts, healing sciences.", "impact": "Travelers, diplomats, doctors, artists, social reformers."},
    
    # Additional Considerations
    {"type": "consideration", "title": "Nakshatra Lord & Planetary Influence", "content": "Determines specific subject choices."},
    {"type": "consideration", "title": "House Placement in D1 & D24 (Education Chart)", "content": "Provides clarity on higher education."},
    {"type": "consideration", "title": "Aspects & Conjunctions", "content": "Influence specialization and success in education."},
    {"type": "consideration", "title": "Dasha & Transit Effects", "content": "Impact when and how a person excels in education."},
    
    # Dasha and Transit Analysis
    {"type": "analysis", "title": "Dasha and Transit Analysis", "content": "The running Mahadasha and Antardasha influence education. If Jupiter Dasha is active, higher education flourishes. If Rahu Dasha is active, the person may study technology or aviation."},
    
    # Navamsa and D-24 Analysis
    {"type": "analysis", "title": "Navamsa (D-9) and D-24 Analysis", "content": "The Navamsa (D-9) chart refines educational prospects. The D-24 chart (Chaturvimshamsha) is specifically analyzed for academic achievements."}
]

# Insert data
result = collection.insert_many(nakshatras_data)
print(f"Successfully created 'nakshatras' collection in 'study' database and added {len(result.inserted_ids)} records.")
