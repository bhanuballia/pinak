from reportlab.platypus import Flowable
from reportlab.lib import colors


class DestinyGraphFlowable(Flowable):

    def __init__(self, timeline, width=420, height=200):
        Flowable.__init__(self)
        self.timeline = timeline
        self.width = width
        self.height = height

    def draw(self):

        if not self.timeline:
            return

        c = self.canv

        padding = 30
        graph_w = self.width - padding * 2
        graph_h = self.height - padding * 2

        # Background box
        c.setStrokeColor(colors.grey)
        c.rect(0, 0, self.width, self.height, stroke=1, fill=0)

        # Axes
        c.line(padding, padding, padding, padding + graph_h)
        c.line(padding, padding, padding + graph_w, padding)

        years = [y["year"] for y in self.timeline]
        scores = [y["score"] for y in self.timeline]

        min_year = min(years)
        max_year = max(years)

        # Scale functions
        def scale_x(year):
            return padding + ((year - min_year) / (max_year - min_year)) * graph_w

        def scale_y(score):
            return padding + (score / 100.0) * graph_h

        # Draw destiny curve
        c.setStrokeColor(colors.HexColor("#b8860b"))
        c.setLineWidth(2)

        prev_x = None
        prev_y = None

        for y in self.timeline:
            x = scale_x(y["year"])
            y_pos = scale_y(y["score"])

            if prev_x is not None:
                c.line(prev_x, prev_y, x, y_pos)

            prev_x = x
            prev_y = y_pos

        # Draw points
        for y in self.timeline:
            x = scale_x(y["year"])
            y_pos = scale_y(y["score"])

            phase = y.get("phase", "")

            if phase == "Peak":
                c.setFillColor(colors.green)
            elif phase == "Challenge":
                c.setFillColor(colors.red)
            else:
                c.setFillColor(colors.blue)

            c.circle(x, y_pos, 3, stroke=0, fill=1)

        # Year labels
        c.setFont("Helvetica", 7)
        for y in self.timeline:
            x = scale_x(y["year"])
            c.drawCentredString(x, 10, str(y["year"]))

        # Score markers
        for val in [20,40,60,80,100]:
            y_pos = scale_y(val)
            c.setFillColor(colors.grey)
            c.drawRightString(padding - 5, y_pos - 2, str(val))
