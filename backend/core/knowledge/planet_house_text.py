# core/knowledge/planet_house_text.py
"""
Rich, structured planet-in-house interpretations.
Uses a template approach: planet traits + house themes + special overrides.
"""

_ORDINALS = {
    1: {"en": "1st", "hi": "पहला"},
    2: {"en": "2nd", "hi": "दूसरा"},
    3: {"en": "3rd", "hi": "तीसरा"},
    4: {"en": "4th", "hi": "चौथा"},
    5: {"en": "5th", "hi": "पांचवां"},
    6: {"en": "6th", "hi": "छठा"},
    7: {"en": "7th", "hi": "सातवां"},
    8: {"en": "8th", "hi": "आठवां"},
    9: {"en": "9th", "hi": "नौवां"},
    10: {"en": "10th", "hi": "दसवां"},
    11: {"en": "11th", "hi": "ग्यारहवां"},
    12: {"en": "12th", "hi": "बारहवां"}
}

HOUSE_THEMES = {
    1: {
        "en": {"area": "Lagna (Self & Body)", "focus": "self-identity, physical body, and overall personality"},
        "hi": {"area": "लग्न (स्वयं और शरीर)", "focus": "आत्म-पहचान, भौतिक शरीर और समग्र व्यक्तित्व"}
    },
    2: {
        "en": {"area": "Dhana (Wealth & Family)", "focus": "accumulated wealth, speech, family, and values"},
        "hi": {"area": "धन (संपत्ति और परिवार)", "focus": "संचित धन, वाणी, परिवार और मूल्य"}
    },
    3: {
        "en": {"area": "Sahaja (Courage & Siblings)", "focus": "courage, communication, siblings, and short journeys"},
        "hi": {"area": "सहज (साहस और भाई-बहन)", "focus": "साहस, संचार, भाई-बहन और छोटी यात्राएं"}
    },
    4: {
        "en": {"area": "Sukha (Home & Happiness)", "focus": "home, mother, inner peace, and immovable property"},
        "hi": {"area": "सुख (घर और खुशी)", "focus": "घर, माता, आंतरिक शांति और अचल संपत्ति"}
    },
    5: {
        "en": {"area": "Putra (Intelligence & Children)", "focus": "intellect, creativity, children, and past-life merit"},
        "hi": {"area": "पुत्र (बुद्धि और बच्चे)", "focus": "बुद्धि, रचनात्मकता, बच्चे और पिछले जन्म के पुण्य"}
    },
    6: {
        "en": {"area": "Shatru (Enemies & Health)", "focus": "service, enemies, health challenges, and daily routine"},
        "hi": {"area": "शत्रु (दुश्मन और स्वास्थ्य)", "focus": "सेवा, शत्रु, स्वास्थ्य चुनौतियां और दिनचर्या"}
    },
    7: {
        "en": {"area": "Kalatra (Marriage & Partnerships)", "focus": "spouse, partnerships, public relations, and business"},
        "hi": {"area": "कलत्र (विवाह और साझेदारी)", "focus": "जीवनसाथी, साझेदारी, जनसंपर्क और व्यवसाय"}
    },
    8: {
        "en": {"area": "Mrityu (Transformation & Longevity)", "focus": "longevity, transformation, hidden matters, and inheritance"},
        "hi": {"area": "मृत्यु (परिवर्तन और आयु)", "focus": "आयु, परिवर्तन, गुप्त मामले और विरासत"}
    },
    9: {
        "en": {"area": "Bhagya (Fortune & Dharma)", "focus": "fortune, higher wisdom, teachers, and spiritual path"},
        "hi": {"area": "भाग्य (सौभाग्य और धर्म)", "focus": "सौभाग्य, उच्च ज्ञान, गुरु और आध्यात्मिक मार्ग"}
    },
    10: {
        "en": {"area": "Karma (Career & Status)", "focus": "career, social status, authority, and public reputation"},
        "hi": {"area": "कर्म (करियर और स्थिति)", "focus": "करियर, सामाजिक स्थिति, अधिकार और सार्वजनिक प्रतिष्ठा"}
    },
    11: {
        "en": {"area": "Labha (Gains & Network)", "focus": "income, social networks, fulfilled desires, and elder siblings"},
        "hi": {"area": "लाभ (आय और नेटवर्क)", "focus": "आय, सामाजिक नेटवर्क, इच्छा पूर्ति और बड़े भाई-बहन"}
    },
    12: {
        "en": {"area": "Vyaya (Loss & Liberation)", "focus": "foreign lands, spiritual liberation, isolation, and expenses"},
        "hi": {"area": "व्यय (हानि और मोक्ष)", "focus": "विदेश, आध्यात्मिक मोक्ष, एकांत और खर्च"}
    }
}

# ── Divisional Chart Contexts ─────────────────────────────────────────────────
# Each entry describes what the divisional chart governs and how to interpret
# planetary positions within it.
VARGA_CONTEXT = {
    1: {
        "en": {
            "name": "Rasi Chart (D1)",
            "domain": "Overall life — self, body, personality, and all life areas",
            "reveals": "the complete picture of the native's life, karma, destiny, and general fortune.",
            "lens": "In the D1 chart, planetary positions show their most fundamental, direct influence on the native's physical life and personality.",
            "ascendant_note": "The D1 ascendant (Lagna) sets the entire tone of the native's life path, body constitution, and self-expression.",
        },
        "hi": {
            "name": "लग्न कुंडली (D1)",
            "domain": "समग्र जीवन — स्वयं, शरीर, व्यक्तित्व और जीवन के सभी क्षेत्र",
            "reveals": "जातक के जीवन, कर्म, भाग्य और सामान्य सौभाग्य की पूरी तस्वीर।",
            "lens": "D1 कुंडली में, ग्रहों की स्थिति जातक के भौतिक जीवन और व्यक्तित्व पर उनका सबसे मौलिक, प्रत्यक्ष प्रभाव दिखाती है।",
            "ascendant_note": "D1 लग्न जातक के जीवन पथ, शारीरिक संरचना और आत्म-अभिव्यक्ति का पूरा स्वर निर्धारित करता है।",
        }
    },
    2: {
        "en": {
            "name": "Hora Chart (D2)",
            "domain": "Wealth, money, material resources, and financial fortune",
            "reveals": "insights about money, assets, material resources, and financial fortune.",
            "lens": "In the D2 chart, planetary positions indicate their influence on the native's financial security, earning capacity, and material accumulation.",
            "ascendant_note": "The D2 ascendant indicates the predominant energy governing wealth accumulation and financial temperament.",
        },
        "hi": {
            "name": "होरा कुंडली (D2)",
            "domain": "धन, पैसा, भौतिक संसाधन और वित्तीय भाग्य",
            "reveals": "धन, संपत्ति, भौतिक संसाधनों और वित्तीय भाग्य के बारे में अंतर्दृष्टि।",
            "lens": "D2 कुंडली में, ग्रहों की स्थिति जातक की वित्तीय सुरक्षा, कमाई क्षमता और भौतिक संचय पर उनका प्रभाव दर्शाती है।",
            "ascendant_note": "D2 लग्न धन संचय और वित्तीय स्वभाव को नियंत्रित करने वाली प्रमुख ऊर्जा को दर्शाता है।",
        }
    },
    3: {
        "en": {
            "name": "Drekkana Chart (D3)",
            "domain": "Siblings, courage, short journeys, and communication",
            "reveals": "the nature of relationships with siblings, one's inherent courage, communication style, and short travels.",
            "lens": "In the D3 chart, planetary positions show how the native's courage, communication, and sibling relationships are shaped.",
            "ascendant_note": "The D3 ascendant reveals the nature of the native's initiative, bravery, and relationship with close companions.",
        },
        "hi": {
            "name": "द्रेष्काण कुंडली (D3)",
            "domain": "भाई-बहन, साहस, छोटी यात्राएं और संचार",
            "reveals": "भाई-बहनों के साथ संबंधों की प्रकृति, व्यक्ति का अंतर्निहित साहस, संचार शैली और छोटी यात्राएं।",
            "lens": "D3 कुंडली में, ग्रहों की स्थिति यह दिखाती है कि जातक का साहस, संचार और भाई-बहनों के रिश्ते कैसे आकार लेते हैं।",
            "ascendant_note": "D3 लग्न जातक की पहल, बहादुरी और करीबी साथियों के साथ संबंधों की प्रकृति को प्रकट करता है।",
        }
    },
    4: {
        "en": {
            "name": "Chaturthamsha Chart (D4)",
            "domain": "Property, home, vehicles, and fixed assets",
            "reveals": "the destiny regarding immovable property, real estate, domestic happiness, and vehicles.",
            "lens": "In the D4 chart, planetary positions indicate the type and quality of property, home environment, and fixed assets the native acquires.",
            "ascendant_note": "The D4 ascendant shows the nature of the home environment, property fortune, and relationship with the motherland.",
        },
        "hi": {
            "name": "चतुर्थांश कुंडली (D4)",
            "domain": "संपत्ति, घर, वाहन और अचल संपत्ति",
            "reveals": "अचल संपत्ति, रियल एस्टेट, घरेलू खुशी और वाहनों के संबंध में भाग्य।",
            "lens": "D4 कुंडली में, ग्रहों की स्थिति जातक द्वारा प्राप्त संपत्ति, घर के वातावरण और अचल संपत्ति के प्रकार और गुणवत्ता को दर्शाती है।",
            "ascendant_note": "D4 लग्न घर के वातावरण, संपत्ति के भाग्य और मातृभूमि के साथ संबंध की प्रकृति को दर्शाता है।",
        }
    },
    7: {
        "en": {
            "name": "Saptamsha Chart (D7)",
            "domain": "Children, progeny, creative legacy, and grandchildren",
            "reveals": "the destiny related to children, their nature, number, and one's legacy through creative output.",
            "lens": "In the D7 chart, planetary positions reveal the timing, nature, and quality of blessings related to children and creative fruits.",
            "ascendant_note": "The D7 ascendant indicates the overarching energy shaping one's relationship with children and the legacy they leave.",
        },
        "hi": {
            "name": "सप्तांश कुंडली (D7)",
            "domain": "बच्चे, संतान, रचनात्मक विरासत और पोते",
            "reveals": "बच्चों से संबंधित भाग्य, उनकी प्रकृति, संख्या और रचनात्मक आउटपुट के माध्यम से किसी की विरासत।",
            "lens": "D7 कुंडली में, ग्रहों की स्थिति बच्चों और रचनात्मक फलों से संबंधित आशीर्वाद के समय, प्रकृति और गुणवत्ता को प्रकट करती है।",
            "ascendant_note": "D7 लग्न व्यक्ति के बच्चों के साथ संबंध और उनके द्वारा छोड़ी जाने वाली विरासत को आकार देने वाली प्रमुख ऊर्जा को दर्शाता है।",
        }
    },
    9: {
        "en": {
            "name": "Navamsha Chart (D9)",
            "domain": "Marriage, spouse, dharma, and the fruit of all actions",
            "reveals": "the true potential of the soul, the nature of the spouse, quality of marital life, and spiritual dharma.",
            "lens": "In the D9 chart (the most important divisional), planetary positions show their refined, soul-level influence on marriage, spouse, and overall life direction after age 35.",
            "ascendant_note": "The D9 ascendant reveals the soul's deeper nature and the qualities the native seeks in a life partner.",
        },
        "hi": {
            "name": "नवांश कुंडली (D9)",
            "domain": "विवाह, जीवनसाथी, धर्म और सभी कार्यों का फल",
            "reveals": "आत्मा की वास्तविक क्षमता, जीवनसाथी की प्रकृति, वैवाहिक जीवन की गुणवत्ता और आध्यात्मिक धर्म।",
            "lens": "D9 कुंडली में (सबसे महत्वपूर्ण वर्ग कुंडली), ग्रहों की स्थिति 35 वर्ष की आयु के बाद विवाह, जीवनसाथी और समग्र जीवन की दिशा पर उनके परिष्कृत, आत्मा-स्तर के प्रभाव को दिखाती है।",
            "ascendant_note": "D9 लग्न आत्मा की गहरी प्रकृति और उन गुणों को प्रकट करता है जो जातक जीवन साथी में चाहता है।",
        }
    },
    10: {
        "en": {
            "name": "Dashamsha Chart (D10)",
            "domain": "Career, profession, social status, and public achievements",
            "reveals": "the native's true career potential, professional trajectory, and societal contribution.",
            "lens": "In the D10 chart, planetary positions directly indicate career strengths, professional environment, and the type of success achievable.",
            "ascendant_note": "The D10 ascendant reveals the core professional identity, work style, and the field most aligned with the native's soul mission.",
        },
        "hi": {
            "name": "दशांश कुंडली (D10)",
            "domain": "करियर, पेशा, सामाजिक स्थिति और सार्वजनिक उपलब्धियां",
            "reveals": "जातक की वास्तविक करियर क्षमता, पेशेवर प्रक्षेपवक्र और सामाजिक योगदान।",
            "lens": "D10 कुंडली में, ग्रहों की स्थिति सीधे करियर की ताकत, पेशेवर माहौल और प्राप्त की जा सकने वाली सफलता के प्रकार को दर्शाती है।",
            "ascendant_note": "D10 लग्न मुख्य पेशेवर पहचान, कार्य शैली और जातक के आत्मा मिशन के साथ सबसे अधिक जुड़े क्षेत्र को प्रकट करता है।",
        }
    },
    12: {
        "en": {
            "name": "Dvadashamsha Chart (D12)",
            "domain": "Parents, ancestry, and karmic inheritance from previous generations",
            "reveals": "the nature of the native's parents, blessings from ancestors, and karmic inheritance.",
            "lens": "In the D12 chart, planetary positions reveal the karmic role of parents, ancestral blessings or debts, and the native's relationship with their lineage.",
            "ascendant_note": "The D12 ascendant identifies the dominant ancestral energy flowing through the native's lineage.",
        },
        "hi": {
            "name": "द्वादशांश कुंडली (D12)",
            "domain": "माता-पिता, वंशावली और पिछली पीढ़ियों से कर्म विरासत",
            "reveals": "जातक के माता-पिता की प्रकृति, पूर्वजों का आशीर्वाद और कर्म विरासत।",
            "lens": "D12 कुंडली में, ग्रहों की स्थिति माता-पिता की कर्म भूमिका, पैतृक आशीर्वाद या ऋण और अपने वंश के साथ जातक के संबंध को प्रकट करती है।",
            "ascendant_note": "D12 लग्न जातक के वंश में प्रवाहित प्रमुख पैतृक ऊर्जा की पहचान करता है।",
        }
    },
    16: {
        "en": {
            "name": "Shodashamsha Chart (D16)",
            "domain": "Vehicles, luxury, mental happiness, and comforts",
            "reveals": "the native's access to luxury, comfort, vehicles, and the quality of mental happiness and pleasure.",
            "lens": "In the D16 chart, planetary positions indicate the type of conveyances, luxury items, and sources of mental joy available to the native.",
            "ascendant_note": "The D16 ascendant sets the tone for how the native experiences pleasure, comfort, and happiness in material life.",
        },
        "hi": {
            "name": "षोडशांश कुंडली (D16)",
            "domain": "वाहन, विलासिता, मानसिक खुशी और सुख",
            "reveals": "विलासिता, आराम, वाहनों तक जातक की पहुंच और मानसिक खुशी और आनंद की गुणवत्ता।",
            "lens": "D16 कुंडली में, ग्रहों की स्थिति जातक को उपलब्ध वाहनों, विलासिता की वस्तुओं और मानसिक आनंद के स्रोतों को दर्शाती है।",
            "ascendant_note": "D16 लग्न यह निर्धारित करता है कि जातक भौतिक जीवन में आनंद, आराम और खुशी का अनुभव कैसे करता है।",
        }
    },
    20: {
        "en": {
            "name": "Vishamsha Chart (D20)",
            "domain": "Spiritual life, religious pursuits, and inner growth",
            "reveals": "the depth of the native's spiritual inclination, piety, and capacity for religious practice.",
            "lens": "In the D20 chart, planetary positions show how spiritual forces operate in the native's life and which deities or paths are most potent for them.",
            "ascendant_note": "The D20 ascendant reveals the spiritual path the native is karmically inclined to follow in this lifetime.",
        },
        "hi": {
            "name": "विशांश कुंडली (D20)",
            "domain": "आध्यात्मिक जीवन, धार्मिक कार्य और आंतरिक विकास",
            "reveals": "जातक के आध्यात्मिक झुकाव, धर्मपरायणता और धार्मिक अभ्यास की क्षमता की गहराई।",
            "lens": "D20 कुंडली में, ग्रहों की स्थिति दिखाती है कि जातक के जीवन में आध्यात्मिक शक्तियां कैसे काम करती हैं और उनके लिए कौन से देवता या मार्ग सबसे शक्तिशाली हैं।",
            "ascendant_note": "D20 लग्न उस आध्यात्मिक मार्ग को प्रकट करता है जिसका अनुसरण करने के लिए जातक इस जीवनकाल में कर्म रूप से प्रवृत्त है।",
        }
    },
    24: {
        "en": {
            "name": "Chaturvimshamsha Chart (D24)",
            "domain": "Education, learning, scholarship, and academic achievement",
            "reveals": "the native's capacity for higher education, the type of knowledge they excel in, and scholarly potential.",
            "lens": "In the D24 chart, planetary positions indicate the fields of study, mentors, and academic achievements that are karmically destined.",
            "ascendant_note": "The D24 ascendant reveals the learning archetype — whether the native is a natural scholar, researcher, artist, or spiritual seeker.",
        },
        "hi": {
            "name": "चतुर्विशांश कुंडली (D24)",
            "domain": "शिक्षा, सीखना, छात्रवृत्ति और शैक्षणिक उपलब्धि",
            "reveals": "उच्च शिक्षा के लिए जातक की क्षमता, ज्ञान का प्रकार जिसमें वे उत्कृष्टता प्राप्त करते हैं, और विद्वतापूर्ण क्षमता।",
            "lens": "D24 कुंडली में, ग्रहों की स्थिति अध्ययन के उन क्षेत्रों, आकाओं और शैक्षणिक उपलब्धियों को दर्शाती है जो कर्म रूप से مقدر हैं।",
            "ascendant_note": "D24 लग्न सीखने के मूलरूप को प्रकट करता है - क्या जातक एक प्राकृतिक विद्वान, शोधकर्ता, कलाकार या आध्यात्मिक साधक है।",
        }
    },
    27: {
        "en": {
            "name": "Saptavimshamsha Chart (D27)",
            "domain": "Strength, vitality, and the soul's inherent resilience",
            "reveals": "the native's core strength, physical vitality, and the resilience of the soul in facing life's trials.",
            "lens": "In the D27 chart, planetary positions show which areas of life the native has the most inherent strength and where challenges may test their resilience.",
            "ascendant_note": "The D27 ascendant reveals the dominant energy of the native's soul-strength and capacity for endurance.",
        },
        "hi": {
            "name": "सप्तविशांश कुंडली (D27)",
            "domain": "ताकत, जीवन शक्ति और आत्मा का अंतर्निहित लचीलापन",
            "reveals": "जातक की मुख्य शक्ति, शारीरिक जीवन शक्ति और जीवन के परीक्षणों का सामना करने में आत्मा का लचीलापन।",
            "lens": "D27 कुंडली में, ग्रहों की स्थिति दिखाती है कि जीवन के किन क्षेत्रों में जातक की सबसे अधिक अंतर्निहित शक्ति है और कहां चुनौतियां उनके लचीलेपन का परीक्षण कर सकती हैं।",
            "ascendant_note": "D27 लग्न जातक की आत्मा की शक्ति और सहनशक्ति की प्रमुख ऊर्जा को प्रकट करता है।",
        }
    },
    30: {
        "en": {
            "name": "Trimshamsha Chart (D30)",
            "domain": "Misfortunes, character flaws, and moral resilience",
            "reveals": "the nature of potential misfortunes, subconscious character flaws, and the moral resilience that helps overcome them.",
            "lens": "In the D30 chart, planetary positions reveal hidden vulnerabilities and the specific life areas where the native must exercise extra caution and spiritual vigilance.",
            "ascendant_note": "The D30 ascendant indicates the primary archetype of challenge the native must consciously work to transcend in this lifetime.",
        },
        "hi": {
            "name": "त्रिशांश कुंडली (D30)",
            "domain": "दुर्भाग्य, चरित्र दोष और नैतिक लचीलापन",
            "reveals": "संभावित दुर्भाग्य की प्रकृति, अवचेतन चरित्र दोष और नैतिक लचीलापन जो उन्हें दूर करने में मदद करता है।",
            "lens": "D30 कुंडली में, ग्रहों की स्थिति छिपी हुई कमजोरियों और विशिष्ट जीवन क्षेत्रों को प्रकट करती है जहां जातक को अतिरिक्त सावधानी और आध्यात्मिक सतर्कता बरतनी चाहिए।",
            "ascendant_note": "D30 लग्न चुनौती के प्राथमिक मूलरूप को इंगित करता है जिसे जातक को इस जीवनकाल में पार करने के लिए सचेत रूप से काम करना चाहिए।",
        }
    },
    40: {
        "en": {
            "name": "Khavedamsha Chart (D40)",
            "domain": "Auspicious/inauspicious results of maternal lineage",
            "reveals": "the fine-grained auspicious and inauspicious results flowing from the maternal side of the family.",
            "lens": "In the D40 chart, planetary positions provide granular insight into the karmic credits and debts received through the mother's lineage.",
            "ascendant_note": "The D40 ascendant indicates the dominant maternal karmic energy influencing the native's fortune.",
        },
        "hi": {
            "name": "खवेदांश कुंडली (D40)",
            "domain": "मातृ वंश के शुभ/अशुभ परिणाम",
            "reveals": "परिवार के मातृ पक्ष से आने वाले सूक्ष्म शुभ और अशुभ परिणाम।",
            "lens": "D40 कुंडली में, ग्रहों की स्थिति माता के वंश के माध्यम से प्राप्त कर्म क्रेडिट और ऋण में बारीक अंतर्दृष्टि प्रदान करती है।",
            "ascendant_note": "D40 लग्न जातक के भाग्य को प्रभावित करने वाली प्रमुख मातृ कर्म ऊर्जा को इंगित करता है।",
        }
    },
    45: {
        "en": {
            "name": "Akshavedamsha Chart (D45)",
            "domain": "Moral conduct, ethics, and paternal karmic legacy",
            "reveals": "the native's moral character, ethical conduct, and the karmic inheritance from the paternal lineage.",
            "lens": "In the D45 chart, planetary positions reveal the ethical framework the soul operates from and the karmic patterns inherited from the father's line.",
            "ascendant_note": "The D45 ascendant indicates the dominant paternal karmic energy and the area of life where ethical growth is most crucial.",
        },
        "hi": {
            "name": "अक्षवेदांश कुंडली (D45)",
            "domain": "नैतिक आचरण, नैतिकता और पैतृक कर्म विरासत",
            "reveals": "जातक का नैतिक चरित्र, नैतिक आचरण और पैतृक वंश से कर्म विरासत।",
            "lens": "D45 कुंडली में, ग्रहों की स्थिति उस नैतिक ढांचे को प्रकट करती है जिससे आत्मा संचालित होती है और पिता की रेखा से विरासत में मिले कर्म पैटर्न।",
            "ascendant_note": "D45 लग्न प्रमुख पैतृक कर्म ऊर्जा और जीवन के उस क्षेत्र को इंगित करता है जहां नैतिक विकास सबसे महत्वपूर्ण है।",
        }
    },
    60: {
        "en": {
            "name": "Shashtiamsha Chart (D60)",
            "domain": "Accumulated karma across multiple lifetimes",
            "reveals": "the deepest karmic imprints from previous lifetimes, shaping the foundational conditions of the current birth.",
            "lens": "In the D60 chart — the most subtle and profound divisional — planetary positions reveal the karmic seeds planted across many lifetimes that now bear fruit.",
            "ascendant_note": "The D60 ascendant is considered the most spiritually significant sign, indicating the soul's overall evolutionary status.",
        },
        "hi": {
            "name": "षष्ट्यंश कुंडली (D60)",
            "domain": "कई जन्मों में संचित कर्म",
            "reveals": "पिछले जन्मों के सबसे गहरे कर्म चिह्न, जो वर्तमान जन्म की मूलभूत स्थितियों को आकार देते हैं।",
            "lens": "D60 कुंडली में - सबसे सूक्ष्म और गहन वर्ग कुंडली - ग्रहों की स्थिति कई जन्मों में बोए गए कर्म बीजों को प्रकट करती है जो अब फल देते हैं।",
            "ascendant_note": "D60 लग्न को सबसे आध्यात्मिक रूप से महत्वपूर्ण राशि माना जाता है, जो आत्मा की समग्र विकासवादी स्थिति को दर्शाता है।",
        }
    }
}


