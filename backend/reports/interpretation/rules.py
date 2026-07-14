
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def personality_analysis(chart, strength):
    lagna = chart["ascendant"]
    lagna_lord_strength = _get_strength(strength, lagna["lord"], 0)
    moon_afflicted = chart["moon"]["afflicted"]

    base_text = ""
    if lagna_lord_strength > 70 and not moon_afflicted:
        base_text = (
            "You possess a confident, stable, and balanced personality. "
            "Your decisions are guided by clarity and inner strength. "
            "The strength of your ascendant lord indicates a natural leadership ability "
            "and a resilient physical constitution. You are likely to face challenges "
            "with a calm demeanor and a strategic mindset.\n\n"
            "Furthermore, your personality radiates a sense of authority that commands "
            "respect from peers and subordinates alike. You have a keen ability to "
            "balance logic with intuition, allowing you to navigate complex social "
            "landscapes with ease. This placement suggests that your self-image is "
            "strong and less likely to be swayed by external criticism."
        )
    elif moon_afflicted:
        base_text = (
            "You are emotionally deep and sensitive. Your mind is powerful but "
            "prone to overthinking and periodic bouts of anxiety. The sensitivity "
            "indicated by your lunar placement suggests a highly intuitive nature, "
            "allowing you to feel the subtle energies of your environment. This depth "
            "can be your greatest strength if channeled into creative or spiritual pursuits.\n\n"
            "On a deeper level, your emotional landscape is rich and multifaceted. "
            "You may find yourself absorbing the moods of those around you, necessitating "
            "periods of solitude to emotional recharge. Developing emotional boundaries "
            "and practicing mindfulness will be essential for maintaining your inner peace. "
            "Your journey involves transforming your sensitivity into empathetic wisdom."
        )
    else:
        base_text = (
            "Your personality reflects adaptability and gradual maturity. "
            "Life experiences shape your confidence over time, and you tend to "
            "become more stable as you age. You are likely to be versatile, "
            "capable of adjusting to different environments and people without "
            "losing your core identity.\n\n"
            "As you navigate through various life stages, you will find that your "
            "perspective broadens significantly. This growth mindset allows you to "
            "learn from every encounter, turning even setbacks into valuable lessons. "
            "Your strength lies in your ability to evolve and refine your character, "
            "making you a reliable and thoughtful individual in both personal and "
            "professional spheres."
        )
    return base_text


def happiness_analysis(chart):
    return (
        "Your chart indicates a steady pursuit of inner peace and domestic harmony. "
        "You find true contentment in a secure home environment and close-knit "
        "family ties. The placement suggests that your emotional well-being is "
        "deeply rooted in your private life and the relationships you nurture "
        "within your personal sanctuary.\n\n"
        "To enhance your sense of fulfillment, focus on creating a living space "
        "that reflects your inner calm. Engaging in activities that foster domestic "
        "bliss, such as gardening, cooking, or family gatherings, will provide "
        "significant emotional nourishment. Your path to happiness lies in "
        "appreciating the simple joys and finding stability within your inner world.\n\n"
        "Furthermore, your subconscious mind is deeply attuned to the rhythms of your "
        "environment. Establishing a daily sanctuary through meditation or quiet "
        "contemplation will amplify your resilience against external stressors. "
        "The stars suggest that your happiness is not a destination but a deliberate "
        "cultivation of harmony in your immediate surroundings. By honoring your "
        "ancestral connections and creating a legacy of love within your home, you "
        "fulfill a key aspect of your soul's desire for safety and belonging."
    )



def life_purpose_analysis(chart):
    return (
        "You are driven by a sense of duty and a desire to create a lasting impact "
        "in your field. Your soul's purpose is closely tied to your professional "
        "achievements and the legacy you leave behind. You possess a natural "
        "ambition that pushes you to excel and seek recognition for your contributions.\n\n"
        "Beyond professional success, your higher purpose involves mentoring others "
        "and sharing the wisdom you've gained along your journey. You are meant to "
        "be a pillar of strength within your community, providing guidance and "
        "inspiration to those who follow in your footsteps. Understanding the "
        "balancing act between personal ambition and selfless service will lead "
        "to a profound sense of life satisfaction.\n\n"
        "This lifetime is a bridge between the lessons of the past and the aspirations "
        "of the future. You are tasked with integrating your personal power with a "
        "larger cosmic mission. By identifying the intersection between your unique "
        "talents and the needs of the world, you activate a powerful dharmic alignment. "
        "The celestial geometry indicates that your influence will extend far beyond "
        "your immediate circle, touching the lives of many as a silent force for "
        "positive transformation and structural improvement."
    )



