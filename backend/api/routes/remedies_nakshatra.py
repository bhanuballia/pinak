from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, Optional

router = APIRouter()

NAKSHATRA_REMEDIES = {
    "Ashwini": {
        "deity": "Ashwini Kumars (Divine Healers)",
        "lord": "Ketu",
        "seeding_mantra": "Om Am / Om Ashwinikumaarabhyam Namah",
        "sacred_tree": "Kuchila (Nux Vomica / Poison Nut)",
        "donation": "Feed horses, donate mustard oil, copper vessels, or red cloth to those in need.",
        "remedy": "Worship Lord Ganesha regularly. Donate wheat or barley on Tuesdays.",
        "profile": "Indicates speed, healing energy, and rejuvenation. Under affliction, can bring impulsiveness."
    },
    "Bharani": {
        "deity": "Yama (God of Justice & Death)",
        "lord": "Venus",
        "seeding_mantra": "Om Im / Om Yamaaya Namah",
        "sacred_tree": "Amla (Indian Gooseberry)",
        "donation": "Donate silk garments, white sweets, camphor, or ghee.",
        "remedy": "Respect women, support underprivileged girls, and worship Goddess Durga.",
        "profile": "Represents transformation, birth, and struggle. Affliction causes restlessness."
    },
    "Krittika": {
        "deity": "Agni (God of Fire)",
        "lord": "Sun",
        "seeding_mantra": "Om Aam / Om Agnaye Namah",
        "sacred_tree": "Gular (Cluster Fig)",
        "donation": "Donate copper, wheat, red flowers, and ghee on Sundays.",
        "remedy": "Perform light agnihotra/homa or light a ghee lamp daily. Worship Lord Kartikeya.",
        "profile": "Fiery, sharp, and purifying. Can lead to quick anger or critical nature when afflicted."
    },
    "Rohini": {
        "deity": "Prajapati (Lord of Creation/Brahma)",
        "lord": "Moon",
        "seeding_mantra": "Om Hrim / Om Prajapataye Namah",
        "sacred_tree": "Jamun (Black Plum)",
        "donation": "Donate rice, milk, silver, white sandalwood, or sugar.",
        "remedy": "Water Jamun trees. Worship Lord Krishna or Lord Vishnu, especially on Mondays.",
        "profile": "Represents beauty, growth, luxury, and artistic talents. Affliction brings possessiveness."
    },
    "Mrigashira": {
        "deity": "Soma (Moon God / Divine Nectar)",
        "lord": "Mars",
        "seeding_mantra": "Om Em / Om Somaaya Namah",
        "sacred_tree": "Khair (Acacia)",
        "donation": "Donate red lentils (masoor dal), copper, jaggery, or red flowers.",
        "remedy": "Plant a Khair tree. Worship Lord Shiva or Lord Hanuman on Tuesdays.",
        "profile": "Represents research, curiosity, and travel. Affliction triggers over-analyzing."
    },
    "Ardra": {
        "deity": "Rudra (God of Storms & Tears)",
        "lord": "Rahu",
        "seeding_mantra": "Om Aeem / Om Rudraaya Namah",
        "sacred_tree": "Krishna Kamal (Longan / Ebony)",
        "donation": "Donate black sesame, blankets, lead, or coconut to shelter houses.",
        "remedy": "Serve leprosy patients or street cleaners. Worship Lord Shiva in Rudra form.",
        "profile": "Represents chaos, clarity, and renewal. Affliction causes mental stress or confusion."
    },
    "Punarvasu": {
        "deity": "Aditi (Mother of the Cosmos)",
        "lord": "Jupiter",
        "seeding_mantra": "Om Aum / Om Aditaye Namah",
        "sacred_tree": "Jackfruit / Bamboo",
        "donation": "Donate turmeric, yellow clothes, gold, chickpeas, or honey.",
        "remedy": "Feed stray animals. Worship Lord Rama or Lord Vishnu on Thursdays.",
        "profile": "Represents return of light, hope, and safety. Affliction brings repetitive cycles."
    },
    "Pushya": {
        "deity": "Brihaspati (Guru of the Heavens)",
        "lord": "Saturn",
        "seeding_mantra": "Om Kam / Om Brihaspataye Namah",
        "sacred_tree": "Peepal (Sacred Fig)",
        "donation": "Donate mustard oil, black shoes, iron, or black sesame on Saturdays.",
        "remedy": "Light a sesame oil lamp under a Peepal tree. Worship Lord Shiva.",
        "profile": "Nourishing, protective, and highly spiritual. Affliction brings delays."
    },
    "Ashlesha": {
        "deity": "Sarpas (Divine Serpents)",
        "lord": "Mercury",
        "seeding_mantra": "Om Kham / Om Sarpebhyo Namah",
        "sacred_tree": "Nagkesar / Champa",
        "donation": "Donate green gram (moong dal), green garments, or books to students.",
        "remedy": "Offer milk to Lord Shiva (Rudrabhishek) or Lord Ganesha on Wednesdays.",
        "profile": "Sharp intuition, magnetic aura, and deep secrets. Affliction triggers suspicion."
    },
    "Magha": {
        "deity": "Pitrus (Ancestors)",
        "lord": "Ketu",
        "seeding_mantra": "Om Gham / Om Pitribhyo Namah",
        "sacred_tree": "Bargad (Banyan Tree)",
        "donation": "Donate warm blankets, umbrellas, or silver to elders.",
        "remedy": "Perform ancestor prayers (Tarpan) and take blessings from living elders.",
        "profile": "Royal status, pride, and heritage. Affliction causes ego clashes."
    },
    "Purva Phalguni": {
        "deity": "Bhaga (God of Prosperity)",
        "lord": "Venus",
        "seeding_mantra": "Om Cham / Om Bhagaaya Namah",
        "sacred_tree": "Palash (Flame of the Forest)",
        "donation": "Donate perfume, cosmetics, white clothes, or sugar to women.",
        "remedy": "Chant Lakshmi Chalisa. Plant a Palash tree and care for it.",
        "profile": "Rest, relaxation, luxury, and romance. Affliction causes laziness."
    },
    "Uttara Phalguni": {
        "deity": "Aryaman (God of Treaties & Patronage)",
        "lord": "Sun",
        "seeding_mantra": "Om Chham / Om Aryamne Namah",
        "sacred_tree": "Khejri (Pakar Tree)",
        "donation": "Donate wheat, copper coins, gold, or ruby on Sundays.",
        "remedy": "Offer water (Arghya) to the Sun at dawn. Chant the Gayatri Mantra.",
        "profile": "Leadership, duty, and community service. Affliction causes isolation."
    },
    "Hasta": {
        "deity": "Savitr (The Sun God of New Beginnings)",
        "lord": "Moon",
        "seeding_mantra": "Om Jam / Om Savitre Namah",
        "sacred_tree": "Reetha (Soapnut) / Jasmine",
        "donation": "Donate pearls, rice, white flowers, or milk on Mondays.",
        "remedy": "Practice handcrafts, drawing, or yoga mudras. Worship Lord Vishnu.",
        "profile": "Skillful hands, intelligence, and business acumen. Affliction causes anxiety."
    },
    "Chitra": {
        "deity": "Vishwakarma (The Celestial Architect)",
        "lord": "Mars",
        "seeding_mantra": "Om Jham / Om Vishwakarmane Namah",
        "sacred_tree": "Bel (Bael Fruit Tree)",
        "donation": "Donate coral, red garments, copper vessels, or sweet wheat bread.",
        "remedy": "Offer Bael leaves to Lord Shiva. Paint or design something creative.",
        "profile": "Aesthetic eye, design excellence, and charm. Affliction brings illusion."
    },
    "Swati": {
        "deity": "Vayu (Wind God)",
        "lord": "Rahu",
        "seeding_mantra": "Om Lam / Om Vayave Namah",
        "sacred_tree": "Arjun Tree",
        "donation": "Donate barley, black blankets, coconut, or charcoal.",
        "remedy": "Worship Goddess Saraswati. Perform pranayama daily in fresh air.",
        "profile": "Independence, movement, and growth. Affliction triggers indecision."
    },
    "Anuradha": {
        "deity": "Mitra (God of Friendship & Alliance)",
        "lord": "Saturn",
        "seeding_mantra": "Om Nam / Om Mitraaya Namah",
        "sacred_tree": "Maulshree (Bakul)",
        "donation": "Donate iron goods, black sesame, or mustard oil.",
        "remedy": "Help friends and colleagues. Read Hanuman Chalisa on Saturdays.",
        "profile": "Loyalty, devotion, and success in foreign lands. Affliction brings grief."
    },
    "Jyeshtha": {
        "deity": "Indra (King of the Gods)",
        "lord": "Mercury",
        "seeding_mantra": "Om Dham / Om Indraaya Namah",
        "sacred_tree": "Neem / Pine",
        "donation": "Donate green clothes, notebooks to students, or fresh green vegetables.",
        "remedy": "Water a Neem tree. Respect elder siblings. Worship Lord Vishnu.",
        "profile": "Seniorship, administrative control, and occult power. Affliction triggers anger."
    },
    "Moola": {
        "deity": "Nirriti (Goddess of Ruin & Dissolution)",
        "lord": "Ketu",
        "seeding_mantra": "Om Yaam / Om Nirritaye Namah",
        "sacred_tree": "Sal Tree",
        "donation": "Donate warm blankets, yellow fruits, or sweet grains.",
        "remedy": "Worship Lord Ganesha. Water Sal tree or place its wood at home.",
        "profile": "Investigation, spiritual depth, and radical changes. Affliction causes ruin."
    },
    "Purva Ashadha": {
        "deity": "Apah (Water Goddesses)",
        "lord": "Venus",
        "seeding_mantra": "Om Bham / Om Adbhyo Namah",
        "sacred_tree": "Ashok Tree",
        "donation": "Donate silver, white sweets, curd, or fragrant oils.",
        "remedy": "Avoid wasting water. Worship Goddess Lakshmi or Goddess Durga.",
        "profile": "Unconquerable spirit, flow, and fame. Affliction causes ego expansion."
    },
    "Uttara Ashadha": {
        "deity": "Vishwadevas (Universal Gods)",
        "lord": "Sun",
        "seeding_mantra": "Om Bham / Om Vishwadevebhyo Namah",
        "sacred_tree": "Kathal (Jackfruit)",
        "donation": "Donate copper, ruby, wheat, or red lentils on Sundays.",
        "remedy": "Respect teachers and guides. Worship Lord Ganesha or Lord Shiva.",
        "profile": "Endurance, victory, and law-abiding nature. Affliction causes dryness."
    },
    "Shravana": {
        "deity": "Lord Vishnu (The Preserver)",
        "lord": "Moon",
        "seeding_mantra": "Om Shram / Om Vishnave Namah",
        "sacred_tree": "Aak / Madar",
        "donation": "Donate rice, milk, pearls, or white flowers to priests.",
        "remedy": "Practice active, mindful listening. Worship Lord Vishnu with tulsi leaves.",
        "profile": "Learning, listening, and organizational skills. Affliction makes one gullible."
    },
    "Dhanishta": {
        "deity": "Eight Vasus (Deities of Abundance)",
        "lord": "Mars",
        "seeding_mantra": "Om Yam / Om Vasubhyo Namah",
        "sacred_tree": "Shami / Coconut Tree",
        "donation": "Donate red lentils, copper, jaggery, or red cloth on Tuesdays.",
        "remedy": "Water a Shami tree. Play or listen to drums/instrumental music. Worship Lord Shiva.",
        "profile": "Wealth, musical talents, and fame. Affliction causes relationship friction."
    },
    "Shatabhisha": {
        "deity": "Varuna (God of Cosmic Oceans)",
        "lord": "Rahu",
        "seeding_mantra": "Om Lam / Om Varunaaya Namah",
        "sacred_tree": "Kadamba",
        "donation": "Donate coconut, lead, charcoal, or blankets to the poor.",
        "remedy": "Serve disabled persons. Worship Lord Shiva or Goddess Durga.",
        "profile": "Healing, secrets, and cosmic vision. Affliction triggers loneliness."
    },
    "Purva Bhadrapada": {
        "deity": "Aja Ekapada (One-footed Storm Deity)",
        "lord": "Jupiter",
        "seeding_mantra": "Om Vam / Om Ajaekapadaaya Namah",
        "sacred_tree": "Mango Tree",
        "donation": "Donate yellow items, turmeric, gold, or honey.",
        "remedy": "Feed cows. Worship Lord Shiva or Lord Vishnu. Respect elders.",
        "profile": "Spiritual depth, dual nature, and sacrifice. Affliction causes instability."
    },
    "Uttara Bhadrapada": {
        "deity": "Ahirbudhnya (Serpent of the Depths)",
        "lord": "Saturn",
        "seeding_mantra": "Om Sham / Om Ahirbudhnyaaya Namah",
        "sacred_tree": "Neem Tree",
        "donation": "Donate black sesame, iron, mustard oil, or woolens.",
        "remedy": "Water Neem trees. Help senior citizens. Worship Lord Shiva or Hanuman.",
        "profile": "Wisdom, restraint, and healing powers. Affliction causes isolation."
    },
    "Revati": {
        "deity": "Pushan (Nourishing Guide of Journeys)",
        "lord": "Mercury",
        "seeding_mantra": "Om Aam / Om Pushne Namah",
        "sacred_tree": "Mahua",
        "donation": "Donate green vegetables, books to kids, or green clothes on Wednesdays.",
        "remedy": "Feed cows with green grass. Worship Lord Vishnu or Goddess Lakshmi.",
        "profile": "Wealth, safe travel, and final release (Moksha). Affliction triggers anxiety."
    }
}