def get_varga_context(d_num: int, lang: str = "en") -> dict:
    """Return the context dict for a divisional chart number (1, 2, 3, ..., 60)."""
    context = VARGA_CONTEXT.get(d_num, {
        "en": {
            "name": f"D{d_num} Chart",
            "domain": f"Divisional chart {d_num} domain",
            "reveals": f"specific sub-domain insights for the D{d_num} chart.",
            "lens": f"In the D{d_num} chart, planetary positions are interpreted through the specific lens of this divisional.",
            "ascendant_note": f"The D{d_num} ascendant reveals the dominant energy for this divisional's domain.",
        }
    })
    
    if isinstance(context, dict) and lang in context:
        return context.get(lang, {})
    elif isinstance(context, dict) and "en" in context:
        return context.get("en", {})
    return context


# ── Sarvashtakavarga House Score Interpretations ─────────────────────────────
# Score thresholds: <=20=very weak, 21-25=weak, 26-28=average, 29-33=strong, 34+=very strong

SAV_HOUSE_CONTEXT = {
    1: {
        "en": {
            "area": "Self, Body & Personality",
            "significator": "Sun",
            "implications": {
                "Health & Vitality": {
                    "low": "Prone to lower immunity and fluctuating physical energy. Needs consistent discipline to maintain vitality.",
                    "high": "Robust physical constitution, high immunity, and strong natural vitality."
                },
                "Self-Expression": {
                    "low": "Potential struggles with self-confidence or difficulty asserting oneself in the world.",
                    "high": "Strong willpower, natural confidence, and a commanding personality."
                },
                "Personality": {
                    "low": "Personality may lack initial impact or appear subdued in social environments.",
                    "high": "Magnetism, strong first impressions, and a dignified presence."
                },
                "Initiative & Drive": {
                    "low": "Tendency toward hesitation or lack of proactive drive in starting new ventures.",
                    "high": "Powerful initiative and the ability to take decisive independent action."
                },
                "Transit Impact": {
                    "low": "Malefic transits can significantly affect health and self-image due to low reserves.",
                    "high": "Resilient against difficult transits; able to maintain self-assurance through challenges."
                },
            },
            "remedies": "Strengthen the body through yoga and physical discipline. Worship the Sun. Wear Ruby after expert advice.",
            "better_perspective": "A strong Lagna lord in the natal chart can compensate for a low SAV score and protect personal vitality.",
        },
        "hi": {
            "area": "स्वयं, शरीर और व्यक्तित्व",
            "significator": "सूर्य",
            "implications": {
                "Health & Vitality": {
                    "low": "कम रोग प्रतिरोधक क्षमता और उतार-चढ़ाव वाली शारीरिक ऊर्जा की संभावना। जीवन शक्ति बनाए रखने के लिए निरंतर अनुशासन की आवश्यकता है।",
                    "high": "मजबूत शारीरिक गठन, उच्च रोग प्रतिरोधक क्षमता और मजबूत प्राकृतिक जीवन शक्ति।"
                },
                "Self-Expression": {
                    "low": "आत्मविश्वास के साथ संघर्ष या दुनिया में खुद को स्थापित करने में कठिनाई हो सकती है।",
                    "high": "मजबूत इच्छाशक्ति, प्राकृतिक आत्मविश्वास और एक प्रभावशाली व्यक्तित्व।"
                },
                "Personality": {
                    "low": "सामाजिक परिवेश में व्यक्तित्व का प्रारंभिक प्रभाव कम हो सकता है या यह दब सकता है।",
                    "high": "आकर्षण, मजबूत पहली छाप और एक गरिमापूर्ण उपस्थिति।"
                },
                "Initiative & Drive": {
                    "low": "हिचकिचाहट की प्रवृत्ति या नए उद्यम शुरू करने में सक्रियता की कमी।",
                    "high": "शक्तिशाली पहल और निर्णायक स्वतंत्र कार्रवाई करने की क्षमता।"
                },
                "Transit Impact": {
                    "low": "कम भंडार के कारण पापी ग्रहों के गोचर स्वास्थ्य और आत्म-छवि को काफी प्रभावित कर सकते हैं।",
                    "high": "कठिन गोचर के खिलाफ लचीलापन; चुनौतियों के बीच आत्म-आश्वासन बनाए रखने में सक्षम।"
                },
            },
            "remedies": "योग और शारीरिक अनुशासन के माध्यम से शरीर को मजबूत करें। सूर्य की पूजा करें। विशेषज्ञ की सलाह के बाद माणिक पहनें।",
            "better_perspective": "जन्म कुंडली में एक मजबूत लग्नेश कम SAV स्कोर की भरपाई कर सकता है और व्यक्तिगत जीवन शक्ति की रक्षा कर सकता है।",
        }
    },
    2: {
        "en": {
            "area": "Wealth, Family & Speech",
            "significator": "Jupiter/Venus",
            "implications": {
                "Financial Accumulation": {
                    "low": "Financial savings may be slow to build, with frequent unexpected expenses.",
                    "high": "Natural talent for wealth accumulation and building stable financial reserves."
                },
                "Family Harmony": {
                    "low": "Potential for misunderstandings or lack of strong support from the immediate family circle.",
                    "high": "Strong family bonds and supportive environment within the household."
                },
                "Speech & Communication": {
                    "low": "Speech may lack persuasiveness or there may be issues with oral expression.",
                    "high": "Articulate, persuasive speech and a naturally authoritative voice."
                },
                "Food & Nourishment": {
                    "low": "Needs to be cautious about dietary habits to maintain overall well-being.",
                    "high": "Excellent nourishment and a healthy, disciplined approach to dietary habits."
                },
                "Transit Impact": {
                    "low": "Malefics transiting here can trigger immediate financial losses or family disputes.",
                    "high": "Financial stability remains largely intact even during challenging transits."
                },
            },
            "remedies": "Practice gratitude and generosity. Worship Goddess Lakshmi on Fridays. Focus on building savings systematically.",
            "better_perspective": "A well-placed 2nd lord or Jupiter in the natal chart helps sustain wealth despite a lower SAV score.",
        },
        "hi": {
            "area": "धन, परिवार और वाणी",
            "significator": "गुरु/शुक्र",
            "implications": {
                "Financial Accumulation": {
                    "low": "वित्तीय बचत धीमी हो सकती है, बार-बार अप्रत्याशित खर्च हो सकते हैं।",
                    "high": "धन संचय और स्थिर वित्तीय भंडार बनाने की स्वाभाविक प्रतिभा।"
                },
                "Family Harmony": {
                    "low": "गलतफहमी की संभावना या तत्काल परिवार से मजबूत समर्थन की कमी।",
                    "high": "मजबूत पारिवारिक बंधन और घर के भीतर सहायक वातावरण।"
                },
                "Speech & Communication": {
                    "low": "वाणी में अनुनय की कमी हो सकती है या मौखिक अभिव्यक्ति में समस्या हो सकती है।",
                    "high": "स्पष्ट, प्रेरक वाणी और स्वाभाविक रूप से आधिकारिक आवाज।"
                },
                "Food & Nourishment": {
                    "low": "समग्र भलाई बनाए रखने के लिए आहार की आदतों के बारे में सतर्क रहने की आवश्यकता है।",
                    "high": "उत्कृष्ट पोषण और आहार की आदतों के प्रति एक स्वस्थ, अनुशासित दृष्टिकोण।"
                },
                "Transit Impact": {
                    "low": "यहां पापी ग्रहों का गोचर तत्काल वित्तीय नुकसान या पारिवारिक विवाद पैदा कर सकता है।",
                    "high": "चुनौतीपूर्ण गोचर के दौरान भी वित्तीय स्थिरता काफी हद तक बरकरार रहती है।"
                },
            },
            "remedies": "कृतज्ञता और उदारता का अभ्यास करें। शुक्रवार को देवी लक्ष्मी की पूजा करें। व्यवस्थित रूप से बचत बनाने पर ध्यान दें।",
            "better_perspective": "जन्म कुंडली में एक अच्छी तरह से स्थित दूसरे भाव का स्वामी या गुरु कम SAV स्कोर के बावजूद धन बनाए रखने में मदद करता है।",
        }
    },
    3: {
        "en": {
            "area": "Courage, Siblings & Efforts",
            "significator": "Mars",
            "implications": {
                "Efforts & Initiative": {
                    "low": "Weakened will, lack of initiative, and significant challenges in achieving goals through self-effort.",
                    "high": "Undaunted willpower and the ability to achieve success through persistent, courageous effort."
                },
                "Courage & Energy": {
                    "low": "Reduced mental courage, potentially causing procrastination or a defeatist mindset.",
                    "high": "High mental bravery, dynamic energy, and a proactive approach to obstacles."
                },
                "Siblings & Family": {
                    "low": "Potential for strained relationships or frequent worries regarding younger siblings.",
                    "high": "Supportive siblings and excellent cooperative efforts with peers."
                },
                "Communication & Skills": {
                    "low": "Possible difficulties in bringing personal skills/talents to full fruition.",
                    "high": "Exceptional development of personal skills and effective communication of ideas."
                },
                "Transit Impact": {
                    "low": "Malefics passing through can aggravate struggles, cause illness, or mental anxiety.",
                    "high": "Transits of malefics are countered by strong inherent courage and proactive steps."
                },
            },
            "remedies": "Focus on self-effort and improving communication skills. Strengthen Mars through physical exercise and discipline.",
            "better_perspective": "If the 3rd lord is well-placed in the natal chart, it can substantially mitigate a low SAV score here.",
        },
        "hi": {
            "area": "साहस, भाई-बहन और प्रयास",
            "significator": "मंगल",
            "implications": {
                "Efforts & Initiative": {
                    "low": "कमजोर इच्छाशक्ति, पहल की कमी और आत्म-प्रयास के माध्यम से लक्ष्यों को प्राप्त करने में महत्वपूर्ण चुनौतियां।",
                    "high": "अदम्य इच्छाशक्ति और निरंतर, साहसी प्रयास के माध्यम से सफलता प्राप्त करने की क्षमता।"
                },
                "Courage & Energy": {
                    "low": "मानसिक साहस में कमी, संभावित रूप से शिथिलता या निराशावादी मानसिकता पैदा कर सकती है।",
                    "high": "उच्च मानसिक बहादुरी, गतिशील ऊर्जा और बाधाओं के प्रति एक सक्रिय दृष्टिकोण।"
                },
                "Siblings & Family": {
                    "low": "तनावपूर्ण संबंधों की संभावना या छोटे भाई-बहनों के संबंध में बार-बार चिंताएं।",
                    "high": "सहायक भाई-बहन और साथियों के साथ उत्कृष्ट सहयोगी प्रयास।"
                },
                "Communication & Skills": {
                    "low": "व्यक्तिगत कौशल/प्रतिभाओं को पूरी तरह से विकसित करने में संभावित कठिनाइयां।",
                    "high": "व्यक्तिगत कौशल का असाधारण विकास और विचारों का प्रभावी संचार।"
                },
                "Transit Impact": {
                    "low": "पापी ग्रहों का गोचर संघर्षों को बढ़ा सकता है, बीमारी या मानसिक चिंता पैदा कर सकता है।",
                    "high": "पापी ग्रहों के गोचर का मुकाबला मजबूत अंतर्निहित साहस और सक्रिय कदमों द्वारा किया जाता है।"
                },
            },
            "remedies": "आत्म-प्रयास और संचार कौशल में सुधार पर ध्यान दें। शारीरिक व्यायाम और अनुशासन के माध्यम से मंगल को मजबूत करें।",
            "better_perspective": "यदि जन्म कुंडली में तीसरे भाव का स्वामी अच्छी तरह से स्थित है, तो यह यहां कम SAV स्कोर को काफी हद तक कम कर सकता है।",
        }
    },
    4: {
        "en": {
            "area": "Home, Mother & Inner Happiness",
            "significator": "Moon",
            "implications": {
                "Domestic Happiness": {
                    "low": "Home life may feel unsettled or lack the desired peace and comfort.",
                    "high": "Pervasive sense of peace and deep satisfaction within the domestic sphere."
                },
                "Property & Assets": {
                    "low": "Acquiring immovable property or vehicles may face delays or recurring obstacles.",
                    "high": "Natural ease in acquiring land, property, and comfortable vehicles."
                },
                "Relationship with Mother": {
                    "low": "Relationship with the mother may be emotionally distant or a source of worry.",
                    "high": "Strong emotional bond and significant blessings received through the mother."
                },
                "Inner Peace": {
                    "low": "Tendency toward emotional restlessness and difficulty in achieving mental rest.",
                    "high": "Deep emotional stability and a naturally contented, peaceful mind."
                },
                "Transit Impact": {
                    "low": "Malefic transits can easily disturb domestic harmony or bring property disputes.",
                    "high": "Emotional resilience protects domestic peace during challenging outer transits."
                },
            },
            "remedies": "Honor and care for your mother. Worship the Moon and Goddess Durga. Perform home-related rituals on Mondays.",
            "better_perspective": "A strong Moon or 4th lord in the natal chart provides emotional security even with a lower SAV score.",
        },
        "hi": {
            "area": "घर, माता और आंतरिक खुशी",
            "significator": "चंद्रमा",
            "implications": {
                "Domestic Happiness": {
                    "low": "घरेलू जीवन अशांत महसूस हो सकता है या वांछित शांति और आराम की कमी हो सकती है।",
                    "high": "घरेलू क्षेत्र के भीतर शांति की व्यापक भावना और गहरी संतुष्टि।"
                },
                "Property & Assets": {
                    "low": "अचल संपत्ति या वाहन प्राप्त करने में देरी या बार-बार बाधाओं का सामना करना पड़ सकता है।",
                    "high": "जमीन, संपत्ति और आरामदायक वाहन प्राप्त करने में स्वाभाविक आसानी।"
                },
                "Relationship with Mother": {
                    "low": "मां के साथ संबंध भावनात्मक रूप से दूर हो सकते हैं या चिंता का कारण हो सकते हैं।",
                    "high": "मजबूत भावनात्मक बंधन और मां के माध्यम से प्राप्त महत्वपूर्ण आशीर्वाद।"
                },
                "Inner Peace": {
                    "low": "भावनात्मक बेचैनी की प्रवृत्ति और मानसिक शांति प्राप्त करने में कठिनाई।",
                    "high": "गहरी भावनात्मक स्थिरता और स्वाभाविक रूप से संतुष्ट, शांतिपूर्ण मन।"
                },
                "Transit Impact": {
                    "low": "पापी ग्रहों के गोचर आसानी से घरेलू सद्भाव को बिगाड़ सकते हैं या संपत्ति विवाद ला सकते हैं।",
                    "high": "भावनात्मक लचीलापन चुनौतीपूर्ण बाहरी गोचर के दौरान घरेलू शांति की रक्षा करता है।"
                },
            },
            "remedies": "अपनी मां का सम्मान करें और उनकी देखभाल करें। चंद्रमा और देवी दुर्गा की पूजा करें। सोमवार को घर से जुड़े अनुष्ठान करें।",
            "better_perspective": "जन्म कुंडली में एक मजबूत चंद्रमा या चौथे भाव का स्वामी कम SAV स्कोर के बावजूद भावनात्मक सुरक्षा प्रदान करता है।",
        }
    },
    5: {
        "en": {
            "area": "Intelligence, Children & Creativity",
            "significator": "Jupiter",
            "implications": {
                "Intellect & Learning": {
                    "low": "May face challenges in concentration or consistent academic progress.",
                    "high": "Sharp intellect, exceptional memory, and a natural aptitude for higher learning."
                },
                "Children & Progeny": {
                    "low": "Delays or concerns regarding children's growth and relationship harmony.",
                    "high": "Joy through children and a deeply rewarding relationship with progeny."
                },
                "Creative Expression": {
                    "low": "Creative talents may remain dormant or face blocks in public expression.",
                    "high": "Powerful creative self-expression and fulfillment through artistic endeavors."
                },
                "Speculation & Risk": {
                    "low": "Cautious or unfavorable results in speculative investments and games of skill.",
                    "high": "Good fortune in investments, speculation, and strategic risk-taking."
                },
                "Transit Impact": {
                    "low": "Transits can temporarily diminish intellectual clarity or affect children's well-being.",
                    "high": "Supportive transits enhance academic success and creative breakthroughs."
                },
            },
            "remedies": "Worship Lord Brihaspati (Jupiter) on Thursdays. Teach and mentor others as a form of spiritual giving.",
            "better_perspective": "A strong 5th lord or well-placed Jupiter significantly compensates for a weaker SAV score in this house.",
        },
        "hi": {
            "area": "बुद्धि, बच्चे और रचनात्मकता",
            "significator": "गुरु",
            "implications": {
                "Intellect & Learning": {
                    "low": "एकाग्रता या निरंतर शैक्षणिक प्रगति में चुनौतियों का सामना करना पड़ सकता है।",
                    "high": "तेज बुद्धि, असाधारण स्मृति और उच्च शिक्षा के लिए प्राकृतिक योग्यता।"
                },
                "Children & Progeny": {
                    "low": "बच्चों के विकास और संबंधों के सामंजस्य के संबंध में देरी या चिंताएं।",
                    "high": "बच्चों के माध्यम से खुशी और संतान के साथ गहरा फायदेमंद संबंध।"
                },
                "Creative Expression": {
                    "low": "रचनात्मक प्रतिभाएं सुप्त रह सकती हैं या सार्वजनिक अभिव्यक्ति में बाधाओं का सामना कर सकती हैं।",
                    "high": "कलात्मक प्रयासों के माध्यम से शक्तिशाली रचनात्मक आत्म-अभिव्यक्ति और पूर्ति।"
                },
                "Speculation & Risk": {
                    "low": "सट्टा निवेश और कौशल के खेलों में सतर्क या प्रतिकूल परिणाम।",
                    "high": "निवेश, सट्टेबाजी और रणनीतिक जोखिम लेने में सौभाग्य।"
                },
                "Transit Impact": {
                    "low": "गोचर अस्थायी रूप से बौद्धिक स्पष्टता को कम कर सकते हैं या बच्चों की भलाई को प्रभावित कर सकते हैं।",
                    "high": "सहायक गोचर शैक्षणिक सफलता और रचनात्मक सफलताओं को बढ़ाते हैं।"
                },
            },
            "remedies": "गुरुवार को भगवान बृहस्पति की पूजा करें। आध्यात्मिक दान के रूप में दूसरों को पढ़ाएं और उनका मार्गदर्शन करें।",
            "better_perspective": "जन्म कुंडली में एक मजबूत 5वें भाव का स्वामी या अच्छी तरह से स्थित गुरु इस भाव में कमजोर SAV स्कोर की काफी भरपाई करता है।",
        }
    },
    6: {
        "en": {
            "area": "Service, Health & Enemies",
            "significator": "Mars/Saturn",
            "implications": {
                "Health & Immunity": {
                    "low": "Slower recovery from illness and lower resistance to daily health stresses.",
                    "high": "Strong physical immunity and the ability to overcome health challenges quickly."
                },
                "Enemies & Rivals": {
                    "low": "Native may feel easily overwhelmed by competition or workplace opposition.",
                    "high": "Capacity to win over enemies and excel in highly competitive environments."
                },
                "Service & Work Ethic": {
                    "low": "Difficulty in maintaining routine or finding satisfaction in daily service roles.",
                    "high": "Exceptional dedication to duty and success through disciplined service."
                },
                "Debts & Obligations": {
                    "low": "Need for careful management to avoid the burden of debts or legal complications.",
                    "high": "Ability to effectively manage finances and stay free from long-term debts."
                },
                "Transit Impact": {
                    "low": "Malefic transits can intensify workplace friction or trigger unexpected health issues.",
                    "high": "Disciplined routine mitigates the impact of malefic transits in this house."
                },
            },
            "remedies": "Serve the underprivileged selflessly. Worship Lord Hanuman. Maintain strict health routines and discipline.",
            "better_perspective": "A strong 6th lord in the natal chart or powerful Saturn/Mars can help offset a lower SAV score here.",
        },
        "hi": {
            "area": "सेवा, स्वास्थ्य और शत्रु",
            "significator": "मंगल/शनि",
            "implications": {
                "Health & Immunity": {
                    "low": "बीमारी से धीमी रिकवरी और दैनिक स्वास्थ्य तनावों के प्रति कम प्रतिरोध।",
                    "high": "मजबूत शारीरिक प्रतिरक्षा और स्वास्थ्य चुनौतियों को जल्दी से दूर करने की क्षमता।"
                },
                "Enemies & Rivals": {
                    "low": "जातक प्रतिस्पर्धा या कार्यस्थल के विरोध से आसानी से अभिभूत महसूस कर सकता है।",
                    "high": "शत्रुओं पर जीत हासिल करने और अत्यधिक प्रतिस्पर्धी वातावरण में उत्कृष्टता प्राप्त करने की क्षमता।"
                },
                "Service & Work Ethic": {
                    "low": "दिनचर्या बनाए रखने या दैनिक सेवा भूमिकाओं में संतुष्टि खोजने में कठिनाई।",
                    "high": "कर्तव्य के प्रति असाधारण समर्पण और अनुशासित सेवा के माध्यम से सफलता।"
                },
                "Debts & Obligations": {
                    "low": "ऋण के बोझ या कानूनी जटिलताओं से बचने के लिए सावधानीपूर्वक प्रबंधन की आवश्यकता है।",
                    "high": "वित्त का प्रभावी ढंग से प्रबंधन करने और दीर्घकालिक ऋणों से मुक्त रहने की क्षमता।"
                },
                "Transit Impact": {
                    "low": "पापी ग्रहों के गोचर कार्यस्थल के घर्षण को तेज कर सकते हैं या अप्रत्याशित स्वास्थ्य समस्याओं को ट्रिगर कर सकते हैं।",
                    "high": "अनुशासित दिनचर्या इस घर में पापी ग्रहों के गोचर के प्रभाव को कम करती है।"
                },
            },
            "remedies": "निःस्वार्थ भाव से वंचितों की सेवा करें। भगवान हनुमान की पूजा करें। सख्त स्वास्थ्य दिनचर्या और अनुशासन बनाए रखें।",
            "better_perspective": "जन्म कुंडली में एक मजबूत 6वें भाव का स्वामी या शक्तिशाली शनि/मंगल यहां कम SAV स्कोर की भरपाई करने में मदद कर सकता है।",
        }
    },
    7: {
        "en": {
            "area": "Marriage, Partnerships & Business",
            "significator": "Venus/Jupiter",
            "implications": {
                "Marital Happiness": {
                    "low": "Marital life may require extra effort to maintain harmony and mutual understanding.",
                    "high": "Natural harmony, deep bonding, and consistent happiness in marriage."
                },
                "Partner's Nature": {
                    "low": "Partner may be struggling with health or lack the desired supportive nature.",
                    "high": "Supportive, healthy, and prosperous life partner who aids the native's growth."
                },
                "Business Partnerships": {
                    "low": "Challenges in team ventures or potential for misunderstandings with partners.",
                    "high": "Success in professional collaborations and long-lasting joint ventures."
                },
                "Public Relations": {
                    "low": "Public social standing may be modest or require significant effort to build.",
                    "high": "Charismatic public presence and very positive social interactions."
                },
                "Transit Impact": {
                    "low": "Malefic transits easily trigger relationship strain or spouse-related worries.",
                    "high": "Stable foundation protects the marriage from temporary malefic transits."
                },
            },
            "remedies": "Worship Goddess Parvati on Mondays. Practice patience and understanding in relationships. Offer sweets to couples.",
            "better_perspective": "A strong Venus or 7th lord in the natal chart provides marital support despite a lower SAV score.",
        },
        "hi": {
            "area": "विवाह, साझेदारी और व्यवसाय",
            "significator": "शुक्र/गुरु",
            "implications": {
                "Marital Happiness": {
                    "low": "वैवाहिक जीवन में सद्भाव और आपसी समझ बनाए रखने के लिए अतिरिक्त प्रयास की आवश्यकता हो सकती है।",
                    "high": "विवाह में प्राकृतिक सद्भाव, गहरा बंधन और निरंतर खुशी।"
                },
                "Partner's Nature": {
                    "low": "जीवनसाथी स्वास्थ्य से जूझ रहा हो सकता है या उसमें वांछित सहायक स्वभाव की कमी हो सकती है।",
                    "high": "सहायक, स्वस्थ और समृद्ध जीवनसाथी जो जातक के विकास में सहायता करता है।"
                },
                "Business Partnerships": {
                    "low": "टीम के उपक्रमों में चुनौतियां या भागीदारों के साथ गलतफहमी की संभावना।",
                    "high": "पेशेवर सहयोग और लंबे समय तक चलने वाले संयुक्त उद्यमों में सफलता।"
                },
                "Public Relations": {
                    "low": "सार्वजनिक सामाजिक स्थिति मामूली हो सकती है या निर्माण के लिए महत्वपूर्ण प्रयास की आवश्यकता हो सकती है।",
                    "high": "करिश्माई सार्वजनिक उपस्थिति और बहुत सकारात्मक सामाजिक संपर्क।"
                },
                "Transit Impact": {
                    "low": "पापी ग्रहों के गोचर आसानी से रिश्ते के तनाव या जीवनसाथी से संबंधित चिंताओं को ट्रिगर करते हैं।",
                    "high": "स्थिर नींव अस्थायी पापी ग्रहों के गोचर से विवाह की रक्षा करती है।"
                },
            },
            "remedies": "सोमवार को देवी पार्वती की पूजा करें। रिश्तों में धैर्य और समझ का अभ्यास करें। जोड़ों को मिठाई बांटें।",
            "better_perspective": "जन्म कुंडली में एक मजबूत शुक्र या 7वें भाव का स्वामी कम SAV स्कोर के बावजूद वैवाहिक सहायता प्रदान करता है।",
        }
    },
    8: {
        "en": {
            "area": "Longevity, Transformation & Hidden Matters",
            "significator": "Saturn",
            "implications": {
                "Longevity & Lifespan": {
                    "low": "Vitality reserves may be lower, requiring a focus on health and safety.",
                    "high": "Excellent longevity and deep reserves of inner survival energy."
                },
                "Transformative Experiences": {
                    "low": "Native may find sudden changes and life upheavals difficult to navigate.",
                    "high": "Capacity for profound inner transformation and growth through life's changes."
                },
                "Hidden Wealth & Inheritance": {
                    "low": "Gains through heritage or hidden sources may be limited or delayed.",
                    "high": "Potential for significant inheritance or gains from insurance/unearned wealth."
                },
                "Occult & Research": {
                    "low": "Interest in occult/research may exist but face blocks in practical attainment.",
                    "high": "Natural aptitude for research, investigative skills, and metaphysical wisdom."
                },
                "Transit Impact": {
                    "low": "Malefic transits to this house can cause severe health or financial disruptions.",
                    "high": "Inner resilience allows the native to emerge stronger from karmic transits."
                },
            },
            "remedies": "Practice Mrityunjaya mantra regularly. Worship Lord Shiva. Donate to hospitals and serve the elderly.",
            "better_perspective": "A strong 8th lord or Saturn in a good position can significantly reduce the intensity of difficult 8th house events.",
        },
        "hi": {
            "area": "आयु, परिवर्तन और गुप्त मामले",
            "significator": "शनि",
            "implications": {
                "Longevity & Lifespan": {
                    "low": "जीवन शक्ति भंडार कम हो सकता है, स्वास्थ्य और सुरक्षा पर ध्यान देने की आवश्यकता है।",
                    "high": "उत्कृष्ट दीर्घायु और आंतरिक अस्तित्व ऊर्जा के गहरे भंडार।"
                },
                "Transformative Experiences": {
                    "low": "जातक को अचानक परिवर्तन और जीवन की उथल-पुथल से पार पाना मुश्किल हो सकता है।",
                    "high": "गहन आंतरिक परिवर्तन और जीवन के परिवर्तनों के माध्यम से विकास की क्षमता।"
                },
                "Hidden Wealth & Inheritance": {
                    "low": "विरासत या छिपे हुए स्रोतों के माध्यम से लाभ सीमित या विलंबित हो सकता है।",
                    "high": "बीमा/बिना कमाए धन से महत्वपूर्ण विरासत या लाभ की संभावना।"
                },
                "Occult & Research": {
                    "low": "गुप्त/अनुसंधान में रुचि मौजूद हो सकती है लेकिन व्यावहारिक प्राप्ति में बाधाओं का सामना करना पड़ सकता है।",
                    "high": "अनुसंधान, खोजी कौशल और आध्यात्मिक ज्ञान के लिए प्राकृतिक योग्यता।"
                },
                "Transit Impact": {
                    "low": "इस घर में पापी ग्रहों के गोचर गंभीर स्वास्थ्य या वित्तीय व्यवधान पैदा कर सकते हैं।",
                    "high": "आंतरिक लचीलापन जातक को कर्म गोचर से मजबूत होकर उभरने की अनुमति देता है।"
                },
            },
            "remedies": "नियमित रूप से महामृत्युंजय मंत्र का अभ्यास करें। भगवान शिव की पूजा करें। अस्पतालों में दान करें और बुजुर्गों की सेवा करें।",
            "better_perspective": "एक मजबूत 8वें भाव का स्वामी या अच्छी स्थिति में शनि 8वें भाव की कठिन घटनाओं की तीव्रता को काफी कम कर सकता है।",
        }
    },
    9: {
        "en": {
            "area": "Fortune, Dharma & Wisdom",
            "significator": "Jupiter/Sun",
            "implications": {
                "Fortune & Luck": {
                    "low": "Luck may appear inconsistent, requiring more effort to achieve fortunate results.",
                    "high": "Consistent good fortune and natural support of fate in major life events."
                },
                "Father & Mentors": {
                    "low": "May lack strong guidance from a father figure or find mentors hard to access.",
                    "high": "Significant support and wisdom inherited from father, gurus, and teachers."
                },
                "Spiritual Growth": {
                    "low": "Spiritual path may feel obstructed or lack deep devotional focus.",
                    "high": "Profound spiritual inclination and natural success in religious pursuits."
                },
                "Higher Learning": {
                    "low": "Academic success in higher fields may require significant perseverance.",
                    "high": "Great aptitude for philosophy, law, and pursuit of deep scholarly wisdom."
                },
                "Transit Impact": {
                    "low": "Malefic transits can temporarily block fortune or cause strain with gurus.",
                    "high": "Benefic transits through this sign bring massive breakthroughs and luck."
                },
            },
            "remedies": "Honour your father and teachers. Worship Lord Vishnu and make pilgrimages. Perform acts of charity on Thursdays.",
            "better_perspective": "Even with a moderate score, a strong Jupiter or 9th lord can activate fortune and blessings from the divine.",
        },
        "hi": {
            "area": "भाग्य, धर्म और ज्ञान",
            "significator": "गुरु/सूर्य",
            "implications": {
                "Fortune & Luck": {
                    "low": "भाग्य असंगत प्रतीत हो सकता है, भाग्यशाली परिणाम प्राप्त करने के लिए अधिक प्रयास की आवश्यकता होती है।",
                    "high": "प्रमुख जीवन की घटनाओं में लगातार सौभाग्य और भाग्य का प्राकृतिक समर्थन।"
                },
                "Father & Mentors": {
                    "low": "पिता के समान व्यक्ति से मजबूत मार्गदर्शन की कमी हो सकती है या आकाओं तक पहुंचना कठिन हो सकता है।",
                    "high": "पिता, गुरुओं और शिक्षकों से विरासत में मिला महत्वपूर्ण समर्थन और ज्ञान।"
                },
                "Spiritual Growth": {
                    "low": "आध्यात्मिक मार्ग बाधित महसूस हो सकता है या गहरे भक्ति ध्यान का अभाव हो सकता है।",
                    "high": "गहन आध्यात्मिक झुकाव और धार्मिक कार्यों में स्वाभाविक सफलता।"
                },
                "Higher Learning": {
                    "low": "उच्च क्षेत्रों में शैक्षणिक सफलता के लिए महत्वपूर्ण दृढ़ता की आवश्यकता हो सकती है।",
                    "high": "दर्शन, कानून और गहरे विद्वतापूर्ण ज्ञान की खोज के लिए महान योग्यता।"
                },
                "Transit Impact": {
                    "low": "पापी ग्रहों के गोचर अस्थायी रूप से भाग्य को रोक सकते हैं या गुरुओं के साथ तनाव पैदा कर सकते हैं।",
                    "high": "इस राशि के माध्यम से शुभ गोचर बड़े पैमाने पर सफलता और भाग्य लाते हैं।"
                },
            },
            "remedies": "अपने पिता और शिक्षकों का सम्मान करें। भगवान विष्णु की पूजा करें और तीर्थयात्रा करें। गुरुवार को दान के कार्य करें।",
            "better_perspective": "यहां तक कि मध्यम स्कोर के साथ, एक मजबूत गुरु या 9वें भाव का स्वामी भाग्य और परमात्मा से आशीर्वाद को सक्रिय कर सकता है।",
        }
    },
    10: {
        "en": {
            "area": "Career, Status & Public Reputation",
            "significator": "Saturn/Sun/Mercury/Jupiter",
            "implications": {
                "Career Success": {
                    "low": "Career path may be characterized by frequent changes or slow recognition.",
                    "high": "Rapid professional growth and achieving high peaks in the chosen field."
                },
                "Public Status": {
                    "low": "Status and public recognition may remain modest despite hard work.",
                    "high": "Authority, high social status, and a widely respected public image."
                },
                "Ambition & Discipline": {
                    "low": "native may struggle to maintain long-term career focus or discipline.",
                    "high": "Unwavering ambition, professional discipline, and strong work ethic."
                },
                "Leadership & Authority": {
                    "low": "Opportunities for command or leadership may be limited or brief.",
                    "high": "Natural aptitude for command and success in leadership roles."
                },
                "Transit Impact": {
                    "low": "Malefic transits can cause job insecurity or damage to reputation.",
                    "high": "Strong professional foundation withstands temporary malefic transits."
                },
            },
            "remedies": "Perform your duties diligently and ethically. Worship Lord Shani/Sun. Avoid shortcuts in professional life.",
            "better_perspective": "A strong 10th lord or exalted Saturn/Sun in the natal chart can sustain career success with lower SAV scores.",
        },
        "hi": {
            "area": "करियर, स्थिति और सार्वजनिक प्रतिष्ठा",
            "significator": "शनि/सूर्य/बुध/गुरु",
            "implications": {
                "Career Success": {
                    "low": "करियर पथ को बार-बार परिवर्तन या धीमी मान्यता की विशेषता हो सकती है।",
                    "high": "तेजी से व्यावसायिक विकास और चुने हुए क्षेत्र में उच्च शिखर प्राप्त करना।"
                },
                "Public Status": {
                    "low": "कड़ी मेहनत के बावजूद स्थिति और सार्वजनिक मान्यता मामूली रह सकती है।",
                    "high": "अधिकार, उच्च सामाजिक स्थिति और व्यापक रूप से सम्मानित सार्वजनिक छवि।"
                },
                "Ambition & Discipline": {
                    "low": "जातक को दीर्घकालिक करियर फोकस या अनुशासन बनाए रखने के लिए संघर्ष करना पड़ सकता है।",
                    "high": "अटूट महत्वाकांक्षा, पेशेवर अनुशासन और मजबूत कार्य नैतिकता।"
                },
                "Leadership & Authority": {
                    "low": "कमांड या नेतृत्व के अवसर सीमित या संक्षिप्त हो सकते हैं।",
                    "high": "कमांड के लिए स्वाभाविक योग्यता और नेतृत्व की भूमिकाओं में सफलता।"
                },
                "Transit Impact": {
                    "low": "पापी ग्रहों के गोचर नौकरी की असुरक्षा या प्रतिष्ठा को नुकसान पहुंचा सकते हैं।",
                    "high": "मजबूत पेशेवर नींव अस्थायी पापी ग्रहों के गोचर का सामना करती है।"
                },
            },
            "remedies": "अपने कर्तव्यों का पालन लगन से और नैतिक रूप से करें। भगवान शनि/सूर्य की पूजा करें। पेशेवर जीवन में शॉर्टकट से बचें।",
            "better_perspective": "जन्म कुंडली में एक मजबूत 10वें भाव का स्वामी या उच्च का शनि/सूर्य कम SAV स्कोर के साथ करियर की सफलता को बनाए रख सकता है।",
        }
    },
    11: {
        "en": {
            "area": "Gains, Income & Fulfillment of Desires",
            "significator": "Jupiter/Saturn",
            "implications": {
                "Financial Gains": {
                    "low": "Income streams may be limited or income growth feels stagnant.",
                    "high": "Abundant income and consistent financial gains from multiple channels."
                },
                "Fulfillment of Desires": {
                    "low": "Native's aspirations and wishes may take significantly longer to manifest.",
                    "high": "Strong planetary support for the real-world fulfillment of one's deepest desires."
                },
                "Social Network": {
                    "low": "Social circle may be small or lack influential supporters.",
                    "high": "Vast network of helpful friends, elder siblings, and powerful allies."
                },
                "Multiple Income Sources": {
                    "low": "Income usually restricted to a single source with limited passive streams.",
                    "high": "Potential for wealth from investments, business, and multiple streams."
                },
                "Transit Impact": {
                    "low": "Malefic transits can block gains or create friction with associates.",
                    "high": "Benefic transits bring windfall gains and fulfillment of long-held goals."
                },
            },
            "remedies": "Expand your social circle with integrity. Donate a portion of income to charity. Worship Jupiter on Thursdays.",
            "better_perspective": "A strong Jupiter or 11th lord in the natal chart can unlock income and social gains even from a moderate SAV score.",
        },
        "hi": {
            "area": "लाभ, आय और इच्छाओं की पूर्ति",
            "significator": "गुरु/शनि",
            "implications": {
                "Financial Gains": {
                    "low": "आय के स्रोत सीमित हो सकते हैं या आय में वृद्धि रुकी हुई महसूस हो सकती है।",
                    "high": "प्रचुर आय और कई चैनलों से लगातार वित्तीय लाभ।"
                },
                "Fulfillment of Desires": {
                    "low": "जातक की आकांक्षाओं और इच्छाओं को प्रकट होने में काफी अधिक समय लग सकता है।",
                    "high": "व्यक्ति की गहरी इच्छाओं की वास्तविक दुनिया में पूर्ति के लिए मजबूत ग्रहीय समर्थन।"
                },
                "Social Network": {
                    "low": "सामाजिक दायरा छोटा हो सकता है या प्रभावशाली समर्थकों की कमी हो सकती है।",
                    "high": "मददगार दोस्तों, बड़े भाई-बहनों और शक्तिशाली सहयोगियों का विशाल नेटवर्क।"
                },
                "Multiple Income Sources": {
                    "low": "आय आमतौर पर सीमित निष्क्रिय धाराओं के साथ एक ही स्रोत तक सीमित होती है।",
                    "high": "निवेश, व्यवसाय और कई धाराओं से धन की संभावना।"
                },
                "Transit Impact": {
                    "low": "पापी ग्रहों के गोचर लाभ को रोक सकते हैं या सहयोगियों के साथ घर्षण पैदा कर सकते हैं।",
                    "high": "शुभ गोचर अप्रत्याशित लाभ और लंबे समय से रखे गए लक्ष्यों की पूर्ति लाते हैं।"
                },
            },
            "remedies": "ईमानदारी के साथ अपने सामाजिक दायरे का विस्तार करें। आय का एक हिस्सा दान करें। गुरुवार को गुरु की पूजा करें।",
            "better_perspective": "जन्म कुंडली में एक मजबूत गुरु या 11वें भाव का स्वामी मध्यम SAV स्कोर से भी आय और सामाजिक लाभ खोल सकता है।",
        }
    },
    12: {
        "en": {
            "area": "Expenses, Liberation & Foreign Connections",
            "significator": "Saturn/Ketu",
            "implications": {
                "Expenditure & Losses": {
                    "low": "Financial focus may be on managing wasteful expenses or sudden losses.",
                    "high": "Capacity to channel expenses into charity, investments, or spiritual growth."
                },
                "Foreign Travel & Stay": {
                    "low": "Opportunities for foreign travel or residence may be restricted.",
                    "high": "Strong potential for success in foreign lands or international work."
                },
                "Spiritual Liberation": {
                    "low": "Spiritual seeking may lack depth or face internal distractions.",
                    "high": "Natural aptitude for meditation, solitude, and inner spiritual freedom."
                },
                "Hospital & Isolation": {
                    "low": "Higher vulnerability to periods of isolation or required hospitalization.",
                    "high": "Resilience against isolation; ability to find peace even in retreat."
                },
                "Transit Impact": {
                    "low": "Malefic transits can intensify expenses or bring periods of reclusion.",
                    "high": "Transits through this house enhance spiritual insight and foreign gains."
                },
            },
            "remedies": "Practice meditation and spiritual discipline. Donate generously to hospitals or orphanages. Limit unnecessary spending.",
            "better_perspective": "A naturally benefic 12th house or strong 12th lord can turn expenses into spiritual investments and foreign opportunities.",
        },
        "hi": {
            "area": "खर्च, मोक्ष और विदेशी संबंध",
            "significator": "शनि/केतु",
            "implications": {
                "Expenditure & Losses": {
                    "low": "वित्तीय ध्यान फालतू खर्चों या अचानक नुकसान के प्रबंधन पर हो सकता है।",
                    "high": "दान, निवेश या आध्यात्मिक विकास में खर्चों को निर्देशित करने की क्षमता।"
                },
                "Foreign Travel & Stay": {
                    "low": "विदेशी यात्रा या निवास के अवसर प्रतिबंधित हो सकते हैं।",
                    "high": "विदेशों में या अंतरराष्ट्रीय कार्यों में सफलता की प्रबल संभावना।"
                },
                "Spiritual Liberation": {
                    "low": "आध्यात्मिक खोज में गहराई की कमी हो सकती है या आंतरिक विकर्षणों का सामना करना पड़ सकता है।",
                    "high": "ध्यान, एकांत और आंतरिक आध्यात्मिक स्वतंत्रता के लिए प्राकृतिक योग्यता।"
                },
                "Hospital & Isolation": {
                    "low": "अलगाव या आवश्यक अस्पताल में भर्ती होने की अवधि के प्रति उच्च भेद्यता।",
                    "high": "अलगाव के खिलाफ लचीलापन; पीछे हटने में भी शांति पाने की क्षमता।"
                },
                "Transit Impact": {
                    "low": "पापी ग्रहों के गोचर खर्चों को तेज कर सकते हैं या वैराग्य की अवधि ला सकते हैं।",
                    "high": "इस घर के माध्यम से गोचर आध्यात्मिक अंतर्दृष्टि और विदेशी लाभ को बढ़ाते हैं।"
                },
            },
            "remedies": "ध्यान और आध्यात्मिक अनुशासन का अभ्यास करें। अस्पतालों या अनाथालयों में उदारतापूर्वक दान करें। अनावश्यक खर्च को सीमित करें।",
            "better_perspective": "एक स्वाभाविक रूप से शुभ 12वां भाव या मजबूत 12वें भाव का स्वामी खर्चों को आध्यात्मिक निवेश और विदेशी अवसरों में बदल सकता है।",
        }
    }
}


