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

def generate_monthly_dict(house: int) -> dict:
    templates = {
        1: {
            "overall": "A month focused on self, health, and personal identity. The Sun in your first house relative to the Moon often brings a degree of fatigue or restlessness, but challenges you to stand firm.",
            "opportunities": "Building self-reliance, focusing on personal health routines, and discovering inner strength.",
            "cautioned": "Avoid overexertion, aggressive arguments, or impulsive decisions regarding your self-image.",
            "career": {"prediction": "You may feel increased pressure or resistance from authority figures.", "dos": "Maintain a low profile and focus on consistent work.", "donts": "Do not confront bosses or rush career moves."},
            "money": {"prediction": "Expenses may rise due to personal needs or health.", "dos": "Stick to your budget strictly.", "donts": "Avoid unnecessary luxury spending."},
            "love": {"prediction": "Ego clashes might occur if you're not careful.", "best_time": "Late evenings for calm discussions.", "challenging_time": "Mid-day when stress is highest."},
            "family": {"prediction": "You might feel detached or desire more independence.", "dos": "Give your loved ones space.", "donts": "Don't force your opinions on family members."},
            "health": {"prediction": "Prone to fatigue, headaches, or eye strain.", "dos": "Stay hydrated and get plenty of rest.", "donts": "Don't skip meals or sacrifice sleep."}
        },
        2: {
            "overall": "The focus shifts to finances, family, and speech. The Sun in the second house warns against financial negligence and harsh words.",
            "opportunities": "Reorganizing your assets and having important, clear family discussions.",
            "cautioned": "Be extremely cautious with your words; harsh speech can ruin important relationships this month.",
            "career": {"prediction": "Financial negotiations at work may be delayed or require extra tact.", "dos": "Double-check financial reports.", "donts": "Do not ask for a raise aggressively."},
            "money": {"prediction": "Unexpected expenses or slight loss of wealth if not careful.", "dos": "Save aggressively.", "donts": "Avoid risky investments or lending money."},
            "love": {"prediction": "Words can heal or hurt; communication is key.", "best_time": "Weekends for quality time.", "challenging_time": "When discussing shared finances."},
            "family": {"prediction": "Minor disputes over money or values are possible.", "dos": "Be the peacemaker.", "donts": "Avoid dragging past issues into present arguments."},
            "health": {"prediction": "Throat, mouth, or eye issues may arise.", "dos": "Eat healthy, non-spicy foods.", "donts": "Do not strain your voice."}
        },
        3: {
            "overall": "An excellent month! The Sun in the third house brings courage, victory over obstacles, and success in your endeavors.",
            "opportunities": "Taking initiative, short travels, and defeating competition.",
            "cautioned": "Overconfidence could lead to taking on too many tasks at once.",
            "career": {"prediction": "Great success, promotions, and favorable outcomes in negotiations.", "dos": "Pitch new ideas and lead projects.", "donts": "Do not ignore team inputs."},
            "money": {"prediction": "Financial gains and increased stability.", "dos": "Invest in skill-building.", "donts": "Avoid idle speculation."},
            "love": {"prediction": "A lively and communicative period in romance.", "best_time": "During short trips or outings.", "challenging_time": "When you act too independently."},
            "family": {"prediction": "Good relations with siblings and a supportive home environment.", "dos": "Plan a short family trip.", "donts": "Don't ignore younger siblings' needs."},
            "health": {"prediction": "High vitality and robust health.", "dos": "Engage in physical activities.", "donts": "Don't ignore minor physical injuries."}
        },
        4: {
            "overall": "A month where domestic matters take precedence. The Sun in the fourth house can cause a lack of peace of mind and issues related to property or vehicles.",
            "opportunities": "Renovating the home, addressing emotional foundations, and spending time indoors.",
            "cautioned": "Avoid disputes with your mother or matters concerning ancestral property.",
            "career": {"prediction": "Work may feel restrictive or you may face obstacles from peers.", "dos": "Focus on administrative or background tasks.", "donts": "Do not seek the spotlight right now."},
            "money": {"prediction": "Expenses related to home maintenance or vehicles.", "dos": "Set aside an emergency home fund.", "donts": "Avoid buying new vehicles this month."},
            "love": {"prediction": "You may feel emotionally needy or disconnected.", "best_time": "Cozy evenings at home.", "challenging_time": "When dealing with household chores."},
            "family": {"prediction": "Domestic harmony requires effort and patience.", "dos": "Spend time with parents, especially mother.", "donts": "Don't bring work stress home."},
            "health": {"prediction": "Possible chest congestion or stress-related issues.", "dos": "Practice breathing exercises.", "donts": "Avoid extremely cold or rich foods."}
        },
        5: {
            "overall": "Focus shifts to intellect, children, and investments. The Sun in the fifth house can cause mental anxiety and concerns regarding offspring or creative projects.",
            "opportunities": "Re-evaluating investments and focusing on long-term educational goals.",
            "cautioned": "Avoid speculative investments and impulsive romantic decisions.",
            "career": {"prediction": "Your ideas may be challenged, leading to mental stress.", "dos": "Rely on logic rather than ego.", "donts": "Don't argue with superiors over creative differences."},
            "money": {"prediction": "Speculative losses are possible.", "dos": "Stick to safe, traditional investments.", "donts": "No gambling or high-risk trading."},
            "love": {"prediction": "Ego conflicts in romance.", "best_time": "When engaged in a shared hobby.", "challenging_time": "When trying to prove who is right."},
            "family": {"prediction": "Concerns regarding children's health or education.", "dos": "Be a supportive guide to your children.", "donts": "Don't be overly critical of their mistakes."},
            "health": {"prediction": "Stomach or digestive issues.", "dos": "Eat a balanced, light diet.", "donts": "Avoid eating out frequently."}
        },
        6: {
            "overall": "A highly favorable month. The Sun in the sixth house destroys enemies, cures diseases, and brings success and financial gains.",
            "opportunities": "Clearing debts, winning legal battles, and improving daily routines.",
            "cautioned": "Avoid becoming overly critical or arrogant in your success.",
            "career": {"prediction": "Victory over competitors and recognition for hard work.", "dos": "Tackle your most difficult tasks now.", "donts": "Don't underestimate your opponents."},
            "money": {"prediction": "Good flow of income and ability to repay debts.", "dos": "Pay off high-interest loans.", "donts": "Don't take on new debt just because you feel secure."},
            "love": {"prediction": "Practical support strengthens your relationship.", "best_time": "When solving problems together.", "challenging_time": "If you act like a manager rather than a partner."},
            "family": {"prediction": "Peaceful atmosphere as old disputes are resolved.", "dos": "Help family members with their chores.", "donts": "Don't be demanding."},
            "health": {"prediction": "Recovery from past ailments and strong immunity.", "dos": "Start a new fitness regime.", "donts": "Don't abandon healthy habits."}
        },
        7: {
            "overall": "The focus is on partnerships and public interactions. The Sun in the seventh house can cause friction in marriage and exhaustion from travel.",
            "opportunities": "Learning to compromise and finding balance in relationships.",
            "cautioned": "Avoid ego battles with your spouse or business partners.",
            "career": {"prediction": "Business partnerships may face stress. Travel may be unrewarding.", "dos": "Review contracts carefully.", "donts": "Don't start a new joint venture now."},
            "money": {"prediction": "Financial fluctuations due to partner's expenses or travel costs.", "dos": "Keep a check on joint accounts.", "donts": "Don't make unilateral financial decisions."},
            "love": {"prediction": "High potential for arguments with your partner.", "best_time": "When you practice active listening.", "challenging_time": "When discussing future commitments."},
            "family": {"prediction": "Spousal relations affect the overall domestic peace.", "dos": "Show appreciation for your spouse.", "donts": "Don't let your ego win over love."},
            "health": {"prediction": "Fatigue, stomach issues, or urinary tract concerns.", "dos": "Drink plenty of water and rest.", "donts": "Avoid exhausting travels."}
        },
        8: {
            "overall": "A challenging month requiring caution. The Sun in the eighth house can bring unexpected obstacles, health issues, and hidden anxieties.",
            "opportunities": "Deep psychological reflection, research, and transformative inner work.",
            "cautioned": "Avoid all risky activities, illegal ventures, or unethical practices.",
            "career": {"prediction": "Sudden changes or hidden politics at the workplace.", "dos": "Keep your plans secret until finalized.", "donts": "Don't trust coworkers blindly."},
            "money": {"prediction": "Delays in receiving funds or unexpected taxes/fines.", "dos": "Ensure all your taxes and papers are in order.", "donts": "Avoid signing major financial documents."},
            "love": {"prediction": "Intense emotions and possible trust issues.", "best_time": "During deep, honest conversations.", "challenging_time": "When secrets or past issues resurface."},
            "family": {"prediction": "Possible concerns regarding the health of an elder.", "dos": "Be supportive and present.", "donts": "Avoid discussing inheritances or wills now."},
            "health": {"prediction": "Vulnerability to sudden illness or minor accidents.", "dos": "Drive carefully and stay alert.", "donts": "Ignore any recurring symptoms."}
        },
        9: {
            "overall": "A focus on spirituality, higher learning, and father figures. The Sun in the ninth house can cause ideological clashes or concerns for elders.",
            "opportunities": "Engaging in religious activities, higher education, or long travels.",
            "cautioned": "Avoid false gurus, unethical shortcuts, or arguing with mentors.",
            "career": {"prediction": "Progress may feel stalled; a good time for skill upgrading.", "dos": "Seek advice from mentors.", "donts": "Don't challenge your boss's ethics without proof."},
            "money": {"prediction": "Moderate finances; expenses on travel or education.", "dos": "Invest in learning.", "donts": "Avoid relying on luck alone."},
            "love": {"prediction": "Seeking deeper meaning and shared values in love.", "best_time": "While attending a class or spiritual event together.", "challenging_time": "When debating philosophy or religion."},
            "family": {"prediction": "Differences of opinion with father or elders.", "dos": "Respect their perspective.", "donts": "Don't force modern views on traditional members."},
            "health": {"prediction": "Generally okay, but watch for thigh or hip issues.", "dos": "Practice yoga or stretching.", "donts": "Avoid sitting in one posture for too long."}
        },
        10: {
            "overall": "An outstanding month! The Sun in the tenth house brings career success, honors, and successful completion of major projects.",
            "opportunities": "Taking leadership roles, launching projects, and gaining public recognition.",
            "cautioned": "Don't let success make you arrogant or neglectful of your home life.",
            "career": {"prediction": "Major achievements, promotions, or successful job changes.", "dos": "Take charge and showcase your skills.", "donts": "Don't be tyrannical to subordinates."},
            "money": {"prediction": "Increase in income or profitable business deals.", "dos": "Reinvest in your career.", "donts": "Avoid reckless spending on status symbols."},
            "love": {"prediction": "Your career success makes you attractive, but time is limited.", "best_time": "Celebrating achievements together.", "challenging_time": "When work cuts into date nights."},
            "family": {"prediction": "Family is proud, but you may be absent due to work.", "dos": "Communicate your schedule clearly.", "donts": "Don't bring your 'boss' persona home."},
            "health": {"prediction": "Excellent vitality and energy.", "dos": "Use the energy productively.", "donts": "Don't burn out by overworking."}
        },
        11: {
            "overall": "A month of great joy and fulfillment. The Sun in the eleventh house brings financial gains, networking success, and the realization of hopes.",
            "opportunities": "Expanding your social circle, reaping rewards of past work, and enjoying life.",
            "cautioned": "Ensure your new connections are genuine and not just fair-weather friends.",
            "career": {"prediction": "Support from influential networks and fruitful collaborations.", "dos": "Attend networking events.", "donts": "Don't isolate yourself."},
            "money": {"prediction": "Significant financial gains and bonuses.", "dos": "Save a portion of windfall gains.", "donts": "Avoid lending money to casual friends."},
            "love": {"prediction": "Romance flourishes through social gatherings.", "best_time": "At parties or group events.", "challenging_time": "When balancing friends vs. partner."},
            "family": {"prediction": "Happy occasions and celebrations at home.", "dos": "Host a gathering.", "donts": "Don't neglect introverted family members."},
            "health": {"prediction": "Good health and quick recovery from any minor issues.", "dos": "Enjoy social physical activities.", "donts": "Don't overindulge in party food/drinks."}
        },
        12: {
            "overall": "A month of closure, expenses, and introspection. The Sun in the twelfth house indicates high expenditures, restless sleep, and a need for isolation.",
            "opportunities": "Spiritual retreats, charity, and letting go of what no longer serves you.",
            "cautioned": "Avoid unnecessary travel, legal disputes, and extravagant spending.",
            "career": {"prediction": "Behind-the-scenes work is favored; avoid the limelight.", "dos": "Plan for the next cycle.", "donts": "Don't start major new initiatives now."},
            "money": {"prediction": "High expenses, possibly related to health or travel.", "dos": "Track every penny.", "donts": "Don't make impulsive purchases."},
            "love": {"prediction": "A need for space or dealing with hidden feelings.", "best_time": "Quiet, isolated getaways.", "challenging_time": "When forced to socialize."},
            "family": {"prediction": "Possible feelings of isolation from family.", "dos": "Communicate your need for rest.", "donts": "Don't misinterpret their busyness as neglect."},
            "health": {"prediction": "Sleep disturbances, eye issues, or foot pain.", "dos": "Practice meditation before bed.", "donts": "Avoid screen time late at night."}
        }
    }
    return templates.get(house, templates[1])

