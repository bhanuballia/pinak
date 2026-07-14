"""
Seed: Sun_Ketu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Ketu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Sun represents confidence and authority; Ketu represents detachment and spiritual isolation.",
        "A conjunction that often disconnects the native from materialistic cravings and the surrounding world.",
        "Indicates a tough time regarding father, paternal ancestors, government, and reputation.",
        "Can lead to a feeling of desolation or dependency on others for important life decisions.",
        "Strong Sun-Ketu keeps one grounded; weak Sun-Ketu results in feeble willpower and shifting responsibilities."
    ],
    "effects": {
        "powerfulSun": [
            "Grants the strength and potential to come out of Ketu's negative/isolating influence.",
            "Enables the native to make efforts and work progressively even if initial confidence is low.",
            "Possesses positive traits like authority and status that help navigate spiritual challenges."
        ],
        "powerfulKetu": [
            "Activates a strong sense of detachment from materialistic features and everyday routine.",
            "Increases inclination toward deep research work and spiritual strength in later years.",
            "Often leads to isolation and low confidence in standard social or professional settings."
        ]
    },
    "nature": {
        "positive": [
            "Manifests as a low egoistic nature with right principles and a grounded attitude.",
            "Strong inclination toward spirituality with less demand for outside attention or validation.",
            "Works with good compatibility in environments that value wisdom over materialistic gain."
        ],
        "negative": [
            "Deprives the native of Sun's achievements, making life feel directionless or 'puppet-like.'",
            "Decisions require others' opinions, leading to a lack of personal satisfaction in life.",
            "Strained relationships with father figures and a blemish on positive traits due to 'headless' Ketu."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Conflicts with father and dependency on others for decisions; high spiritual wisdom."
        },
        {
            "house": "2nd House",
            "effect": "Speech may be perceived as rude by loved ones, but native may possess paternal wealth."
        },
        {
            "house": "3rd House",
            "effect": "Strained sibling relations and less progress in efforts, but strong in political/spiritual sectors."
        },
        {
            "house": "5th House",
            "effect": "Success in spiritual life and attaining deep learning over the meaning of life."
        },
        {
            "house": "9th House",
            "effect": "Reputation as a mentor/consultant; travels for religious pilgrimages but tough father relations."
        },
        {
            "house": "10th House",
            "effect": "Good political career prospects with moderate financial gains."
        },
        {
            "house": "11th House",
            "effect": "Financial gains from father's side but persistent dissatisfaction over wealth matters."
        }
    ],
    "keywords": ["sun", "ketu", "conjunction", "spiritual detachment", "isolation", "authority", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Ketu is the headless node representing illusions and disconnection from the materialistic "
        "world. Sun represents resourceful potential and self-confidence. Their conjunction is "
        "like a 'thorn in the palm'—it tends to hurt deeply by blemishing positive traits. "
        "The native may feel like a puppet driven by destiny, struggling to take independent "
        "decisions. It indicates a significant challenge related to father, government, and "
        "public reputation, but offers immense potential for spiritual evolution."
    ),
    "effectsDetail": {
        "powerfulSun": (
            "When the Sun is strong, it provides the willpower to overcome Ketu's isolating "
            "tendencies. You possess the potential to lead a progressive life by curbing "
            "Ketu's detachment and focusing your resourcefulness on your purpose."
        ),
        "powerfulKetu": (
            "When Ketu dominates, a sense of isolation prevails. You may find it difficult "
            "to complete everyday routine work due to detachment. However, your spiritual "
            "strength and capacity for research will increase significantly in your later years."
        ),
        "positiveConjunction": (
            "A positive conjunction fosters right principles and a grounded attitude. You "
            "are less influenced by ego and external attention, often finding profound "
            "satisfaction in spiritual pursuits and research-oriented fields."
        ),
        "negativeConjunction": (
            "A negative conjunction makes you directionless. You may feel unable to look beyond "
            "Ketu's illusions, requiring others' opinions for even minor matters. This lack of "
            "autonomy often leads to dissatisfaction in relationships and professional achievements."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native may struggle with low confidence and management of materialistic affairs, but possesses heightened wisdom in spiritual matters."
        },
        {
            "house": "9th House",
            "detail": "An excellent placement for becoming a respected mentor or consultant, though relationship with the father remains complex."
        },
        {
            "house": "10th House",
            "detail": "While financial gains are moderate, the combination can provide a very stable and successful political career."
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
    db = client["Two_Planet_Conjunction"]
    col = db["Sun_Ketu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Sun_Ketu collection: document {action}.")
    print(f"     Total documents in Sun_Ketu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Sun_Ketu collection...")
    asyncio.run(seed())
    print("[+] Done.")
