# tithi_pravesha/tithi_return.py

class TithiReturn:

    def find_return(
        self,
        natal_difference,
        current_difference
    ):

        difference = abs(
            natal_difference
            -
            current_difference
        )

        return {

            "matched":
                difference < 0.01,

            "difference":
                round(difference, 5)

        }