def generate_yearly_dict(house: int) -> dict:
    templates = {
        1: {
            "overall": "Jupiter transiting your natal Moon causes a period of mental confusion, changes, and heavy expenses. It's a time of inner restructuring rather than outer expansion.",
            "opportunities": "Deep spiritual introspection, learning humility, and letting go of ego.",
            "cautioned": "Avoid making major life-altering decisions regarding location or career hastily.",
            "career": {"prediction": "You may feel unappreciated or face unwanted transfers.", "dos": "Adapt to changes gracefully.", "donts": "Do not quit without a backup plan."},
            "money": {"prediction": "Increased expenses and difficulty saving.", "dos": "Create a strict long-term budget.", "donts": "Avoid taking large loans."},
            "love": {"prediction": "Emotional fluctuations can confuse your partner.", "best_time": "When you clearly communicate your feelings.", "challenging_time": "When you withdraw without explanation."},
            "family": {"prediction": "A feeling of detachment or shifting family dynamics.", "dos": "Be patient with family members.", "donts": "Don't isolate yourself completely."},
            "health": {"prediction": "Stress-related ailments and fatigue.", "dos": "Prioritize mental health.", "donts": "Don't ignore persistent symptoms."}
        },
        2: {
            "overall": "An excellent year! Jupiter in the second house brings wealth, family expansion, and success through speech and knowledge.",
            "opportunities": "Accumulating wealth, expanding the family, and successful investments.",
            "cautioned": "Avoid overeating or becoming overly materialistic.",
            "career": {"prediction": "Financial rewards for your hard work and successful negotiations.", "dos": "Ask for that raise or promotion.", "donts": "Don't be arrogant in your speech."},
            "money": {"prediction": "Significant increase in savings and assets.", "dos": "Invest in stable, long-term assets.", "donts": "Don't squander money on unnecessary luxuries."},
            "love": {"prediction": "Harmonious and stable romantic life.", "best_time": "During family gatherings.", "challenging_time": "When balancing work and love."},
            "family": {"prediction": "Joy in the family, possible birth of a child or marriage.", "dos": "Celebrate with loved ones.", "donts": "Don't take family support for granted."},
            "health": {"prediction": "Good health, but watch out for weight gain.", "dos": "Maintain a balanced diet.", "donts": "Avoid excessive sweets."}
        },
        3: {
            "overall": "A year requiring hard work and courage. Jupiter in the third house can cause changes in position, obstacles, and issues with siblings.",
            "opportunities": "Developing new skills, networking, and taking calculated risks.",
            "cautioned": "Avoid losing hope during temporary setbacks and maintain good relations with siblings.",
            "career": {"prediction": "Progress requires immense effort. You may face opposition.", "dos": "Upskill and network.", "donts": "Don't engage in office politics."},
            "money": {"prediction": "Finances require careful management. Gains come only through hard work.", "dos": "Save for emergencies.", "donts": "Avoid speculative investments."},
            "love": {"prediction": "Communication gaps may cause friction.", "best_time": "When you openly share your thoughts.", "challenging_time": "When you assume things without asking."},
            "family": {"prediction": "Possible disputes with siblings or neighbors.", "dos": "Be the bigger person in arguments.", "donts": "Don't let minor issues escalate."},
            "health": {"prediction": "Stress and minor issues related to arms or shoulders.", "dos": "Practice stress-relief techniques.", "donts": "Don't ignore physical exhaustion."}
        },
        4: {
            "overall": "A year of domestic focus. Jupiter in the fourth house can bring sorrow, concerns about property or mother, and a lack of inner peace.",
            "opportunities": "Focusing on inner psychological healing and home renovations.",
            "cautioned": "Avoid property disputes and ensure your mother's health is monitored.",
            "career": {"prediction": "You may feel stuck or lack recognition.", "dos": "Focus on foundational work.", "donts": "Don't expect rapid promotions this year."},
            "money": {"prediction": "Expenses on vehicles, home, or family needs.", "dos": "Budget for home repairs.", "donts": "Avoid buying property impulsively."},
            "love": {"prediction": "Emotional insecurity may strain relationships.", "best_time": "Quiet time at home.", "challenging_time": "When dealing with family interference."},
            "family": {"prediction": "Domestic unrest or health issues of mother.", "dos": "Spend quality time with parents.", "donts": "Don't bring outside frustrations home."},
            "health": {"prediction": "Chest or heart-related anxieties.", "dos": "Regular checkups.", "donts": "Don't suppress your emotions."}
        },
        5: {
            "overall": "A wonderful year! Jupiter in the fifth house brings happiness from children, success in education, romantic bliss, and good investments.",
            "opportunities": "Higher education, creative projects, and profitable investments.",
            "cautioned": "Avoid overconfidence and ensure you actually do the work rather than just relying on luck.",
            "career": {"prediction": "Creative solutions bring recognition and success.", "dos": "Pitch innovative ideas.", "donts": "Don't ignore the details."},
            "money": {"prediction": "Good returns from past investments.", "dos": "Invest in stocks or mutual funds carefully.", "donts": "Don't gamble recklessly."},
            "love": {"prediction": "A highly romantic and joyful period.", "best_time": "During creative or fun activities.", "challenging_time": "If you act too prideful."},
            "family": {"prediction": "Great joy regarding children or younger family members.", "dos": "Encourage their pursuits.", "donts": "Don't be overly controlling."},
            "health": {"prediction": "Excellent physical and mental health.", "dos": "Engage in hobbies.", "donts": "Avoid overindulgence."}
        },
        6: {
            "overall": "A year requiring caution regarding health and enemies. Jupiter in the sixth house brings debts, disputes, and physical ailments.",
            "opportunities": "Paying off debts, improving daily routines, and serving others.",
            "cautioned": "Avoid taking new loans, engaging in legal battles, or neglecting health.",
            "career": {"prediction": "Opposition from colleagues and increased workload.", "dos": "Stay organized and compliant.", "donts": "Don't pick fights with superiors."},
            "money": {"prediction": "Increased expenses and difficulty saving.", "dos": "Focus on clearing debt.", "donts": "Do not co-sign loans for anyone."},
            "love": {"prediction": "Stress from other areas may spill into romance.", "best_time": "When you support each other practically.", "challenging_time": "When criticizing each other's habits."},
            "family": {"prediction": "Minor disputes and health concerns in the family.", "dos": "Be patient and forgiving.", "donts": "Don't be overly critical."},
            "health": {"prediction": "Digestive issues, liver concerns, or general sluggishness.", "dos": "Strict healthy diet.", "donts": "Avoid alcohol and heavy foods."}
        },
        7: {
            "overall": "A highly auspicious year for partnerships. Jupiter in the seventh house brings marriage, business success, and joyful travels.",
            "opportunities": "Forming new alliances, getting married, or expanding business.",
            "cautioned": "Avoid taking your partner for granted amidst the success.",
            "career": {"prediction": "Business partnerships flourish; good public image.", "dos": "Collaborate and network.", "donts": "Don't try to do everything alone."},
            "money": {"prediction": "Financial gains through partnerships or spouse.", "dos": "Invest jointly.", "donts": "Avoid hiding financial details from your partner."},
            "love": {"prediction": "Excellent period for commitment and marital bliss.", "best_time": "During travels or romantic getaways.", "challenging_time": "When egos clash temporarily."},
            "family": {"prediction": "Harmony and celebrations in the family.", "dos": "Include everyone in your joy.", "donts": "Don't ignore single family members."},
            "health": {"prediction": "Good health and vitality.", "dos": "Maintain a balanced lifestyle.", "donts": "Don't overexert during travels."}
        },
        8: {
            "overall": "A year of unexpected events and transformations. Jupiter in the eighth house brings obstacles, health issues, and hidden anxieties.",
            "opportunities": "Research, occult studies, and deep psychological healing.",
            "cautioned": "Avoid all risky ventures, illegal activities, and neglecting health.",
            "career": {"prediction": "Sudden changes, politics, or loss of position.", "dos": "Keep a low profile and adapt.", "donts": "Don't engage in unethical practices."},
            "money": {"prediction": "Unexpected expenses or issues with inheritances/taxes.", "dos": "Keep all paperwork clear.", "donts": "Avoid major investments."},
            "love": {"prediction": "Intense emotions, secrets, or trust issues may arise.", "best_time": "When engaging in deep, honest communication.", "challenging_time": "When suspicions take over."},
            "family": {"prediction": "Concerns regarding the health of elders or in-laws.", "dos": "Offer support without judgment.", "donts": "Avoid disputes over joint family assets."},
            "health": {"prediction": "Chronic issues may flare up; risk of accidents.", "dos": "Follow medical advice strictly.", "donts": "Ignore persistent symptoms."}
        },
        9: {
            "overall": "One of the best years! Jupiter in the ninth house brings immense luck, spiritual progress, long travels, and blessings from elders.",
            "opportunities": "Higher education, pilgrimages, publishing, and finding a mentor.",
            "cautioned": "Avoid becoming overly dogmatic or missing opportunities due to laziness.",
            "career": {"prediction": "Great progress, favorable transfers, and recognition.", "dos": "Aim high and seek mentorship.", "donts": "Don't be afraid to take a leap of faith."},
            "money": {"prediction": "Financial prosperity and luck in investments.", "dos": "Donate to charity to keep the flow.", "donts": "Avoid hoarding wealth."},
            "love": {"prediction": "Spiritual connection and shared values enhance love.", "best_time": "During long travels or learning together.", "challenging_time": "When debating beliefs."},
            "family": {"prediction": "Support from father and elders; peaceful home.", "dos": "Seek blessings from parents.", "donts": "Don't disrespect traditions."},
            "health": {"prediction": "Excellent health and recovery from past illnesses.", "dos": "Engage in spiritual practices for mental peace.", "donts": "Avoid extreme physical risks."}
        },
        10: {
            "overall": "A year focused on career challenges. Jupiter in the tenth house can cause loss of position, struggles at work, and increased responsibilities.",
            "opportunities": "Building resilience, restructuring your career path, and hard work.",
            "cautioned": "Avoid conflicts with authority figures and hasty job changes.",
            "career": {"prediction": "Heavy workload, lack of recognition, or unwanted changes.", "dos": "Stay dedicated and patient.", "donts": "Don't argue with your boss."},
            "money": {"prediction": "Income is steady but expenses may rise; no easy gains.", "dos": "Rely on earned income only.", "donts": "Avoid risky career moves for money."},
            "love": {"prediction": "Career stress may affect your relationship.", "best_time": "When you leave work at the office.", "challenging_time": "When you bring work stress home."},
            "family": {"prediction": "You may have less time for family due to work demands.", "dos": "Communicate your schedule.", "donts": "Don't neglect your family duties completely."},
            "health": {"prediction": "Stress-related issues, knee or joint pain.", "dos": "Maintain a work-life balance.", "donts": "Don't sit for prolonged hours without breaks."}
        },
        11: {
            "overall": "A year of ultimate fulfillment! Jupiter in the eleventh house brings immense gains, fulfillment of desires, and great social success.",
            "opportunities": "Networking, reaping rewards of past efforts, and expanding influence.",
            "cautioned": "Avoid arrogance and ensure you give back to society.",
            "career": {"prediction": "Promotions, bonuses, and successful collaborations.", "dos": "Leverage your network.", "donts": "Don't isolate yourself."},
            "money": {"prediction": "Multiple sources of income and significant wealth accumulation.", "dos": "Invest wisely for the future.", "donts": "Avoid reckless lending."},
            "love": {"prediction": "Joyful social life enhances romantic prospects.", "best_time": "At social events and gatherings.", "challenging_time": "When balancing friends and partner."},
            "family": {"prediction": "Happy events, celebrations, and support from elder siblings.", "dos": "Host family gatherings.", "donts": "Don't ignore family for friends."},
            "health": {"prediction": "Robust health and high energy levels.", "dos": "Enjoy life moderately.", "donts": "Avoid overindulgence in celebrations."}
        },
        12: {
            "overall": "A year of endings, expenses, and spiritual retreats. Jupiter in the twelfth house indicates high expenditures, isolation, and foreign travels.",
            "opportunities": "Spiritual growth, charity, visiting foreign lands, and closing old chapters.",
            "cautioned": "Avoid taking on new debts, legal disputes, and reckless spending.",
            "career": {"prediction": "Work behind the scenes or in foreign lands is favored.", "dos": "Plan and research.", "donts": "Don't seek the spotlight."},
            "money": {"prediction": "High expenses, often on good causes or travel.", "dos": "Budget carefully for travels.", "donts": "Avoid unnecessary luxury purchases."},
            "love": {"prediction": "A need for solitude may confuse your partner.", "best_time": "During quiet, isolated retreats.", "challenging_time": "When forced into heavy social situations."},
            "family": {"prediction": "Physical or emotional distance from family is possible.", "dos": "Stay in touch via communication.", "donts": "Don't completely cut off loved ones."},
            "health": {"prediction": "Sleep disturbances or minor hospital visits.", "dos": "Practice meditation and sleep hygiene.", "donts": "Don't ignore mental health."}
        }
    }
    return templates.get(house, templates[1])


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
            "sections": generate_monthly_dict(sun_rel)
        },
        "yearly": {
            "house": jup_rel,
            "sections": generate_yearly_dict(jup_rel)
        },
        "current_transits": {
            "Moon": current_moon_sign,
            "Sun": current_sun_sign,
            "Jupiter": current_jup_sign
        }
    }
