# nakshatra/nakshatra_attributes.py

NAKSHATRA_ATTRIBUTES = {
    "Ashwini": {
        "gana": "Deva",
        "yoni": "Horse",
        "nadi": "Vata",
        "element": "Fire",
        "deity": "Ashwini Kumaras"
    },
    "Bharani": {
        "gana": "Manushya",
        "yoni": "Elephant",
        "nadi": "Pitta",
        "element": "Earth",
        "deity": "Yama"
    },
    "Krittika": {
        "gana": "Rakshasa",
        "yoni": "Sheep",
        "nadi": "Kapha",
        "element": "Fire",
        "deity": "Agni"
    },
    "Rohini": {
        "gana": "Manushya",
        "yoni": "Serpent",
        "nadi": "Vata",
        "element": "Earth",
        "deity": "Brahma"
    },
    "Mrigashira": {
        "gana": "Deva",
        "yoni": "Serpent",
        "nadi": "Pitta",
        "element": "Earth",
        "deity": "Chandra"
    },
    "Ardra": {
        "gana": "Manushya",
        "yoni": "Dog",
        "nadi": "Kapha",
        "element": "Water",
        "deity": "Rudra"
    },
    "Punarvasu": {
        "gana": "Deva",
        "yoni": "Cat",
        "nadi": "Vata",
        "element": "Water",
        "deity": "Aditi"
    },
    "Pushya": {
        "gana": "Deva",
        "yoni": "Goat",
        "nadi": "Pitta",
        "element": "Water",
        "deity": "Brihaspati"
    },
    "Ashlesha": {
        "gana": "Rakshasa",
        "yoni": "Cat",
        "nadi": "Kapha",
        "element": "Water",
        "deity": "Sarpa (Nagas)"
    },
    "Magha": {
        "gana": "Rakshasa",
        "yoni": "Rat",
        "nadi": "Vata",
        "element": "Water",
        "deity": "Pitris"
    },
    "Purva Phalguni": {
        "gana": "Manushya",
        "yoni": "Rat",
        "nadi": "Pitta",
        "element": "Water",
        "deity": "Bhaga"
    },
    "Uttara Phalguni": {
        "gana": "Manushya",
        "yoni": "Cow",
        "nadi": "Kapha",
        "element": "Water",
        "deity": "Aryaman"
    },
    "Hasta": {
        "gana": "Deva",
        "yoni": "Buffalo",
        "nadi": "Vata",
        "element": "Earth",
        "deity": "Savitr"
    },
    "Chitra": {
        "gana": "Rakshasa",
        "yoni": "Tiger",
        "nadi": "Pitta",
        "element": "Fire",
        "deity": "Vishwakarma"
    },
    "Swati": {
        "gana": "Deva",
        "yoni": "Buffalo",
        "nadi": "Kapha",
        "element": "Fire",
        "deity": "Vayu"
    },
    "Vishakha": {
        "gana": "Rakshasa",
        "yoni": "Tiger",
        "nadi": "Vata",
        "element": "Fire",
        "deity": "Indragni"
    },
    "Anuradha": {
        "gana": "Deva",
        "yoni": "Deer",
        "nadi": "Pitta",
        "element": "Fire",
        "deity": "Mitra"
    },
    "Jyeshtha": {
        "gana": "Rakshasa",
        "yoni": "Deer",
        "nadi": "Kapha",
        "element": "Air",
        "deity": "Indra"
    },
    "Mula": {
        "gana": "Rakshasa",
        "yoni": "Dog",
        "nadi": "Vata",
        "element": "Air",
        "deity": "Nirriti"
    },
    "Purva Ashadha": {
        "gana": "Manushya",
        "yoni": "Monkey",
        "nadi": "Pitta",
        "element": "Air",
        "deity": "Apas"
    },
    "Uttara Ashadha": {
        "gana": "Manushya",
        "yoni": "Mongoose",
        "nadi": "Kapha",
        "element": "Air",
        "deity": "Vishwadevas"
    },
    "Shravana": {
        "gana": "Deva",
        "yoni": "Monkey",
        "nadi": "Vata",
        "element": "Air",
        "deity": "Vishnu"
    },
    "Dhanishta": {
        "gana": "Rakshasa",
        "yoni": "Lion",
        "nadi": "Pitta",
        "element": "Air",
        "deity": "Eight Vasus"
    },
    "Shatabhisha": {
        "gana": "Rakshasa",
        "yoni": "Horse",
        "nadi": "Kapha",
        "element": "Air",
        "deity": "Varuna"
    },
    "Purva Bhadrapada": {
        "gana": "Manushya",
        "yoni": "Lion",
        "nadi": "Vata",
        "element": "Air",
        "deity": "Aja Ekapada"
    },
    "Uttara Bhadrapada": {
        "gana": "Manushya",
        "yoni": "Cow",
        "nadi": "Pitta",
        "element": "Air",
        "deity": "Ahirbudhnya"
    },
    "Revati": {
        "gana": "Deva",
        "yoni": "Elephant",
        "nadi": "Kapha",
        "element": "Water",
        "deity": "Pushan"
    }
}

def get_attributes(
    nakshatra_name: str
):

    return NAKSHATRA_ATTRIBUTES.get(
        nakshatra_name,
        {}
    )
