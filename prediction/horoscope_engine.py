# prediction/horoscope_engine.py
"""
Vedic Horoscope Prediction Engine.
Provides Daily, Monthly, and Yearly predictions based on Gochar (transits) 
relative to the Natal Moon (Chandra Rashi).
"""
from typing import Dict, Any, List
import datetime
from astronomy.julian import datetime_to_julian
from astronomy.positions import get_all_planetary_positions
from panchang.nakshatra import compute_nakshatra_from_lon

# Standard results for Moon transit from Natal Moon
DAILY_PREDICTIONS = {
    1: "A day of physical comfort, good food, and general happiness. You feel emotionally balanced and confident.",
    2: "Watch your expenses and speech today. There might be some minor financial fluctuations or family discussions.",
    3: "A productive day for communication, short travels, and courageous actions. Support from siblings or colleagues is likely.",
    4: "You may feel more domestic or sensitive today. Focus on home matters and avoid unnecessary stress.",
    5: "A good day for creativity, romance, and children. Your intellect is sharp, making it a great time for planning.",
    6: "Success over obstacles and health improvements. A good day to finish pending tasks or clear debts.",
    7: "Favorable for partnerships and social interactions. You may spend quality time with your spouse or business partner.",
    8: "Take care of your health and stay away from arguments. A day to be cautious and reflective.",
    9: "A day for spiritual growth or long-distance planning. You may feel more inclined towards higher learning or religion.",
    10: "Career growth and professional recognition are indicated. You feel successful and respected in your workspace.",
    11: "A day of gains and social networking. Financial rewards or meeting influential friends is possible.",
    12: "Higher expenses or a feeling of isolation. Good for meditation, charity, or working behind the scenes."
}

# Standard results for Sun transit from Natal Moon (Monthly)
MONTHLY_PREDICTIONS = {
    1: "A month of new beginnings and increased vitality. You may feel more authoritative and focused on self-improvement.",
    2: "Focus on financial security and family assets. It's a month to stabilize your resources.",
    3: "High energy for communication and short-distance travels. Success in professional ventures through courage.",
    4: "A month focused on home, property, and inner peace. You may deal with domestic responsibilities.",
    5: "Favorable for creative projects, social life, and romance. You feel more expressive and playful.",
    6: "A time to focus on health, routine, and service. You will be able to overcome challenges at work.",
    7: "Emphasis on relationships and public life. It's a month to balance your needs with those of others.",
    8: "A transformative month. You may deal with shared resources, insurance, or deep psychological shifts.",
    9: "Broaden your horizons through travel or education. Luck favors your ventures and spiritual pursuits.",
    10: "Peak month for career and social status. Opportunities for promotion or public recognition arise.",
    11: "Social gains and fulfillment of desires. Your networking leads to fruitful outcomes.",
    12: "A time for introspection and rest. Complete old projects and prepare for the next cycle."
}

# Yearly Predictions based on Jupiter transit from Natal Moon
YEARLY_JUPITER_PREDICTIONS = {
    1: "Jupiter transiting your natal Moon sign brings wisdom, expansion, and a general sense of well-being. A year of personal growth.",
    2: "Growth in wealth and family prosperity. Your speech is influential, and you may invest in valuable assets.",
    3: "Expansion in communication skills and social circle. Good year for writing, teaching, and short travels.",
    4: "Happiness at home and acquisition of property or vehicles. Inner peace and emotional stability improve.",
    5: "Excellent for children, education, and creative pursuits. Your counsel is sought by many.",
    6: "Health improvements and success in legal matters. You handle your responsibilities with grace.",
    7: "Blessings in marriage and business partnerships. Harmonious relationships lead to mutual success.",
    8: "Sudden gains or interest in occult sciences. A year of deep spiritual transformation.",
    9: "The most auspicious transit for luck, travel, and religious activities. Divine grace is felt in your life.",
    10: "Significant career advancement and professional honors. Your status in society rises.",
    11: "Multiple streams of income and fulfillment of long-cherished dreams. Great social success.",
    12: "Spiritual elevation and foreign travels. You may spend on charitable causes or spiritual retreats."
}

