# backend/dashboard/chart_renderer.py

class ChartRenderer:
    def render_svg_chart(self, planets: list):
        """
        Generate a basic SVG representation of a Vedic chart with planet nodes.
        """
        svg_header = '<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">'
        svg_body = '<rect x="10" y="10" width="380" height="380" rx="15" fill="#1e1e38" stroke="#4c4c8c" stroke-width="2"/>'
        svg_body += '<circle cx="200" cy="200" r="150" fill="none" stroke="#6b6bbf" stroke-width="1.5"/>'
        
        for idx, p in enumerate(planets):
            # Calculate coordinates
            long = float(p.get("longitude", 0))
            # Just some basic circular math
            import math
            rad = math.radians(long)
            cx = 200 + 120 * math.cos(rad)
            cy = 200 - 120 * math.sin(rad)
            name = p.get("name", "P")[:2]
            svg_body += f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="8" fill="#ff007f"/>'
            svg_body += f'<text x="{cx+10:.1f}" y="{cy+4:.1f}" fill="#00f3ff" font-size="10" font-family="sans-serif">{name}</text>'
            
        svg_footer = '</svg>'
        return svg_header + svg_body + svg_footer
