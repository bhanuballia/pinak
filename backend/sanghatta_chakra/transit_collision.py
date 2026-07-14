# sanghatta_chakra/transit_collision.py

class TransitCollision:

    def detect(
        self,
        saturn_house,
        mars_house
    ):

        collision = (
            abs(
                saturn_house
                -
                mars_house
            ) <= 1
        )

        return {

            "collision": collision

        }
