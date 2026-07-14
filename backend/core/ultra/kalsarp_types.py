def detect_kalsarp_type(chart):

    rahu_house = 1
    ketu_house = 7
    
    for h, data in chart.get("houses", {}).items():
        if "Rahu" in data.get("planets", []):
            rahu_house = int(h)
        if "Ketu" in data.get("planets", []):
            ketu_house = int(h)

    types = {
        1: "Anant",
        2: "Kulik",
        3: "Vasuki",
        4: "Shankhpal",
        5: "Padma",
        6: "Mahapadma",
        7: "Takshak",
        8: "Karkotak",
        9: "Shankhachur",
        10: "Ghatak",
        11: "Vishdhar",
        12: "Sheshnag",
    }

    return types.get(rahu_house, "Unknown")
