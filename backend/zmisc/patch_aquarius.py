import json
import re

def main():
    with open(r'frontend\src\data\planetInSign.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    with open('prompt_aquarius.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    houses = {}
    for i in range(1, 13):
        pattern = re.compile(rf"Moon in Aquarius in {i}(st|nd|rd|th) House\n(.*?)(?=Moon in Aquarius in \d+(st|nd|rd|th) House|Natal Moon Report|\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            houses[str(i)] = match.group(2).strip()
        else:
            print(f"Warning: Could not find house {i}")

    print(f"Extracted {len(houses)} houses for Aquarius.")
    
    aqua_effect = "Moon in Aquarius indicates a strong desire for personal freedom, individuality, and an unconventional approach to expressing emotions. You value your independence and may have a unique style that stands out in a crowd. You are inclined toward progressive trends and compassionate humanitarian work. While you value personal space in relationships, finding a balance between independence and emotional intimacy is key to your contentment."
    aqua_combust = "When Moon is combusted in Aquarius it may affect your emotional clarity, stability and intuition and the individual may struggle in expressing his/her emotions and may feel weighed down by your ego or willpower. The combustion of Moon in Aquarius brings restrictions in the formation of innovative ideas where you may face challenges in expressing your feelings to others and finding emotional fulfilment.\\n\\nMoon represents your emotions and instincts so when Moon is combusted in Aquarius it could lead to fluctuations in emotional stability due to heightened sensitivity and inability to work under the supervision of other’s instruction as it brings the feeling of confinement. You might struggle with mood swings and there will be lack of emotional stability."

    houses_str = json.dumps(houses, indent=8)
    houses_str = "houses: " + houses_str

    aqua_block_regex = re.compile(r"(Aquarius:\s*\{\s*effect:\s*\")[^\"]*(\",\s*combustEffect:\s*\")(.*?)(\",\s*remedies:\s*\[\])", re.DOTALL)
    
    def replacer(match):
        prefix = "Aquarius: {\n        effect: \""
        effect = aqua_effect
        middle = "\",\n        combustEffect: \""
        combust = aqua_combust
        suffix = "\",\n        " + houses_str.replace('\n', '\n        ') + ",\n        remedies: []"
        return prefix + effect + middle + combust + suffix
        
    new_js = aqua_block_regex.sub(replacer, js_content, count=1)
    
    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

if __name__ == "__main__":
    main()
