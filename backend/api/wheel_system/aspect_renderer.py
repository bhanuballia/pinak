# wheel_system/aspect_renderer.py

class AspectRenderer:

    ASPECTS = {
        "conjunction": 0,
        "opposition": 180,
        "trine": 120,
        "square": 90
    }

    def detect_aspect(self, p1, p2):

        diff = abs(p1 - p2)

        if diff > 180:
            diff = 360 - diff

        for aspect, angle in self.ASPECTS.items():

            if abs(diff - angle) <= 5:
                return aspect

        return None
