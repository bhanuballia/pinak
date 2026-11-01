"""
Vedic Festivals Reference & Calculation Engine
Calculates authentic Hindu festivals, Vrats, and religious observances for any month of any year
based on Vedic Tithi (0-29), Paksha (Shukla/Krishna), Sun Rashi, and traditional Panchang rules.
"""

from typing import Optional, Dict, Any

# Major Vedic Festivals Rulebook (Solar Sign + Tithi index)
# Sun Rashi: 0:Mesha, 1:Vrishabha, 2:Mithuna, 3:Karka, 4:Simha, 5:Kanya, 6:Tula, 7:Vrishchika, 8:Dhanu, 9:Makara, 10:Kumbha, 11:Meena
# Tithi Index: 0..14 = Shukla Pratipada..Purnima, 15..29 = Krishna Pratipada..Amavasya

SPECIAL_FESTIVAL_RULES = [
    # --- KARTIK MAS (Sun in Tula/Vrischika, or Post-Sharad Purnima) ---
    # Dhanteras (Krishna Trayodashi before Diwali)
    {
        "sun_signs": [6, 7], "tithi": 27, "name": "धनतेरस / धनत्रयोदशी",
        "desc": "भगवान धन्वन्तरि जयन्ती, यम दीपदान, नवीन स्वर्ण, रजत एवं बर्तनों का क्रय।"
    },
    # Narak Chaturdashi / Roop Chaudas
    {
        "sun_signs": [6, 7], "tithi": 28, "name": "नरक चतुर्दशी / रूप चौदस / छोटी दीपावली",
        "desc": "अभ्यंग स्नान, यम तर्पण, सन्ध्या समय दीप प्रज्वलन।"
    },
    # Deepawali (Kartik Krishna Amavasya)
    {
        "sun_signs": [6, 7], "tithi": 29, "name": "दीपावली / श्री महालक्ष्मी पूजन",
        "desc": "दीपावली महोत्सव, भगवती महालक्ष्मी, श्री गणेश व कुबेर पूजन, रात्रि दीपदान।"
    },
    # Govardhan Puja / Annakoot (Kartik Shukla Pratipada)
    {
        "sun_signs": [6, 7], "tithi": 0, "name": "गोवर्धन पूजा / अन्नकूट महोत्सव / द्यूत क्रीड़ा",
        "desc": "गौ पूजन, गोवर्धन परिक्रमा, 56 भोग अन्नकूट प्रसाद वितरण।"
    },
    # Bhai Dooj / Yama Dwitiya (Kartik Shukla Dwitiya)
    {
        "sun_signs": [6, 7], "tithi": 1, "name": "भैया दूज / यम द्वितीया / चित्रगुप्त पूजा",
        "desc": "बहनों द्वारा भाइयों का तिलक, यमुना स्नान, दीर्घायु एवं रक्षा हेतु मंगलकामना।"
    },
    # Chhath Puja Nahay Khay (Kartik Shukla Chaturthi)
    {
        "sun_signs": [6, 7], "tithi": 3, "name": "छठ पूजा आरम्भ (नहाय-खाय)",
        "desc": "सूर्य षष्ठी व्रत का शुभारम्भ, पवित्र स्नान एवं कद्दू-भात का सेवन।"
    },
    # Kharna (Kartik Shukla Panchami)
    {
        "sun_signs": [6, 7], "tithi": 4, "name": "खरना (लोहंडा) / छठ व्रत",
        "desc": "सायंकालीन रसियाव-रोटी का प्रसाद ग्रहण, 36 घंटे का निर्जला उपवास आरम्भ।"
    },
    # Sandhya Arghya (Kartik Shukla Shashthi)
    {
        "sun_signs": [6, 7], "tithi": 5, "name": "सूर्य षष्ठी (छठ पूजा) / सांध्य अर्घ्य",
        "desc": "अस्ताचलगामी भगवान सूर्य को प्रथम अर्घ्य दान, संतान एवं कुल कल्याण हेतु।"
    },
    # Usha Arghya (Kartik Shukla Saptami)
    {
        "sun_signs": [6, 7], "tithi": 6, "name": "उषा अर्घ्य / छठ पूजा पारण",
        "desc": "उदीयमान भगवान भास्कर को प्रात:कालीन अर्घ्य, महापर्व का पूर्ण पारण।"
    },
    # Gopashtami (Kartik Shukla Ashtami)
    {
        "sun_signs": [6, 7], "tithi": 7, "name": "गोपाष्टमी व्रत",
        "desc": "गोमाता एवं बछड़ों का विधिवत पूजन, गोग्रास अर्पण।"
    },
    # Devutthana Ekadashi / Tulsi Vivah (Kartik Shukla Ekadashi)
    {
        "sun_signs": [6, 7], "tithi": 10, "name": "देवउठनी एकादशी / प्रबोधिनी एकादशी / तुलसी विवाह आरम्भ",
        "desc": "चातुर्मास समाप्त, भगवान श्रीहरि योगनिद्रा से जागे, समस्त मांगलिक कार्य आरम्भ।"
    },
    # Tulsi Vivah / Vaikuntha Chaturdashi
    {
        "sun_signs": [6, 7], "tithi": 13, "name": "वैकुण्ठ चतुर्दशी / तुलसी विवाह",
        "desc": "भगवान श्रीहरि एवं शिव का मिलन, तुलसी-शालिग्राम विवाह।"
    },
    # Dev Deepawali / Kartik Purnima (Kartik Shukla Purnima)
    {
        "sun_signs": [6, 7], "tithi": 14, "name": "देव दीपावली / कार्तिक पूर्णिमा / त्रिपुरारी पूर्णिमा",
        "desc": "काशी में देव दीपावली, गंगा स्नान, दीपदान, गुरु नानक देव जी प्रकाशोत्सव।"
    },

    # --- ASHWIN MAS (Sun in Kanya/Tula) ---
    # Sarvapitri Amavasya
    {
        "sun_signs": [5, 6], "tithi": 29, "name": "सर्वपितृ अमावस्या / महालया / पितृ विसर्जन",
        "desc": "समस्त ज्ञात-अज्ञात पितरों का तर्पण, पिण्डदान एवं विसर्जन।"
    },
    # Ghatasthapana / Navratri Day 1
    {
        "sun_signs": [5, 6], "tithi": 0, "name": "शारदीय नवरात्रारम्भ / कलश स्थापन / शैलपुत्री पूजन",
        "desc": "घटस्थापना, दुर्गा सप्तशती पाठ आरम्भ, माता शैलपुत्री की आराधना।"
    },
    # Maha Ashtami (Navratri)
    {
        "sun_signs": [5, 6], "tithi": 7, "name": "दुर्गा महाष्टमी व्रत / महागौरी पूजन / कन्या पूजन",
        "desc": "महाअष्टमी व्रत, महागौरी आराधना, सन्धि पूजा, कन्या पूजन।"
    },
    # Maha Navami (Navratri)
    {
        "sun_signs": [5, 6], "tithi": 8, "name": "महानवमी / सिद्धिदात्री पूजन / नवरात्र हवन",
        "desc": "सिद्धिदात्री पूजन, पूर्णाहुति हवन, नवरात्र व्रत पारण।"
    },
    # Vijayadashami / Dussehra
    {
        "sun_signs": [5, 6], "tithi": 9, "name": "विजयादशमी / दशहरा / शमी पूजन",
        "desc": "बुराई पर अच्छाई की विजय, श्रीराम विजयोत्सव, शमी पूजा, रावण दहन।"
    },
    # Sharad Purnima
    {
        "sun_signs": [5, 6], "tithi": 14, "name": "शरद पूर्णिमा / कोजागरी पूर्णिमा / रास पूर्णिमा",
        "desc": "अमृत वर्षा स्नान, चन्द्र दर्शन, भगवती महालक्ष्मी पूजन, खीर का भोग।"
    },
    # Karwa Chauth (Kartik Krishna Chaturthi)
    {
        "sun_signs": [6], "tithi": 18, "name": "करवा चौथ व्रत / संकष्टी चतुर्थी",
        "desc": "अखण्ड सौभाग्य हेतु सुहागिनों का निर्जला व्रत, रात्रि चन्द्रोदय पर अर्घ्य पूजन।"
    },
    # Ahoi Ashtami (Kartik Krishna Ashtami)
    {
        "sun_signs": [6], "tithi": 22, "name": "अहोई अष्टमी व्रत",
        "desc": "संतान की दीर्घायु एवं मंगल हेतु माताओं का निर्जला व्रत, तारों को अर्घ्य।"
    },

    # --- SHRAVANA MAS (Sun in Karka/Simha) ---
    # Nag Panchami (Shukla Panchami)
    {
        "sun_signs": [3, 4], "tithi": 4, "name": "नाग पंचमी",
        "desc": "नाग देवताओं का दुग्धाभिषेक, अनन्त, वासुकि, शेषनाग पूजन।"
    },
    # Raksha Bandhan (Shravana Purnima)
    {
        "sun_signs": [3, 4], "tithi": 14, "name": "रक्षाबन्धन / श्रावणी पूर्णिमा / संस्कृत दिवस",
        "desc": "बहनों द्वारा भाइयों की कलाई पर रक्षासूत्र, श्रावणी उपाकर्म।"
    },
    # Krishna Janmashtami (Bhadrapada Krishna Ashtami)
    {
        "sun_signs": [4], "tithi": 22, "name": "श्री कृष्ण जन्माष्टमी व्रत",
        "desc": "भगवान श्री कृष्ण जन्मोत्सव, मध्यरात्रि जन्माभिषेक, उपवास एवं भजन।"
    },

    # --- BHADRAPADA MAS (Sun in Simha/Kanya) ---
    # Ganesh Chaturthi
    {
        "sun_signs": [4, 5], "tithi": 3, "name": "गणेश चतुर्थी / विनायक चतुर्थी / गणेशोत्सव आरम्भ",
        "desc": "प्रथम पूज्य श्री गणेश जी की प्रतिमा स्थापना, मोदक भोग, 10 दिवसीय गणेशोत्सव।"
    },
    # Anant Chaturdashi / Ganesh Visarjan
    {
        "sun_signs": [4, 5], "tithi": 13, "name": "अनन्त चतुर्दशी / गणेश विसर्जन",
        "desc": "भगवान अनन्त (विष्णु) पूजन, 14 गांठों वाला सूत्र धारण, गणपति विसर्जन।"
    },

    # --- CHAITRA / VAISHAKHA (Sun in Meena/Mesha) ---
    # Chaitra Navratri / Hindu New Year (Shukla Pratipada)
    {
        "sun_signs": [11, 0], "tithi": 0, "name": "चैत्र नवरात्रारम्भ / नव संवत्सरारम्भ / गुड़ी पड़वा",
        "desc": "नववर्षारम्भ, विक्रम संवत, घटस्थापना, वासन्ती नवरात्र आरम्भ।"
    },
    # Ram Navami (Chaitra Shukla Navami)
    {
        "sun_signs": [11, 0], "tithi": 8, "name": "श्री राम नवमी / चैत्र नवरात्र पूर्ण",
        "desc": "मर्यादा पुरुषोत्तम भगवान श्री राम जन्मोत्सव, मध्याह्न 12 बजे आरती व जन्मोत्सव।"
    },
    # Hanuman Jayanti (Chaitra Purnima)
    {
        "sun_signs": [11, 0], "tithi": 14, "name": "हनुमान जयन्ती / चैत्र पूर्णिमा",
        "desc": "श्री हनुमान जन्मोत्सव, सुन्दरकाण्ड पाठ, सिन्दूर अर्पण।"
    },
    # Akshaya Tritiya (Vaishakha Shukla Tritiya)
    {
        "sun_signs": [0], "tithi": 2, "name": "अक्षय तृतीया / परशुराम जयन्ती",
        "desc": "सर्वसिद्धि अबूझ मुहूर्त, स्वर्ण क्रय, दान-पुण्य एवं नवीन कार्य आरम्भ।"
    },

    # --- MAGHA / PHALGUNA (Sun in Makara/Kumbha) ---
    # Makar Sankranti
    {
        "sun_signs": [9], "tithi": -1, "name": "मकर संक्रान्ति / उत्तरायण / पोंगल / बिहू",
        "desc": "सूर्य देव का मकर राशि में प्रवेश, तिल-गुड़ दान, पतंगोत्सव।"
    },
    # Vasant Panchami / Saraswati Puja (Magha Shukla Panchami)
    {
        "sun_signs": [9, 10], "tithi": 4, "name": "बसन्त पंचमी / श्री सरस्वती पूजा",
        "desc": "विद्या की देवी मां सरस्वती पूजन, वाग्देवी आराधना, पीत वस्त्र धारण।"
    },
    # Maha Shivratri (Phalguna Krishna Chaturdashi)
    {
        "sun_signs": [10, 11], "tithi": 28, "name": "महाशिवरात्रि व्रत / ज्योतिर्लिंग प्राकट्य",
        "desc": "देवों के देव महादेव का प्राकट्य, चार प्रहर रुद्राभिषेक, शिव-पार्वती विवाह।"
    },
    # Holika Dahan (Phalguna Shukla Chaturdashi/Purnima)
    {
        "sun_signs": [10, 11], "tithi": 13, "name": "होलिका दहन / छोटी होली",
        "desc": "भक्त प्रह्लाद की रक्षा, होलिका दहन, असत्य पर सत्य की विजय।"
    },
    # Holi / Dhulendi (Chaitra Krishna Pratipada)
    {
        "sun_signs": [11], "tithi": 15, "name": "धुलेंडी / रंगों का पर्व होली",
        "desc": "पारस्परिक प्रेम एवं रंगों का महापर्व, गुलाल एवं वसन्तोत्सव।"
    }
]

def get_special_vedic_festival(sun_sign: int, tithi_idx: int) -> Optional[Dict[str, str]]:
    """Matches astronomical Sun sign and Tithi index with authentic Vedic festivals."""
    for rule in SPECIAL_FESTIVAL_RULES:
        if sun_sign in rule["sun_signs"] and rule["tithi"] == tithi_idx:
            return {"name": rule["name"], "desc": rule["desc"]}
    return None
