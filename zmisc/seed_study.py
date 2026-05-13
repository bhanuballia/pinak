import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://vedic-astrology:XyZ123@cluster0.mongodb.net/vedic_astrology?retryWrites=True&w=majority")
client = MongoClient(MONGO_URL)
db = client.vedic_astrology
study_collection = db.get_collection("study")

# Clear existing data
study_collection.delete_many({})

study_data = [
    {
        "category": "Key Houses",
        "title": "2nd House (Dhana Bhava)",
        "content": "Governs basic education, communication skills, and the early childhood learning environment. A strong 2nd house lord ensures a solid foundation in primary education.",
        "icon": "🏫"
    },
    {
        "category": "Key Houses",
        "title": "4th House (Sukha Bhava)",
        "content": "Represents formal education, schooling, and the ability to grasp new concepts. It is the seat of formal learning and academic certificates.",
        "icon": "📖"
    },
    {
        "category": "Key Houses",
        "title": "5th House (Buddhi Bhava)",
        "content": "The house of intelligence, memory, and analytical skills. It determines your creative intellect and the ability to apply knowledge practically.",
        "icon": "🧠"
    },
    {
        "category": "Key Houses",
        "title": "9th House (Dharma Bhava)",
        "content": "Signifies higher education, research, philosophy, and wisdom. It governs masters, doctorates, and specialized profound knowledge.",
        "icon": "🏛️"
    },
    {
        "category": "Key Houses",
        "title": "10th House (Karma Bhava)",
        "content": "Career-oriented studies and professional qualifications. It shows the translation of academic success into professional status.",
        "icon": "💼"
    },
    {
        "category": "Planetary Influences",
        "title": "Mercury (Budha)",
        "content": "The significator of intelligence, logic, and analytical ability. Strong Mercury makes one sharp in mathematics and communication.",
        "icon": "☿"
    },
    {
        "category": "Planetary Influences",
        "title": "Jupiter (Guru)",
        "content": "The Karaka for wisdom, higher knowledge, and spiritual learning. It grants depth and a broader perspective to one's education.",
        "icon": "♃"
    },
    {
        "category": "Planetary Influences",
        "title": "Sun (Surya)",
        "content": "Provides focus, authority, and administrative skills. Essential for those aspiring for government sectors or leadership roles in academia.",
        "icon": "☀️"
    },
    {
        "category": "Planetary Influences",
        "title": "Moon (Chandra)",
        "content": "Influences mental stability and concentration. A stable Moon is crucial for emotional intelligence and consistent study habits.",
        "icon": "🌙"
    },
    {
        "category": "Special Combinations",
        "title": "Saraswati Yoga",
        "content": "Formed when Jupiter, Venus, and Mercury are in Kendra or Trikona from Lagna. It grants exceptional mastery over arts, science, and literature.",
        "icon": "✨"
    },
    {
        "category": "Special Combinations",
        "title": "Budh-Aditya Yoga",
        "content": "Sun and Mercury conjunction in the same house. It enhances intellectual brilliance and sharpens the individual's logic and reasoning.",
        "icon": "💡"
    },
    {
        "category": "Special Combinations",
        "title": "GajKesari Yoga",
        "content": "Jupiter in a Kendra from the Moon. It brings immense wisdom, respect, and success in scholarly pursuits and research.",
        "icon": "🐘"
    },
    {
        "category": "Special Combinations",
        "title": "Bhadra & Hamsa Yoga",
        "content": "Forms of Panch Mahapurush Yoga involving Mercury and Jupiter. These yogas produce world-class scholars, teachers, and intellectual leaders.",
        "icon": "👑"
    },
    {
        "category": "Subject Specialization",
        "title": "Science & Tech",
        "content": "Influenced by Mars (Engineering), Sun (Governance), Saturn (Research), and Rahu (Computing/Modern Tech). High probability of success in technical fields.",
        "icon": "🚀"
    },
    {
        "category": "Subject Specialization",
        "title": "Finance & Commerce",
        "content": "Governed by Mercury (Accounting), Venus (Economics), and Jupiter (Banking). Excellent for Chartered Accountancy and Financial Management.",
        "icon": "📈"
    },
    {
        "category": "Subject Specialization",
        "title": "Arts & Law",
        "content": "Venus (Creativity/Design), Jupiter (Judiciary), and Moon (Humanities). Success in creative arts, literature, and legal professions.",
        "icon": "⚖️"
    },
    {
        "category": "Subject Specialization",
        "title": "Medical Sciences",
        "content": "Requires Sun (Life), Moon (Caring), Mars (Surgery), and Saturn/Rahu (Pharmaceuticals/Research). Strong 6th and 8th house influences are common.",
        "icon": "🩺"
    },
    {
        "category": "Remedies & Tips",
        "title": "East/North-East Study",
        "content": "Always study facing East or North-East to align with solar energy and enhance cognitive absorption. Keep the study area clutter-free.",
        "icon": "🧭"
    },
    {
        "category": "Remedies & Tips",
        "title": "Mercury Invocation",
        "content": "Chanting the Budha Mantra or worshipping Lord Ganesha on Wednesdays significantly improves logic and memory retention.",
        "icon": "🕉️"
    },
    {
        "category": "Remedies & Tips",
        "title": "Green Presence",
        "content": "Keeping green plants or using green stationery helps stabilize Mercury, reducing exam anxiety and improving written expression.",
        "icon": "🌿"
    },
    {
        "category": "Lal Kitab Remedies",
        "title": "Mercury in 3rd/8th/9th/12th",
        "content": "If Mercury is weak, never accept a free gift of an electronic item or a pen. Always donate green grass to a cow to strengthen intellect.",
        "icon": "🐄"
    },
    {
        "category": "Lal Kitab Remedies",
        "title": "Jupiter (Guru) Strength",
        "content": "Apply a Saffron (Kesar) Tilak on the forehead daily. This activates the Pineal gland and aligns personal energy with universal wisdom.",
        "icon": "🪔"
    },
    {
        "category": "Lal Kitab Remedies",
        "title": "Concentration Secret",
        "content": "If concentration is low, keep a small silver square piece in your wallet. It stabilizes the Moon and prevents mental flickering during exams.",
        "icon": "🥈"
    }
]

study_collection.insert_many(study_data)
print(f"Successfully seeded {len(study_data)} study insights into MongoDB!")
client.close()
