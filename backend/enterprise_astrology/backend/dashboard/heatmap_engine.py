# backend/dashboard/heatmap_engine.py

class HeatmapEngine:
    def compile_activation_heatmap(self, planets: list):
        """
        Compile an energy activation matrix mapping 12 zodiac signs and houses.
        """
        matrix = [[0 for _ in range(12)] for _ in range(12)]
        
        for p in planets:
            # Map planetary positions to houses/signs
            house = (p.get("house", 1) - 1) % 12
            sign = (p.get("sign_index", 1) - 1) % 12
            # Add energy score (higher weights for heavy planets)
            weight = 10
            if p.get("name") in ["Sun", "Saturn", "Jupiter", "Mars"]:
                weight = 25
            matrix[house][sign] += weight
            
        return {
            "matrix": matrix,
            "max_intensity": max(max(row) for row in matrix) if any(row for row in matrix) else 0,
            "status": "compiled"
        }
