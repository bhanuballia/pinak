def detect_profession(chart):

    tenth_lord = chart["house_lords"][10]

    sign = chart[tenth_lord]["sign"]

    if sign in ["Gemini","Virgo"]:
        return "Business, communication, analytics"

    if sign in ["Capricorn","Taurus"]:
        return "Finance, administration"

    if sign in ["Leo","Aries"]:
        return "Leadership, government, management"

    return "Professional field varies"