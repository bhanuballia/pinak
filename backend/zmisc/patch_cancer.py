import json
import re

def main():
    with open(r'frontend\src\data\planetInSign.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    with open('prompt_cancer.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    houses = {}
    for i in range(1, 13):
        pattern = re.compile(rf"Moon in Cancer in {i}(st|nd|rd|th) House\n(.*?)(?=Moon in Cancer in \d+(st|nd|rd|th) House|Natal Moon Report|\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            houses[str(i)] = match.group(2).strip()
        else:
            print(f"Warning: Could not find house {i}")

    print(f"Extracted {len(houses)} houses for Cancer.")
    
    cancer_effect = "Moon in Cancer in the first house indicates your emotional instincts that are influenced by the energy of Cancer and are strongly visible in your nature and personality. Moon represents our emotional needs and how we nurture our emotions whereas Cancer is a nurturing sign that is associated with home, family, and our collective emotions.\\n\\nYou may have a strong craving for emotional belonging and security which creates a desire to foster a warm and comfortable home environment. Your emotions strongly reflect in your personality which makes you highly intuitive and sensitive as you are more receptive towards the needs of others. You love to nurture relationships with your loved ones by taking care of them with your unconditional love and attention.\\n\\nHowever, you tend to retreat into your shell when you feel emotionally threatened /vulnerable which makes you appear reserved. Otherwise, you have a highly warm and protective nature in your relationships. Your emotions have a strong influence on your emotional stability in order to feel balanced and grounded in situations /relationships."

    houses_str = json.dumps(houses, indent=8)
    houses_str = "houses: " + houses_str

    # We need to replace the `effect` property and inject `houses` into Cancer
    cancer_block_regex = re.compile(r"(Cancer:\s*\{\s*effect:\s*\")[^\"]*(\",\s*combustEffect:\s*\")(.*?)(\",\s*remedies:\s*\[\])", re.DOTALL)
    
    def replacer(match):
        prefix = "Cancer: {\n        effect: \""
        effect = cancer_effect
        middle = "\",\n        combustEffect: \""
        combust = "When Moon is combusted in Cancer it means that Moon is in the same sign as the Sun, or it is too close to the Sun in degrees in your horoscope. When Moon is combusted, it is said that it loses some of its power and individuality due to the overwhelming influence of Sun on the qualities of the combust planet.\\n\\nWhen Moon is combusted in Cancer it may affect your emotional clarity and stability. You may feel weighed down by your ego or willpower and face an inability to share your fear and emotional disturbances with your loved ones and retreat into your shell when challenged emotionally. It can weaken the emotional and nurturing qualities associated with Moon and thereby create strong challenges in expressing your feelings to others and finding emotional fulfilment.\\n\\nMoon represents your emotions and instincts, so when Moon is combusted in Cancer it can lead to fluctuations in emotional stability due to heightened sensitivity and emotional instability. You might struggle with mood swings and an inability to nurture yourself and others emotionally."
        suffix = "\",\n        " + houses_str.replace('\n', '\n        ') + ",\n        remedies: []"
        return prefix + effect + middle + combust + suffix
        
    new_js = cancer_block_regex.sub(replacer, js_content, count=1)
    
    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

if __name__ == "__main__":
    main()
