# matchmaking/guna_milan/nakshatra_data.py
"""
Data for Ashta Koota (36 Guna Milan) matching.
Contains Varna, Vashya, Gana, Yoni, Nadi and Lord for each Nakshatra.
"""

NAKSHATRA_ATTRIBUTES = {
    "Ashwini": {"lord": "Ketu", "varna": "Vaishya", "vashya": "Chatushpada", "gana": "Deva", "yoni": "Ashwa", "nadi": "Aadi"},
    "Bharani": {"lord": "Venus", "varna": "Mleccha", "vashya": "Chatushpada", "gana": "Manushya", "yoni": "Gaja", "nadi": "Madhya"},
    "Krittika": {"lord": "Sun", "varna": "Brahmin", "vashya": "Chatushpada", "gana": "Rakshasa", "yoni": "Mesha", "nadi": "Antya"},
    "Rohini": {"lord": "Moon", "varna": "Shudra", "vashya": "Chatushpada", "gana": "Manushya", "yoni": "Sarpa", "nadi": "Antya"},
    "Mrigashira": {"lord": "Mars", "varna": "Vaishya", "vashya": "Dwipada", "gana": "Deva", "yoni": "Sarpa", "nadi": "Madhya"},
    "Ardra": {"lord": "Rahu", "varna": "Shudra", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Shwan", "nadi": "Aadi"},
    "Punarvasu": {"lord": "Jupiter", "varna": "Vaishya", "vashya": "Dwipada", "gana": "Deva", "yoni": "Marjar", "nadi": "Aadi"},
    "Pushya": {"lord": "Saturn", "varna": "Kshatriya", "vashya": "Chatushpada", "gana": "Deva", "yoni": "Mesha", "nadi": "Madhya"},
    "Ashlesha": {"lord": "Mercury", "varna": "Mleccha", "vashya": "Keeta", "gana": "Rakshasa", "yoni": "Marjar", "nadi": "Antya"},
    "Magha": {"lord": "Ketu", "varna": "Shudra", "vashya": "Chatushpada", "gana": "Rakshasa", "yoni": "Mushaka", "nadi": "Antya"},
    "Purva Phalguni": {"lord": "Venus", "varna": "Brahmin", "vashya": "Chatushpada", "gana": "Manushya", "yoni": "Mushaka", "nadi": "Madhya"},
    "Uttara Phalguni": {"lord": "Sun", "varna": "Kshatriya", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Gau", "nadi": "Aadi"},
    "Hasta": {"lord": "Moon", "varna": "Vaishya", "vashya": "Dwipada", "gana": "Deva", "yoni": "Mahisha", "nadi": "Aadi"},
    "Chitra": {"lord": "Mars", "varna": "Shudra", "vashya": "Dwipada", "gana": "Rakshasa", "yoni": "Vyaghra", "nadi": "Madhya"},
    "Swati": {"lord": "Rahu", "varna": "Mleccha", "vashya": "Dwipada", "gana": "Deva", "yoni": "Mahisha", "nadi": "Antya"},
    "Vishakha": {"lord": "Jupiter", "varna": "Brahmin", "vashya": "Keeta", "gana": "Rakshasa", "yoni": "Vyaghra", "nadi": "Antya"},
    "Anuradha": {"lord": "Saturn", "varna": "Shudra", "vashya": "Keeta", "gana": "Deva", "yoni": "Mriga", "nadi": "Madhya"},
    "Jyeshtha": {"lord": "Mercury", "varna": "Vaishya", "vashya": "Keeta", "gana": "Rakshasa", "yoni": "Mriga", "nadi": "Aadi"},
    "Mula": {"lord": "Ketu", "varna": "Kshatriya", "vashya": "Chatushpada", "gana": "Rakshasa", "yoni": "Shwan", "nadi": "Aadi"},
    "Purva Ashadha": {"lord": "Venus", "varna": "Vaishya", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Vanar", "nadi": "Madhya"},
    "Uttara Ashadha": {"lord": "Sun", "varna": "Kshatriya", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Nakula", "nadi": "Antya"},
    "Shravana": {"lord": "Moon", "varna": "Mleccha", "vashya": "Dwipada", "gana": "Deva", "yoni": "Vanar", "nadi": "Antya"},
    "Dhanishta": {"lord": "Mars", "varna": "Shudra", "vashya": "Chatushpada", "gana": "Rakshasa", "yoni": "Simha", "nadi": "Madhya"},
    "Shatabhisha": {"lord": "Rahu", "varna": "Mleccha", "vashya": "Dwipada", "gana": "Rakshasa", "yoni": "Ashwa", "nadi": "Aadi"},
    "Purva Bhadrapada": {"lord": "Jupiter", "varna": "Brahmin", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Simha", "nadi": "Aadi"},
    "Uttara Bhadrapada": {"lord": "Saturn", "varna": "Kshatriya", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Gau", "nadi": "Madhya"},
    "Revati": {"lord": "Mercury", "varna": "Shudra", "vashya": "Dwipada", "gana": "Deva", "yoni": "Gaja", "nadi": "Antya"}
}

# Additional data for sign-based guna milan
SIGN_ATTRIBUTES = {
    "Aries": {"lord": "Mars", "varna": "Kshatriya", "vashya": "Chatushpada"},
    "Taurus": {"lord": "Venus", "varna": "Vaishya", "vashya": "Chatushpada"},
    "Gemini": {"lord": "Mercury", "varna": "Shudra", "vashya": "Dwipada"},
    "Cancer": {"lord": "Moon", "varna": "Brahmin", "vashya": "Jalachar"},
    "Leo": {"lord": "Sun", "varna": "Kshatriya", "vashya": "Vanchar"},
    "Virgo": {"lord": "Mercury", "varna": "Vaishya", "vashya": "Dwipada"},
    "Libra": {"lord": "Venus", "varna": "Shudra", "vashya": "Dwipada"},
    "Scorpio": {"lord": "Mars", "varna": "Brahmin", "vashya": "Keeta"},
    "Sagittarius": {"lord": "Jupiter", "varna": "Kshatriya", "vashya": "Dwipada"},
    "Capricorn": {"lord": "Saturn", "varna": "Vaishya", "vashya": "Jalachar"},
    "Aquarius": {"lord": "Saturn", "varna": "Shudra", "vashya": "Dwipada"},
    "Pisces": {"lord": "Jupiter", "varna": "Brahmin", "vashya": "Jalachar"}
}

# Animal Compatibility Matrix for Yoni Koota
YONI_COMPATIBILITY = {
    "Ashwa": {"Ashwa": 4, "Gaja": 2, "Mesha": 2, "Sarpa": 3, "Shwan": 2, "Marjar": 2, "Mushaka": 1, "Gau": 3, "Mahisha": 3, "Vyaghra": 2, "Mriga": 2, "Vanar": 3, "Nakula": 2, "Simha": 1},
    "Gaja": {"Ashwa": 2, "Gaja": 4, "Mesha": 3, "Sarpa": 3, "Shwan": 2, "Marjar": 2, "Mushaka": 3, "Gau": 2, "Mahisha": 3, "Vyaghra": 1, "Mriga": 2, "Vanar": 3, "Nakula": 2, "Simha": 2},
    "Mesha": {"Ashwa": 2, "Gaja": 3, "Mesha": 4, "Sarpa": 2, "Shwan": 1, "Marjar": 2, "Mushaka": 1, "Gau": 3, "Mahisha": 3, "Vyaghra": 2, "Mriga": 3, "Vanar": 2, "Nakula": 2, "Simha": 0},
    "Sarpa": {"Ashwa": 3, "Gaja": 3, "Mesha": 2, "Sarpa": 4, "Shwan": 2, "Marjar": 1, "Mushaka": 1, "Gau": 1, "Mahisha": 1, "Vyaghra": 2, "Mriga": 3, "Vanar": 2, "Nakula": 0, "Simha": 2},
    "Shwan": {"Ashwa": 2, "Gaja": 2, "Mesha": 1, "Sarpa": 2, "Shwan": 4, "Marjar": 2, "Mushaka": 1, "Gau": 2, "Mahisha": 2, "Vyaghra": 1, "Mriga": 2, "Vanar": 2, "Nakula": 1, "Simha": 1},
    "Marjar": {"Ashwa": 2, "Gaja": 2, "Mesha": 2, "Sarpa": 1, "Shwan": 2, "Marjar": 4, "Mushaka": 0, "Gau": 2, "Mahisha": 2, "Vyaghra": 2, "Mriga": 3, "Vanar": 3, "Nakula": 2, "Simha": 2},
    "Mushaka": {"Ashwa": 1, "Gaja": 3, "Mesha": 1, "Sarpa": 1, "Shwan": 1, "Marjar": 0, "Mushaka": 4, "Gau": 2, "Mahisha": 2, "Vyaghra": 2, "Mriga": 2, "Vanar": 2, "Nakula": 2, "Simha": 1},
    "Gau": {"Ashwa": 3, "Gaja": 2, "Mesha": 3, "Sarpa": 1, "Shwan": 2, "Marjar": 2, "Mushaka": 2, "Gau": 4, "Mahisha": 3, "Vyaghra": 0, "Mriga": 3, "Vanar": 2, "Nakula": 2, "Simha": 1},
    "Mahisha": {"Ashwa": 3, "Gaja": 3, "Mesha": 3, "Sarpa": 1, "Shwan": 2, "Marjar": 2, "Mushaka": 2, "Gau": 3, "Mahisha": 4, "Vyaghra": 1, "Mriga": 2, "Vanar": 2, "Nakula": 2, "Simha": 1},
    "Vyaghra": {"Ashwa": 2, "Gaja": 1, "Mesha": 2, "Sarpa": 2, "Shwan": 1, "Marjar": 2, "Mushaka": 2, "Gau": 0, "Mahisha": 1, "Vyaghra": 4, "Mriga": 1, "Vanar": 1, "Nakula": 2, "Simha": 1},
    "Mriga": {"Ashwa": 2, "Gaja": 2, "Mesha": 3, "Sarpa": 3, "Shwan": 2, "Marjar": 3, "Mushaka": 2, "Gau": 3, "Mahisha": 2, "Vyaghra": 1, "Mriga": 4, "Vanar": 2, "Nakula": 2, "Simha": 0},
    "Vanar": {"Ashwa": 3, "Gaja": 3, "Mesha": 2, "Sarpa": 2, "Shwan": 2, "Marjar": 3, "Mushaka": 2, "Gau": 2, "Mahisha": 2, "Vyaghra": 1, "Mriga": 2, "Vanar": 4, "Nakula": 2, "Simha": 2},
    "Nakula": {"Ashwa": 2, "Gaja": 2, "Mesha": 2, "Sarpa": 0, "Shwan": 1, "Marjar": 2, "Mushaka": 2, "Gau": 2, "Mahisha": 2, "Vyaghra": 2, "Mriga": 2, "Vanar": 2, "Nakula": 4, "Simha": 2},
    "Simha": {"Ashwa": 1, "Gaja": 2, "Mesha": 0, "Sarpa": 2, "Shwan": 1, "Marjar": 2, "Mushaka": 1, "Gau": 1, "Mahisha": 1, "Vyaghra": 1, "Mriga": 0, "Vanar": 2, "Nakula": 2, "Simha": 4}
}
