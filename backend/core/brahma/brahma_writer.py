def build_brahma_text(profession, marriage, wealth, karma, maharishi, omniscient):

    text = ""

    text += f"Your karmic evolution index is {karma}/100. "

    text += f"Professional destiny indicates {profession}. "

    if marriage.get("status"):
        text += marriage["status"] + ". "

    text += "Financial trajectory shows gradual rise across major dashas. "

    text += maharishi.get("maharishi_text","")

    text += omniscient.get("supreme_text","")

    return text
