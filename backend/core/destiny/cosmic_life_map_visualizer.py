from reportlab.platypus import Flowable
from reportlab.lib import colors


class CosmicLifeMapFlowable(Flowable):

    def __init__(self, timeline, dasha=None, events=None,
                 width=440, height=240):
        Flowable.__init__(self)
        self.timeline = timeline or []
        self.dasha = dasha or {}
        self.events = events or {}
        self.width = width
        self.height = height

    def draw(self):

        if not self.timeline:
            return

        c = self.canv

        padding = 40
        graph_w = self.width - padding * 2
        graph_h = self.height - padding * 2

        # ===============================
        # Background frame
        # ===============================
        c.setStrokeColor(colors.grey)
        c.rect(0, 0, self.width, self.height, stroke=1, fill=0)

        years = [y["year"] for y in self.timeline]
        scores = [y["score"] for y in self.timeline]

        min_year = min(years)
        max_year = max(years)

        def scale_x(year):
            return padding + ((year - min_year) / (max_year - min_year)) * graph_w

        def scale_y(score):
            return padding + (score / 100.0) * graph_h

        # ===============================
        # 🌈 Dasha Background Bands
        # ===============================
        for d in self.dasha.get("list", []):
            try:
                start = int(d["start_date"][:4])
                end = int(d["end_date"][:4])

                if end < min_year or start > max_year:
                    continue

                x1 = scale_x(max(start, min_year))
                x2 = scale_x(min(end, max_year))

                lord = d.get("lord", "")

                if lord in ["Jupiter", "Venus"]:
                    c.setFillColorRGB(0.85, 1, 0.85)  # greenish
                elif lord in ["Saturn", "Rahu", "Ketu"]:
                    c.setFillColorRGB(1, 0.85, 0.85)  # reddish
                else:
                    c.setFillColorRGB(0.9, 0.9, 1)    # bluish

                c.rect(x1, padding, x2 - x1, graph_h, stroke=0, fill=1)

            except Exception:
                pass

        # ===============================
        # Axis lines
        # ===============================
        c.setStrokeColor(colors.black)
        c.line(padding, padding, padding, padding + graph_h)
        c.line(padding, padding, padding + graph_w, padding)

        # ===============================
        # Destiny Curve
        # ===============================
        c.setStrokeColor(colors.HexColor("#b8860b"))
        c.setLineWidth(2)

        prev_x = None
        prev_y = None

        for row in self.timeline:
            x = scale_x(row["year"])
            y = scale_y(row["score"])

            if prev_x is not None:
                c.line(prev_x, prev_y, x, y)

            prev_x = x
            prev_y = y

        # ===============================
        # Event overlays
        # ===============================
        for row in self.timeline:

            x = scale_x(row["year"])
            y = scale_y(row["score"])

            phase = row.get("phase", "")

            if phase == "Peak":
                c.setFillColor(colors.green)
            elif phase == "Challenge":
                c.setFillColor(colors.red)
            else:
                c.setFillColor(colors.blue)

            c.circle(x, y, 3, fill=1, stroke=0)

            # Marriage window marker
            if row.get("marriage_window"):
                c.setFillColor(colors.pink)
                c.rect(x - 2, padding, 4, graph_h, fill=1, stroke=0)

            # Career rise marker
            if row.get("career_peak"):
                c.setFillColor(colors.gold)
                c.circle(x, padding + graph_h + 6, 3, fill=1)

            # Health risk marker
            if row.get("health_risk"):
                c.setFillColor(colors.orange)
                c.circle(x, padding - 6, 3, fill=1)

        # ===============================
        # Year labels
        # ===============================
        c.setFont("Helvetica", 7)
        for row in self.timeline:
            x = scale_x(row["year"])
            c.setFillColor(colors.black)
            c.drawCentredString(x, 15, str(row["year"]))

        # Score grid
        for val in [20,40,60,80,100]:
            y = scale_y(val)
            c.setFillColor(colors.grey)
            c.drawRightString(padding - 6, y - 2, str(val))
