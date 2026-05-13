
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

zodiac_career_data = [
    {
        "sign": "Aries",
        "governing_planets": ["Jupiter", "Saturn", "Venus"],
        "analysis": "Jupiter, Saturn and Venus are the important planets which play a crucial role in predicting the career of you. Your placement should always be good, and just in case, they interchange between one another or have conjunction with the others, it gives beneficial results for you in the form of good career growth and direction.",
        "career_profiles": ["Engineering in any stream", "Construction", "Management in any field"]
    },
    {
        "sign": "Taurus",
        "governing_planets": ["Saturn", "Mercury", "Jupiter"],
        "analysis": "Saturn, Mercury, and Jupiter play the most essential role in predicting the career for you. If the conjunction or interchanges or placements of the three planets are positive, then you will always be ready to experience positive news on professional front.",
        "career_profiles": ["Mechanical or Technical Field", "Government Services (Railway or Any Other Field)", "Commission or Consultancy Based Job Profile", "Multimedia", "Hotel", "Graphics Designing", "Animation", "Management"]
    },
    {
        "sign": "Gemini",
        "governing_planets": ["Moon", "Jupiter", "Venus"],
        "analysis": "Moon, Jupiter, and Venus are the most essential planets which play a major role in the accurate prediction of the career for you that brings growth and prosperity in your life. If these planets have a good placement or conjunct or interchange with one another, then growth and success will be a constant factor for your professional life.",
        "career_profiles": ["Art and Creativity related Job Profile", "Education & Academics", "Professional Advisor", "Medical Field", "Teaching Field", "Chartered Accountant profile"]
    },
    {
        "sign": "Cancer",
        "governing_planets": ["Sun", "Mars", "Jupiter"],
        "analysis": "Sun, Mars, and Jupiter are the most essential planet for predicting the most beneficial and growing career option for you. If the placement of the above-mentioned planets are good or has conjunction or interchanges between each other, then the possibilities of having a thriving and ever-growing career are on the cards of you.",
        "career_profiles": ["Real Estate", "Any Management Profile", "Technical Field such as Mechanical or Software Engineering", "Hotel Management", "Construction", "Psychotherapy", "Medical Field"]
    },
    {
        "sign": "Leo",
        "governing_planets": ["Mercury", "Jupiter", "Mars"],
        "analysis": "In the case of Leo, Mercury, Jupiter, and Mars are the most important planets when it comes to making the right prediction for your professional life. In the event that these planets have a good placement or conjunction, or they interchange between one another in a positive manner, then it means that the career graph of you will always rise consistently.",
        "career_profiles": ["Administrative Job Profiles", "Art and Creativity related Job", "High authoritative Job in the Government", "Photography", "Entertainment Industry", "Fashion industry", "Consultancy and commission-based Job", "Defense", "Law Enforcement"]
    },
    {
        "sign": "Virgo",
        "governing_planets": ["Mercury", "Venus", "Saturn"],
        "analysis": "Mercury, Venus, and Saturn have a major role to play in the prediction of the profession by birth date. If the above-mentioned planets have a good placement or conjunction or they interchange with one another on a positive note, then such conditions are sure to bring good and positive news to you, especially in your professional life.",
        "career_profiles": ["Content Writing", "Consultancy and Commission-based Job", "Ladies Clothing and Apparels Business", "Professional Advisors", "Teaching Field"]
    },
    {
        "sign": "Libra",
        "governing_planets": ["Moon", "Mars", "Saturn"],
        "analysis": "Moon, Mars, and Saturn are the most crucial planets when it comes to the prediction of the profession by birth chart. If Moon, Mars, and Saturn are placed in a good house or have a conjunction or interchange your places with one another, all of the mentioned condition will work in the favor of you as it will be the bearer of good news for the career or professional life of you.",
        "career_profiles": ["Hotel Management", "Management in any Stream", "Art and Creativity Related Job", "Graphic Designer", "Multimedia", "Animation"]
    },
    {
        "sign": "Scorpio",
        "governing_planets": ["Jupiter", "Sun"],
        "analysis": "For the Scorpio, Jupiter and Sun are the most essential planets for the prediction of profession or career by date of birth or birth chart. When Jupiter and Sun are placed well in the chart or have conjunction or are interchanging place with one another, then the good news of growth and progress in the field of career or profession will remain a constant factor in the life of you.",
        "career_profiles": ["Civil Services", "Government Job", "Defense", "Law Enforcement", "Law Field", "Real Estate", "Agriculture"]
    },
    {
        "sign": "Sagittarius",
        "governing_planets": ["Jupiter", "Mercury", "Sun"],
        "analysis": "In the case of the Sagittarius, Jupiter, Mercury, and Sun are the three most crucial planets that help in prediction the career graph of you in present and future. If the above-mentioned planets are placed well in the natal chart or have a conjunction or are interchanging places with one another (on a positive note), then you will experience stable growth and success in your career.",
        "career_profiles": ["Education-related Field", "Teaching Profile", "Job Profiles related to Religious Field", "Chartered Accountant", "Commission or Consultancy Profile", "Stationery and School Supplies Business", "Clerical Job", "Advisory job Profile"]
    },
    {
        "sign": "Capricorn",
        "governing_planets": ["Venus", "Saturn", "Mars"],
        "analysis": "Venus, Saturn, and Mars are the three most important planets when it comes to making a prediction for the profession of a Capricorn on the basis of his or her birth chart or date of birth. Just in case, that Venus, Saturn, and Mars are strongly placed or have a conjunction or are interchanging houses with one another, then there are higher chances of you to do extremely well in your profile.",
        "career_profiles": ["Art and Creativity related Job", "Female Clothing and Apparels (Job or Business)", "Cosmetics (Job or Business)", "Jewelry (Job or Business)", "Engineering in Any Field", "Perfumes"]
    },
    {
        "sign": "Aquarius",
        "governing_planets": ["Mars", "Jupiter", "Venus"],
        "analysis": "For the Aquarius, Mars, Jupiter, and Venus are the most crucial planets for the prediction of the career of you on the basis of your birth chart. If Mars, Jupiter, and Venus are placed well in the chart or are interchanging places with one another or have conjunction, then the results of these conditions remain in the favor of you and he or she will see a consistent rise in your career.",
        "career_profiles": ["Construction (job or business)", "Management Profile", "Hotel Industry", "Real Estate Field", "Security Field", "Commission and Consultancy Based Job"]
    },
    {
        "sign": "Pisces",
        "governing_planets": ["Jupiter", "Mars"],
        "analysis": "Jupiter and Mars are the most important planets when it comes to the professional prediction according to the birth chart. If Jupiter and Mars are placed well or have a conjunction or are interchanging places with each other, then the possibilities of having a better and brighter career for you heightens.",
        "career_profiles": ["Teaching Career", "Management In Any Field", "Real Estate", "Chartered Accountant", "Hotel Industry", "Media Field", "Agriculture"]
    }
]

async def seed_zodiac_career():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client["career"]
    collection = db.get_collection("zodiac_signs")
    
    # Clear existing data
    await collection.delete_many({})
    
    # Insert new data
    result = await collection.insert_many(zodiac_career_data)
    print(f"Inserted {len(result.inserted_ids)} zodiac career records.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_zodiac_career())
