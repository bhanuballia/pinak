"""
Seed script - Part 1: Sun conjunctions (Sun+Moon, Sun+Mars, Sun+Mercury, Sun+Jupiter, Sun+Venus, Sun+Saturn, Sun+Rahu, Sun+Ketu)
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

conjunctions = [
    # ── SUN + MOON ──
    {
        "planet1": "Sun", "planet2": "Moon",
        "title": "Sun-Moon Conjunction (Amavasya Yoga)",
        "general": "The luminaries unite, blending ego with emotion. The native's conscious will and subconscious feelings operate as one, often producing intense personalities who feel deeply but may struggle to separate their inner world from outer identity.",
        "positive_effects": [
            "Strong willpower and self-confidence",
            "Emotional and rational minds work in harmony",
            "Natural leadership with empathetic sensitivity",
            "Creative and intuitive abilities"
        ],
        "negative_effects": [
            "Emotional instability or moodiness",
            "Mother-related issues (Moon combust Sun)",
            "Difficulty distinguishing feelings from facts",
            "Ego clashes in relationships"
        ],
        "career": "Politics, public service, healing, creative arts, government roles",
        "health": "Eye ailments, heart issues, blood pressure, mental stress",
        "remedies": [
            "Offer water to the Sun at sunrise daily",
            "Worship Lord Shiva on Mondays",
            "Wear Pearl (Moti) or Ruby (Manik) as advised",
            "Donate white items on Mondays"
        ],
        "famous_traits": "Charismatic, emotional leaders; deeply sensitive yet outwardly strong",
        "house_effects": {
            "1": "Strong personality, public prominence, health concerns",
            "7": "Relationship challenges, powerful partnerships",
            "10": "Excellent career, fame, authority"
        }
    },
    # ── SUN + MARS ──
    {
        "planet1": "Sun", "planet2": "Mars",
        "title": "Sun-Mars Conjunction (Kshatriya Yoga)",
        "general": "Two fiery planets combine, producing immense drive, courage, and ambition. This is a warrior combination — bold, action-oriented, and competitive. The native is a natural fighter who rarely backs down.",
        "positive_effects": [
            "Exceptional courage and physical stamina",
            "Strong leadership and executive ability",
            "Entrepreneurial drive and ambition",
            "Success in competitive fields"
        ],
        "negative_effects": [
            "Aggression, anger, impulsiveness",
            "Accidents, injuries, burns",
            "Domineering attitude in relationships",
            "Legal disputes or conflicts with authority"
        ],
        "career": "Military, police, surgery, sports, engineering, politics",
        "health": "Fevers, pitta disorders, accidents, head injuries, blood pressure",
        "remedies": [
            "Recite Hanuman Chalisa daily",
            "Donate red lentils on Tuesdays",
            "Wear Red Coral (Moonga) with care",
            "Avoid anger — practice patience meditation"
        ],
        "famous_traits": "Bold, fearless, action-oriented leaders and warriors",
        "house_effects": {
            "1": "Fiery personality, athletic build, aggressive nature",
            "10": "Powerful career, authority, possible conflicts at work",
            "7": "Aggressive partnerships, domineering spouse"
        }
    },
    # ── SUN + MERCURY ──
    {
        "planet1": "Sun", "planet2": "Mercury",
        "title": "Sun-Mercury Conjunction (Budhaditya Yoga)",
        "general": "The most celebrated intellectual combination in Vedic astrology. Mercury's intellect is energised by Solar vitality, creating sharp, communicative, and intelligent individuals. Often called Budhaditya Yoga when strong.",
        "positive_effects": [
            "Exceptional intelligence and quick thinking",
            "Excellent communication and writing skills",
            "Sharp analytical and business acumen",
            "Success in education, media, and commerce"
        ],
        "negative_effects": [
            "Mercury can be combust, reducing its full potential",
            "Over-analytical or overthinking tendencies",
            "Nervous system strain",
            "Ego in intellectual matters"
        ],
        "career": "Writing, journalism, teaching, accounting, IT, law, astrology",
        "health": "Nervous disorders, skin issues, speech problems if combust",
        "remedies": [
            "Recite Vishnu Sahasranama on Wednesdays",
            "Donate green items and books on Wednesdays",
            "Wear Emerald (Panna) if Mercury is strong",
            "Feed green fodder to cows"
        ],
        "famous_traits": "Witty, eloquent, intellectually gifted communicators",
        "house_effects": {
            "1": "Brilliant intellect, articulate speech",
            "3": "Outstanding writing, media skills",
            "10": "Career success through intellect and communication"
        }
    },
    # ── SUN + JUPITER ──
    {
        "planet1": "Sun", "planet2": "Jupiter",
        "title": "Sun-Jupiter Conjunction (Guru-Surya Yoga)",
        "general": "The king meets the teacher — a highly auspicious combination. Dharma, wisdom, and authority combine, bestowing leadership with ethics. The native is respected, educated, and spiritually inclined.",
        "positive_effects": [
            "Righteous leadership and moral authority",
            "Wisdom, knowledge, and higher learning",
            "Spiritual inclination and dharmic nature",
            "Success in law, education, and governance"
        ],
        "negative_effects": [
            "Jupiter may become combust near Sun",
            "Over-confidence or self-righteousness",
            "Conflicts with father or teachers",
            "Tendency to preach or moralize"
        ],
        "career": "Judiciary, teaching, administration, religion, politics, medicine",
        "health": "Liver issues, obesity, back problems",
        "remedies": [
            "Worship Lord Vishnu on Thursdays",
            "Donate yellow items and turmeric on Thursdays",
            "Wear Yellow Sapphire (Pukhraj) as advised",
            "Respect father and teachers"
        ],
        "famous_traits": "Wise, generous, authoritative, spiritually inclined leaders",
        "house_effects": {
            "1": "Noble character, spiritual wisdom, respected personality",
            "9": "Deep spiritual and philosophical nature",
            "10": "High status career, respected authority"
        }
    },
    # ── SUN + VENUS ──
    {
        "planet1": "Sun", "planet2": "Venus",
        "title": "Sun-Venus Conjunction",
        "general": "Royalty meets beauty. This combination blends authority with artistic sensibility. The native has a magnetic personality, love of luxury, and is often gifted in arts and diplomacy.",
        "positive_effects": [
            "Charm, charisma, and aesthetic sensibility",
            "Success in arts, entertainment, and luxury trades",
            "Love of beauty, comfort, and social life",
            "Diplomatic and persuasive nature"
        ],
        "negative_effects": [
            "Venus often combust — relationship challenges",
            "Overindulgence in pleasures",
            "Conflicts in marriage or partnerships",
            "Vanity or superficiality"
        ],
        "career": "Entertainment, fashion, luxury goods, diplomacy, beauty industry",
        "health": "Reproductive issues, kidney problems, eye disorders",
        "remedies": [
            "Worship Goddess Lakshmi on Fridays",
            "Donate white items and sweets on Fridays",
            "Wear Diamond or White Sapphire as advised",
            "Practice humility in relationships"
        ],
        "famous_traits": "Charming, artistic, socially graceful, luxury-loving",
        "house_effects": {
            "1": "Attractive personality, artistic nature",
            "7": "Romantic partnerships, marital challenges if Venus combust",
            "10": "Career in arts, entertainment, or public life"
        }
    },
    # ── SUN + SATURN ──
    {
        "planet1": "Sun", "planet2": "Saturn",
        "title": "Sun-Saturn Conjunction",
        "general": "The most difficult luminaries combination — father and servant, king and judge. Creates conflict between ego (Sun) and discipline (Saturn). Life brings hard lessons in authority, responsibility, and humility.",
        "positive_effects": [
            "Exceptional discipline and perseverance",
            "Success through hard work and patience",
            "Strong sense of justice and duty",
            "Leadership in challenging circumstances"
        ],
        "negative_effects": [
            "Conflict with father or authority figures",
            "Career obstacles and delayed success",
            "Health issues — bones, joints, heart",
            "Depression or feelings of inadequacy"
        ],
        "career": "Law, administration, mining, real estate, government service",
        "health": "Bone disorders, heart problems, chronic diseases, depression",
        "remedies": [
            "Worship Lord Shiva and recite Maha Mrityunjaya Mantra",
            "Donate black sesame seeds on Saturdays",
            "Wear Blue Sapphire only after expert consultation",
            "Serve the elderly and poor"
        ],
        "famous_traits": "Disciplined, hard-working, ambitious despite obstacles",
        "house_effects": {
            "1": "Serious personality, hardships in early life",
            "10": "Career struggles but eventual success through effort",
            "7": "Relationship difficulties, delay in marriage"
        }
    },
    # ── SUN + RAHU ──
    {
        "planet1": "Sun", "planet2": "Rahu",
        "title": "Sun-Rahu Conjunction (Grahan Yoga)",
        "general": "Called Grahan (Eclipse) Yoga. Rahu eclipses the Sun — ego, identity, and authority become obsessive or distorted. The native craves recognition intensely and may pursue power through unconventional means.",
        "positive_effects": [
            "Ambitious, unconventional leadership",
            "Success in foreign lands or with foreigners",
            "Innovation and out-of-the-box thinking",
            "Magnetic, hypnotic personality"
        ],
        "negative_effects": [
            "Ego distortion, false pride",
            "Conflicts with father and government",
            "Deceptive tendencies or being deceived",
            "Mental unrest, identity confusion"
        ],
        "career": "Politics (unconventional), technology, foreign trade, media manipulation",
        "health": "Neurological issues, mysterious ailments, head-related problems",
        "remedies": [
            "Recite Aditya Hridayam daily",
            "Donate wheat and jaggery on Sundays",
            "Worship Lord Ganesha to reduce Rahu's malefic effects",
            "Avoid deception and manipulation"
        ],
        "famous_traits": "Intensely ambitious, unconventional, obsessed with recognition",
        "house_effects": {
            "1": "Unusual personality, identity struggles, foreign connections",
            "10": "Rise through unconventional means, fame and controversy",
            "4": "Disturbed home life, foreign residence"
        }
    },
    # ── SUN + KETU ──
    {
        "planet1": "Sun", "planet2": "Ketu",
        "title": "Sun-Ketu Conjunction",
        "general": "Ketu dissolves the Sun's ego, pushing the native toward spirituality and detachment from authority and recognition. A deeply spiritual combination that can bring both renunciation and confusion about identity.",
        "positive_effects": [
            "Deep spiritual wisdom and detachment",
            "Psychic and intuitive abilities",
            "Past-life knowledge and mystical insight",
            "Humility and selfless service"
        ],
        "negative_effects": [
            "Low self-confidence and identity confusion",
            "Poor relationship with father",
            "Career instability and lack of recognition",
            "Isolation or feelings of disconnection"
        ],
        "career": "Spirituality, occult, research, medicine, behind-the-scenes roles",
        "health": "Head injuries, mysterious diseases, nervous system issues",
        "remedies": [
            "Worship Lord Ganesha and Lord Bhairava",
            "Donate blankets and sesame on Saturdays",
            "Recite Ketu mantra: Om Ketave Namah",
            "Practice meditation and yoga"
        ],
        "famous_traits": "Spiritually inclined, detached, intuitive, withdrawn from worldly ambition",
        "house_effects": {
            "1": "Spiritual nature, identity confusion, eccentric personality",
            "12": "Moksha orientation, foreign travel, spiritual liberation",
            "9": "Deep spiritual practices, conflicts with traditions"
        }
    },
]

async def seed():
    client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where(), tls=True,
                                 tlsAllowInvalidCertificates=True, tlsAllowInvalidHostnames=True)
    db = client["Two_Planet_Conjunction"]
    col = db["Conjunctions"]

    for doc in conjunctions:
        key = {"planet1": doc["planet1"], "planet2": doc["planet2"]}
        await col.update_one(key, {"$set": doc}, upsert=True)
        print(f"  [ok] {doc['planet1']} + {doc['planet2']}")

    count = await col.count_documents({})
    print(f"\nTotal documents in Conjunctions: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Part 1: Sun conjunctions...")
    asyncio.run(seed())
    print("[+] Part 1 done.")