def get_prediction(natal_moon_lon: float, jd_now: float) -> Dict[str, Any]:
    current_pos = get_all_planetary_positions(jd_now)
    current_moon_lon = current_pos["Moon"]["sidereal"]["lon"]
    current_sun_lon = current_pos["Sun"]["sidereal"]["lon"]
    current_jup_lon = current_pos["Jupiter"]["sidereal"]["lon"]

    natal_moon_sign = int(natal_moon_lon / 30)
    current_moon_sign = int(current_moon_lon / 30)
    current_sun_sign = int(current_sun_lon / 30)
    current_jup_sign = int(current_jup_lon / 30)

    # Relative position (1-12)
    def rel_pos(current, natal):
        p = (current - natal) % 12
        return int(p + 1)

    moon_rel = rel_pos(current_moon_sign, natal_moon_sign)
    sun_rel = rel_pos(current_sun_sign, natal_moon_sign)
    jup_rel = rel_pos(current_jup_sign, natal_moon_sign)

    def get_daily_categories(pos: int) -> List[Dict[str, str]]:
        favorable = [1, 3, 6, 10, 11]
        average = [2, 5, 7, 9]
        if pos in favorable:
            return [
                {"name": "Business & professional Activity", "value": "Good day throughout for all kind of business deals. Good long-term positives."},
                {"name": "Love & relationships", "value": "Quite lovable. There will be buoyancy and positive thoughts, which could bring happiness."},
                {"name": "Money Matters", "value": "Good throughout the day. Gains will multiply on work commenced today."},
                {"name": "Dealing in stocks & shares", "value": "Quite a positive day. There could be gains both speculative & long term on investment made today. Please verify with your birth chart to confirm whether speculation suits your overall."},
                {"name": "Travel", "value": "Favourable day throughout."},
                {"name": "Purchase of new house/ car", "value": "Very favorable. There will be happiness with the acquisitions."},
                {"name": "Gambling", "value": "Favorable day. Confirm with your natal chart for overall gambling success possibilities."}
            ]
        elif pos in average:
            return [
                {"name": "Business & professional Activity", "value": "A steady day. Routine tasks will proceed without major hurdles."},
                {"name": "Love & relationships", "value": "Moderate interactions. Avoid bringing work stress into personal conversations."},
                {"name": "Money Matters", "value": "Stable finances. Avoid spontaneous big purchases today."},
                {"name": "Dealing in stocks & shares", "value": "Market actions require caution. Do not make impulsive investments."},
                {"name": "Travel", "value": "Normal travel yields expected results. Plan carefully."},
                {"name": "Purchase of new house/ car", "value": "A neutral day for making large acquisitions. You may proceed post careful review."},
                {"name": "Gambling", "value": "Not highly favored. Rely on calculated risks rather than pure luck."}
            ]
        else:
            return [
                {"name": "Business & professional Activity", "value": "Challenging day. Postpone crucial meetings if possible and focus on planning."},
                {"name": "Love & relationships", "value": "High chance of misunderstandings. Keep conversations clear and empathetic."},
                {"name": "Money Matters", "value": "Expenses may spike. Careful budgeting is required today."},
                {"name": "Dealing in stocks & shares", "value": "Not an ideal day for trading. Focus on holding and observing market trends."},
                {"name": "Travel", "value": "Possible delays or minor inconveniences. Double-check all itineraries."},
                {"name": "Purchase of new house/ car", "value": "Postpone major asset purchases. Wait for a more auspicious transit."},
                {"name": "Gambling", "value": "Strictly avoid speculative activities today. Risk of loss is elevated."}
            ]

    return {
        "daily": {
            "house": moon_rel,
            "prediction": DAILY_PREDICTIONS.get(moon_rel, "Neutral day."),
            "categories": get_daily_categories(moon_rel)
        },
        "monthly": {
            "house": sun_rel,
            "prediction": MONTHLY_PREDICTIONS.get(sun_rel, "Steady month.")
        },
        "yearly": {
            "house": jup_rel,
            "prediction": YEARLY_JUPITER_PREDICTIONS.get(jup_rel, "Prosperous year.")
        },
        "current_transits": {
            "Moon": current_moon_sign,
            "Sun": current_sun_sign,
            "Jupiter": current_jup_sign
        }
    }
