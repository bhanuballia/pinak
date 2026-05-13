import os
import re
import json

KETU_JS = r'd:\vedic-astrology-app - 2\frontend\src\data\planets\ketu.js'

taurus_data = {
    "effect": "Taurus is ruled by Venus and it shares an average relationship with Ketu. Here, Ketu is in an earth sign and in mythology; it is represented as the Dragon’s tail. Such people want to walk freely and seek movement, but that does not mean that they fly in the air because Taurus is an earthy sign and this element keeps them grounded. Due to the impulse given by Ketu, such people are always pulled between need for movement and the need for stability. Ketu in Taurus also gives a pensive mood to the person. Such people like to talk a lot and are sometimes quite insincere. These people face hurdles in acquiring luxuries and material comforts they want. Ketu in Taurus also creates hurdles in love life. Such people also face issues within their family. They often move towards wrong directions in life that require immoral actions. While they tend to be quite loving, caring and compassionate, they struggle to get the same level of love and compassion in return. Ketu in Taurus also makes the native lethargic. Such people have a tendency to procrastinate. These natives can also be quite stubborn as a bull at times. Ego also strongly marks their character, adding to challenges in maintaining relationships.",
    "houses": {}
}

with open(KETU_JS, 'r', encoding='utf-8') as f:
    content = f.read()

signs_match = re.search(r'signs:\s*\{', content)
if signs_match:
    insertion_point = signs_match.end()
    taurus_json = "\n    Taurus: " + json.dumps(taurus_data, indent=8) + ","
    new_content = content[:insertion_point] + taurus_json + content[insertion_point:]
    
    with open(KETU_JS, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Added Ketu in Taurus to ketu.js")
else:
    print("Could not find signs object in ketu.js")
