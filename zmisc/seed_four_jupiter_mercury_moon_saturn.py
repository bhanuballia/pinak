"""
Seed: Jupiter_Mercury_Moon_Saturn collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mercury-Jupiter-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a righteous, moral, and highly compassionate personality blessed with immense prosperity.",
        "Combines Wisdom (Jupiter), Logic (Mercury), Emotions (Moon), and Discipline (Saturn) for social abundance.",
        "Natives are quick-witted, extremely wealthy, and enjoy a high position in society, often with a penchant for poetry."
    ],
    "planetRoles": {
        "Moon": "Emotions, compassion, generosity, dazzling personality, good looks",
        "Mercury": "Logic, intellect, quick-witted nature, poetry, social attention",
        "Jupiter": "Wisdom, righteousness, morality, prosperity, lady luck, wealth",
        "Saturn": "Discipline, social position, reputation, relatives, potential for illicit deeds (if afflicted)"
    },
    "effects": {
        "powerfulSun": [
            "Note: This conjunction lacks the Sun; its authority is provided by Jupiter's wisdom and Saturn's discipline.",
            "Natives rely on their moral standing and quick wit to gain social status.",
            "Success comes through a righteous path rather than aggressive dominance."
        ],
        "powerfulMoon": [
            "Grants a deeply compassionate and generous heart, making the native a favorite among relatives.",
            "Ensures a dazzling and good-looking personality that naturally draws social attention.",
            "Provides the emotional depth required for creative pursuits like poetry."
        ],
        "powerfulMercury": [
            "Grants a quick-witted and highly intellectual mind that is respected in all social circles.",
            "Ensures a strong penchant for poetry, sometimes making the native a renowned poet themselves.",
            "Provides the communication skills necessary to maintain a flawless public reputation."
        ],
        "powerfulJupiter": [
            "Grants immense wealth, often making the native one of the richest people in their sphere.",
            "Ensures lady luck always showers the native with prosperity and abundance.",
            "Provides a righteous and moral foundation that guides all major life decisions."
        ],
        "powerfulSaturn": [
            "Grants a higher position in society and a solid, unshakeable reputation.",
            "Ensures discipline in managing vast wealth and maintaining a good bond with relatives.",
            "Provides structure, though if afflicted in certain houses (like the 2nd), it can lead to bad company."
        ]
    },
    "nature": {
        "positive": [
            "Righteous and moral individual who is blessed with extraordinary wealth and lady luck.",
            "Compassionate and generous leader who is a favorite among relatives and friends.",
            "Quick-witted and wise, commanding a lot of attention and respect in their social circle.",
            "Creative soul with a dazzling personality and a strong talent for poetry."
        ],
        "negative": [
            "Risk of indulging in illicit deeds or falling into bad company if the conjunction is afflicted (e.g., in the 2nd house).",
            "Internal pressure to maintain a perfectly righteous and moral public image.",
            "Potential for wealth to attract false friends if Mercury's logic is clouded.",
            "Over-generosity that could be exploited by relatives or social peers."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Dazzling personality; highly moral bearing; immense wealth and social attention."
        },
        {
            "house": "2nd House",
            "effect": "Risk of involvement with bad company and illicit deeds despite high financial prosperity."
        },
        {
            "house": "10th House",
            "effect": "Higher position in society; respected reputation; career success through wisdom and poetry."
        },
        {
            "house": "4th House",
            "effect": "Deeply compassionate domestic life; strong bond with relatives; abundance at home."
        }
    ],
    "keywords": ["moon", "mercury", "jupiter", "saturn", "conjunction", "righteous", "wealthy", "poetry", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants you a dazzling personality and naturally good looks. You possess a "
            "deeply compassionate and generous heart, which makes you a favorite among your relatives. "
            "Your emotional depth allows you to connect with people easily, and it fuels your "
            "creative talents, particularly giving you a penchant for poetry and the arts."
        ),
        "powerfulMercury": (
            "Mercury provides you with a quick-witted and intellectual mind. You are sharp in your "
            "dealings and enjoy a lot of attention in your social circle due to your clever "
            "communication. If you channel this energy creatively, you may even become a "
            "celebrated poet or writer, using your logic to craft profound narratives."
        ),
        "powerfulJupiter": (
            "Jupiter is the ultimate benefactor in this conjunction, acting as 'lady luck' who showers "
            "you with prosperity and abundance. You are a righteous and moral person, and this "
            "karmic purity often results in you being one of the richest people in your "
            "sphere. Your wisdom guides your wealth, ensuring it is used generously."
        ),
        "powerfulSaturn": (
            "Saturn ensures that your wealth and status are grounded in reality. It grants you a higher "
            "position in society and a solid reputation. You maintain a structured and good bond "
            "with your relatives. However, you must be cautious of its placement; if afflicted "
            "or placed in the 2nd house, Saturn's darker side may tempt you toward bad company "
            "or illicit deeds."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Prosperous Poet' personality. You are a righteous and moral "
        "individual, known for your compassion and generosity. Lady luck always seems to favor you, "
        "showering you with immense prosperity and making you one of the richest people on earth. "
        "You are wise and quick-witted, enjoying a dazzling public image and a lot of attention "
        "in your social circle. Your higher position in society is well-deserved, and you "
        "maintain a very favorable bond with your relatives. With a natural penchant for "
        "poetry and a beautiful appearance, you lead an enviable life filled with abundance "
        "and creative joy."
    ),
    "negativeDetail": (
        "Negative influences are generally minimal, but when this conjunction is afflicted—particularly "
        "in the 2nd house of speech and accumulated wealth—it can cause a sudden moral downfall. "
        "You may be tempted to indulge in illicit deeds or get involved with bad company, risking "
        "your hard-earned reputation. Additionally, your extreme generosity can sometimes make "
        "you a target for exploitation by those who wish to take advantage of your immense "
        "wealth. Staying true to your inherent righteousness is vital to avoid these pitfalls."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a dazzling and highly attractive personality. You are known for your quick wit and moral bearing. Lady luck ensures that you rise to a high position in society, enjoying immense wealth and the admiration of a vast social circle."
        },
        {
            "house": "2nd House",
            "detail": "While this house brings immense accumulated wealth and resources, it is a challenging placement for morality. You must be extremely cautious of bad company and illicit deeds, which could tarnish your reputation and separate you from your relatives."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career with a highly respected reputation. You achieve a prominent position in society through your wisdom and righteous actions. Your quick-witted nature makes you an excellent leader or an acclaimed creative professional."
        },
        {
            "house": "4th House",
            "detail": "Identity is centered on a prosperous and abundant domestic life. You share a deeply compassionate bond with your family and relatives, who consider you their favorite. Your home is a place of poetry, wealth, and moral learning."
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
    # Alphabetical order: Jupiter, Mercury, Moon, Saturn
    col_name = "Jupiter_Mercury_Moon_Saturn"
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
    print("[*] Seeding Jupiter_Mercury_Moon_Saturn four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
