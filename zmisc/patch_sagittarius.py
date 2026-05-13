import json
import re

def main():
    with open(r'frontend\src\data\planetInSign.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    with open('prompt_sagittarius.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    houses = {}
    for i in range(1, 13):
        pattern = re.compile(rf"Moon in Sagittarius in {i}(st|nd|rd|th) [Hh]ouse\n(.*?)(?=Moon in Sagittarius in \d+(st|nd|rd|th) [Hh]ouse|Natal Moon Report|\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            houses[str(i)] = match.group(2).strip()
        else:
            print(f"Warning: Could not find house {i}")

    print(f"Extracted {len(houses)} houses for Sagittarius.")
    
    sag_effect = "Moon in Sagittarius blesses you with an abundance of physical strength, robust health, and a strong, optimistic, and outgoing personality. You possess traits like ambition and loyalty in abundance, making you capable of connecting with others and forming meaningful relationships. You have the potential of earning wealth through your efforts and bringing stability in your relationships, though your desire for harmony can sometimes manifest as possessiveness. Your nurturing personality is devoted to fulfilling others' needs, creating deep familial and personal bonds."
    sag_combust = "When Moon is combusted in Sagittarius it may affect your emotional clarity, stability and intuition and you may have to struggle in expressing your emotions. You may feel weighed down by your own need for companionship without giving up your freedom, creating strong challenges for you in maintaining harmony in personal relationships. It can weaken the emotional and nurturing qualities associated with Moon which can create strong challenges in expressing your feelings to others and finding emotional fulfilment.\\n\\nMoon represents your emotions and instincts so when Moon is combusted in Sagittarius it could lead to fluctuations in emotional stability due to heightened sensitivity and adventurous nature. You might struggle with mood swings and the inability to nurture yourself and others emotionally."

    houses_str = json.dumps(houses, indent=8)
    houses_str = "houses: " + houses_str

    sag_block_regex = re.compile(r"(Sagittarius:\s*\{\s*effect:\s*\")[^\"]*(\",\s*combustEffect:\s*\")(.*?)(\",\s*remedies:\s*\[\])", re.DOTALL)
    
    def replacer(match):
        prefix = "Sagittarius: {\n        effect: \""
        effect = sag_effect
        middle = "\",\n        combustEffect: \""
        combust = sag_combust
        suffix = "\",\n        " + houses_str.replace('\n', '\n        ') + ",\n        remedies: []"
        return prefix + effect + middle + combust + suffix
        
    new_js = sag_block_regex.sub(replacer, js_content, count=1)
    
    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

if __name__ == "__main__":
    main()
