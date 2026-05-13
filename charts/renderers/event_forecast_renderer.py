import svgwrite
import os


def render_event_forecast_grid(grid, out_svg, size=800):

    os.makedirs(os.path.dirname(out_svg) or ".", exist_ok=True)

    w = size
    h = size * 0.5

    dwg = svgwrite.Drawing(out_svg, size=(w, h))
    dwg.add(dwg.rect(insert=(0,0), size=(w,h), fill="white"))

    base_y = h - 60
    step_x = (w - 100) / len(grid)

    def draw_line(key, color):
        pts = []
        for i, row in enumerate(grid):
            x = 50 + i * step_x
            y = base_y - row[key] * 2.5
            pts.append((x, y))

        dwg.add(
            dwg.polyline(
                pts,
                stroke=color,
                fill="none",
                stroke_width=3
            )
        )

    draw_line("career", "#1e88e5")
    draw_line("marriage", "#d81b60")
    draw_line("wealth", "#43a047")
    draw_line("health", "#fb8c00")

    dwg.save()
    return out_svg
