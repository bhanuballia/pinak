from sarvatobhadra.core.vedha_geometry import VedhaGeometry

class VedhaEngine:

    def calculate(self, grid, activations):
        """
        Calculates the actual grid paths for Sammukha, Vama, and Dakshina Vedhas.
        """
        result = []
        geom = VedhaGeometry()

        for item in activations:
            nakshatra_name = item.get("nakshatra")
            planet_name = item.get("planet")
            
            # Find the nakshatra in the grid
            nak_cell = next((c for c in grid if c["label"] == nakshatra_name and c["type"] == "nakshatra"), None)
            
            if nak_cell:
                # Calculate row and col from 81-cell 1D array index
                row = nak_cell["id"] // 9
                col = nak_cell["id"] % 9
                
                # Get the vedha paths originating from this row, col
                paths = geom.calculate_vedha_paths(row, col)
                
                # Tag cells with affliction type
                is_malefic = planet_name in ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]
                affliction = "malefic" if is_malefic else "benefic"
                
                for path_obj in paths:
                    for r, c in path_obj["cells"]:
                        idx = r * 9 + c
                        # Malefic hit takes visual priority if mixed
                        current = grid[idx].get("affliction_type")
                        if current != "malefic":
                            grid[idx]["affliction_type"] = affliction

                result.append({
                    "planet": planet_name,
                    "nakshatra": nakshatra_name,
                    "origin_row": row,
                    "origin_col": col,
                    "paths": paths
                })

        return result
