"""
Seed: Mercury_Moon_Saturn_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mercury-Venus-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents an astute and wise personality who enjoys worldly comforts but often struggles with harsh and adulterous tendencies.",
        "Combines Logic (Mercury), Emotions (Moon), Attraction (Venus), and Hardship (Saturn) for victory over foes.",
        "Natives are victorious in arguments and enjoy a good partner, but their cold nature alienates their loved ones."
    ],
    "planetRoles": {
        "Moon": "Emotions, mental capabilities, wisdom, eye sensitivity, mother",
        "Mercury": "Logic, intellect, winning arguments, communication, astuteness",
        "Venus": "Attraction, ample comforts, servants, good partner, adulterous tendencies",
        "Saturn": "Hardship, harshness, cold nature, hostility to relatives, victory over opposition"
    },
    "effects": {
        "powerfulSun": [
            "Note: This conjunction lacks the Sun; its authority is provided by Saturn's dominance and Mercury's logic.",
            "Natives rely on their ability to win arguments and fights to establish their social standing.",
            "Success comes through outsmarting foes rather than traditional authoritative leadership."
        ],
        "powerfulMoon": [
            "Grants highly positive mental capabilities, making the native exceptionally astute and wise.",
            "Ensures emotional endurance during conflicts, though it may result in a lack of deep empathy.",
            "Provides a sharp intuition that aids in defeating opposition, though it may cause eye-related problems."
        ],
        "powerfulMercury": [
            "Grants the intellectual power to win arguments and fights with ease.",
            "Ensures victory over opposition and foes through calculated and logical strategies.",
            "Provides an astute approach to life, though communication can often lack politeness."
        ],
        "powerfulVenus": [
            "Grants ample comforts in life, including luxury, wealth, and servants to cater to the native.",
            "Ensures the blessing of a good, supportive partner and the joy of progeny after marriage.",
            "Provides strong physical desires that, if unchecked, can lead to adulterous conduct."
        ],
        "powerfulSaturn": [
            "Grants a cold and highly pragmatic nature that is unfazed by emotional conflicts.",
            "Ensures the native can overpower enemies through sheer endurance and harsh tactics.",
            "Provides a structured, albeit hostile, approach to dealing with relatives and loved ones."
        ]
    },
    "nature": {
        "positive": [
            "Highly astute and wise individual with superior mental capabilities.",
            "Enjoys a life of ample comforts, luxury, and the service of others.",
            "Blessed with a good partner and the joy of progeny despite personal flaws.",
            "Unbeatable in arguments and fights, ensuring consistent victory over foes and opposition."
        ],
        "negative": [
            "Tendency toward adulterous conduct and moral instability in personal relationships.",
            "Harsh and cold nature that severely lacks politeness when dealing with others.",
            "Specifically hostile towards relatives and loved ones, causing domestic isolation.",
            "Prone to physical ailments, particularly eye-related problems or vision issues."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Astute but cold personality; physical comforts; potential for eye problems."
        },
        {
            "house": "7th House",
            "effect": "Good partner but high risk of adulterous behavior; victory over public enemies."
        },
        {
            "house": "6th House",
            "effect": "Unbeatable in fights and arguments; outsmarts all opposition; harsh to subordinates."
        },
        {
            "house": "4th House",
            "effect": "Ample domestic comforts and servants; hostile relations with extended family and relatives."
        }
    ],
    "keywords": ["moon", "mercury", "venus", "saturn", "conjunction", "astute", "harsh", "victorious", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants you highly positive mental capabilities. You are naturally astute and "
            "wise, able to navigate complex situations with a sharp mind. However, because the Moon "
            "is conjunct with Saturn, your emotional expression can become stunted, and this "
            "affliction often manifests physically as a vulnerability to eye-related problems."
        ),
        "powerfulMercury": (
            "Mercury provides you with the logic and communication skills to win arguments and fights. "
            "You are exceptionally skilled at verbal combat and consistently earn victory over "
            "your opposition and foes. However, your expression is often direct to the point "
            "of being harsh, severely lacking the politeness needed for harmonious relationships."
        ),
        "powerfulVenus": (
            "Venus ensures you are blessed with ample comforts in life, such as luxury and servants to "
            "cater to your needs. Despite your harsh nature, Venus grants you a good partner and "
            "the joy of progeny after marriage. However, the influence of this conjunction makes "
            "you prone to adulterous conduct, risking the very domestic stability you enjoy."
        ),
        "powerfulSaturn": (
            "Saturn is the source of your cold and unyielding nature. It gives you the endurance to "
            "crush your enemies but makes you hostile towards your own relatives and loved ones. "
            "You approach relationships with a pragmatism that others find harsh and unforgiving, "
            "often isolating yourself emotionally from your family."
        )
    },
    "positiveDetail": (
        "This conjunction creates an 'Astute Victor' personality. You possess highly positive mental "
        "capabilities, making you an exceptionally wise and sharp individual. You are a formidable "
        "force in any conflict, using your logic and endurance to win arguments and earn "
        "consistent victory over your opposition and foes. Materially, you are highly blessed, "
        "enjoying ample comforts, luxury, and the service of others. Despite your flaws, "
        "lady luck ensures you find a good partner and experience the bliss of progeny "
        "after marriage. You are a survivor who uses intellect and sheer willpower to "
        "dominate your environment."
    ),
    "negativeDetail": (
        "Negative influences manifest as a severe lack of politeness and a cold, harsh nature. You "
        "tend to be specifically hostile towards your relatives and loved ones, causing significant "
        "friction in your personal life. In terms of conduct, there is a strong tendency toward "
        "adulterous behavior, which can threaten your marital peace. Physically, the "
        "affliction of the Moon and Venus by Saturn can cause chronic eye-related problems. "
        "Your greatest challenge is to balance your desire for victory and comfort with "
        "empathy and loyalty toward those who support you."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a sharp, astute mind but a very cold personal bearing. You are known for winning arguments and enjoying physical comforts. However, you must take care of your health, specifically guarding against eye-related problems and vision issues."
        },
        {
            "house": "7th House",
            "detail": "Powerhouse for public interaction and marriage. You attract a good partner and enjoy post-marital wealth, but your adulterous tendencies and harsh communication can cause severe marital strain. You easily defeat open enemies and business rivals."
        },
        {
            "house": "6th House",
            "detail": "Ensures absolute victory over foes and opposition. You use your logic and cold pragmatism to win any fight or legal argument. While you may have servants to cater to you, your harsh nature makes you an intimidating figure to subordinates."
        },
        {
            "house": "4th House",
            "detail": "Identity is defined by a desire for domestic luxury and ample comforts. You build a wealthy home environment, but your hostile attitude towards relatives and extended family members ensures that your domestic life lacks true emotional warmth."
        }
    ]
}

async def seed():
    client = AsyncIOMotorClient(
        MONGO_URL,
        tlsCAFile=certifi.where(),
        tls=True,
        tlsAllowInvalidCertificates=True,
        tlsAllowInvalidHostnames=True
    )
    db = client["Four_Planet_Conjunction"]
    # Alphabetical order: Mercury, Moon, Saturn, Venus
    col_name = "Mercury_Moon_Saturn_Venus"
    col = db[col_name]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Four Planet Conjunction: {col_name} {action}.")
    print(f"     Total documents in {col_name}: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mercury_Moon_Saturn_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
