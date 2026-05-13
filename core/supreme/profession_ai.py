def classify_profession(chart, strength, shadbala):

    saturn = shadbala.get("Saturn",1)
    sun = shadbala.get("Sun",1)
    mercury = shadbala.get("Mercury",1)
    mars = shadbala.get("Mars",1)

    if saturn > 1.2 and sun > 1.1:
        return "Government / IAS / Administration"

    if mercury > 1.2:
        return "Business / Finance / Tech"

    if mars > 1.2:
        return "Engineering / Defence / Police"

    return "General Professional Path"
