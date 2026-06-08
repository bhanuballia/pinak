# wheel_system/collision_avoidance.py

class CollisionAvoidance:

    def spread(self, positions):

        adjusted = []

        for i, pos in enumerate(positions):

            pos["y"] += i * 12

            adjusted.append(pos)

        return adjusted
