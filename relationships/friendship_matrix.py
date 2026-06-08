# relationships/friendship_matrix.py

from relationships.natural_relationships import get_natural_relationship
from relationships.temporary_relationships import get_temporary_relationship
from relationships.compound_relationships import get_compound_relationship

class FriendshipMatrix:

    def build(self, planet_positions):
        natural_matrix = {}
        temporary_matrix = {}
        compound_matrix = {}

        planets = list(planet_positions.keys())

        for p1 in planets:
            natural_matrix[p1] = {}
            temporary_matrix[p1] = {}
            compound_matrix[p1] = {}

            for p2 in planets:
                if p1 == p2:
                    natural_matrix[p1][p2] = "-"
                    temporary_matrix[p1][p2] = "-"
                    compound_matrix[p1][p2] = "-"
                    continue

                # Natural
                nat = get_natural_relationship(p1, p2)
                natural_matrix[p1][p2] = nat

                # Temporary
                temp = get_temporary_relationship(
                    planet_positions[p1],
                    planet_positions[p2]
                )
                temporary_matrix[p1][p2] = temp

                # Compound
                comp = get_compound_relationship(
                    p1,
                    p2,
                    planet_positions[p1],
                    planet_positions[p2]
                )
                compound_matrix[p1][p2] = comp

        return {
            "natural": natural_matrix,
            "temporary": temporary_matrix,
            "compound": compound_matrix
        }
