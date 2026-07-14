import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://vedic-astrology:XyZ123@cluster0.mongodb.net/vedic_astrology?retryWrites=True&w=majority")
client = MongoClient(MONGO_URL)
db = client.vedic_astrology
study_collection = db.get_collection("study")

# Clear existing data to avoid duplicates, or keep it? 
# The user wants "below data in study collection", so I'll refresh it with this premium content.
study_collection.delete_many({})

study_data = [
    {
        "category": "Introduction",
        "title": "Vedic Science of Learning",
        "content": "Astrology is a Vedic science that helps reveal the past, present, and future. In the present age, with many streams of education available, astrology helps in identifying strengths, weaknesses, and opportunities through an individual's birth chart, guiding students toward the right path during crucial decisions like 10th or 12th grade.",
        "icon": "📜"
    },
    {
        "category": "Core Planets",
        "title": "Educational Significators",
        "content": "Three planets play foundational roles: Jupiter signifies total knowledge and wisdom, Mercury signifies intelligence and logical processing, and the Moon signifies the state of the mind and concentration.",
        "icon": "🪐"
    },
    {
        "category": "Key Houses",
        "title": "House Progression (2-9)",
        "content": "2nd House: Basic/primary education and samskaras. 4th House: Higher schooling and the ability to grasp. 5th House: Memory power and intellect. 9th House: Master's degrees and logical thinking. 8th House: Research and occult sciences.",
        "icon": "🏠"
    },
    {
        "category": "Stages of Education",
        "title": "Tracking Growth",
        "content": "Early childhood can be found through the 2nd house. Overall prospects through the 4th. Success until a Bachelor’s degree is seen from both 4th and 5th houses. Master’s and specialized research prospects are seen in the 9th house. Good Dashas during these periods are vital for recognition.",
        "icon": "📈"
    },
    {
        "category": "Subject Specialization",
        "title": "Sun: Medicine & Politics",
        "content": "The Sun governs fields of Medicine, Administration, high-level Politics, and Zoology. It grants the authority and vitality needed for these sectors.",
        "icon": "☀️"
    },
    {
        "category": "Subject Specialization",
        "title": "Moon: Psychology & Marketing",
        "content": "The Moon influences Marine sciences, Horticulture, Home Science, Nursing, Botany, Psychology, and Marketing. It relates to caring, growth, and the public eye.",
        "icon": "🌙"
    },
    {
        "category": "Subject Specialization",
        "title": "Mars: Tech & Engineering",
        "content": "Mars governs Military, Geology, Mechanics, Surgery, Electrical & Electronics Engineering, and Agricultural Sciences. It provides the energy and technical precision required.",
        "icon": "⚔️"
    },
    {
        "category": "Subject Specialization",
        "title": "Mercury: Commerce & Arts",
        "content": "Mercury signifies Mathematics, Literature, Banking, Commerce, Aviation, Languages, Journalism, and Media/Theatre. It is the lord of communication and calculation.",
        "icon": "☿"
    },
    {
        "category": "Subject Specialization",
        "title": "Jupiter: Law & Research",
        "content": "Jupiter governs Law, Banking, Philosophy, Religious Scriptures, and In-depth Research learning. It brings expansion and ethical depth to these fields.",
        "icon": "♃"
    },
    {
        "category": "Subject Specialization",
        "title": "Venus: Design & Management",
        "content": "Venus influences Hotel Management, Telecommunication, Fine Arts, Sociology, Architecture, and Jewelry/Textile Design. It is the planet of aesthetics and social structures.",
        "icon": "🎨"
    },
    {
        "category": "Subject Specialization",
        "title": "Saturn: History & Metallurgy",
        "content": "Saturn governs Metallurgy, Engineering, Politics, and History. It represents structure, deep-rooted tradition, and the discipline of hard metals and past records.",
        "icon": "♄"
    },
    {
        "category": "Subject Specialization",
        "title": "Rahu: Modern Science",
        "content": "Rahu influences Engineering, Forensic sciences, Electrical systems, Computer Science, and Nuclear Science. It represents the breakthrough and unconventional technologies.",
        "icon": "🌑"
    },
    {
        "category": "Subject Specialization",
        "title": "Ketu: Philosophy & Coding",
        "content": "Ketu governs Computer Science, Philosophy, and Metaphysical subjects. It provides deep technical insight and the ability to look beyond the material surface.",
        "icon": "💥"
    },
    {
        "category": "Advanced Analysis",
        "title": "Conjunctions & Synergy",
        "content": "Fine-tuning requires looking at aspects. Sun + Mars indicates Civil Services or Surgeons. Sun + Venus leads to Fashion and Theatre. Mars + Rahu + Saturn indicates heavy Technical Engineering. Mars + Mercury gives expertise in Computers and Programming. Jupiter's aspect amplifies success in any of these chosen paths.",
        "icon": "🔄"
    },
    {
        "category": "Advanced Analysis",
        "title": "Educational Hurdles",
        "content": "Afflictions to key houses (2, 4, 5, 9) indicate specific level hurdles. These might manifest as problems in general intelligence or difficulty in grasping complex materials. Timely remedies and focusing on planetary strengths can lessen the impact of these weaknesses.",
        "icon": "⚠️"
    }
]

# Insert records
result = study_collection.insert_many(study_data)
print(f"Successfully seeded {len(result.inserted_ids)} detailed study records into MongoDB!")
