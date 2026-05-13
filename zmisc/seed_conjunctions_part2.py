"""
Seed script - Part 2: Moon conjunctions (Moon+Mars, Moon+Mercury, Moon+Jupiter, Moon+Venus, Moon+Saturn, Moon+Rahu, Moon+Ketu)
                      Mars conjunctions  (Mars+Mercury, Mars+Jupiter, Mars+Venus, Mars+Saturn, Mars+Rahu, Mars+Ketu)
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

conjunctions = [
    # ── MOON + MARS ──
    {
        "planet1": "Moon", "planet2": "Mars",
        "title": "Moon-Mars Conjunction (Chandra-Mangal Yoga)",
        "general": "A powerful Dhana (wealth) yoga in Vedic astrology. Emotions (Moon) fused with energy (Mars) creates intense passion, financial acumen, and restlessness. The native earns through real estate, finance, and mother's side.",
        "positive_effects": [
            "Financial prosperity and wealth accumulation",
            "High energy, courage, and passion",
            "Success in real estate and investments",
            "Strong willpower and emotional resilience"
        ],
        "negative_effects": [
            "Anger, impulsiveness, emotional outbursts",
            "Troubled relationship with mother",
            "Blood-related health issues",
            "Restlessness and instability"
        ],
        "career": "Real estate, banking, finance, surgery, military, food industry",
        "health": "Blood disorders, menstrual issues, accidents, fevers",
        "remedies": [
            "Worship Goddess Durga on Tuesdays",
            "Donate red lentils and jaggery",
            "Wear Red Coral after consultation",
            "Practice anger management"
        ],
        "famous_traits": "Passionate, financially savvy, emotionally intense, energetic",
        "house_effects": {
            "2": "Excellent for wealth and family finances",
            "7": "Passionate but volatile partnerships",
            "11": "Large gains and social connections"
        }
    },
    # ── MOON + MERCURY ──
    {
        "planet1": "Moon", "planet2": "Mercury",
        "title": "Moon-Mercury Conjunction",
        "general": "Emotion meets intellect. The mind (Mercury) is deeply influenced by feelings (Moon), creating intuitive thinkers and gifted communicators with strong emotional intelligence.",
        "positive_effects": [
            "Sharp memory and emotional intelligence",
            "Gifted in writing, poetry, and communication",
            "Empathetic and perceptive nature",
            "Success in counselling, teaching, and media"
        ],
        "negative_effects": [
            "Over-sensitivity and anxiety",
            "Indecisiveness due to emotional thinking",
            "Nervous disorders and mental restlessness",
            "Tendency to overthink"
        ],
        "career": "Writing, counselling, teaching, psychology, media, commerce",
        "health": "Nervous system issues, anxiety, digestive problems",
        "remedies": [
            "Recite Vishnu Sahasranama on Wednesdays",
            "Donate green vegetables on Wednesdays",
            "Wear Emerald or Pearl as advised",
            "Meditation and breathing exercises"
        ],
        "famous_traits": "Intuitive, empathetic communicators and writers",
        "house_effects": {
            "1": "Emotionally intelligent, talkative personality",
            "3": "Gifted writer, journalist, or speaker",
            "4": "Strong home-based education and emotional security"
        }
    },
    # ── MOON + JUPITER ──
    {
        "planet1": "Moon", "planet2": "Jupiter",
        "title": "Moon-Jupiter Conjunction (Gaja-Kesari Yoga context)",
        "general": "Wisdom and emotion in harmony. Jupiter expands the mind's compassion and intuition. The native is nurturing, wise, and spiritually inclined. Often related to Gaja-Kesari variants.",
        "positive_effects": [
            "Compassion, wisdom, and generous nature",
            "Strong intuition and spiritual insight",
            "Good fortune and positive thinking",
            "Excellent for teaching, healing, and mentoring"
        ],
        "negative_effects": [
            "Overindulgence and emotional excess",
            "Naivety or over-trusting nature",
            "Weight gain, liver issues",
            "Over-optimism leading to poor judgment"
        ],
        "career": "Teaching, healing, counselling, spirituality, law, public service",
        "health": "Liver, obesity, diabetes, fluid retention",
        "remedies": [
            "Worship Lord Vishnu on Thursdays",
            "Donate yellow cloth and turmeric",
            "Wear Yellow Sapphire or Pearl",
            "Read scriptures and practice dharma"
        ],
        "famous_traits": "Wise, nurturing, philosophical, generous",
        "house_effects": {
            "1": "Noble character, wise and respected personality",
            "4": "Happy home life, spiritual mother",
            "9": "Deep spirituality and dharmic nature"
        }
    },
    # ── MOON + VENUS ──
    {
        "planet1": "Moon", "planet2": "Venus",
        "title": "Moon-Venus Conjunction",
        "general": "Two benefic watery planets unite, creating a deeply romantic, artistic, and sensually inclined nature. The native is charming, loving, and has a refined aesthetic sense.",
        "positive_effects": [
            "Romantic and artistic nature",
            "Charm, beauty, and social grace",
            "Success in creative arts and entertainment",
            "Loving relationships and domestic happiness"
        ],
        "negative_effects": [
            "Overindulgence in pleasures and luxury",
            "Emotional dependency in relationships",
            "Laziness and lack of discipline",
            "Financial extravagance"
        ],
        "career": "Arts, music, fashion, beauty, hospitality, luxury goods",
        "health": "Hormonal imbalances, kidney issues, weight gain",
        "remedies": [
            "Worship Goddess Lakshmi on Fridays",
            "Donate white items and sweets",
            "Wear Diamond or White Sapphire",
            "Practice moderation in pleasures"
        ],
        "famous_traits": "Charming, artistic, romantic, socially magnetic",
        "house_effects": {
            "1": "Beautiful, charming, artistic personality",
            "5": "Creative talent, romantic affairs",
            "7": "Happy and romantic partnerships"
        }
    },
    # ── MOON + SATURN ──
    {
        "planet1": "Moon", "planet2": "Saturn",
        "title": "Moon-Saturn Conjunction (Visha Yoga)",
        "general": "Called Visha (poison) Yoga. Saturn constricts the Moon's emotions, creating depression, detachment, and hardship in early life. However, it also builds extraordinary resilience and discipline.",
        "positive_effects": [
            "Exceptional discipline and emotional resilience",
            "Capacity for hard work and perseverance",
            "Success through sustained effort",
            "Depth of character through suffering"
        ],
        "negative_effects": [
            "Depression, emotional coldness, pessimism",
            "Troubled relationship with mother",
            "Loneliness and social isolation",
            "Mental health challenges"
        ],
        "career": "Administration, research, mining, real estate, social work",
        "health": "Depression, bone issues, cold diseases, reproductive problems",
        "remedies": [
            "Worship Lord Shiva and Lord Hanuman",
            "Donate black sesame and mustard oil on Saturdays",
            "Offer milk to Shiva Lingam on Mondays",
            "Serve elderly and poor people"
        ],
        "famous_traits": "Disciplined, resilient, emotionally guarded, hard-working",
        "house_effects": {
            "1": "Serious, introverted, emotionally reserved personality",
            "4": "Difficult home life, separation from mother",
            "10": "Hard-earned career success, late recognition"
        }
    },
    # ── MOON + RAHU ──
    {
        "planet1": "Moon", "planet2": "Rahu",
        "title": "Moon-Rahu Conjunction (Grahan Yoga / Shakata Yoga)",
        "general": "Rahu eclipses the Moon, creating intense emotional hunger, obsessive thinking, and powerful imagination. The mind craves unusual experiences. This is a karmic combination producing extraordinary creative power or mental turbulence.",
        "positive_effects": [
            "Powerful imagination and creativity",
            "Success in foreign lands",
            "Unconventional and innovative thinking",
            "Psychic and intuitive gifts"
        ],
        "negative_effects": [
            "Mental restlessness, anxiety, phobias",
            "Troubled mother relationship",
            "Deception or being deceived emotionally",
            "Addictive tendencies"
        ],
        "career": "Psychology, occult, foreign trade, entertainment, politics",
        "health": "Mental disorders, phobias, nervous breakdown, mysterious ailments",
        "remedies": [
            "Worship Goddess Durga and Goddess Chandi",
            "Recite Durga Saptashati",
            "Wear Silver ring on right hand",
            "Avoid drugs and alcohol strictly"
        ],
        "famous_traits": "Intensely imaginative, emotionally obsessive, unconventional",
        "house_effects": {
            "1": "Unusual personality, mental intensity",
            "4": "Restless home life, foreign mother or residence",
            "12": "Vivid dreams, spiritual experiences, foreign settlement"
        }
    },
    # ── MOON + KETU ──
    {
        "planet1": "Moon", "planet2": "Ketu",
        "title": "Moon-Ketu Conjunction",
        "general": "Ketu dissolves the mind's attachment to the material world. The native is deeply intuitive, psychically sensitive, and spiritually oriented. Past life memories surface through dreams and intuition.",
        "positive_effects": [
            "Deep spiritual intuition and psychic gifts",
            "Detachment leading to inner peace",
            "Past-life wisdom accessible through meditation",
            "Compassion and mystical sensitivity"
        ],
        "negative_effects": [
            "Emotional detachment and depression",
            "Mother's health issues or separation",
            "Mental confusion and lack of direction",
            "Social isolation and withdrawal"
        ],
        "career": "Spirituality, healing, occult, research, charitable work",
        "health": "Mental issues, mysterious diseases, digestive problems",
        "remedies": [
            "Worship Lord Ganesha and Ketu deity",
            "Donate grey blankets and sesame",
            "Recite Om Ketave Namah 108 times",
            "Practice meditation and grounding exercises"
        ],
        "famous_traits": "Deeply intuitive, spiritually inclined, emotionally detached",
        "house_effects": {
            "1": "Spiritual personality, emotional withdrawal",
            "8": "Deep occult interests, transformative experiences",
            "12": "Moksha path, isolation, spiritual liberation"
        }
    },
    # ── MARS + MERCURY ──
    {
        "planet1": "Mars", "planet2": "Mercury",
        "title": "Mars-Mercury Conjunction",
        "general": "Action meets intellect. Mars gives Mercury's analytical mind a sharp, combative edge. The native is quick-witted, technically brilliant, and debates with passion. Excellent for engineering and strategy.",
        "positive_effects": [
            "Sharp, quick intellect and technical skill",
            "Excellence in engineering, mathematics, strategy",
            "Competitive and debating prowess",
            "Entrepreneurial mindset with execution ability"
        ],
        "negative_effects": [
            "Sharp tongue and argumentative nature",
            "Impulsive decisions and restlessness",
            "Mercury may become combust near Mars",
            "Tendency to verbal aggression"
        ],
        "career": "Engineering, surgery, law, sports commentary, journalism, IT",
        "health": "Nervous tension, accidents, skin disorders, speech issues",
        "remedies": [
            "Recite Hanuman Chalisa on Tuesdays",
            "Donate books and green items on Wednesdays",
            "Practice mindful speech",
            "Chant Budha mantra for mental clarity"
        ],
        "famous_traits": "Sharp-tongued, technically brilliant, competitive debaters",
        "house_effects": {
            "1": "Quick, sharp personality; technically gifted",
            "3": "Excellent writing, combat sports, technical skills",
            "10": "Engineering, IT, or military career success"
        }
    },
    # ── MARS + JUPITER ──
    {
        "planet1": "Mars", "planet2": "Jupiter",
        "title": "Mars-Jupiter Conjunction (Dharma-Yuddha Yoga)",
        "general": "The warrior meets the sage. This combination blends courage with wisdom, creating principled leaders and righteous fighters. The native fights for truth and dharma.",
        "positive_effects": [
            "Courageous and principled leadership",
            "Success in law, military, and governance",
            "Generous and expansive energy",
            "Success in spiritual disciplines"
        ],
        "negative_effects": [
            "Over-confidence and self-righteousness",
            "Jupiter may be weakened near Mars",
            "Conflicts over principles and ideology",
            "Liver and blood-related issues"
        ],
        "career": "Military, law, judiciary, administration, sports, teaching",
        "health": "Liver problems, fevers, blood disorders",
        "remedies": [
            "Worship Lord Vishnu and Lord Hanuman",
            "Donate yellow cloth and red lentils",
            "Wear Yellow Sapphire or Red Coral as advised",
            "Study sacred texts"
        ],
        "famous_traits": "Principled, courageous, righteous, dynamic leaders",
        "house_effects": {
            "1": "Bold, righteous, physically powerful personality",
            "9": "Dharmic warrior, religious or legal pursuits",
            "10": "Military or legal career success"
        }
    },
    # ── MARS + VENUS ──
    {
        "planet1": "Mars", "planet2": "Venus",
        "title": "Mars-Venus Conjunction",
        "general": "The cosmic lovers unite. Masculine Mars and feminine Venus create intense romantic passion, creative fire, and aesthetic drive. The native has magnetic appeal and extraordinary passion in love and art.",
        "positive_effects": [
            "Magnetic charisma and romantic intensity",
            "Creative and artistic excellence",
            "Passionate drive in relationships",
            "Success in entertainment and arts"
        ],
        "negative_effects": [
            "Over-passion leading to relationship conflicts",
            "Lustfulness and sensual excess",
            "Financial impulsiveness",
            "Venus may be combust near Mars"
        ],
        "career": "Entertainment, sports, arts, fashion, hospitality, luxury",
        "health": "Reproductive issues, STDs, kidney and blood disorders",
        "remedies": [
            "Worship Goddess Lakshmi on Fridays",
            "Worship Lord Hanuman on Tuesdays",
            "Donate white and red items on respective days",
            "Practice celibacy or relationship discipline"
        ],
        "famous_traits": "Intensely passionate, magnetically attractive, creatively driven",
        "house_effects": {
            "1": "Physically attractive, passionate personality",
            "5": "Romantic affairs, creative artistic talent",
            "7": "Passionate but volatile romantic partnerships"
        }
    },
    # ── MARS + SATURN ──
    {
        "planet1": "Mars", "planet2": "Saturn",
        "title": "Mars-Saturn Conjunction",
        "general": "Fire meets iron. This tense combination creates extreme discipline with volatile energy. The native works with iron will but faces frustration, delays, and potential for accidents or conflicts.",
        "positive_effects": [
            "Iron discipline and extraordinary perseverance",
            "Ability to accomplish extremely difficult tasks",
            "Success in engineering, construction, mining",
            "Leadership in challenging conditions"
        ],
        "negative_effects": [
            "Accidents, injuries, violence",
            "Explosive anger and frustration",
            "Conflicts with authority and the law",
            "Chronic health issues"
        ],
        "career": "Engineering, construction, military, sports, surgery, mining",
        "health": "Accidents, bone fractures, fevers, chronic inflammation",
        "remedies": [
            "Worship Lord Hanuman and Lord Shiva",
            "Donate black sesame and red lentils",
            "Chant Maha Mrityunjaya Mantra",
            "Avoid risk-taking and reckless behavior"
        ],
        "famous_traits": "Iron-willed, disciplined, volatile under pressure, physically strong",
        "house_effects": {
            "1": "Physically strong but accident-prone personality",
            "10": "Hard-won career success with conflicts",
            "8": "Danger, transformation, potential for violence or surgery"
        }
    },
    # ── MARS + RAHU ──
    {
        "planet1": "Mars", "planet2": "Rahu",
        "title": "Mars-Rahu Conjunction (Angarak Yoga)",
        "general": "Called Angarak Yoga — extremely volatile. Mars's aggression amplified by Rahu's obsession creates dangerous, uncontrolled energy. The native can be explosive, violent, or brilliantly unconventional.",
        "positive_effects": [
            "Extraordinary drive and ambition",
            "Fearlessness and revolutionary spirit",
            "Success in technology and unconventional fields",
            "Powerful sports or military career"
        ],
        "negative_effects": [
            "Explosive anger and violent tendencies",
            "Accidents and injuries",
            "Legal troubles and conflicts",
            "Reckless and self-destructive behavior"
        ],
        "career": "Military (special forces), technology, revolution, extreme sports",
        "health": "Accidents, blood disorders, explosions, burns, head injuries",
        "remedies": [
            "Recite Hanuman Chalisa daily",
            "Worship Lord Bhairava on Tuesdays",
            "Donate red items and iron",
            "Practice anger management and avoid weapons"
        ],
        "famous_traits": "Fearless, explosive, revolutionary, dangerously ambitious",
        "house_effects": {
            "1": "Aggressive, accident-prone, powerful personality",
            "8": "Danger, transformation, occult, accidents",
            "10": "Explosive career with controversies"
        }
    },
    # ── MARS + KETU ──
    {
        "planet1": "Mars", "planet2": "Ketu",
        "title": "Mars-Ketu Conjunction",
        "general": "Two warriors of karma meet. Ketu gives Mars an intuitive, detached edge while Mars energises Ketu's spiritual quest. The native is a spiritual warrior — disciplined in occult practices and fearless in the face of unknown.",
        "positive_effects": [
            "Spiritual discipline and warrior energy",
            "Success in occult, healing, and mystical arts",
            "Fearless approach to the unknown",
            "Past-life martial arts or warrior skills"
        ],
        "negative_effects": [
            "Sudden accidents and impulsive violence",
            "Reckless behavior without clear direction",
            "Conflicts with brothers and siblings",
            "Mysterious injuries or surgeries"
        ],
        "career": "Military (covert), occult, surgery, healing, spiritual warrior",
        "health": "Sudden injuries, mysterious fevers, blood disorders",
        "remedies": [
            "Worship Lord Skanda/Karttikeya and Ganesha",
            "Donate red items and sesame on Tuesdays",
            "Chant Mars and Ketu mantras",
            "Avoid anger and violence strictly"
        ],
        "famous_traits": "Fearless, spiritually intense, warrior archetype with mystical depth",
        "house_effects": {
            "1": "Fearless, intense, possibly accident-prone personality",
            "8": "Deep occult interests, transformative experiences",
            "12": "Spiritual warrior, foreign military or occult work"
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
    print("[*] Seeding Part 2: Moon & Mars conjunctions...")
    asyncio.run(seed())
    print("[+] Part 2 done.")
