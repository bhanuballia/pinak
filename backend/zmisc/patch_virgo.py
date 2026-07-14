import json
import re

def main():
    with open(r'frontend\src\data\planetInSign.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    with open('prompt_virgo.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    houses = {}
    for i in range(1, 13):
        pattern = re.compile(rf"Moon in Virgo in {i}(st|nd|rd|th) [Hh]ouse\n(.*?)(?=Moon in Virgo in \d+(st|nd|rd|th) [Hh]ouse|Natal Moon Report|\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            houses[str(i)] = match.group(2).strip()
        else:
            print(f"Warning: Could not find house {i}")

    print(f"Extracted {len(houses)} houses for Virgo.")
    
    virgo_effect = "Moon in Virgo will make you brave enough to embrace the challenges and to turn them into new possibilities. More specifically, you must take the lead of your life and inspire others, through your growth and confidence. You will be filled with new ideas and will implement them in a positive way which will bring good luck in your business or profession.\\n\\nYou will value inner spirit, straightforward attitude and high will power. You will be emotional, over sensitive, unpredictable, submissive, and sentimental. You will have a strong desire to achieve a name, fame, and recognition."
    virgo_combust = "Combusted Moon will create delusion and you will feel insecure about your family, work, finance, and health. Your toxic mind will shake up all areas of your life. With such a position, your decision-making ability gets clouded. It is possible that your mother might abuse you verbally or physically which will create a lot of disturbance and friction in your mind."

    houses_str = json.dumps(houses, indent=8)
    houses_str = "houses: " + houses_str

    virgo_block_regex = re.compile(r"(Virgo:\s*\{\s*effect:\s*\")[^\"]*(\",\s*combustEffect:\s*\")(.*?)(\",\s*remedies:\s*\[\])", re.DOTALL)
    
    def replacer(match):
        prefix = "Virgo: {\n        effect: \""
        effect = virgo_effect
        middle = "\",\n        combustEffect: \""
        combust = virgo_combust
        suffix = "\",\n        " + houses_str.replace('\n', '\n        ') + ",\n        remedies: []"
        return prefix + effect + middle + combust + suffix
        
    new_js = virgo_block_regex.sub(replacer, js_content, count=1)
    
    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

if __name__ == "__main__":
    main()
