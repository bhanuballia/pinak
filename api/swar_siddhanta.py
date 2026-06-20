# api/swar_siddhanta.py

from shadbala.shadbala import compute_shadbala

# Tattva Mappings for Planets
PLANET_TATTVA = {
    "Sun": "Agni",
    "Moon": "Jala",
    "Mars": "Agni",
    "Mercury": "Prithvi",
    "Jupiter": "Akasha",
    "Venus": "Jala",
    "Saturn": "Vayu",
    "Rahu": "Vayu",
    "Ketu": "Agni"
}

# Tattva Mappings for Rasis (Zodiac Signs)
RASI_TATTVA = {
    1: "Agni", 5: "Agni", 9: "Agni",      # Aries, Leo, Sagittarius
    2: "Prithvi", 6: "Prithvi", 10: "Prithvi", # Taurus, Virgo, Capricorn
    3: "Vayu", 7: "Vayu", 11: "Vayu",     # Gemini, Libra, Aquarius
    4: "Jala", 8: "Jala", 12: "Jala"      # Cancer, Scorpio, Pisces
}

# Swar Siddhanta Syllable Mappings
TATTVA_SYLLABLES = {
    "Agni": ["I", "E", "Ma", "Me", "Ta", "Te", "Ra", "Re", "Na", "Ne", "Ya", "Ye", "Bha", "Bhe"],
    "Prithvi": ["A", "O", "Ku", "Ko", "Gha", "Go", "Pa", "Po", "Ba", "Bo", "Va", "Vo", "Ma", "Mo"],
    "Vayu": ["U", "Ai", "Ka", "Ke", "Cha", "Che", "Ta", "Te", "Tha", "The", "Pa", "Pe", "Sa", "Se"],
    "Jala": ["E", "Ou", "Ja", "Je", "Da", "De", "Na", "Ne", "Ba", "Be", "Ma", "Me", "Ya", "Ye"],
    "Akasha": ["Am", "Ah", "Ha", "He", "Kha", "Khe", "Gha", "Ghe", "Cha", "Che", "Tha", "The"]
}

# Avakahada Chakra (Nakshatra-based naming syllables)
NAKSHATRA_SYLLABLES = {
    "Ashwini": ["Chu", "Che", "Cho", "Laa"],
    "Bharani": ["Lee", "Loo", "Le", "Lo"],
    "Krittika": ["A", "Ee", "U", "E"],
    "Rohini": ["O", "Vaa", "Vee", "Vu"],
    "Mrigashira": ["Ve", "Vo", "Kaa", "Kee"],
    "Ardra": ["Ku", "Gha", "Ing", "Chha"],
    "Punarvasu": ["Ke", "Ko", "Haa", "Hee"],
    "Pushya": ["Hu", "He", "Ho", "Daa"],
    "Ashlesha": ["Dee", "Doo", "De", "Do"],
    "Magha": ["Maa", "Mee", "Moo", "Me"],
    "Purva Phalguni": ["Mo", "Taa", "Tee", "Too"],
    "Uttara Phalguni": ["Te", "To", "Paa", "Pee"],
    "Hasta": ["Poo", "Sha", "Na", "Tha"],
    "Chitra": ["Pe", "Po", "Raa", "Ree"],
    "Swati": ["Roo", "Re", "Ro", "Taa"],
    "Vishakha": ["Tee", "Too", "Te", "To"],
    "Anuradha": ["Naa", "Nee", "Noo", "Ne"],
    "Jyeshtha": ["No", "Yaa", "Yee", "Yoo"],
    "Mula": ["Ye", "Yo", "Bhaa", "Bhee"],
    "Purva Ashadha": ["Bhoo", "Dhaa", "Phaa", "Dha"],
    "Uttara Ashadha": ["Bhe", "Bho", "Jaa", "Jee"],
    "Shravana": ["Khee", "Khoo", "Khe", "Kho"],
    "Dhanishtha": ["Gaa", "Gee", "Gu", "Ge"],
    "Shatabhisha": ["Go", "Saa", "See", "Soo"],
    "Purva Bhadrapada": ["Se", "So", "Daa", "Dee"],
    "Uttara Bhadrapada": ["Doo", "Tha", "Jha", "Yna"],
    "Revati": ["De", "Do", "Cha", "Chee"]
}

def get_dominant_tattva(ascendant_sign_index: int) -> str:
    """Returns the dominant Tattva based on the Ascendant sign (1-12)."""
    return RASI_TATTVA.get(ascendant_sign_index, "Akasha")

def get_beneficial_tattva(jd_ut: float, lat: float, lon: float) -> str:
    """Returns the beneficial Tattva based on the strongest planet from Shadbala."""
    shadbala_result = compute_shadbala(jd_ut, lat, lon)
    strongest_planet = shadbala_result.get("summary", {}).get("strongest", ("Jupiter", 0))[0]
    if not strongest_planet:
        strongest_planet = "Jupiter"
    return PLANET_TATTVA.get(strongest_planet, "Akasha"), strongest_planet

def get_swar_recommendations(tattva: str) -> list:
    """Returns recommended starting syllables for a given Tattva."""
    return TATTVA_SYLLABLES.get(tattva, [])

def get_avakahada_syllable(nakshatra_name: str, pada: int) -> str:
    """Returns the Avakahada starting syllable for a given Nakshatra and Pada (1-4)."""
    # Clean up nakshatra name if it has suffix
    clean_name = nakshatra_name.split()[0] if nakshatra_name else ""
    for k in NAKSHATRA_SYLLABLES.keys():
        if k.lower().startswith(clean_name.lower()):
            clean_name = k
            break
            
    syllables = NAKSHATRA_SYLLABLES.get(clean_name, [])
    if syllables and 1 <= pada <= 4:
        return syllables[pada - 1]
    return ""