def lifestyle_analysis(chart):
    return (
        "A balanced lifestyle with attention to both physical and mental well-being "
        "is strongly suggested by your planetary configuration. You thrive when "
        "your daily routine includes time for exercise, proper nutrition, and "
        "quiet reflection. Discipline in these areas acts as a foundation for "
        "your overall success and vitality.\n\n"
        "Consider incorporating holistic practices such as Yoga or meditation into "
        "your schedule. These activities will help harmonize your energy and "
        "reduce stress, allowing you to maintain peak performance in all areas "
        "of life. Your lifestyle should be a reflection of your commitment to "
        "longevity and sustained growth, ensuring that your physical vessel "
        "is capable of supporting your soul's ambitions."
    )


def career_analysis(chart, dasha):
    return (
        "Career prospects are linked to sustained effort and strategic timing during "
        "favorable dasha periods. You have the potential for significant professional "
        "growth if you remain focused on your long-term goals. Your ability to "
        "navigate the corporate or professional hierarchy is enhanced by your "
        "patience and eye for detail.\n\n"
        "During peak planetary periods, you should be prepared to take calculated "
        "risks and step into roles of greater responsibility. Networking and "
        "building strong professional alliances will also play a crucial role in "
        "your advancement. Remember that your career is a marathon, not a sprint; "
        "maintaining your integrity and work ethic will ensure that your rise "
        "to the top is both deserved and sustainable.\n\n"
        "The alignment of your career lord suggests that you are most effective in "
        "environments that value both innovation and structure. You may find that "
        "your professional path undergoes significant evolution as you align more "
        "deeply with your innate skills. Your professional charisma is a tool for "
        "not just success but for building systems that empower others. As you "
        "ascend, focus on the ethical implications of your power, as your chart "
        "indicates that your greatest successes come when you act in alignment "
        "with universal justice and transparency."
    )



def education_analysis(chart):
    return (
        "Focus and dedication in your early years build a strong foundation for "
        "lifelong learning. You possess an inquisitive mind that seeks to understand "
        "the deeper principles behind the subjects you study. Academic success "
        "is well within your reach if you cultivate specialized knowledge in "
        "areas that truly ignite your passion.\n\n"
        "Your educational journey may involve higher learning or specialized "
        "training later in life. You are likely to be recognized for your "
        "intellectual depth and your ability to synthesize complex information. "
        "Continuous self-education and staying updated with the latest "
        "advancements in your field will keep your mind sharp and your "
        "skills relevant throughout your career."
    )


def finance_analysis(chart, strength):
    return (
        "Financial stability comes through disciplined planning and prudent "
        "investments. Your chart suggests a capability for wealth accumulation, "
        "but it requires a cautious approach to expenditure. Developing a "
        "long-term financial strategy and adhering to it will yield substantial "
        "rewards over time.\n\n"
        "You may find success in investments related to land, property, or "
        "long-standing institutions. It is important to avoid speculative "
        "ventures that promise quick returns but carry high risks. By focusing "
        "on building assets that provide consistent value, you can ensure a "
        "comfortable and secure future for yourself and your loved ones. "
        "Generosity coupled with wise management is your key to prosperity.\n\n"
        "The celestial indicators of wealth suggest that your prosperity is linked "
        "to your ability to manage both material and energetic resources. As you "
        "align with the natural cycles of abundance, you will find that "
        "opportunities for financial growth appear in sync with your personal "
        "readiness. Your wealth-building journey is also a soul-lesson in "
        "stewardship. By balancing your personal needs with charitable acts and "
        "community investment, you create a positive feedback loop that ensures "
        "sustainable affluence and karmic merit."
    )



