import json
import re

def main():
    with open(r'frontend\src\data\planetInSign.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    with open('prompt_pisces.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    houses = {}
    for i in range(1, 13):
        pattern = re.compile(rf"Moon in Pisces in {i}(st|nd|rd|th) [Hh]ouse\n(.*?)(?=Moon in Pisces in \d+(st|nd|rd|th) [Hh]ouse|Natal Moon Report|\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            houses[str(i)] = match.group(2).strip()
        else:
            print(f"Warning: Could not find house {i}")

    print(f"Extracted {len(houses)} houses for Pisces.")
    
    pisces_effect = "Moon in Pisces has its own sets of challenges despite much positivity. Your strong sensitivity can make your emotions overpower your psyche, making you tense and leading you to either leave issues unresolved or move away from problems. Your compassionate nature can drain you emotionally, making it essential to set boundaries to protect your mental energy. Your strong inclination toward the mystic and vivid imagination may make you hesitant to face the reality of life, necessitating a balance between practical responsibilities and healing practices like meditation."
    pisces_combust = "When Moon is combusted in Pisces it means that Moon is in the same sign as the Sun, or it is too close to the Sun in degrees in your horoscope. When Moon is combusted, it is said that it loses some of its power and individuality due to the overwhelming influence of Sun on the qualities of the combust planet.\\n\\nWhen Moon is combusted in Pisces it may affect your emotional clarity, stability, intuition and you may feel weighed down by your own need for friendship from others without giving up your freedom. It can weaken the emotional and nurturing qualities associated with Moon as you may have challenges in expressing your feelings to others and finding emotional fulfilment.\\n\\nMoon represents your emotions so when Moon is combusted in Pisces it can lead to ups and downs in your emotional stability due to your heightened sensitivity. You may have mood swings and you will not be able to take care of yourself and others emotionally."

    houses_str = json.dumps(houses, indent=8)
    houses_str = "houses: " + houses_str

    pisces_block_regex = re.compile(r"(Pisces:\s*\{\s*effect:\s*\")[^\"]*(\",\s*combustEffect:\s*\")(.*?)(\",\s*remedies:\s*\[\])", re.DOTALL)
    
    def replacer(match):
        prefix = "Pisces: {\n        effect: \""
        effect = pisces_effect
        middle = "\",\n        combustEffect: \""
        combust = pisces_combust
        suffix = "\",\n        " + houses_str.replace('\n', '\n        ') + ",\n        remedies: []"
        return prefix + effect + middle + combust + suffix
        
    new_js = pisces_block_regex.sub(replacer, js_content, count=1)
    
    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

if __name__ == "__main__":
    main()
