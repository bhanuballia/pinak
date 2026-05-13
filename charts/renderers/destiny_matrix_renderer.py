import svgwrite
import os


def render_destiny_matrix(matrix_data, out_svg, size=700):

    os.makedirs(os.path.dirname(out_svg) or ".", exist_ok=True)

    w = size
    h = size * 0.6

    dwg = svgwrite.Drawing(out_svg, size=(w, h))
    dwg.add(dwg.rect(insert=(0,0), size=(w,h), fill="white"))

    cx_offset = 60
    base_y = h - 60
    step_x = (w - 120) / 10

    def draw_curve(curve, color):
        pts = []
        for i, row in enumerate(curve):
            x = cx_offset + i * step_x
            y = base_y - (row["value"] * 3)
            pts.append((x, y))

        dwg.add(
            dwg.polyline(
                pts,
                stroke=color,
                fill="none",
                stroke_width=3
            )
        )

    draw_curve(matrix_data["marriage_curve"], "#e57373")
    draw_curve(matrix_data["wealth_curve"], "#4caf50")
    draw_curve(matrix_data["karma_curve"], "#5c6bc0")

    # Labels
    dwg.add(dwg.text("Marriage", insert=(10,20), fill="#e57373"))
    dwg.add(dwg.text("Wealth", insert=(10,40), fill="#4caf50"))
    dwg.add(dwg.text("Karma", insert=(10,60), fill="#5c6bc0"))

    dwg.save()
    return out_svg