# ── Sign Context Logic ────────────────────────────────────────────────────────
SIGN_LORDS = {
    "Aries": {"en": "Mars", "hi": "मंगल"},
    "Taurus": {"en": "Venus", "hi": "शुक्र"},
    "Gemini": {"en": "Mercury", "hi": "बुध"},
    "Cancer": {"en": "Moon", "hi": "चंद्रमा"},
    "Leo": {"en": "Sun", "hi": "सूर्य"},
    "Virgo": {"en": "Mercury", "hi": "बुध"},
    "Libra": {"en": "Venus", "hi": "शुक्र"},
    "Scorpio": {"en": "Mars", "hi": "मंगल"},
    "Sagittarius": {"en": "Jupiter", "hi": "गुरु"},
    "Capricorn": {"en": "Saturn", "hi": "शनि"},
    "Aquarius": {"en": "Saturn", "hi": "शनि"},
    "Pisces": {"en": "Jupiter", "hi": "गुरु"}
}

SIGN_TRAITS = {
    "Aries": {
        "en": "dynamic energy and pioneering spirit",
        "hi": "गतिशील ऊर्जा और अग्रणी भावना"
    },
    "Taurus": {
        "en": "artistic refinement and material stability",
        "hi": "कलात्मक शोधन और भौतिक स्थिरता"
    },
    "Gemini": {
        "en": "intellectual curiosity and communication skill",
        "hi": "बौद्धिक जिज्ञासा और संचार कौशल"
    },
    "Cancer": {
        "en": "emotional depth and nurturing care",
        "hi": "भावनात्मक गहराई और पोषण देखभाल"
    },
    "Leo": {
        "en": "authority, creativity, and self-expression",
        "hi": "अधिकार, रचनात्मकता और आत्म-अभिव्यक्ति"
    },
    "Virgo": {
        "en": "analytical precision and dedication to service",
        "hi": "विश्लेषणात्मक सटीकता और सेवा के प्रति समर्पण"
    },
    "Libra": {
        "en": "diplomacy, balance, and aesthetic harmony",
        "hi": "कूटनीति, संतुलन और सौंदर्य सद्भाव"
    },
    "Scorpio": {
        "en": "transformative power and intense focus",
        "hi": "परिवर्तनकारी शक्ति और गहन ध्यान"
    },
    "Sagittarius": {
        "en": "wisdom, philosophy, and spiritual expansion",
        "hi": "ज्ञान, दर्शन और आध्यात्मिक विस्तार"
    },
    "Capricorn": {
        "en": "discipline, structure, and professional ambition",
        "hi": "अनुशासन, संरचना और पेशेवर महत्वाकांक्षा"
    },
    "Aquarius": {
        "en": "innovation, social vision, and unique gains",
        "hi": "नवाचार, सामाजिक दृष्टि और अद्वितीय लाभ"
    },
    "Pisces": {
        "en": "spiritual sensitivity, imagination, and liberation",
        "hi": "आध्यात्मिक संवेदनशीलता, कल्पना और मुक्ति"
    }
}