@router.post("/nakshatra")
def get_nakshatra_remedy(payload: Dict[str, Any] = Body(...)):
    try:
        # Check if nakshatra_name is passed directly
        nak_name = payload.get("nakshatra_name")
        
        # If not passed, we can calculate it from birth details if provided
        if not nak_name:
            birth_date = payload.get("birth_date")
            birth_time = payload.get("birth_time")
            lat = payload.get("lat")
            lon = payload.get("lon")
            tz_offset = payload.get("tz_offset", 0.0)
            
            if birth_date and birth_time and lat is not None and lon is not None:
                # Calculate birth chart to find Moon's Nakshatra
                from astronomy.julian import datetime_to_julian
                import datetime as _dt
                from charts.rashi_chart import build_rashi_chart
                
                y, m, d = [int(x) for x in birth_date.split("-")]
                tp = [int(x) for x in birth_time.split(":")]
                dt_local = _dt.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
                dt_utc = dt_local - _dt.timedelta(hours=float(tz_offset))
                jd_ut = datetime_to_julian(dt_utc)
                
                chart = build_rashi_chart(jd_ut, float(lat), float(lon))
                moon_pos = chart.get("planet_positions", {}).get("Moon", {})
                nak_name = moon_pos.get("sidereal", {}).get("nakshatra_name")
                
        if not nak_name:
            raise HTTPException(status_code=400, detail="Either nakshatra_name or birth_date, birth_time, lat, lon must be provided.")
            
        # Match nakshatra key case insensitively
        matched_key = None
        for key in NAKSHATRA_REMEDIES.keys():
            if key.lower() in nak_name.lower() or nak_name.lower() in key.lower():
                matched_key = key
                break
                
        if not matched_key:
            # Fallback
            matched_key = "Ashwini"
            
        remedy_data = NAKSHATRA_REMEDIES[matched_key]
        return {
            "nakshatra": matched_key,
            **remedy_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
