# sanghatta_chakra/sanghatta_engine.py

from sanghatta_chakra.tara_engine import (
    TaraEngine
)

from sanghatta_chakra.suffering_index import (
    SufferingIndex
)

from sanghatta_chakra.event_probability import (
    EventProbability
)


class SanghattaEngine:

    def analyze(
        self,
        natal_nakshatra,
        transit_nakshatra,
        saturn,
        mars,
        rahu
    ):

        tara = TaraEngine().calculate(
            natal_nakshatra,
            transit_nakshatra
        )

        suffering = (
            SufferingIndex()
            .calculate(
                saturn,
                mars,
                rahu
            )
        )

        probability = (
            EventProbability()
            .predict(suffering)
        )

        return {

            "tara": tara,
            "suffering": suffering,
            "probability": probability

        }