def get_varga_sign_intro(d_num: int, sign_name: str, lang: str = "en") -> str:
    """Return a contextual sentence for an ascendant sign in a varga chart."""
    ctx = get_varga_context(d_num, lang)
    lord_data = SIGN_LORDS.get(sign_name, {"en": ""})
    lord = lord_data.get(lang, lord_data.get("en", "")) if isinstance(lord_data, dict) else lord_data
    
    traits_data = SIGN_TRAITS.get(sign_name, {"en": "unique energy"})
    traits = traits_data.get(lang, traits_data.get("en", "unique energy")) if isinstance(traits_data, dict) else traits_data
    
    # Custom sentence based on user's requested style
    if d_num == 2 and sign_name == "Cancer":
        if lang == "hi":
            return "इस वर्ग कुंडली में कर्क लग्न के साथ, वित्तीय मामलों और धन संचय को भावनात्मक गहराई और उतार-चढ़ाव वाली बहुतायत के साथ दर्शाया गया है।"
        return "With Cancer ascendant in this divisional chart, financial matters and wealth accumulation are indicated with emotional depth and fluctuating abundance."
        
    if lang == "hi":
        return f"इस वर्ग कुंडली में {sign_name} लग्न के साथ, {ctx.get('domain', '')} {traits} से प्रभावित होते हैं।"
    return f"With {sign_name} ascendant in this divisional chart, {ctx.get('domain', '')} are influenced by {traits}."


