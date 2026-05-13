import os
import re
import json

KETU_JS = r'd:\vedic-astrology-app - 2\frontend\src\data\planets\ketu.js'

virgo_data = {
    "effect": "Ketu in Virgo brings a blend of practicality and spiritual detachment. You may face a lack of satisfaction and clashes of opinion which will force you to make corrections in behaviour. You take important decisions that can be painful but help to make things easy and clear for the coming days. You may experience emotional frustration and loneliness with lack of support in relationships at times, creating hurdles in your love life.",
    "houses": {
        "1": "Lack of satisfaction and clashes of opinion may occur which will force you to make corrections in behaviour. You take important decisions that can be painful but help to make things easy and clear for the coming days. Emotional frustration and loneliness with lack of support in a relationship will manifest during certain periods, creating hurdles and difficulty in relationships along with a lack of substance in your love life.",
        "2": "Nourishment will be required for self-motivation. You require space in a relationship so that energy will flow without any challenges, which will elevate the attraction towards your partner. You will feel more connected to people who make you comfortable. This combination promotes a harmonious balance between love and desire, influencing your life experiences.",
        "3": "It will enhance your love and romantic life, bringing creativity and exploration of new sensual experiences. You have a desire to feel externally validated by others. You will feel joy in yourself and engage in activities that truly bring you joy. You will be smart enough to deal with all kinds of twisted situations, maintaining a balance in both professional and personal life. You may enjoy exploring trips with colleagues and family.",
        "4": "The position of Ketu will make you take prompt financial decisions; it is advised not to be involved in any investments. Maintain a balance in your personal and professional life. Constrain expenses, consider savings, and avoid aggression in decision making. Take care of your mental health by avoiding unnecessary stress. Ketu will create disagreements with your spouse which might create misunderstandings and anger issues. You might face hindrances that increase mental stress.",
        "5": "You will have a magnetism that increases your attractiveness and charm. It opens doors for potential romantic encounters. It will rekindle the flame of passion and intensify the physical aspect of relationships. However, it can also stir up conflicts and power struggles if energies are not channeled constructively. You will be inclined towards spirituality and initiated with powerful mantras. Love life may take a twist as you may struggle with commitment.",
        "6": "You will thoroughly enjoy each other’s company and relish intimacy. You will be inclined towards doing more work and spending extra time at your workplace. You will have to work harder than others to achieve your targets. You will be quite clear when making professional decisions. Your intellect may help you build a good reputation. However, this position may aggravate pent-up emotions, potentially requiring a break in relationships.",
        "7": "You can experience growth and receive appreciation from colleagues. You will be blessed with a sense of responsibility and commitment, giving you a positive attitude, patience, and perseverance. You will achieve success in your professional path by overcoming internal challenges. You will have a compatible relationship. If afflicted, avoid aggression and anger; expect delays in returns from investments and competition in your career.",
        "8": "You will love boldly and share your feelings without fear. You will get innovative ideas to express love which will be appreciated by your partner. Your partner will understand your love. If afflicted, there might be disagreements, ego clashes, and disharmony. Avoid major career moves; Ketu’s position will activate hidden enemies in professional arenas. Do not take aggressive decisions.",
        "9": "You will be creative in finances and make your money work for you. Hard work and determination will expand family business to earn foreign currencies and collaborations. Be cautious of conspiracies; handle documentation carefully for financial investments. Ketu’s position will affect relationships, causing anxiety and disagreements. Keep up patience. Your energy level might get drained due to excessive stress, potentially causing health issues.",
        "10": "At times, you might not get enough time for your partner, creating disharmony in your relationship. Business travel might lead to a long-distance relationship, but you both will lead through the storm with togetherness. Planning and balancing your life will give relief. New creative ideas will open opportunities. Professionally, you may face agony and enviousness in your workplace.",
        "11": "The position of Ketu will give good opportunities in your workplace, but you must work hard to utilize them. Delegate work to manage hectic workloads. You will have many innovative ideas to take your career to the next level through socializing. If afflicted, you may face financial loss, misunderstandings in relationships, and may also indulge in illegal activities.",
        "12": "In every challenging scenario, the placement of Ketu will push you back into financial loss and high expense. The more work you put in, the better the outcomes. Your love life will demand high commitment, even though you could occasionally feel alone; you might crave solitude. Your bonding might take a turn, creating discomfort. Deal with situations calmly. You will get the opportunity to enhance your spirituality."
    }
}

with open(KETU_JS, 'r', encoding='utf-8') as f:
    content = f.read()

signs_match = re.search(r'signs:\s*\{', content)
if signs_match:
    insertion_point = signs_match.end()
    virgo_json = "\n    Virgo: " + json.dumps(virgo_data, indent=8) + ","
    new_content = content[:insertion_point] + virgo_json + content[insertion_point:]
    
    with open(KETU_JS, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Added Ketu in Virgo to ketu.js")
else:
    print("Could not find signs object in ketu.js")
