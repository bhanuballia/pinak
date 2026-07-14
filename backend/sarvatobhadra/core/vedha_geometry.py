class VedhaGeometry:

    def calculate_vedha_paths(self, row, col):
        """
        Dynamically calculates the 3 Vedha paths (Sammukha, Vama, Dakshina)
        based on which edge of the 9x9 board the planet is currently sitting.
        It shoots the "laser beams" inwards across the board.
        """
        paths = []
        
        # Determine the vectors (dx, dy) based on the wall
        vectors = {}

        if row == 0:
            # Top wall -> shoot down (+dy)
            vectors = {
                "sammukha": (0, 1),
                "vama": (1, 1),
                "dakshina": (-1, 1)
            }
        elif row == 8:
            # Bottom wall -> shoot up (-dy)
            vectors = {
                "sammukha": (0, -1),
                "vama": (-1, -1),
                "dakshina": (1, -1)
            }
        elif col == 0:
            # Left wall -> shoot right (+dx)
            vectors = {
                "sammukha": (1, 0),
                "vama": (1, -1),
                "dakshina": (1, 1)
            }
        elif col == 8:
            # Right wall -> shoot left (-dx)
            vectors = {
                "sammukha": (-1, 0),
                "vama": (-1, 1),
                "dakshina": (-1, -1)
            }
        else:
            # If a planet is inside the grid (e.g. Rahu/Ketu sometimes), 
            # shoot in all 4 diagonal and straight directions (simplified for now)
            vectors = {
                "sammukha_h": (1, 0),
                "sammukha_v": (0, 1),
                "vama": (1, 1),
                "dakshina": (-1, 1)
            }

        # Project the vectors across the 9x9 grid
        for name, vector in vectors.items():
            dx, dy = vector
            path = []
            
            for i in range(1, 10):
                r = row + (dy * i)
                c = col + (dx * i)
                
                # Stop if it hits the boundary
                if 0 <= r < 9 and 0 <= c < 9:
                    path.append((r, c))
                else:
                    break

            if path:
                vedha_type = "Sammukha (Frontal)" if "sammukha" in name else "Vama (Left)" if "vama" in name else "Dakshina (Right)"
                paths.append({
                    "vedha_type": vedha_type,
                    "direction": name,
                    "cells": path
                })

        return paths
