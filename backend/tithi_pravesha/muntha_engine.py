# tithi_pravesha/muntha_engine.py

class MunthaEngine:

    def calculate(
        self,
        age
    ):

        return {

            "muntha_house":
                ((age % 12) + 1)

        }