# ── Score Band Definitions ──────────────────────────────────────────────────
_SCORE_BANDS = [
    (0, 20, 
     {"en": "Very Weak", "hi": "बहुत कमजोर"}, 
     "#c62828", 
     {"en": "This house has an extremely low bindu count, indicating severely restricted results in its domain. The native may face persistent struggles in this life area, especially during related dasha and transit periods.", "hi": "इस घर में बिंदु संख्या बहुत कम है, जो इसके क्षेत्र में गंभीर रूप से प्रतिबंधित परिणामों को दर्शाता है। जातक को इस जीवन क्षेत्र में लगातार संघर्ष का सामना करना पड़ सकता है, विशेष रूप से संबंधित दशा और गोचर अवधि के दौरान।"}),
    
    (21, 25, 
     {"en": "Weak", "hi": "कमजोर"}, 
     "#e65100", 
     {"en": "A score below 25 is generally considered weak in SAV analysis. The native may face recurring challenges in this house's domain, with limited support from planetary transits through this sign.", "hi": "SAV विश्लेषण में 25 से नीचे के स्कोर को आम तौर पर कमजोर माना जाता है। जातक को इस घर के क्षेत्र में बार-बार चुनौतियों का सामना करना पड़ सकता है, इस राशि के माध्यम से ग्रहों के गोचर से सीमित समर्थन के साथ।"}),
    
    (26, 28, 
     {"en": "Average", "hi": "औसत"}, 
     "#f9a825", 
     {"en": "An average score indicates moderate results — neither particularly fortunate nor particularly difficult. The native can achieve results in this domain through deliberate effort.", "hi": "औसत स्कोर मध्यम परिणामों को इंगित करता है - न तो विशेष रूप से भाग्यशाली और न ही विशेष रूप से कठिन। जातक जानबूझकर प्रयास के माध्यम से इस क्षेत्र में परिणाम प्राप्त कर सकता है।"}),
    
    (29, 33, 
     {"en": "Strong", "hi": "मजबूत"}, 
     "#2e7d32", 
     {"en": "A strong bindu count indicates this house has good planetary support. Results in this domain tend to come with relative ease, and transits through this sign are generally supportive.", "hi": "एक मजबूत बिंदु संख्या इंगित करती है कि इस घर को अच्छा ग्रहीय समर्थन प्राप्त है। इस क्षेत्र में परिणाम अपेक्षाकृत आसानी से आते हैं, और इस राशि के माध्यम से गोचर आम तौर पर सहायक होते हैं।"}),
    
    (34, 56, 
     {"en": "Very Strong", "hi": "बहुत मजबूत"}, 
     "#1565c0", 
     {"en": "An exceptional score indicates exceptional planetary support for this house's domain. The native enjoys natural luck and ease in this life area, with highly beneficial transits reinforcing positive outcomes.", "hi": "एक असाधारण स्कोर इस घर के क्षेत्र के लिए असाधारण ग्रहीय समर्थन को इंगित करता है। जातक को इस जीवन क्षेत्र में प्राकृतिक भाग्य और आसानी का आनंद मिलता है, अत्यधिक लाभकारी गोचर सकारात्मक परिणामों को मजबूत करते हैं।"})
]


def get_sav_interpretation(house: int, score: int, lang: str = "en") -> dict:
    """
    Return a structured interpretation dict for a house's SAV score.
    Keys: area, significator, score, band_label, band_color, band_desc,
          implications (dict), remedies, better_perspective, avg_note
    """
    raw_ctx = SAV_HOUSE_CONTEXT.get(house, {})
    
    if isinstance(raw_ctx, dict) and lang in raw_ctx:
        ctx = raw_ctx.get(lang, {})
    elif isinstance(raw_ctx, dict) and "en" in raw_ctx:
        ctx = raw_ctx.get("en", {})
    else:
        ctx = raw_ctx
    band_label_data, band_color, band_desc_data = {"en": "Unknown", "hi": "अज्ञात"}, "#555555", {"en": "", "hi": ""}
    for lo, hi, label, color, desc in _SCORE_BANDS:
        if lo <= score <= hi:
            band_label_data, band_color, band_desc_data = label, color, desc
            break
            
    band_label = band_label_data.get(lang, band_label_data.get("en", "Unknown")) if isinstance(band_label_data, dict) else band_label_data
    band_desc = band_desc_data.get(lang, band_desc_data.get("en", "")) if isinstance(band_desc_data, dict) else band_desc_data

    # Resolve score-sensitive implications
    implications = {}
    is_high = score >= 28
    ctx_impl = ctx.get("implications", {})
    if isinstance(ctx_impl, dict):
        for key, val in ctx_impl.items():
            if isinstance(val, dict):
                implications[key] = val.get("high" if is_high else "low", "")
            else:
                implications[key] = str(val)

    return {
        "area":              ctx.get("area", f"House {house}"),
        "significator":      ctx.get("significator", ""),
        "score":             score,
        "band_label":        band_label,
        "band_color":        band_color,
        "band_desc":         band_desc,
        "implications":      implications,
        "remedies":          ctx.get("remedies", ""),
        "better_perspective":ctx.get("better_perspective", ""),
        "avg_note": (
            "SAV (सर्वाष्टकवर्ग) में, प्रति भाव औसत स्कोर 28 बिंदु है। "
            "25 से कम बिंदु अपेक्षाकृत कमजोर माने जाते हैं; 30 से ऊपर मजबूत होते हैं। "
            "सभी 12 भावों का कुल योग हमेशा 337 बिंदु होना चाहिए।"
        ) if lang == "hi" else (
            "In SAV, the average score per house is 28 points. "
            "Scores below 25 are relatively low; above 30 are strong. "
            "The total of all 12 houses must equal 337 bindus."
        ),
    }


