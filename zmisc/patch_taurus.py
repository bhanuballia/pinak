import json
import re

def main():
    with open(r'frontend\src\data\planetInSign.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    with open('prompt_taurus.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    houses = {}
    for i in range(1, 13):
        pattern = re.compile(rf"Moon in Taurus in {i}(st|nd|rd|th) House\n(.*?)(?=Moon in Taurus in \d+(st|nd|rd|th) House|Natal Moon Report|\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            houses[str(i)] = match.group(2).strip()

    print(f"Extracted {len(houses)} houses for Taurus.")
    
    taurus_effect = "Moon in Taurus here signifies your emotional nature, making you seek emotion security through stability in relationships and materialistic comforts. Your steady approach in life along with a grounded and practical nature allows you to navigate through any challenge with flexibility and strength.\\n\\nYou look for emotional security through gaining materialistic assets and stability in your relationships. This also creates a strong attraction for good food, luxurious surroundings, and stable relationships.\\n\\nYour emotions are often expressed in a steady and serene manner since you have a natural ability to remain calm and composed even in challenging situations. Others may perceive you as a strong, reliable, and dependable support system in the hour of urgency."

    houses_str = json.dumps(houses, indent=8)
    houses_str = "houses: " + houses_str

    # We need to replace the `effect` property and inject `houses` into Taurus
    taurus_block_regex = re.compile(r"(Taurus:\s*\{\s*effect:\s*\")[^\"]*(\",\s*combustEffect:\s*\")(.*?)(\",\s*remedies:\s*\[\])", re.DOTALL)
    
    def replacer(match):
        prefix = "Taurus: {\n        effect: \""
        effect = taurus_effect
        middle = "\",\n        combustEffect: \""
        combust = match.group(3)
        suffix = "\",\n        " + houses_str.replace('\n', '\n        ') + ",\n        remedies: []"
        return prefix + effect + middle + combust + suffix
        
    new_js = taurus_block_regex.sub(replacer, js_content, count=1)
    
    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

if __name__ == "__main__":
    main()
