import svgwrite
import os

def render_destiny_svg(graph, out_path, width=800, height=400):

    os.makedirs(os.path.dirname(out_path),exist_ok=True)

    dwg = svgwrite.Drawing(out_path,size=(width,height))
    dwg.add(dwg.rect((0,0),(width,height),fill="white"))

    # draw axis
    dwg.add(dwg.line((40,height-40),(width-20,height-40),stroke="#000"))
    dwg.add(dwg.line((40,20),(40,height-40),stroke="#000"))

    values = [p["value"] for p in graph]
    years  = [p["year"] for p in graph]

    if not values:
        dwg.save()
        return out_path

    maxv = max(values)

    step_x = (width-80)/(len(graph)-1)

    points = []

    for i,v in enumerate(values):

        x = 40 + i*step_x
        y = (height-40) - (v/maxv)*(height-80)

        points.append((x,y))

    dwg.add(dwg.polyline(points,stroke="#b8860b",fill="none",stroke_width=2))

    dwg.save()
    return out_path