PLANET_TRAITS = {
    "Sun": {
        "en": {
            "nature": "regal, authoritative, and soul-driven",
            "personality": "Confident, dignified, and naturally commanding with strong leadership presence and a desire for recognition.",
            "behavioral": "Proud, generous, and principled; can become egoistic or domineering if afflicted.",
            "health": "Issues with heart, eyes, bones, and vitality; excess heat or inflammation possible.",
            "relationships": "Seeks a partner of equal status; can overshadow the spouse due to strong individuality.",
            "career": "Excels as a leader, government official, politician, administrator, doctor, or in public-facing authority roles.",
            "strength_note": "Exalted Sun (Aries) gives exceptional leadership; debilitated Sun (Libra) may cause ego conflicts.",
            "remedies": "Offer water to the Sun at sunrise, worship Lord Shiva, wear Ruby (Manik) after expert advice, and chant Aditya Hridayam.",
            "special": {
                1: "Creates a 'Sun Lagna' personality — proud, authoritative, and deeply connected to the soul's purpose.",
                10: "One of the finest placements for career; the native achieves fame and authority in professional life."
            }
        },
        "hi": {
            "nature": "शाही, आधिकारिक और आत्मा से प्रेरित",
            "personality": "आत्मविश्वासी, गरिमापूर्ण और स्वाभाविक रूप से मजबूत नेतृत्व उपस्थिति और मान्यता की इच्छा के साथ कमांडिंग।",
            "behavioral": "गर्वित, उदार और सिद्धांतवादी; यदि पीड़ित हो तो अहंकारी या हावी हो सकता है।",
            "health": "हृदय, आंख, हड्डियों और जीवन शक्ति की समस्याएं; अधिक गर्मी या सूजन संभव है।",
            "relationships": "समान स्थिति के साथी की तलाश; मजबूत व्यक्तित्व के कारण जीवनसाथी पर हावी हो सकता है।",
            "career": "एक नेता, सरकारी अधिकारी, राजनीतिज्ञ, प्रशासक, डॉक्टर या सार्वजनिक रूप से अधिकृत भूमिकाओं के रूप में उत्कृष्ट।",
            "strength_note": "उच्च का सूर्य (मेष) असाधारण नेतृत्व देता है; नीच का सूर्य (तुला) अहंकार संघर्ष पैदा कर सकता है।",
            "remedies": "सूर्योदय के समय सूर्य को जल अर्पित करें, भगवान शिव की पूजा करें, विशेषज्ञ की सलाह के बाद माणिक पहनें और आदित्य हृदयम का जाप करें।",
            "special": {
                1: "एक 'सूर्य लग्न' व्यक्तित्व बनाता है - गर्वित, आधिकारिक और आत्मा के उद्देश्य से गहराई से जुड़ा हुआ।",
                10: "करियर के लिए सबसे बेहतरीन स्थानों में से एक; जातक पेशेवर जीवन में प्रसिद्धि और अधिकार प्राप्त करता है।"
            }
        }
    },
    "Moon": {
        "en": {
            "nature": "emotional, nurturing, and mind-driven",
            "personality": "Sensitive, intuitive, and empathetic with a strong emotional aura and fluctuating moods.",
            "behavioral": "Caring, imaginative, and receptive; can become over-emotional, anxious, or overly dependent.",
            "health": "Prone to water-related issues, mental stress, hormonal imbalances, and lung/chest ailments.",
            "relationships": "Deeply emotional and nurturing partner; seeks security and emotional bonding.",
            "career": "Thrives in nursing, hospitality, food industry, counseling, travel, import-export, and public relations.",
            "strength_note": "Exalted Moon (Taurus) gives a calm, wealthy mind; debilitated Moon (Scorpio) may cause emotional turmoil.",
            "remedies": "Fast on Mondays, worship Goddess Parvati/Durga, wear Pearl (Moti) after expert advice, and chant Chandra mantra.",
            "special": {
                4: "Moon in its own-like zone — brings deep domestic happiness, emotional peace, and strong maternal bond."
            }
        },
        "hi": {
            "nature": "भावनात्मक, पोषण करने वाला और मन से प्रेरित",
            "personality": "संवेदनशील, सहज और एक मजबूत भावनात्मक आभा और उतार-चढ़ाव वाले मूड के साथ सहानुभूतिपूर्ण।",
            "behavioral": "देखभाल करने वाला, कल्पनाशील और ग्रहणशील; अति-भावनात्मक, चिंतित या अत्यधिक निर्भर हो सकता है।",
            "health": "पानी से संबंधित मुद्दों, मानसिक तनाव, हार्मोनल असंतुलन और फेफड़ों/छाती की बीमारियों का खतरा।",
            "relationships": "गहराई से भावनात्मक और पोषण करने वाला साथी; सुरक्षा और भावनात्मक संबंध चाहता है।",
            "career": "नर्सिंग, आतिथ्य, खाद्य उद्योग, परामर्श, यात्रा, आयात-निर्यात और जनसंपर्क में पनपता है।",
            "strength_note": "उच्च का चंद्रमा (वृषभ) एक शांत, धनी मन देता है; नीच का चंद्रमा (वृश्चिक) भावनात्मक उथल-पुथल पैदा कर सकता है।",
            "remedies": "सोमवार को उपवास करें, देवी पार्वती/दुर्गा की पूजा करें, विशेषज्ञ की सलाह के बाद मोती पहनें और चंद्र मंत्र का जाप करें।",
            "special": {
                4: "चंद्रमा अपने जैसे क्षेत्र में - गहरी घरेलू खुशी, भावनात्मक शांति और मजबूत मातृ बंधन लाता है।"
            }
        }
    },
    "Mars": {
        "en": {
            "nature": "fiery, energetic, and action-oriented",
            "personality": "Athletic, bold, direct, and high-energy with strong willpower and a competitive drive. Known for muscular build and sharp features.",
            "behavioral": "Outspoken, courageous, and proactive; quick to anger but also quick to forgive. Can be stubborn or self-centric.",
            "health": "Issues with high blood pressure, skin rashes, cuts, burns, fevers, and blood-related disorders due to fiery nature.",
            "relationships": "Creates Manglik Dosha in houses 1, 2, 4, 7, 8, and 12. Aggressive or assertive in partnerships; needs a strong partner.",
            "career": "Excels in military, police, engineering, surgery, sports, construction, and entrepreneurship requiring physical courage.",
            "strength_note": "Strong Mars (Aries, Scorpio, Capricorn) brings leadership and charisma; weak Mars leads to recklessness or aggression.",
            "remedies": "Worship Lord Hanuman, fast on Tuesdays, offer red flowers to Lord Hanuman, wear Coral (Moonga) after expert advice.",
            "special": {
                1: "Mars in the 1st house (Lagna) creates a dynamic, courageous personality often making the native athletic, impulsive, and energetic. Creates Manglik Dosha. Natives can be short-tempered, accident-prone, or struggle with a self-centric infant-like nature.",
                10: "Ruchaka Yoga may form — one of the Pancha Mahapurusha Yogas — giving exceptional authority, fame, and professional power."
            }
        },
        "hi": {
            "nature": "उग्र, ऊर्जावान और कार्रवाई-उन्मुख",
            "personality": "मजबूत इच्छाशक्ति और प्रतिस्पर्धी ड्राइव के साथ एथलेटिक, साहसी, प्रत्यक्ष और उच्च ऊर्जा। पेशी निर्माण और तेज विशेषताओं के लिए जाना जाता है।",
            "behavioral": "स्पष्टवादी, साहसी और सक्रिय; क्रोध में जल्दी लेकिन क्षमा करने में भी जल्दी। जिद्दी या आत्मकेंद्रित हो सकता है।",
            "health": "उग्र प्रकृति के कारण उच्च रक्तचाप, त्वचा पर चकत्ते, कट, जलन, बुखार और रक्त संबंधी विकार।",
            "relationships": "भाव 1, 2, 4, 7, 8 और 12 में मांगलिक दोष बनाता है। साझेदारी में आक्रामक या मुखर; एक मजबूत साथी की आवश्यकता है।",
            "career": "सैन्य, पुलिस, इंजीनियरिंग, सर्जरी, खेल, निर्माण और शारीरिक साहस की आवश्यकता वाले उद्यमिता में उत्कृष्ट।",
            "strength_note": "मजबूत मंगल (मेष, वृश्चिक, मकर) नेतृत्व और करिश्मा लाता है; कमजोर मंगल लापरवाही या आक्रामकता की ओर ले जाता है।",
            "remedies": "भगवान हनुमान की पूजा करें, मंगलवार को उपवास करें, भगवान हनुमान को लाल फूल चढ़ाएं, विशेषज्ञ की सलाह के बाद मूंगा पहनें।",
            "special": {
                1: "प्रथम भाव (लग्न) में मंगल एक गतिशील, साहसी व्यक्तित्व बनाता है जो अक्सर जातक को एथलेटिक, आवेगी और ऊर्जावान बनाता है। मांगलिक दोष बनाता है। जातक क्रोधी, दुर्घटना-प्रवण या आत्मकेंद्रित शिशु जैसी प्रकृति से संघर्ष कर सकता है।",
                10: "रुचक योग बन सकता है - पंच महापुरुष योगों में से एक - असाधारण अधिकार, प्रसिद्धि और पेशेवर शक्ति प्रदान करता है।"
            }
        }
    },
    "Mercury": {
        "en": {
            "nature": "intellectual, analytical, and communicative",
            "personality": "Quick-witted, youthful, and expressive with strong analytical and verbal abilities. Often appears younger than their age.",
            "behavioral": "Adaptive, curious, and logical; may become nervous, indecisive, or overly critical when afflicted.",
            "health": "Prone to nervous system issues, skin conditions, speech disorders, and respiratory problems.",
            "relationships": "Intellectual and communicative in partnerships; seeks a witty and intelligent companion.",
            "career": "Excels in writing, accounting, IT, teaching, law, astrology, journalism, and all analytical or communication fields.",
            "strength_note": "Exalted Mercury (Virgo) gives exceptional intellect; debilitated Mercury (Pisces) may cause confusion and indecision.",
            "remedies": "Worship Lord Vishnu or Goddess Saraswati, wear Emerald (Panna) after expert advice, feed green vegetables to animals.",
            "special": {
                1: "Bhadra Yoga may form if Mercury is in Gemini or Virgo in the 1st house — granting extraordinary intellect and communication skills."
            }
        },
        "hi": {
            "nature": "बौद्धिक, विश्लेषणात्मक और संचारी",
            "personality": "मजबूत विश्लेषणात्मक और मौखिक क्षमताओं के साथ त्वरित-बुद्धिमान, युवा और अभिव्यंजक। अक्सर अपनी उम्र से छोटा दिखाई देता है।",
            "behavioral": "अनुकूलनीय, जिज्ञासु और तार्किक; पीड़ित होने पर घबराया हुआ, अनिर्णायक या अति-आलोचनात्मक हो सकता है।",
            "health": "तंत्रिका तंत्र के मुद्दों, त्वचा की स्थिति, भाषण विकार और श्वसन समस्याओं का खतरा।",
            "relationships": "साझेदारी में बौद्धिक और संचारी; एक मजाकिया और बुद्धिमान साथी चाहता है।",
            "career": "लेखन, लेखांकन, आईटी, शिक्षण, कानून, ज्योतिष, पत्रकारिता और सभी विश्लेषणात्मक या संचार क्षेत्रों में उत्कृष्ट।",
            "strength_note": "उच्च का बुध (कन्या) असाधारण बुद्धि देता है; नीच का बुध (मीन) भ्रम और अनिर्णय पैदा कर सकता है।",
            "remedies": "भगवान विष्णु या देवी सरस्वती की पूजा करें, विशेषज्ञ की सलाह के बाद पन्ना पहनें, जानवरों को हरी सब्जियां खिलाएं।",
            "special": {
                1: "यदि बुध प्रथम भाव में मिथुन या कन्या राशि में हो तो भद्र योग बन सकता है - असाधारण बुद्धि और संचार कौशल प्रदान करता है।"
            }
        }
    },
    "Jupiter": {
        "en": {
            "nature": "wise, expansive, and spiritually inclined",
            "personality": "Optimistic, philosophical, generous, and naturally fortunate with a broad world-view and strong moral character.",
            "behavioral": "Wise, benevolent, and inspiring; can become over-indulgent, preachy, or lazy when afflicted.",
            "health": "Prone to liver issues, obesity, diabetes, and problems from over-indulgence in food and comfort.",
            "relationships": "Supportive, wise, and noble partner; brings grace and stability to relationships.",
            "career": "Thrives as teacher, judge, priest, counselor, financial advisor, philosopher, or banker.",
            "strength_note": "Exalted Jupiter (Cancer) is supremely auspicious; debilitated Jupiter (Capricorn) may cause overconfidence or missed wisdom.",
            "remedies": "Worship Lord Vishnu/Brihaspati, fast on Thursdays, offer yellow flowers, wear Yellow Sapphire (Pukhraj) after expert advice.",
            "special": {
                9: "Supremely auspicious placement — known as 'Dharma Karmadhipati' combination, granting deep wisdom, spiritual leadership, and divine grace."
            }
        },
        "hi": {
            "nature": "बुद्धिमान, विस्तारक और आध्यात्मिक रूप से झुकाव वाला",
            "personality": "आशावादी, दार्शनिक, उदार और एक व्यापक विश्वदृष्टि और मजबूत नैतिक चरित्र के साथ स्वाभाविक रूप से भाग्यशाली।",
            "behavioral": "बुद्धिमान, परोपकारी और प्रेरक; पीड़ित होने पर अति-भोगवादी, उपदेशात्मक या आलसी हो सकता है।",
            "health": "भोजन और आराम में अति-लिप्त होने से यकृत के मुद्दों, मोटापा, मधुमेह और समस्याओं का खतरा।",
            "relationships": "सहायक, बुद्धिमान और महान साथी; रिश्तों में अनुग्रह और स्थिरता लाता है।",
            "career": "शिक्षक, न्यायाधीश, पुजारी, परामर्शदाता, वित्तीय सलाहकार, दार्शनिक या बैंकर के रूप में पनपता है।",
            "strength_note": "उच्च का गुरु (कर्क) अत्यंत शुभ होता है; नीच का गुरु (मकर) अति आत्मविश्वास या छूटे हुए ज्ञान का कारण बन सकता है।",
            "remedies": "भगवान विष्णु/बृहस्पति की पूजा करें, गुरुवार को उपवास करें, पीले फूल चढ़ाएं, विशेषज्ञ की सलाह के बाद पुखराज पहनें।",
            "special": {
                9: "अत्यंत शुभ स्थान - जिसे 'धर्म कर्माधिपति' संयोजन के रूप में जाना जाता है, गहरा ज्ञान, आध्यात्मिक नेतृत्व और ईश्वरीय कृपा प्रदान करता है।"
            }
        }
    },
    "Venus": {
        "en": {
            "nature": "artistic, refined, and pleasure-seeking",
            "personality": "Charming, beautiful, diplomatic, and aesthetically sensitive with a love for luxury, beauty, and harmony.",
            "behavioral": "Loving, creative, and socially graceful; can become indulgent, vain, or overly relationship-dependent.",
            "health": "Issues with kidneys, reproductive system, skin, throat, and hormonal balance.",
            "relationships": "Brings a charming, artistic spouse; highly values love and beauty in partnerships.",
            "career": "Excels in arts, fashion, music, film, luxury goods, beauty industry, hospitality, and diplomacy.",
            "strength_note": "Exalted Venus (Pisces) is supremely refined; debilitated Venus (Virgo) may make love elusive or overly critical.",
            "remedies": "Worship Goddess Lakshmi, fast on Fridays, offer white flowers/sweets, wear Diamond (Heera) or White Sapphire after expert advice.",
            "special": {
                7: "Malavya Yoga may form — one of the Pancha Mahapurusha Yogas — giving exceptional beauty, luxury, and a loving, artistic spouse."
            }
        },
        "hi": {
            "nature": "कलात्मक, परिष्कृत और खुशी चाहने वाला",
            "personality": "आकर्षक, सुंदर, कूटनीतिक और विलासिता, सुंदरता और सद्भाव के लिए प्यार के साथ सौंदर्य की दृष्टि से संवेदनशील।",
            "behavioral": "प्यार करने वाला, रचनात्मक और सामाजिक रूप से सुंदर; अनुग्रहकारी, व्यर्थ, या अत्यधिक संबंध-निर्भर हो सकता है।",
            "health": "गुर्दे, प्रजनन प्रणाली, त्वचा, गले और हार्मोनल संतुलन की समस्याएं।",
            "relationships": "एक आकर्षक, कलात्मक जीवनसाथी लाता है; साझेदारी में प्यार और सुंदरता को अत्यधिक महत्व देता है।",
            "career": "कला, फैशन, संगीत, फिल्म, लक्जरी सामान, सौंदर्य उद्योग, आतिथ्य और कूटनीति में उत्कृष्ट।",
            "strength_note": "उच्च का शुक्र (मीन) अत्यंत परिष्कृत है; नीच का शुक्र (कन्या) प्यार को मायावी या अत्यधिक आलोचक बना सकता है।",
            "remedies": "देवी लक्ष्मी की पूजा करें, शुक्रवार को उपवास करें, सफेद फूल/मिठाई चढ़ाएं, विशेषज्ञ की सलाह के बाद हीरा या सफेद नीलम पहनें।",
            "special": {
                7: "मालव्य योग बन सकता है - पंच महापुरुष योगों में से एक - असाधारण सुंदरता, विलासिता और एक प्यार करने वाला, कलात्मक जीवनसाथी देता है।"
            }
        }
    },
    "Saturn": {
        "en": {
            "nature": "disciplined, karmic, and slow-working",
            "personality": "Serious, structured, responsible, and enduring with a mature outlook on life and strong work ethic.",
            "behavioral": "Patient, disciplined, and dutiful; can become pessimistic, rigid, fearful, or cold when afflicted.",
            "health": "Prone to bone/joint issues, chronic illness, dental problems, skin diseases, and nerve-related ailments.",
            "relationships": "Brings a mature, stable, and serious partner; relationships require effort and patience to flourish.",
            "career": "Excels in law, mining, construction, real estate, government service, agriculture, and any field requiring discipline and persistence.",
            "strength_note": "Exalted Saturn (Libra) builds remarkable long-term success; debilitated Saturn (Aries) may cause chronic struggles.",
            "remedies": "Worship Lord Shani/Hanuman, fast on Saturdays, donate black sesame/iron, wear Blue Sapphire (Neelam) only after expert advice.",
            "special": {
                10: "Shasha Yoga may form — one of the Pancha Mahapurusha Yogas — giving authority, discipline, and enduring career achievement."
            }
        },
        "hi": {
            "nature": "अनुशासित, कर्मिक और धीमी गति से काम करने वाला",
            "personality": "जीवन पर एक परिपक्व दृष्टिकोण और मजबूत कार्य नैतिकता के साथ गंभीर, संरचित, जिम्मेदार और स्थायी।",
            "behavioral": "रोगी, अनुशासित और कर्तव्यपरायण; पीड़ित होने पर निराशावादी, कठोर, भयभीत या ठंडा हो सकता है।",
            "health": "हड्डी/जोड़ों की समस्याओं, पुरानी बीमारी, दंत समस्याओं, त्वचा रोगों और तंत्रिका संबंधी बीमारियों का खतरा।",
            "relationships": "एक परिपक्व, स्थिर और गंभीर साथी लाता है; रिश्तों को फलने-फूलने के लिए प्रयास और धैर्य की आवश्यकता होती है।",
            "career": "कानून, खनन, निर्माण, अचल संपत्ति, सरकारी सेवा, कृषि और अनुशासन और दृढ़ता की आवश्यकता वाले किसी भी क्षेत्र में उत्कृष्ट।",
            "strength_note": "उच्च का शनि (तुला) उल्लेखनीय दीर्घकालिक सफलता बनाता है; नीच का शनि (मेष) पुराने संघर्षों का कारण बन सकता है।",
            "remedies": "भगवान शनि/हनुमान की पूजा करें, शनिवार को उपवास करें, काले तिल/लोहे का दान करें, विशेषज्ञ की सलाह के बाद ही नीलम पहनें।",
            "special": {
                10: "शश योग बन सकता है - पंच महापुरुष योगों में से एक - अधिकार, अनुशासन और स्थायी करियर उपलब्धि देता है।"
            }
        }
    },
    "Rahu": {
        "en": {
            "nature": "unconventional, ambitious, and illusion-creating",
            "personality": "Ambitious, unconventional, and worldly with a magnetic personality and a strong drive for material attainment.",
            "behavioral": "Bold, innovative, and rule-breaking; can become obsessive, deceptive, or prone to extreme desires.",
            "health": "Issues with nervous system, skin, mental health, poisoning, and chronic or mysterious ailments.",
            "relationships": "Brings an unconventional, foreign, or unique partner; relationships can be intense and transformative.",
            "career": "Excels in technology, media, politics, foreign trade, research, psychology, and unconventional or futuristic fields.",
            "strength_note": "Rahu in friendly signs (Gemini, Virgo) drives massive worldly success. In difficult signs, it may manifest as obsession or deceit.",
            "remedies": "Worship Goddess Durga/Saraswati, donate to charity on Saturdays, feed birds, wear Hessonite Garnet (Gomed) after expert advice.",
            "special": {
                10: "Extremely powerful for worldly fame and unconventional career success when well-placed — many celebrities and entrepreneurs have this."
            }
        },
        "hi": {
            "nature": "अपरंपरागत, महत्वाकांक्षी और भ्रम पैदा करने वाला",
            "personality": "एक चुंबकीय व्यक्तित्व और भौतिक प्राप्ति के लिए एक मजबूत ड्राइव के साथ महत्वाकांक्षी, अपरंपरागत और सांसारिक।",
            "behavioral": "बोल्ड, अभिनव और नियम तोड़ने वाला; जुनूनी, भ्रामक, या अत्यधिक इच्छाओं से ग्रस्त हो सकता है।",
            "health": "तंत्रिका तंत्र, त्वचा, मानसिक स्वास्थ्य, विषाक्तता और पुरानी या रहस्यमय बीमारियों के मुद्दे।",
            "relationships": "एक अपरंपरागत, विदेशी या अद्वितीय साथी लाता है; रिश्ते गहन और परिवर्तनकारी हो सकते हैं।",
            "career": "प्रौद्योगिकी, मीडिया, राजनीति, विदेशी व्यापार, अनुसंधान, मनोविज्ञान और अपरंपरागत या भविष्य के क्षेत्रों में उत्कृष्ट।",
            "strength_note": "राहु मित्र राशियों (मिथुन, कन्या) में बड़े पैमाने पर सांसारिक सफलता दिलाता है। कठिन राशियों में, यह जुनून या छल के रूप में प्रकट हो सकता है।",
            "remedies": "देवी दुर्गा/सरस्वती की पूजा करें, शनिवार को दान करें, पक्षियों को खिलाएं, विशेषज्ञ की सलाह के बाद गोमेद पहनें।",
            "special": {
                10: "सांसारिक प्रसिद्धि और अपरंपरागत करियर की सफलता के लिए अत्यंत शक्तिशाली जब अच्छी तरह से स्थित हो - कई मशहूर हस्तियों और उद्यमियों के पास यह होता है।"
            }
        }
    },
    "Ketu": {
        "en": {
            "nature": "spiritual, detached, and karmically significant",
            "personality": "Intuitive, spiritual, and introspective with a detached view of the material world and strong past-life wisdom.",
            "behavioral": "Mysterious, psychic, and contemplative; can become reclusive, confused, or disconnected from reality.",
            "health": "Prone to mysterious illnesses, surgeries, spiritual crises, and nervous or immune system issues.",
            "relationships": "Brings a spiritual, detached, or past-life-connected partner; relationships require understanding and mutual independence.",
            "career": "Thrives in spiritual work, astrology, research, medicine, technology, and any field involving hidden knowledge.",
            "strength_note": "Ketu in spiritual signs (Pisces, Sagittarius, Scorpio) accelerates liberation; in material signs, detachment may harm worldly pursuits.",
            "remedies": "Worship Lord Ganesha/Shiva, fast on Thursdays, donate saffron/blankets, wear Cat's Eye (Lehsunia) only after expert advice.",
            "special": {
                12: "Classic placement for spiritual liberation (Moksha). Native is deeply meditative and may achieve enlightenment or great spiritual freedom."
            }
        },
        "hi": {
            "nature": "आध्यात्मिक, अलग और कर्म रूप से महत्वपूर्ण",
            "personality": "भौतिक दुनिया के एक अलग दृष्टिकोण और मजबूत पिछले जीवन के ज्ञान के साथ सहज, आध्यात्मिक और आत्मनिरीक्षण।",
            "behavioral": "रहस्यमय, मानसिक और चिंतनशील; वैरागी, भ्रमित या वास्तविकता से अलग हो सकता है।",
            "health": "रहस्यमय बीमारियों, सर्जरी, आध्यात्मिक संकटों और तंत्रिका या प्रतिरक्षा प्रणाली की समस्याओं का खतरा।",
            "relationships": "एक आध्यात्मिक, अलग, या पिछले जन्म से जुड़ा साथी लाता है; रिश्तों को समझ और आपसी स्वतंत्रता की आवश्यकता होती है।",
            "career": "आध्यात्मिक कार्य, ज्योतिष, अनुसंधान, चिकित्सा, प्रौद्योगिकी और छिपे हुए ज्ञान से जुड़े किसी भी क्षेत्र में पनपता है।",
            "strength_note": "आध्यात्मिक राशियों (मीन, धनु, वृश्चिक) में केतु मोक्ष को गति देता है; भौतिक राशियों में, वैराग्य सांसारिक कार्यों को नुकसान पहुंचा सकता है।",
            "remedies": "भगवान गणेश/शिव की पूजा करें, गुरुवार को उपवास करें, केसर/कंबल का दान करें, विशेषज्ञ की सलाह के बाद ही लहसुनिया पहनें।",
            "special": {
                12: "आध्यात्मिक मुक्ति (मोक्ष) के लिए क्लासिक प्लेसमेंट। जातक गहरा ध्यान करने वाला होता है और ज्ञान या महान आध्यात्मिक स्वतंत्रता प्राप्त कर सकता है।"
            }
        }
    }
}


