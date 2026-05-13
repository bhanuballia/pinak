import os
import re
import json

VENUS_JS = r'd:\vedic-astrology-app - 2\frontend\src\data\planets\venus.js'

virgo_data = {
    "effect": "Venus is debilitated in Virgo, but this position of Venus is still average because Mercury, the lord of Virgo and Venus are friends towards each other. Venus in Virgo nonetheless does affect one’s marital life negatively since Venus is associated with partner and marriage and here it is in debilitated position. Overall, Venus in Virgo gives a cautious and careful personality. There is an undying desire for love and attention of the opposite sex. Mercury is mind and when Venus is associated, the native’s mind is always occupied by thoughts of love and sensuality. These people struggle to enjoy a sense of fulfillment and satisfaction in their love and married life.\n\nNonetheless, they are devoted in love. Their idea of love is commitment. These natives are capable of complete romantic involvement. They tend to be good lovers. As a person, the native is polite, mannered, attractive and neat in appearance. Venus in Virgo also gives a strong love for luxuries. Such a person desires to dress well and maintain a luxurious lifestyle. They have a strong penchant for material comforts such as vehicles, property and so on. They get attracted towards beauty and often times; they are professionally associated with beauty industry as well. They are also well versed in creative fields such as fine arts, music etc.",
    "retrogradeEffect": "",
    "combustEffect": "",
    "houses": {
        "1": "", "2": "", "3": "", "4": "", "5": "", "6": "",
        "7": "", "8": "", "9": "", "10": "", "11": "", "12": ""
    },
    "remedies": []
}

with open(VENUS_JS, 'r', encoding='utf-8') as f:
    content = f.read()

signs_match = re.search(r'signs:\s*\{', content)
if signs_match:
    insertion_point = signs_match.end()
    virgo_json = "      Virgo: " + json.dumps(virgo_data, indent=8) + ","
    new_content = content[:insertion_point] + "\n" + virgo_json + content[insertion_point:]
    
    with open(VENUS_JS, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Added Venus in Virgo to venus.js")
else:
    print("Could not find signs object in venus.js")
