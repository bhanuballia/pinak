import json
import re

def main():
    with open(r'frontend\src\data\planetInSign.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    with open('prompt_gemini.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    houses = {}
    for i in range(1, 13):
        # note that the user has "Moon in Gemini in 11th house" (lowercase h) and "1st House"
        pattern = re.compile(rf"Moon in Gemini in {i}(st|nd|rd|th) [Hh]ouse\n(.*?)(?=Moon in Gemini in \d+(st|nd|rd|th) [Hh]ouse|Natal Moon Report|\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            houses[str(i)] = match.group(2).strip()
        else:
            print(f"Warning: Could not find house {i}")

    print(f"Extracted {len(houses)} houses for Gemini.")
    
    gemini_effect = "When Moon is in Gemini, it is important for your physical, psychological, and overall well-being. It reflects your personality, identity, and how you appear to others. Your emotional needs are tied to how you express yourself and your identity, making you sensitive to how others see you. This can lead to a desire to present yourself as communicative and flexible to the people around and world.\\n\\nYou are flexible and adaptable and have the ability to adjust easily to different situations and people. You likely have interest in various things and enjoy exploring various topics. Your intelligence allows you to express your feelings through your great communication, although you may analyze your emotions intellectually before sharing them with others. Your strong expression, coupled with wit and humor, helps you cope with and express your emotions effectively.\\n\\nYou might find that you have a restless mind and a strong curiosity for knowledge and new experiences. However, there are times when you may lack emotional depth and prefer to keep situations or relationships at a superficial level. Your emotional ups and downs are often influenced by external factors and this can make it difficult for you to maintain emotional stability, and you may seek change to feel emotionally fulfilled."

    houses_str = json.dumps(houses, indent=8)
    houses_str = "houses: " + houses_str

    # We need to replace the `effect` property and inject `houses` into Gemini
    gemini_block_regex = re.compile(r"(Gemini:\s*\{\s*effect:\s*\")[^\"]*(\",\s*combustEffect:\s*\")(.*?)(\",\s*remedies:\s*\[\])", re.DOTALL)
    
    def replacer(match):
        prefix = "Gemini: {\n        effect: \""
        effect = gemini_effect
        middle = "\",\n        combustEffect: \""
        combust = match.group(3)
        suffix = "\",\n        " + houses_str.replace('\n', '\n        ') + ",\n        remedies: []"
        return prefix + effect + middle + combust + suffix
        
    new_js = gemini_block_regex.sub(replacer, js_content, count=1)
    
    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

if __name__ == "__main__":
    main()
