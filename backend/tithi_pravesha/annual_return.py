# tithi_pravesha/annual_return.py

from datetime import datetime


class AnnualReturn:

    def generate(
        self,
        birth_date,
        year
    ):

        return {

            "return_year": year,
            "base_date": birth_date,
            "generated_at":
                str(datetime.utcnow())

        }