def hobbies_analysis(chart):
    return (
        "Creative pursuits and intellectual hobbies provide a healthy outlet for "
        "your energy. You may find great pleasure in activities that allow you "
        "to express your inner thoughts and feelings, such as writing, painting, "
        "or music. These hobbies act as a vital release for stress and help "
        "maintain your emotional equilibrium.\n\n"
        "Engaging in group activities or clubs related to your interests can also "
        "be very beneficial, providing a sense of community and shared purpose. "
        "Your hobbies should not just be a pastime but a core part of your "
        "self-care routine. By dedicating time to what you love, you recharge "
        "your spirit and bring a sense of joy and playfulness into your "
        "daily life."
    )


def health_analysis(chart, dosha):
    if dosha.get("pitta", False):
        return (
            "You may be prone to heat-related issues and inflammatory conditions. "
            "Stay hydrated and avoid spicy or excessively greasy foods. Your pitta "
            "constitution requires a cooling diet and a calm environment to "
            "remain in balance.\n\n"
            "Regular detoxification and practices that cool the system, such as "
            "Sheetali Pranayama, are highly recommended. Pay attention to your "
            "digestive health and avoid excessive exposure to the sun or high "
            "temperatures. By maintaining a 'cool' head and body, you can prevent "
            "minor irritations from escalating into chronic health concerns.\n\n"
            "On a deeper level, your vitality is a reflection of your inner fire and "
            "passion. Learning to transform frustration or anger into creative drive "
            "will significantly benefit your physical well-being. The stars advise "
            "that your health is strongly influenced by your emotional temperature. "
            "Cultivating peace and practicing forgiveness acts as a powerful healing "
            "force, ensuring that your energy flows freely and your recovery "
            "mechanisms remain sharp and effective."
        )
    return (
        "Your constitution is generally robust and resilient. Regular exercise, "
        "coupled with a balanced diet, will help you maintain your natural "
        "vitality. You have a strong recovery potential, but it should not be "
        "taken for granted.\n\n"
        "Monitor your sleep patterns and ensure you are getting adequate rest "
        "to allow for physical and mental rejuvenation. Preventive care, such "
        "as regular check-ups and a consistent wellness routine, will ensure "
        "that you remain active and vibrant well into your later years. Your "
        "health is your greatest asset; treat it with the respect it deserves.\n\n"
        "Your body is the temple of your soul, and its strength is an indicator of "
        "your karmic balance in the physical realm. By aligning your physical "
        "habits with the natural seasonal changes, you can achieve a state of "
        "dynamic equilibrium. The astral configuration suggests that meditation "
        "and light physical movement like Tai Chi or gentle stretching will "
        "harmonize your nervous system. Remember that longevity is built on "
        "the foundations of daily discipline and a positive, life-affirming "
        "internal dialogue."
    )



def relationship_analysis(chart, dosha):
    manglik = dosha.get("manglik", {}).get("present", False)
    if manglik:
        return (
            "Relationships may require extra patience and understanding due to "
            "strong Martian energy. Open communication is key to preventing "
            "minor disagreements from escalating. Learning to channel this intense "
            "energy into constructive activities together can strengthen your bond.\n\n"
            "On a positive note, this energy also translates to passion and a "
            "strong protective instinct toward your partner. By practicing "
            "empathy and choosing your battles wisely, you can build a dynamic "
            "and deeply fulfilling relationship. Rituals that promote "
            "emotional cooling and mutual respect will be beneficial for "
            "harmonizing your domestic life.\n\n"
            "Your relationship journey is a powerful arena for the mastery of "
            "emotion. The presence of Manglik energy suggests that you are meant to "
            "evolve through the fire of connection. As you learn to prioritize "
            "harmony over dominance, your partnerships will become a source of "
            "immense mutual power. The cosmic challenge is to find the middle path "
            "between independence and merging, turning your intensity into a "
            "luminous and enduring bond."
        )
    return (
        "Your relationship sector shows harmony, mutual understanding, and steady "
        "growth. You are likely to attract partners who are supportive and "
        "share your values. The key to your marital bliss lies in the deep "
        "friendship and respect you share with your significant other.\n\n"
        "Nurturing your relationships through quality time and shared interests "
        "will provide a strong sense of emotional security. Your ability to "
        "listen and empathize makes you a cherished partner and friend. By "
        "maintaining this positive dynamic, you ensure that your personal "
        "relationships remain a source of strength and inspiration throughout "
        "your life.\n\n"
        "The celestial alignment favors long-lasting and soul-level connections. "
        "You possess a natural diplomacy that allows you to bridge differences "
        "with grace. Your partnerships often serve as a mirror for your own "
        "spiritual growth, showing you the beauty within your own soul. By "
        "continuing to value transparency and mutual respect, you build a "
        "relation fortress that can withstand any external storm, providing "
        "a safe and fertile ground for both partners to thrive."
    )



