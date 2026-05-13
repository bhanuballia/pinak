import json
import re

def main():
    with open(r'frontend\src\data\planetInSign.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    with open('prompt_libra.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    houses = {}
    for i in range(1, 13):
        pattern = re.compile(rf"Moon in Libra in {i}(st|nd|rd|th) House\n(.*?)(?=Moon in Libra in \d+(st|nd|rd|th) House|Natal Moon Report|\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            houses[str(i)] = match.group(2).strip()
        else:
            print(f"Warning: Could not find house {i}")

    print(f"Extracted {len(houses)} houses for Libra.")
    
    libra_effect = "This placement shows a perfect balance of three Gunas – Satav, Rajas and Tamas and five elements – Fire, Water, Earth, Air and Space. They have introverted personalities and like to be in the company of their close friends because that is how they charge their exhausted battery.\\n\\nThey have their own strong and irrefutable arguments in favor of what they feel or say. Their intelligence brings out so many alternatives, real and unreal, that they constantly strive to select the best available option. Venus is the lord of Libra. Venus is the planet of love, relationships, money and comforts. They are charming and have a sense of justice. They have a very attractive look."

    houses_str = json.dumps(houses, indent=8)
    houses_str = "houses: " + houses_str

    libra_block_regex = re.compile(r"(Libra:\s*\{\s*effect:\s*\")[^\"]*(\",\s*remedies:\s*\[\])", re.DOTALL)
    
    def replacer(match):
        prefix = "Libra: {\n        effect: \""
        effect = libra_effect
        suffix = "\",\n        " + houses_str.replace('\n', '\n        ') + ",\n        remedies: []"
        return prefix + effect + suffix
        
    new_js = libra_block_regex.sub(replacer, js_content, count=1)
    
    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

if __name__ == "__main__":
    main()
