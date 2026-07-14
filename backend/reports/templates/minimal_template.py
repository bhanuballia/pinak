from reportlab.platypus import Paragraph, Spacer, PageBreak, Table
from reportlab.lib.units import inch

def build_minimal_report(data, styles):
    """
    data = {
        "birth_details": {...},
        "charts": {...},
        "panchang": {...},
        "ashtakavarga": {...},
        ...
    }
    """
    story = []

    story.append(Paragraph("जन्म कुंडली – संक्षिप्त रिपोर्ट", styles["HindiTitle"]))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Minimal Classical Horoscope Report", styles["EngTitle"]))
    story.append(Spacer(1, 0.3 * inch))

    # Birth details (bilingual)
    bd = data["birth_details"]
    story.append(Paragraph("<b>जन्म विवरण</b>", styles["HindiBody"]))
    story.append(Paragraph(
        f"नाम: {bd['name']}<br/>"
        f"जन्म तिथि: {bd['dob']}<br/>"
        f"जन्म समय: {bd['time']}<br/>"
        f"स्थान: {bd['place']}",
        styles["HindiBody"]
    ))
    story.append(Spacer(1, 0.2*inch))

    story.append(Paragraph("<b>Birth Details (English)</b>", styles["EngBody"]))
    story.append(Paragraph(
        f"Name: {bd['name']}<br/>"
        f"Date of Birth: {bd['dob']}<br/>"
        f"Time: {bd['time']}<br/>"
        f"Place: {bd['place']}",
        styles["EngBody"]
    ))
    story.append(PageBreak())

    # Add Rasi chart
    story.append(Paragraph("राशि चार्ट (D1)", styles["HindiTitle"]))
    story.append(Paragraph("Rasi Chart (D1)", styles["EngTitle"]))

    # Insert chart drawing as an image or table (you already generate chart data)
    #story.append(Image(...))  # Your chart image

    story.append(PageBreak())

    # Panchang
    story.append(Paragraph("पंचांग", styles["HindiTitle"]))
    story.append(Paragraph("Panchang Details", styles["EngTitle"]))

    # Nakshatra etc
    story.append(Paragraph(f"Nakshatra: {data['panchang']['nakshatra']}", styles["EngBody"]))
    story.append(PageBreak())

    # Ashtakavarga Summary
    story.append(Paragraph("अष्टकवर्ग सारांश", styles["HindiTitle"]))
    story.append(Paragraph("Ashtakavarga Summary", styles["EngTitle"]))

    table_data = [["Sign", "Total Bindus"]]
    for idx, b in enumerate(data["ashtakavarga"]["sarvashtakavarga"]):
        table_data.append([idx+1, b])

    story.append(Table(table_data))

    return story
