"""
Seed: Mars_Moon_Sun collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Mars Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a powerful personality with courage, emotions, and action.",
        "Indicates strong willpower, passion, and desire for status.",
        "Creates struggle for inner peace due to aggression and self-respect."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, status, ego",
        "Moon": "Mind, emotions, mother, mental peace",
        "Mars": "Action, courage, aggression, willpower"
    },
    "effects": {
        "powerfulSun": [
            "Helps find life purpose",
            "Creates discipline and control over emotions",
            "Maintains strong self-identity"
        ],
        "powerfulMoon": [
            "Emotional intelligence and stability",
            "Strong bonding with people",
            "Courage with calmness"
        ],
        "powerfulMars": [
            "Initiative and passion",
            "Aggressive approach to challenges",
            "Strong determination"
        ]
    },
    "nature": {
        "positive": [
            "Fearless personality",
            "Strong leadership and courage",
            "Ability to fight injustice",
            "Entrepreneurial mindset"
        ],
        "negative": [
            "Aggression and ego",
            "Emotional imbalance",
            "Relationship issues",
            "Moral compromise for self-gain"
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Attractive personality, success, strong leadership"
        },
        {
            "house": "3rd House",
            "effect": "Bravery, bold communication, fearless nature"
        },
        {
            "house": "5th House",
            "effect": "Career success, political growth, technical skills"
        },
        {
            "house": "9th House",
            "effect": "Reformist mindset, challenges traditions"
        },
        {
            "house": "10th House",
            "effect": "High status, success in career, authority"
        },
        {
            "house": "11th House",
            "effect": "Gains from technology, AI, entrepreneurship"
        }
    ],
    "keywords": ["sun", "moon", "mars", "conjunction", "vedic astrology"],
    
    # Detailed narrative fields based on the user's provided text
    "effectsDetail": {
        "powerfulSun": "When the Sun is in good strength with the Moon and Mars, it helps you find the real purpose of your life. It will help you develop a strict discipline, and restraint over emotional desires and unnecessary aggression that could come from the Moon or Mars. Criticism or praise won’t change your sense of purpose.",
        "powerfulMars": "When Mars has the dominating role in the Sun-Moon-Mars conjunction, you will take initiative in matters and do so with a passionate approach. You could take a strong or harsh approach to resolve challenges. You will focus on the final result instead of recognizing soul-level desires and may even ignore all emotional needs. You could be good at manipulating others for your benefit.",
        "powerfulMoon": "When the Moon is in good strength in the conjunction with the Sun and Mars, it gives the ability to manage the masses with emotional bonding. It will guide you to have harmonious relationships with everyone. You will not get into aggressive conversations, and instead have courage and a high self-respect to deal with challenging situations. You will stand against injustice; protect the weak with a strong gut, and demonstrate courage, because the Moon will make you mentally strong and nothing will break your spirit."
    },
    "positiveDetail": (
        "You could be known as a fearless warrior of justice. You have the courage to stand alone even in challenging situations. "
        "A positive Sun-Moon-Mars will help overcome challenges with bravery and confidence. It helps you avoid making emotional decisions. "
        "You will protect against injustice even if you have to break rules. If there is no one on your side, you will still have the "
        "courage to stand for the right thing and even go against the government, if required. A Sun-Mars-Moon conjunction gives you "
        "a valiant personality. If this conjunction is in a friendly sign, it will bless you with high moral clarity and an inner "
        "light that doesn't flicker under pressure. People will judge you as a shameless person, but you know what's right. This "
        "practical approach will bring you a high rank and status in the latter phase of your life. You will be bold, fearless, "
        "and competitive in nature—you face dangers head-on. Your opponents will not have the courage to stand against you. "
        "This combination also blesses you with good entrepreneurial skills. You have the boldness and energy to challenge existing "
        "rules or traditional beliefs. You will have the emotional intelligence and intuition to understand the needs of people. "
        "You will have the courage and conviction to speak out against unjust laws or outdated traditions that harm the society."
    ),
    "negativeDetail": (
        "A reckless and ego-driven courage will manifest when these three planets are conjunct in a challenging status or in an "
        "inimical zodiac sign. It will drag you toward moral compromise for self-gain. You will have the courage to undertake "
        "tasks that are impossible for others, but you could overrule ethical and moral values; this could cause a loss of status "
        "on the professional front. You may also enforce laws on the professional front or in religious matters as per your convenience. "
        "You will be unaffected by others' opinions about your actions. You will act on your own beliefs, and not for approval, which "
        "could bring challenges in relationships in the workplace, and family, and also difficulties on the financial front. If you "
        "develop a rigid personality, it could cause emotional disconnection with those around. The status of these planets can also "
        "develop a personality that doesn't feel shame or guilt easily, especially due to a strong ego and impulsiveness. You could "
        "justify unethical behavior for personal benefits. Your emotional independence could cause misunderstandings, alienation, "
        "or coldness in relationships, be it with family, or at work. Your strong willpower could turn into stubbornness, and have "
        "a tendency to ignore moral and ethical boundaries. You could be perceived as arrogant and disconnected due to a lack of "
        "emotional connection."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Sun-Moon-Mars conjunction in the 1st house or in the Aries zodiac sign indicates that you will win against rivals, take the initiative to build important projects, and attain success with your determination. You will have an attractive personality and can learn skills at any stage of your life, which makes you successful in any area and sector. This combination gives a connection with higher authority figures."
        },
        {
            "house": "5th House",
            "detail": "Sun-Moon-Mars conjunction in the 5th house or in Leo zodiac will give a good rank in career. It will grant support from the father and the government. It will also help you attain success in a political career. You will be skilled in machinery work, engineering abilities, and have a technical mindset that could help you run a successful business."
        },
        {
            "house": "3rd House",
            "detail": "Sun-Moon-Mars conjunction in the 3rd house will give a brave personality. The status of these planets can also cause an open personality that some would call shameless, due to a strong ego and impulsiveness. You will become reactive and sensitive to your needs. The combination will cause uninhibited speech and behavior. You may express harsh truths, criticism, or opinions bluntly without hesitation or fear of offending others."
        },
        {
            "house": "9th House",
            "detail": "Sun-Moon-Mars conjunction in the 9th house will help you transform rules and laws for the well-being of the masses. It also grants the courage to speak about the laws that are not beneficial for the masses. It provides the boldness and energy to challenge existing rules or traditional beliefs. You will have emotional intelligence and intuition to understand the needs of the people. You will show courage and conviction in speaking out against unjust laws or outdated traditions that harm society."
        },
        {
            "house": "10th House",
            "detail": "Sun-Moon-Mars conjunction in the 10th house will bless you with luxury and a high status. You will enjoy the company of government or senior officials even in the corporate sector."
        },
        {
            "house": "11th House",
            "detail": "Sun-Moon-Mars conjunction in the 11th house indicates you will have expertise in creating artificial intelligence work; there will be gains from technology, and you will be good at dealing with multiple projects. Success in careers that deal with machinery, engineering, technology, and construction is possible. When it comes to financial gains, you may have a self-centered approach. Your opponents will not have the courage to stand against you. You are also blessed with good entrepreneurial skills."
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
    db = client["Triple_Planet_Conjunction"]
    # Sorting: Mars, Moon, Sun
    col_name = "Mars_Moon_Sun"
    col = db[col_name]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Triple Planet Conjunction: {col_name} {action}.")
    print(f"     Total documents in {col_name}: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mars_Moon_Sun triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
