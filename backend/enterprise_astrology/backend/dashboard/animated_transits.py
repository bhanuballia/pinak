# backend/dashboard/animated_transits.py

class AnimatedTransits:
    def interpolate_degrees(self, start_deg: float, end_deg: float, steps: int = 10):
        """
        Linearly interpolate between two longitudes in degrees, taking the shortest circular path.
        """
        # Ensure values are within 0-360
        start = start_deg % 360
        end = end_deg % 360
        
        # Calculate the direct difference
        diff = end - start
        
        # Adjust for circular shortest path
        if diff > 180:
            diff -= 360
        elif diff < -180:
            diff += 360
            
        path = []
        for i in range(steps + 1):
            fraction = i / float(steps)
            current = (start + diff * fraction) % 360
            path.append(round(current, 4))
            
        return path