KEY_EFFECT_CATEGORIES = [
    "Personality & Appearance",
    "Behavioral Traits",
    "Health",
    "Relationships & Marriage",
    "Career & Success",
]


def planet_rich_interpretation(planet: str, house: int, lang: str = "en") -> dict:
    """
    Returns a rich, structured interpretation dict for a planet in a house.
    Keys: summary, key_effects (dict), considerations (dict)
    """
    traits = PLANET_TRAITS.get(planet)
    house_theme = HOUSE_THEMES.get(house)
    if not traits or not house_theme:
        return {}

    raw_traits = traits if isinstance(traits, dict) else {}
    if lang in raw_traits:
        traits_dict = raw_traits.get(lang, {})
    elif "en" in raw_traits:
        traits_dict = raw_traits.get("en", {})
    else:
        traits_dict = raw_traits
    
    if isinstance(house_theme, dict) and lang in house_theme:
        house_theme_dict = house_theme.get(lang, {})
    elif isinstance(house_theme, dict) and "en" in house_theme:
        house_theme_dict = house_theme.get("en", {})
    else:
        house_theme_dict = house_theme if isinstance(house_theme, dict) else {}
    
    ordinal_raw = _ORDINALS.get(house, str(house))
    if isinstance(ordinal_raw, dict):
        ordinal = ordinal_raw.get(lang, ordinal_raw.get("en", str(house)))
    else:
        ordinal = ordinal_raw
        
    area = house_theme_dict.get("area", f"House {house}")
    focus = house_theme_dict.get("focus", "this life area")

    # Check for special override for summary
    special_note = traits_dict.get("special", {}).get(house, "")
    if special_note:
        summary = str(special_note)
    else:
        if lang == "hi":
            summary = (
                f"{ordinal} भाव ({area}) में {planet} अपने {traits_dict.get('nature', 'अद्वितीय')} प्रभाव को "
                f"{focus} के क्षेत्र में लाता है। यह स्थिति जातक के दृष्टिकोण को महत्वपूर्ण रूप से रंगती है, "
                f"जो भौतिक और आध्यात्मिक दोनों तरह के परिणामों को आकार देती है।"
            )
        else:
            summary = (
                f"{planet} in the {ordinal} house ({area}) brings its {traits_dict.get('nature', 'unique')} energy "
                f"into the domain of {focus}. This placement significantly colours the native's "
                f"approach to this area of life, shaping outcomes both materially and spiritually."
            )

    if lang == "hi":
        key_effects = {
            "व्यक्तित्व और रूप-रंग": (
                f"{traits_dict.get('personality', '')} "
                f"{ordinal} भाव में, यह {traits_dict.get('nature', 'अद्वितीय')} प्रभाव {focus} पर जातक के दृष्टिकोण को आकार देता है।"
            ),
            "व्यवहार संबंधी गुण": traits_dict.get("behavioral", ""),
            "स्वास्थ्य": traits_dict.get("health", ""),
            "संबंध और विवाह": traits_dict.get("relationships", ""),
            "करियर और सफलता": traits_dict.get("career", ""),
        }
        considerations = {
            "ग्रह बल का महत्व": traits_dict.get("strength_note", ""),
            "उपाय": traits_dict.get("remedies", ""),
        }
    else:
        key_effects = {
            "Personality & Appearance": (
                f"{traits_dict.get('personality', '')} "
                f"In the {ordinal} house, this {traits_dict.get('nature', 'unique')} influence shapes the native's outlook on {focus}."
            ),
            "Behavioral Traits": traits_dict.get("behavioral", ""),
            "Health": traits_dict.get("health", ""),
            "Relationships & Marriage": traits_dict.get("relationships", ""),
            "Career & Success": traits_dict.get("career", ""),
        }
        considerations = {
            "Strength Matters": traits_dict.get("strength_note", ""),
            "Remedies": traits_dict.get("remedies", ""),
        }

    return {
        "summary": summary,
        "key_effects": key_effects,
        "considerations": considerations,
        "planet": planet,
        "house": house,
        "ordinal": ordinal,
        "area": area,
    }


