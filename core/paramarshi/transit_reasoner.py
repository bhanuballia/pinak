def transit_handler(question, report_data):

    timeline = report_data.get("timeline", [])

    year = None
    for word in question.split():
        if word.isdigit():
            year = int(word)

    for y in timeline:
        if y["year"] == year:
            return y

    return {"summary": "Transit data unavailable"}
