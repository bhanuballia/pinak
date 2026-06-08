# shadbala/shadbala_engine.py

from shadbala.sthana_bala import (
    calculate_sthana_bala
)

from shadbala.dig_bala import (
    calculate_dig_bala
)

from shadbala.kala_bala import (
    calculate_kala_bala
)

from shadbala.cheshta_bala import (
    calculate_cheshta_bala
)

from shadbala.naisargika_bala import (
    calculate_naisargika_bala
)

from shadbala.drik_bala import (
    calculate_drik_bala
)


class ShadbalaEngine:

    def compute(
        self,
        chart
    ):

        result = {}

        planets = list(
            chart.get("planet_positions", {}).keys()
        )

        for planet in planets:

            sthana = calculate_sthana_bala(
                chart,
                planet
            )

            dig = calculate_dig_bala(
                chart,
                planet
            )

            kala = calculate_kala_bala(
                chart,
                planet
            )

            cheshta = (
                calculate_cheshta_bala(
                    chart,
                    planet
                )
            )

            naisargika = (
                calculate_naisargika_bala(
                    planet
                )
            )

            drik = calculate_drik_bala(
                chart,
                planet
            )

            total = (
                sthana +
                dig +
                kala +
                cheshta +
                naisargika +
                drik
            )

            result[planet] = {

                "sthana":
                    round(sthana, 2),

                "dig":
                    round(dig, 2),

                "kala":
                    round(kala, 2),

                "cheshta":
                    round(cheshta, 2),

                "naisargika":
                    round(naisargika, 2),

                "drik":
                    round(drik, 2),

                "total":
                    round(total, 2)
            }

        return result
