"""
Seed script - Part 3: Remaining 15 conjunctions
Mercury+Jupiter, Mercury+Venus, Mercury+Saturn, Mercury+Rahu, Mercury+Ketu,
Jupiter+Venus, Jupiter+Saturn, Jupiter+Rahu, Jupiter+Ketu,
Venus+Saturn, Venus+Rahu, Venus+Ketu,
Saturn+Rahu, Saturn+Ketu, Rahu+Ketu
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

conjunctions = [
    # ── MERCURY + JUPITER ──
    {
        "planet1": "Mercury", "planet2": "Jupiter",
        "title": "Mercury-Jupiter Conjunction",
        "general": "The scholar's yoga. Intellect (Mercury) and wisdom (Jupiter) blend to create brilliant teachers, philosophers, and advisors. The native has a vast, well-organised mind and loves learning.",
        "positive_effects": [
            "Brilliant intellect and philosophical depth",
            "Exceptional teaching and writing ability",
            "Success in law, education, and counselling",
            "Ethical and principled thinking"
        ],
        "negative_effects": [
            "Over-intellectualising emotions",
            "Verbose or preachy communication style",
            "Mercury combust near Jupiter sometimes",
            "Difficulty making quick decisions"
        ],
        "career": "Teaching, law, publishing, philosophy, astrology, consulting",
        "health": "Liver, nervous system, skin disorders",
        "remedies": [
            "Worship Lord Vishnu on Thursdays and Wednesdays",
            "Donate books and yellow cloth",
            "Wear Emerald or Yellow Sapphire as advised",
            "Read and share sacred knowledge"
        ],
        "famous_traits": "Learned, eloquent, philosophical, ethical advisors",
        "house_effects": {
            "1": "Highly intelligent, articulate, learned personality",
            "3": "Gifted writer and orator",
            "9": "Deep philosophy, religious scholarship"
        }
    },
    # ── MERCURY + VENUS ──
    {
        "planet1": "Mercury", "planet2": "Venus",
        "title": "Mercury-Venus Conjunction",
        "general": "Intellect meets beauty. This artistic conjunction produces gifted communicators in creative fields — poets, musicians, designers, and diplomats. The native has a refined, charming wit.",
        "positive_effects": [
            "Artistic, poetic, and musical talent",
            "Charming communication and social grace",
            "Success in media, arts, and luxury trades",
            "Romantic intelligence and relationship skills"
        ],
        "negative_effects": [
            "Superficiality or vanity",
            "Indecisiveness in love matters",
            "Scattered focus between arts and intellect",
            "Financial impracticality"
        ],
        "career": "Music, poetry, design, fashion, media, diplomacy, beauty",
        "health": "Kidney issues, skin disorders, nervous tension",
        "remedies": [
            "Worship Goddess Saraswati and Lakshmi",
            "Donate green and white items",
            "Wear Emerald or Diamond as advised",
            "Practice creative arts regularly"
        ],
        "famous_traits": "Charming, artistic, witty, romantically intelligent",
        "house_effects": {
            "1": "Charming, artistic personality with refined taste",
            "5": "Creative talent, romantic intelligence",
            "7": "Charming partnerships, love of beauty in relationships"
        }
    },
    # ── MERCURY + SATURN ──
    {
        "planet1": "Mercury", "planet2": "Saturn",
        "title": "Mercury-Saturn Conjunction",
        "general": "The methodical analyst. Saturn disciplines Mercury's quick mind into systematic, structured thinking. Produces excellent researchers, scientists, and administrators who think deeply before acting.",
        "positive_effects": [
            "Systematic, methodical intellect",
            "Excellent research and analytical ability",
            "Disciplined communication and writing",
            "Success in science, research, and administration"
        ],
        "negative_effects": [
            "Pessimistic or negative thinking patterns",
            "Speech delays or communication inhibition",
            "Cold, detached communication style",
            "Anxiety and mental rigidity"
        ],
        "career": "Research, science, administration, law, accounting, engineering",
        "health": "Nervous disorders, depression, speech issues, skin problems",
        "remedies": [
            "Worship Lord Shiva on Saturdays",
            "Donate black sesame and green items",
            "Wear Blue Sapphire and Emerald after consultation",
            "Practice positive affirmations daily"
        ],
        "famous_traits": "Methodical, serious, deep thinkers and researchers",
        "house_effects": {
            "1": "Serious, analytical, reserved personality",
            "6": "Excellent in research, service, health fields",
            "10": "Disciplined career success, structured work"
        }
    },
    # ── MERCURY + RAHU ──
    {
        "planet1": "Mercury", "planet2": "Rahu",
        "title": "Mercury-Rahu Conjunction",
        "general": "Rahu amplifies Mercury's intellect into obsessive, unconventional brilliance. The native is a master communicator in technology, media, and foreign fields — but prone to deceptive or manipulative speech.",
        "positive_effects": [
            "Genius-level intellect and communication",
            "Success in technology and digital media",
            "Foreign language mastery",
            "Unconventional, innovative problem-solving"
        ],
        "negative_effects": [
            "Deceptive or manipulative speech",
            "Mental obsession and information overload",
            "Spreading misinformation",
            "Nervous breakdowns from overstimulation"
        ],
        "career": "Technology, AI, media, foreign communication, trading",
        "health": "Nervous disorders, anxiety, speech issues, skin problems",
        "remedies": [
            "Worship Lord Ganesha to remove obstacles",
            "Donate green and mixed items on Wednesdays",
            "Recite Rahu mantra and Budha mantra",
            "Practice truthful communication strictly"
        ],
        "famous_traits": "Brilliantly unconventional, tech-savvy, intensely communicative",
        "house_effects": {
            "1": "Unusual intellect, obsessive thinking, clever personality",
            "3": "Genius writer or communicator, possibly deceptive",
            "10": "Career in technology, media, or foreign fields"
        }
    },
    # ── MERCURY + KETU ──
    {
        "planet1": "Mercury", "planet2": "Ketu",
        "title": "Mercury-Ketu Conjunction",
        "general": "Ketu dissolves Mercury's logical framework, producing intuitive, mystical thinking. The native taps into past-life knowledge and has a non-linear, spiritual intellect.",
        "positive_effects": [
            "Intuitive and mystical intelligence",
            "Past-life knowledge and spiritual insight",
            "Excellence in occult, healing, and research",
            "Non-linear creative problem-solving"
        ],
        "negative_effects": [
            "Difficulty in organised, linear thinking",
            "Communication confusion or stammering",
            "Mental detachment and absent-mindedness",
            "Struggles in conventional education"
        ],
        "career": "Occult, astrology, healing, research, spirituality, alternative medicine",
        "health": "Nervous disorders, speech issues, mysterious mental symptoms",
        "remedies": [
            "Worship Lord Ganesha and Lord Vishnu",
            "Donate green and grey items",
            "Recite Ketu and Budha mantras",
            "Practice mindfulness and grounding"
        ],
        "famous_traits": "Intuitively brilliant, mystical thinkers, non-linear genius",
        "house_effects": {
            "1": "Unique, intuitive, possibly eccentric personality",
            "8": "Deep occult intellect, research into mysteries",
            "12": "Spiritual knowledge, foreign languages, isolation"
        }
    },
    # ── JUPITER + VENUS ──
    {
        "planet1": "Jupiter", "planet2": "Venus",
        "title": "Jupiter-Venus Conjunction",
        "general": "The two great benefics unite in a highly auspicious combination. Wisdom meets beauty; dharma meets pleasure. The native is wealthy, wise, artistic, and blessed with a loving family and spiritual inclination.",
        "positive_effects": [
            "Great wealth, prosperity, and comfort",
            "Wisdom combined with artistic sensibility",
            "Loving marriage and happy family life",
            "Spiritual elevation through beauty and devotion"
        ],
        "negative_effects": [
            "Overindulgence in luxury and pleasure",
            "Lazy or hedonistic tendencies",
            "Conflicting values between dharma and desire",
            "Weight gain and health from excess"
        ],
        "career": "Arts, luxury business, spirituality, counselling, law, medicine",
        "health": "Liver, kidney, diabetes, obesity from excess",
        "remedies": [
            "Worship Lord Vishnu and Goddess Lakshmi",
            "Donate yellow and white items",
            "Wear Yellow Sapphire or Diamond as advised",
            "Practice moderation and gratitude"
        ],
        "famous_traits": "Wealthy, wise, artistically inclined, deeply spiritual and loving",
        "house_effects": {
            "1": "Blessed, beautiful, wise personality",
            "2": "Wealth and family happiness",
            "7": "Excellent for marriage and loving partnerships"
        }
    },
    # ── JUPITER + SATURN ──
    {
        "planet1": "Jupiter", "planet2": "Saturn",
        "title": "Jupiter-Saturn Conjunction (Dharma-Karma Yoga)",
        "general": "Wisdom meets discipline. This powerful social conjunction (occurring every 20 years) shapes societal leaders and reformers. The native balances expansion with restriction — a pillar of dharmic duty.",
        "positive_effects": [
            "Leadership in social reform and justice",
            "Balanced wisdom with practical discipline",
            "Long-term success through sustained effort",
            "Spiritual and material achievement combined"
        ],
        "negative_effects": [
            "Inner conflict between optimism and pessimism",
            "Delayed success and frustration with pace",
            "Rigid moralism or dogmatism",
            "Liver and bone health issues"
        ],
        "career": "Law, politics, social reform, administration, philosophy, religion",
        "health": "Liver, bone, joint issues, chronic diseases",
        "remedies": [
            "Worship Lord Vishnu and Lord Shiva",
            "Donate yellow and black items on respective days",
            "Perform charitable service regularly",
            "Study law, ethics, and sacred texts"
        ],
        "famous_traits": "Principled, disciplined, reformist, socially influential leaders",
        "house_effects": {
            "1": "Serious, wise, disciplined personality",
            "9": "Dharmic and philosophical reformer",
            "10": "Authoritative career with social impact"
        }
    },
    # ── JUPITER + RAHU ──
    {
        "planet1": "Jupiter", "planet2": "Rahu",
        "title": "Jupiter-Rahu Conjunction (Guru Chandal Yoga)",
        "general": "Called Guru Chandal Yoga — controversial and powerful. Rahu pollutes Jupiter's dharmic wisdom, creating unconventional, rule-breaking teachers and leaders who challenge tradition but may cross ethical lines.",
        "positive_effects": [
            "Unconventional wisdom and innovation",
            "Success through breaking traditional norms",
            "International reach and foreign connections",
            "Powerful and magnetic teaching ability"
        ],
        "negative_effects": [
            "Unethical or immoral conduct",
            "Guru betrayal or being misled by teachers",
            "Dharmic conflicts and reputation damage",
            "Overexpansion and greed"
        ],
        "career": "Alternative spirituality, foreign education, politics, unconventional leadership",
        "health": "Liver issues, mental instability, mysterious diseases",
        "remedies": [
            "Worship Lord Vishnu and Lord Ganesha",
            "Donate yellow cloth and grains on Thursdays",
            "Recite Vishnu Sahasranama daily",
            "Strictly follow ethical conduct"
        ],
        "famous_traits": "Unconventional, rule-breaking, internationally powerful, controversial",
        "house_effects": {
            "1": "Eccentric, charismatic, rule-breaking personality",
            "9": "Controversial spiritual or philosophical beliefs",
            "10": "Unconventional path to authority and fame"
        }
    },
    # ── JUPITER + KETU ──
    {
        "planet1": "Jupiter", "planet2": "Ketu",
        "title": "Jupiter-Ketu Conjunction",
        "general": "A deeply spiritual combination. Ketu strips Jupiter of worldly ambition, turning wisdom toward moksha and liberation. The native is a natural renunciant and spiritual teacher, often with past-life saintly wisdom.",
        "positive_effects": [
            "Deep spiritual wisdom and past-life knowledge",
            "Natural guru or spiritual teacher ability",
            "Detachment from material wealth",
            "Enlightened, compassionate worldview"
        ],
        "negative_effects": [
            "Lack of material prosperity",
            "Conflicts with teachers or gurus",
            "Difficulty following conventional religion",
            "Over-detachment from worldly duties"
        ],
        "career": "Spirituality, moksha path, teaching, philosophy, alternative healing",
        "health": "Liver, mysterious diseases, weight fluctuations",
        "remedies": [
            "Worship Lord Vishnu and Lord Ganesha",
            "Donate yellow and grey items",
            "Serve saints and spiritual teachers",
            "Recite Guru mantra and Ketu mantra"
        ],
        "famous_traits": "Spiritually wise, detached, past-life sage energy, natural guru",
        "house_effects": {
            "1": "Spiritual, wise, detached personality",
            "8": "Deep occult wisdom and spiritual transformation",
            "12": "Moksha path, spiritual liberation, ashram life"
        }
    },
    # ── VENUS + SATURN ──
    {
        "planet1": "Venus", "planet2": "Saturn",
        "title": "Venus-Saturn Conjunction",
        "general": "Beauty constrained by discipline. Saturn delays and restricts Venus's pleasures, creating a native who achieves in arts and relationships only through sustained effort and often after difficult experiences.",
        "positive_effects": [
            "Long-lasting, committed relationships",
            "Disciplined artistic excellence",
            "Success in luxury business through hard work",
            "Mature, serious approach to love"
        ],
        "negative_effects": [
            "Delayed marriage and relationship difficulties",
            "Emotional coldness or detachment in love",
            "Financial restrictions despite desires",
            "Loneliness and sense of deprivation"
        ],
        "career": "Architecture, luxury business, fashion (structured), law, real estate",
        "health": "Kidney issues, bone disorders, skin problems, reproductive delays",
        "remedies": [
            "Worship Goddess Lakshmi and Lord Shiva",
            "Donate white and black items on respective days",
            "Wear White Sapphire or Blue Sapphire after consultation",
            "Serve elderly women"
        ],
        "famous_traits": "Disciplined in love, mature artist, hardworking in creative fields",
        "house_effects": {
            "1": "Serious, reserved, artistic personality",
            "7": "Delayed or difficult marriage, committed once married",
            "10": "Career success in arts or luxury through hard work"
        }
    },
    # ── VENUS + RAHU ──
    {
        "planet1": "Venus", "planet2": "Rahu",
        "title": "Venus-Rahu Conjunction",
        "general": "Rahu intensifies Venus's desires to obsessive levels. The native craves luxury, romance, and beauty with extreme passion. This can produce extraordinary artists or lead to excess and unconventional relationships.",
        "positive_effects": [
            "Magnetic charm and extraordinary beauty",
            "Success in foreign arts and entertainment",
            "Unconventional creative brilliance",
            "Wealth through arts and relationships"
        ],
        "negative_effects": [
            "Obsessive attachments and infatuations",
            "Unconventional or taboo relationships",
            "Excessive spending and materialism",
            "Deception in love and business"
        ],
        "career": "International entertainment, fashion, luxury trade, foreign arts",
        "health": "Reproductive issues, kidney disorders, addiction to pleasure",
        "remedies": [
            "Worship Goddess Lakshmi and Goddess Durga",
            "Donate white items and flowers on Fridays",
            "Recite Venus and Rahu mantras",
            "Practice moderation in desires"
        ],
        "famous_traits": "Magnetically attractive, obsessively passionate, unconventionally artistic",
        "house_effects": {
            "1": "Extremely attractive, desire-driven personality",
            "7": "Unconventional or foreign romantic partnerships",
            "5": "Creative obsession, romantic infatuations"
        }
    },
    # ── VENUS + KETU ──
    {
        "planet1": "Venus", "planet2": "Ketu",
        "title": "Venus-Ketu Conjunction",
        "general": "Ketu dissolves Venus's attachment to worldly pleasures. The native has refined taste but is detached from materialism. Spiritual devotion replaces mundane romance, producing saintly artists and devotees.",
        "positive_effects": [
            "Spiritual devotion and selfless love",
            "Refined aesthetic with detachment from materialism",
            "Past-life artistic talent resurfaces",
            "Excellence in devotional music and sacred arts"
        ],
        "negative_effects": [
            "Detachment in romantic relationships",
            "Financial losses or lack of material enjoyment",
            "Marital dissatisfaction or separation",
            "Confusion about desires and values"
        ],
        "career": "Devotional arts, spiritual healing, occult, alternative therapies",
        "health": "Reproductive issues, mysterious skin conditions, kidney problems",
        "remedies": [
            "Worship Goddess Lakshmi and Lord Ganesha",
            "Donate white and grey items",
            "Recite Lakshmi mantra and Ketu mantra",
            "Practice bhakti yoga and devotional singing"
        ],
        "famous_traits": "Spiritually artistic, detached from material love, devotionally inclined",
        "house_effects": {
            "1": "Spiritually refined, detached from worldly pleasures",
            "7": "Karmic relationships, spiritual partnerships",
            "12": "Spiritual liberation through devotion, foreign spiritual experiences"
        }
    },
    # ── SATURN + RAHU ──
    {
        "planet1": "Saturn", "planet2": "Rahu",
        "title": "Saturn-Rahu Conjunction (Shrapit Yoga)",
        "general": "Called Shrapit (cursed) Yoga. Saturn's karmic restriction meets Rahu's karmic obsession — producing a native who carries heavy past-life karma. Life is a series of hard lessons, but overcoming them leads to profound transformation.",
        "positive_effects": [
            "Extraordinary resilience and karmic clearing",
            "Success through unconventional, disciplined efforts",
            "Mastery over material world through struggle",
            "Profound transformation and spiritual growth"
        ],
        "negative_effects": [
            "Heavy karmic burdens and obstacles",
            "Chronic delays and frustrations",
            "Social isolation and misfortunes",
            "Rebellious nature causing self-harm"
        ],
        "career": "Research, occult, social reform, unconventional business, technology",
        "health": "Chronic diseases, nervous disorders, bone and joint issues",
        "remedies": [
            "Recite Shrapit Stotra and Shani mantra",
            "Worship Lord Shiva and Lord Hanuman",
            "Donate black sesame, iron, and oil on Saturdays",
            "Perform Shrapit Dosh Nivaran Puja"
        ],
        "famous_traits": "Karmically burdened, resilient, transformative, unconventionally disciplined",
        "house_effects": {
            "1": "Heavy karma, serious personality, life of obstacles",
            "8": "Deep occult, chronic ailments, transformation through suffering",
            "10": "Career obstacles, unconventional path to success"
        }
    },
    # ── SATURN + KETU ──
    {
        "planet1": "Saturn", "planet2": "Ketu",
        "title": "Saturn-Ketu Conjunction",
        "general": "Two separating forces unite. Saturn's karma meets Ketu's detachment, creating a native who is withdrawn, spiritually inclined, and carries profound karmic weight from past lives. Liberation through service and discipline.",
        "positive_effects": [
            "Deep spiritual detachment and wisdom",
            "Ability to serve selflessly without reward",
            "Karmic clearing through disciplined renunciation",
            "Mastery of hidden knowledge and occult"
        ],
        "negative_effects": [
            "Extreme isolation and loneliness",
            "Chronic health issues and hardships",
            "Disconnection from society and relationships",
            "Depression and nihilistic thinking"
        ],
        "career": "Spiritual service, research, occult, social work, philosophy",
        "health": "Chronic bone diseases, nervous disorders, mysterious ailments",
        "remedies": [
            "Worship Lord Shiva and Lord Bhairava",
            "Donate black and grey items on Saturdays",
            "Serve the poor, sick, and elderly",
            "Recite Saturn and Ketu mantras regularly"
        ],
        "famous_traits": "Austere, karmically withdrawn, spiritually profound, self-sacrificing",
        "house_effects": {
            "1": "Serious, detached, ascetic personality",
            "12": "Moksha path, isolation, hospital or ashram life",
            "8": "Deep karma, occult mastery, transformation through hardship"
        }
    },
    # ── RAHU + KETU ──
    {
        "planet1": "Rahu", "planet2": "Ketu",
        "title": "Rahu-Ketu Axis (Nodal Axis)",
        "general": "The karmic axis of the horoscope. Rahu and Ketu are always exactly opposite — they never truly conjoin. Their axis represents the soul's deepest karmic journey: Rahu's insatiable desire and Ketu's renunciation define the life's ultimate lesson.",
        "positive_effects": [
            "Profound karmic awareness and soul evolution",
            "Psychic and intuitive gifts from nodal energy",
            "Ability to master both material and spiritual realms",
            "Strong past-life wisdom accessible through practice"
        ],
        "negative_effects": [
            "Intense karmic struggles and life crises",
            "Identity confusion between past and future",
            "Eclipse-like disruptions in life during transits",
            "Extremes of experience — feast or famine"
        ],
        "career": "Spirituality, occult, astrology, research, unconventional fields",
        "health": "Mysterious ailments, neurological issues, karmic diseases",
        "remedies": [
            "Worship Lord Ganesha and Goddess Durga",
            "Recite Rahu-Ketu mantras on respective days",
            "Donate to charitable causes regularly",
            "Practice meditation to balance the axis"
        ],
        "famous_traits": "Karmically intense, psychically gifted, drawn between extremes of desire and renunciation",
        "house_effects": {
            "1/7": "Identity vs. relationships — karmic life theme",
            "2/8": "Material vs. transformative wealth — resources karma",
            "4/10": "Home vs. career — family and ambition karma"
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
    print("[*] Seeding Part 3: Mercury, Jupiter, Venus, Saturn, Rahu/Ketu conjunctions...")
    asyncio.run(seed())
    print("[+] Part 3 done.")
