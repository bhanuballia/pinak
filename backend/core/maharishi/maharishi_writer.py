def build_maharishi_text(yogas, career, marriage, fortune, omniscient):

    text = ""

    text += f"Your fortune index stands at {fortune}/100. "

    if yogas:
        text += "Classical yogas indicate powerful karmic support. "

    text += f"Career tendencies suggest {career}. "

    if marriage.get("delay"):
        text += "Marriage may require patience and emotional maturity. "

    text += omniscient.get("supreme_text","")

    return text