def spirituality_analysis(chart):
    return (
        "Your soul's journey in this lifetime is marked by a deep quest for "
        "higher truth and spiritual liberation. You are likely to find "
        "profound meaning in ancient wisdom, meditation, and service to "
        "humanity. Your chart suggests a strong connectivity with the "
        "divine realms, allowing you to access higher states of consciousness "
        "with relative ease.\n\n"
        "Engaging in regular spiritual retreats or pilgrimages will provide "
        "the nourishment your soul craves. You are meant to be a bridge "
        "between the material and spiritual worlds, demonstrating that "
        "true prosperity includes inner peace. Your path involves "
        "balancing worldly responsibilities with a consistent spiritual "
        "practice, leading to a life of complete fulfillment."
    )


def hidden_potential_analysis(chart):
    return (
        "There are latent talents and hidden strengths within you that are "
        "meant to emerge during times of deep transformation. Your chart "
        "indicates an ability to thrive in investigative, research-oriented, "
        "or occult fields. You possess a psychological depth that allows "
        "you to understand the root causes of situations and people.\n\n"
        "Developing your intuition and embracing the cycles of 'death and "
        "rebirth' in your life will unlock these hidden potentials. You "
        "have the power to heal yourself and others through your "
        "understanding of the subtle planes of existence. Trusting your "
        "inner voice and exploring the mysteries of life will lead to "
        "discoveries that empower your entire existence."
    )


def travel_analysis(chart):
    return (
        "Your chart suggests significant opportunities for travel, both "
        "short-distance and to far-off lands. These journeys are not just "
        "for leisure but serve as important catalysts for your personal "
        "and professional growth. You are likely to gain specialized "
        "knowledge or expand your worldview through these international "
        "connections.\n\n"
        "Foreign cultures and philosophies will have a profound impact "
        "on your perspective. You may even find success and prosperity "
        "in lands away from your place of birth. Adapting to diverse "
        "environments is your natural strength, allowing you to build "
        "a global network of friends and colleagues. Your life is a "
        "voyage of continuous discovery, spanning across boundaries "
        "and cultures."
    )


def siblings_analysis(chart):
    return (
        "Relationships with siblings and peers are characterized by a sense "
        "of courage, shared ambition, and mutual support. You possess the "
        "initiative to lead and the bravery to take on challenges that "
        "others might avoid. Your siblings, if any, will play a crucial "
        "role in your early development and provide a source of "
        "competitive inspiration.\n\n"
        "Communicating your ideas with clarity and conviction will be "
        "your greatest asset in both personal and professional spheres. "
        "Your courage is not just physical but mental, allowing you "
        "to stand up for your beliefs and advocate for those you care "
        "about. By nurturing your local networks and sibling bonds, "
        "you create a strong foundation of social support for your "
        "life's endeavors."
    )


def parental_analysis(chart):
    return (
        "Your heritage and the blessings of your parents and ancestors "
        "form a protective shield around your life. You have inherited "
        "a strong set of values and a sense of tradition that guides "
        "your choices. The influence of your mentors and elders is "
        "predominantly positive, providing a moral compass that "
        "steers you through life's complexities.\n\n"
        "Honoring your roots and maintaining a strong connection with "
        "your heritage will provide you with immense psychological "
        "strength. You may also receive support or inheritance in "
        "various forms from your family line. Your journey involves "
        "carrying the best of your family's legacy forward while "
        "contributing your unique achievements to the lineage. "
        "Ancestral blessings are your hidden source of resilience "
        "and grace."
    )