# ── Legacy one-liner interface (kept for backward compatibility) ──────────────
PLANET_HOUSE_TEXT = {
    "Sun": {
        "en": {
            1: "Sun in the first house indicates a strong, confident personality with natural leadership qualities.",
            2: "Sun in the second house suggests focus on wealth, family values, and authoritative speech.",
            3: "Sun in the third house emphasizes courage, strong communication, and proactive relations with siblings.",
            4: "Sun in the fourth house emphasizes strong attachment to homeland and family traditions.",
            5: "Sun in the fifth house highlights creativity, intelligence, and interest in progeny.",
            6: "Sun in the sixth house indicates strength in overcoming obstacles and success in competition.",
            7: "Sun in the seventh house brings an authoritative partner and highlights public social standing.",
            8: "Sun in the eighth house suggests deep inner transformation and interest in research/occult.",
            9: "Sun in the ninth house points toward wisdom, spiritual inclination, and higher learning.",
            10: "Sun in the tenth house is a very strong placement for career peak and public leadership.",
            11: "Sun in the eleventh house indicates fulfillment of desires through powerful social networks.",
            12: "Sun in the twelfth house suggests spiritual path potential and internal contemplation.",
        },
        "hi": {
            1: "प्रथम भाव में सूर्य प्राकृतिक नेतृत्व गुणों वाले एक मजबूत, आत्मविश्वासी व्यक्तित्व को दर्शाता है।",
            2: "दूसरे भाव में सूर्य धन, पारिवारिक मूल्यों और आधिकारिक वाणी पर ध्यान केंद्रित करने का सुझाव देता है।",
            3: "तीसरे भाव में सूर्य साहस, मजबूत संचार और भाई-बहनों के साथ सक्रिय संबंधों पर जोर देता है।",
            4: "चौथे भाव में सूर्य मातृभूमि और पारिवारिक परंपराओं के प्रति मजबूत लगाव पर जोर देता है।",
            5: "पांचवें भाव में सूर्य रचनात्मकता, बुद्धिमत्ता और संतान में रुचि पर प्रकाश डालता है।",
            6: "छठे भाव में सूर्य बाधाओं पर काबू पाने में ताकत और प्रतिस्पर्धा में सफलता को दर्शाता है।",
            7: "सातवें भाव में सूर्य एक आधिकारिक साथी लाता है और सार्वजनिक सामाजिक स्थिति पर प्रकाश डालता है।",
            8: "आठवें भाव में सूर्य गहरे आंतरिक परिवर्तन और शोध/गुप्त विद्या में रुचि का सुझाव देता है।",
            9: "नौवें भाव में सूर्य ज्ञान, आध्यात्मिक झुकाव और उच्च शिक्षा की ओर इशारा करता है।",
            10: "दसवें भाव में सूर्य करियर के शिखर और सार्वजनिक नेतृत्व के लिए बहुत मजबूत स्थिति है।",
            11: "ग्यारहवें भाव में सूर्य शक्तिशाली सामाजिक नेटवर्क के माध्यम से इच्छाओं की पूर्ति को दर्शाता है।",
            12: "बारहवें भाव में सूर्य आध्यात्मिक मार्ग की क्षमता और आंतरिक चिंतन का सुझाव देता है।",
        }
    },
    "Moon": {
        "en": {
            1: "Moon in the first house makes for a sensitive, intuitive, and empathetic personality.",
            2: "Moon in the second house indicates emotional security found in family and financial stability.",
            3: "Moon in the third house suggests an active mind and close emotional bond with siblings.",
            4: "Moon in the fourth house emphasizes deep inner peace and maternal connection.",
            5: "Moon in the fifth house highlights creative intelligence and emotional investment in children.",
            6: "Moon in the sixth house suggests emotional involvement in service and health routines.",
            7: "Moon in the seventh house indicates an emotional, nurturing relationship partner.",
            8: "Moon in the eighth house suggests deep intuition and psychic sensitivity.",
            9: "Moon in the ninth house points toward philosophical depth and spiritual journeys.",
            10: "Moon in the tenth house brings nurturing professional image and public-facing success.",
            11: "Moon in the eleventh house indicates emotional fulfillment through social circles.",
            12: "Moon in the twelfth house suggests vivid dreams and emotional maturity through solitude.",
        },
        "hi": {
            1: "प्रथम भाव में चंद्रमा एक संवेदनशील, सहज और सहानुभूतिपूर्ण व्यक्तित्व बनाता है।",
            2: "दूसरे भाव में चंद्रमा परिवार और वित्तीय स्थिरता में पाई जाने वाली भावनात्मक सुरक्षा को दर्शाता है।",
            3: "तीसरे भाव में चंद्रमा एक सक्रिय दिमाग और भाई-बहनों के साथ घनिष्ठ भावनात्मक बंधन का सुझाव देता है।",
            4: "चौथे भाव में चंद्रमा गहरी आंतरिक शांति और मातृ संबंध पर जोर देता है।",
            5: "पांचवें भाव में चंद्रमा रचनात्मक बुद्धिमत्ता और बच्चों में भावनात्मक निवेश पर प्रकाश डालता है।",
            6: "छठे भाव में चंद्रमा सेवा और स्वास्थ्य दिनचर्या में भावनात्मक भागीदारी का सुझाव देता है।",
            7: "सातवें भाव में चंद्रमा एक भावनात्मक, देखभाल करने वाले जीवनसाथी को दर्शाता है।",
            8: "आठवें भाव में चंद्रमा गहरी अंतर्ज्ञान और मानसिक संवेदनशीलता का सुझाव देता है।",
            9: "नौवें भाव में चंद्रमा दार्शनिक गहराई और आध्यात्मिक यात्राओं की ओर इशारा करता है।",
            10: "दसवें भाव में चंद्रमा पोषण करने वाली पेशेवर छवि और सार्वजनिक सफलता लाता है।",
            11: "ग्यारहवें भाव में चंद्रमा सामाजिक हलकों के माध्यम से भावनात्मक पूर्ति को दर्शाता है।",
            12: "बारहवें भाव में चंद्रमा एकांत के माध्यम से ज्वलंत सपनों और भावनात्मक परिपक्वता का सुझाव देता है।",
        }
    },
    "Mars": {
        "en": {
            1: "Mars in the first house brings high energy, competitive spirit, and a pioneering approach.",
            2: "Mars in the second house suggests dynamic wealth generation with caution on impulsive spending.",
            3: "Mars in the third house emphasizes extreme courage and an assertive communication style.",
            4: "Mars in the fourth house indicates a protective, energetic domestic environment.",
            5: "Mars in the fifth house highlights passionate creativity and logic-driven intelligence.",
            6: "Mars in the sixth house provides strength to defeat competitors and high-energy work approach.",
            7: "Mars in the seventh house brings an energetic, assertive partner requiring collaborative balance.",
            8: "Mars in the eighth house suggests intense resilience and interest in investigative research.",
            9: "Mars in the ninth house points toward independent spiritual views and higher knowledge.",
            10: "Mars in the tenth house is powerful for professional authority and career victory.",
            11: "Mars in the eleventh house indicates success through active participation in large groups.",
            12: "Mars in the twelfth house suggests high energy used for humanitarian or spiritual work.",
        },
        "hi": {
            1: "प्रथम भाव में मंगल उच्च ऊर्जा, प्रतिस्पर्धी भावना और एक अग्रणी दृष्टिकोण लाता है।",
            2: "दूसरे भाव में मंगल आवेगी खर्च पर सावधानी के साथ गतिशील धन सृजन का सुझाव देता है।",
            3: "तीसरे भाव में मंगल अत्यधिक साहस और एक मुखर संचार शैली पर जोर देता है।",
            4: "चौथे भाव में मंगल एक सुरक्षात्मक, ऊर्जावान घरेलू वातावरण को दर्शाता है।",
            5: "पांचवें भाव में मंगल भावुक रचनात्मकता और तर्क-संचालित बुद्धिमत्ता पर प्रकाश डालता है।",
            6: "छठे भाव में मंगल प्रतिस्पर्धियों को हराने की ताकत और उच्च-ऊर्जा कार्य दृष्टिकोण प्रदान करता है।",
            7: "सातवें भाव में मंगल एक ऊर्जावान, मुखर साथी लाता है जिसके लिए सहयोगात्मक संतुलन की आवश्यकता होती है।",
            8: "आठवें भाव में मंगल तीव्र लचीलापन और खोजी अनुसंधान में रुचि का सुझाव देता है।",
            9: "नौवें भाव में मंगल स्वतंत्र आध्यात्मिक विचारों और उच्च ज्ञान की ओर इशारा करता है।",
            10: "दसवें भाव में मंगल पेशेवर अधिकार और करियर की जीत के लिए शक्तिशाली है।",
            11: "ग्यारहवें भाव में मंगल बड़े समूहों में सक्रिय भागीदारी के माध्यम से सफलता को दर्शाता है।",
            12: "बारहवें भाव में मंगल मानवीय या आध्यात्मिक कार्यों के लिए उपयोग की जाने वाली उच्च ऊर्जा का सुझाव देता है।",
        }
    },
    "Mercury": {
        "en": {
            1: "Mercury in the first house indicates a quick wit, intellectual curiosity, and expressive personality.",
            2: "Mercury in the second house suggests skill in commerce and an eloquent manner of speaking.",
            3: "Mercury in the third house emphasizes excellence in writing and constant learning.",
            4: "Mercury in the fourth house brings an intellectual domestic atmosphere.",
            5: "Mercury in the fifth house highlights strategic intelligence and speculative skill.",
            6: "Mercury in the sixth house indicates talent in detailed work and analytical health approaches.",
            7: "Mercury in the seventh house suggests intellectual partnership and skill in negotiation.",
            8: "Mercury in the eighth house points toward research skills and investigative intelligence.",
            9: "Mercury in the ninth house emphasizes higher learning and success in publishing or teaching.",
            10: "Mercury in the tenth house indicates professional reputation based on intellect and communication.",
            11: "Mercury in the eleventh house brings diverse intellectual social networks.",
            12: "Mercury in the twelfth house suggests a highly imaginative mind and interest in mysticism.",
        },
        "hi": {
            1: "प्रथम भाव में बुध त्वरित बुद्धि, बौद्धिक जिज्ञासा और अभिव्यंजक व्यक्तित्व को दर्शाता है।",
            2: "दूसरे भाव में बुध वाणिज्य में कौशल और बोलने के एक वाक्पटु तरीके का सुझाव देता है।",
            3: "तीसरे भाव में बुध लेखन में उत्कृष्टता और निरंतर सीखने पर जोर देता है।",
            4: "चौथे भाव में बुध एक बौद्धिक घरेलू माहौल लाता है।",
            5: "पांचवें भाव में बुध रणनीतिक बुद्धिमत्ता और सट्टा कौशल पर प्रकाश डालता है।",
            6: "छठे भाव में बुध विस्तृत कार्य और विश्लेषणात्मक स्वास्थ्य दृष्टिकोण में प्रतिभा को दर्शाता है।",
            7: "सातवें भाव में बुध बौद्धिक साझेदारी और बातचीत में कौशल का सुझाव देता है।",
            8: "आठवें भाव में बुध अनुसंधान कौशल और खोजी बुद्धिमत्ता की ओर इशारा करता है।",
            9: "नौवें भाव में बुध उच्च शिक्षा और प्रकाशन या शिक्षण में सफलता पर जोर देता है।",
            10: "दसवें भाव में बुध बुद्धि और संचार के आधार पर पेशेवर प्रतिष्ठा को दर्शाता है।",
            11: "ग्यारहवें भाव में बुध विविध बौद्धिक सामाजिक नेटवर्क लाता है।",
            12: "बारहवें भाव में बुध अत्यधिक कल्पनाशील दिमाग और रहस्यवाद में रुचि का सुझाव देता है।",
        }
    },
    "Jupiter": {
        "en": {
            1: "Jupiter in the first house brings wisdom, optimism, and a personality that attracts natural luck.",
            2: "Jupiter in the second house suggests abundance and financial growth through ethical means.",
            3: "Jupiter in the third house emphasizes wise communication and success in media.",
            4: "Jupiter in the fourth house indicates peaceful home life and spiritual happiness.",
            5: "Jupiter in the fifth house highlights exceptional intelligence and virtuous children.",
            6: "Jupiter in the sixth house provides protection from enemies and balanced daily service.",
            7: "Jupiter in the seventh house brings a wise, supportive partner and success in legal partnerships.",
            8: "Jupiter in the eighth house suggests longevity, inheritance gains, and spiritual insights.",
            9: "Jupiter in the ninth house is supreme for wisdom, higher knowledge, and divine grace.",
            10: "Jupiter in the tenth house indicates a respected career and leadership based on wisdom.",
            11: "Jupiter in the eleventh house brings influential mentors and financial expansion.",
            12: "Jupiter in the twelfth house suggests spiritual liberation and success in foreign lands.",
        },
        "hi": {
            1: "प्रथम भाव में बृहस्पति ज्ञान, आशावाद और एक ऐसा व्यक्तित्व लाता है जो प्राकृतिक भाग्य को आकर्षित करता है।",
            2: "दूसरे भाव में बृहस्पति नैतिक माध्यमों से प्रचुरता और वित्तीय वृद्धि का सुझाव देता है।",
            3: "तीसरे भाव में बृहस्पति बुद्धिमानीपूर्ण संचार और मीडिया में सफलता पर जोर देता है।",
            4: "चौथे भाव में बृहस्पति शांतिपूर्ण पारिवारिक जीवन और आध्यात्मिक खुशी को दर्शाता है।",
            5: "पांचवें भाव में बृहस्पति असाधारण बुद्धिमत्ता और गुणी बच्चों पर प्रकाश डालता है।",
            6: "छठे भाव में बृहस्पति शत्रुओं से सुरक्षा और संतुलित दैनिक सेवा प्रदान करता है।",
            7: "सातवें भाव में बृहस्पति एक बुद्धिमान, सहायक साथी और कानूनी साझेदारी में सफलता लाता है।",
            8: "आठवें भाव में बृहस्पति दीर्घायु, विरासत लाभ और आध्यात्मिक अंतर्दृष्टि का सुझाव देता है।",
            9: "नौवें भाव में बृहस्पति ज्ञान, उच्च विद्या और ईश्वरीय कृपा के लिए सर्वोच्च है।",
            10: "दसवें भाव में बृहस्पति ज्ञान पर आधारित एक सम्मानित करियर और नेतृत्व को दर्शाता है।",
            11: "ग्यारहवें भाव में बृहस्पति प्रभावशाली गुरुओं और वित्तीय विस्तार को लाता है।",
            12: "बारहवें भाव में बृहस्पति आध्यात्मिक मुक्ति और विदेशी भूमि में सफलता का सुझाव देता है।",
        }
    },
    "Venus": {
        "en": {
            1: "Venus in the first house indicates charm, beauty, and a refined, harmonious personality.",
            2: "Venus in the second house suggests artistic wealth and finding value in luxury and family.",
            3: "Venus in the third house emphasizes artistic hobbies and pleasant journeys with siblings.",
            4: "Venus in the fourth house indicates a beautiful home and deep emotional contentment.",
            5: "Venus in the fifth house highlights creative genius, romantic inclinations, and joy through children.",
            6: "Venus in the sixth house suggests maintaining harmony in the workplace.",
            7: "Venus in the seventh house brings a charming, artistic partner and highlights beauty in love.",
            8: "Venus in the eighth house suggests deep transformative relationships and financial gains through partners.",
            9: "Venus in the ninth house points toward love for travel and refined philosophical views.",
            10: "Venus in the tenth house indicates a career in arts, fashion, or diplomacy.",
            11: "Venus in the eleventh house brings gains through artistic social circles.",
            12: "Venus in the twelfth house suggests refined inner world and spiritual artistic expression.",
        },
        "hi": {
            1: "प्रथम भाव में शुक्र आकर्षण, सुंदरता और एक परिष्कृत, सामंजस्यपूर्ण व्यक्तित्व को दर्शाता है।",
            2: "दूसरे भाव में शुक्र कलात्मक धन और विलासिता और परिवार में मूल्य खोजने का सुझाव देता है।",
            3: "तीसरे भाव में शुक्र कलात्मक शौक और भाई-बहनों के साथ सुखद यात्राओं पर जोर देता है।",
            4: "चौथे भाव में शुक्र एक सुंदर घर और गहरी भावनात्मक संतुष्टि को दर्शाता है।",
            5: "पांचवें भाव में शुक्र रचनात्मक प्रतिभा, रोमांटिक झुकाव और बच्चों के माध्यम से खुशी पर प्रकाश डालता है।",
            6: "छठे भाव में शुक्र कार्यस्थल में सामंजस्य बनाए रखने का सुझाव देता है।",
            7: "सातवें भाव में शुक्र एक आकर्षक, कलात्मक साथी लाता है और प्यार में सुंदरता पर प्रकाश डालता है।",
            8: "आठवें भाव में शुक्र गहरे परिवर्तनकारी संबंधों और भागीदारों के माध्यम से वित्तीय लाभ का सुझाव देता है।",
            9: "नौवें भाव में शुक्र यात्रा के प्रति प्रेम और परिष्कृत दार्शनिक विचारों की ओर इशारा करता है।",
            10: "दसवें भाव में शुक्र कला, फैशन या कूटनीति में करियर को दर्शाता है।",
            11: "ग्यारहवें भाव में शुक्र कलात्मक सामाजिक हलकों के माध्यम से लाभ लाता है।",
            12: "बारहवें भाव में शुक्र परिष्कृत आंतरिक दुनिया और आध्यात्मिक कलात्मक अभिव्यक्ति का सुझाव देता है।",
        }
    },
    "Saturn": {
        "en": {
            1: "Saturn in the first house indicates a serious, disciplined personality with a mature life view.",
            2: "Saturn in the second house suggests cautious, slow wealth-building through hard work.",
            3: "Saturn in the third house emphasizes perseverance in skills and long-term efforts.",
            4: "Saturn in the fourth house indicates a structured domestic life and stability through heritage.",
            5: "Saturn in the fifth house highlights disciplined creativity and responsibility toward progeny.",
            6: "Saturn in the sixth house provides discipline for tedious work and victory over rivals.",
            7: "Saturn in the seventh house brings a mature, stable partner and emphasizes commitment.",
            8: "Saturn in the eighth house suggests longevity and mastery of complex occult subjects.",
            9: "Saturn in the ninth house points toward traditional spirituality and disciplined learning.",
            10: "Saturn in the tenth house indicates status achieved through hard work and endurance.",
            11: "Saturn in the eleventh house indicates steady, long-term gains and a loyal mature social circle.",
            12: "Saturn in the twelfth house suggests disciplined spiritual seeking and foreign success.",
        },
        "hi": {
            1: "प्रथम भाव में शनि जीवन के प्रति परिपक्व दृष्टिकोण के साथ एक गंभीर, अनुशासित व्यक्तित्व को दर्शाता है।",
            2: "दूसरे भाव में शनि कड़ी मेहनत के माध्यम से सतर्क, धीमे धन-निर्माण का सुझाव देता है।",
            3: "तीसरे भाव में शनि कौशल और दीर्घकालिक प्रयासों में दृढ़ता पर जोर देता है।",
            4: "चौथे भाव में शनि एक संरचित घरेलू जीवन और विरासत के माध्यम से स्थिरता को दर्शाता है।",
            5: "पांचवें भाव में शनि अनुशासित रचनात्मकता और संतान के प्रति जिम्मेदारी पर प्रकाश डालता है।",
            6: "छठे भाव में शनि थकाऊ काम के लिए अनुशासन और प्रतिद्वंद्वियों पर जीत प्रदान करता है।",
            7: "सातवें भाव में शनि एक परिपक्व, स्थिर साथी लाता है और प्रतिबद्धता पर जोर देता है।",
            8: "आठवें भाव में शनि दीर्घायु और जटिल गुप्त विषयों में महारत का सुझाव देता है।",
            9: "नौवें भाव में शनि पारंपरिक आध्यात्मिकता और अनुशासित सीखने की ओर इशारा करता है।",
            10: "दसवें भाव में शनि कड़ी मेहनत और सहनशक्ति के माध्यम से प्राप्त स्थिति को दर्शाता है।",
            11: "ग्यारहवें भाव में शनि स्थिर, दीर्घकालिक लाभ और एक वफादार परिपक्व सामाजिक मंडली को दर्शाता है।",
            12: "बारहवें भाव में शनि अनुशासित आध्यात्मिक खोज और विदेशी सफलता का सुझाव देता है।",
        }
    },
    "Rahu": {
        "en": {
            1: "Rahu in the first house brings an unconventional, adventurous personality with a drive for achievement.",
            2: "Rahu in the second house suggests intense focus on wealth acquisition and family innovation.",
            3: "Rahu in the third house emphasizes revolutionary communication and courageous risk-taking.",
            4: "Rahu in the fourth house indicates a unique home environment and non-traditional emotional security.",
            5: "Rahu in the fifth house highlights innovative creativity and unconventional educational paths.",
            6: "Rahu in the sixth house provides an unconventional approach to defeating rivals.",
            7: "Rahu in the seventh house suggests an unconventional or foreign partner.",
            8: "Rahu in the eighth house suggests deep interest in mysteries and research.",
            9: "Rahu in the ninth house points toward foreign wisdom and non-traditional spirituality.",
            10: "Rahu in the tenth house indicates a drive for massive worldly status via innovative paths.",
            11: "Rahu in the eleventh house brings diverse social connections and unconventional desire fulfillment.",
            12: "Rahu in the twelfth house suggests vivid imagination and unique spiritual experiences.",
        },
        "hi": {
            1: "प्रथम भाव में राहु उपलब्धि के लिए एक अभियान के साथ एक अपरंपरागत, साहसी व्यक्तित्व लाता है।",
            2: "दूसरे भाव में राहु धन प्राप्ति और पारिवारिक नवाचार पर तीव्र ध्यान केंद्रित करने का सुझाव देता है।",
            3: "तीसरे भाव में राहु क्रांतिकारी संचार और साहसी जोखिम लेने पर जोर देता है।",
            4: "चौथे भाव में राहु एक अद्वितीय घरेलू वातावरण और गैर-पारंपरिक भावनात्मक सुरक्षा को दर्शाता है।",
            5: "पांचवें भाव में राहु नवीन रचनात्मकता और अपरंपरागत शैक्षिक मार्गों पर प्रकाश डालता है।",
            6: "छठे भाव में राहु प्रतिद्वंद्वियों को हराने के लिए एक अपरंपरागत दृष्टिकोण प्रदान करता है।",
            7: "सातवें भाव में राहु एक अपरंपरागत या विदेशी साथी का सुझाव देता है।",
            8: "आठवें भाव में राहु रहस्यों और अनुसंधान में गहरी रुचि का सुझाव देता है।",
            9: "नौवें भाव में राहु विदेशी ज्ञान और गैर-पारंपरिक आध्यात्मिकता की ओर इशारा करता है।",
            10: "दसवें भाव में राहु नवीन रास्तों के माध्यम से बड़े पैमाने पर सांसारिक स्थिति के लिए एक अभियान को दर्शाता है।",
            11: "ग्यारहवें भाव में राहु विविध सामाजिक संबंध और अपरंपरागत इच्छा पूर्ति लाता है।",
            12: "बारहवें भाव में राहु ज्वलंत कल्पना और अद्वितीय आध्यात्मिक अनुभवों का सुझाव देता है।",
        }
    },
    "Ketu": {
        "en": {
            1: "Ketu in the first house brings a detached, spiritual personality disconnected from ego.",
            2: "Ketu in the second house suggests a detached approach to wealth valuing spirituality.",
            3: "Ketu in the third house emphasizes intuitive communication and spiritual bond with siblings.",
            4: "Ketu in the fourth house indicates an internal search for emotional peace.",
            5: "Ketu in the fifth house highlights deep intuitive intelligence and spiritual creative insights.",
            6: "Ketu in the sixth house provides success over enemies through spiritual detachment.",
            7: "Ketu in the seventh house suggests a spiritually-leaning partner.",
            8: "Ketu in the eighth house suggests profound spiritual transformations and hidden truths.",
            9: "Ketu in the ninth house is high for spiritual liberation (moksha) and deep wisdom.",
            10: "Ketu in the tenth house indicates a subtle professional reputation without worldly attachment.",
            11: "Ketu in the eleventh house brings detachment from social ambitions through selfless altruism.",
            12: "Ketu in the twelfth house is classic for spiritual liberation and freedom from karmic bonds.",
        },
        "hi": {
            1: "प्रथम भाव में केतु अहंकार से अलग एक वैरागी, आध्यात्मिक व्यक्तित्व लाता है।",
            2: "दूसरे भाव में केतु आध्यात्मिकता को महत्व देने वाले धन के प्रति एक वैरागी दृष्टिकोण का सुझाव देता है।",
            3: "तीसरे भाव में केतु सहज संचार और भाई-बहनों के साथ आध्यात्मिक बंधन पर जोर देता है।",
            4: "चौथे भाव में केतु भावनात्मक शांति के लिए आंतरिक खोज को दर्शाता है।",
            5: "पांचवें भाव में केतु गहरी सहज बुद्धिमत्ता और आध्यात्मिक रचनात्मक अंतर्दृष्टि पर प्रकाश डालता है।",
            6: "छठे भाव में केतु आध्यात्मिक वैराग्य के माध्यम से शत्रुओं पर सफलता प्रदान करता है।",
            7: "सातवें भाव में केतु एक आध्यात्मिक झुकाव वाले साथी का सुझाव देता है।",
            8: "आठवें भाव में केतु गहन आध्यात्मिक परिवर्तनों और छिपे हुए सत्य का सुझाव देता है।",
            9: "नौवें भाव में केतु आध्यात्मिक मुक्ति (मोक्ष) और गहरे ज्ञान के लिए उच्च है।",
            10: "दसवें भाव में केतु सांसारिक मोह के बिना एक सूक्ष्म पेशेवर प्रतिष्ठा को दर्शाता है।",
            11: "ग्यारहवें भाव में केतु निस्वार्थ परोपकारिता के माध्यम से सामाजिक महत्वाकांक्षाओं से वैराग्य लाता है।",
            12: "बारहवें भाव में केतु आध्यात्मिक मुक्ति और कर्म बंधनों से मुक्ति के लिए क्लासिक है।",
        }
    },
}


def planet_interpretation(planet: str, house: int, lang: str = "en") -> str:
    """Backward-compatible simple one-liner interpretation."""
    planet_data = PLANET_HOUSE_TEXT.get(planet, {})
    if isinstance(planet_data, dict) and lang in planet_data:
        return planet_data.get(lang, {}).get(house, "")
    elif isinstance(planet_data, dict) and "en" in planet_data:
        return planet_data.get("en", {}).get(house, "")
    else:
        return planet_data.get(house, "")
