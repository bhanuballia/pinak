# nakshatra_advanced/dasha_sync/dasha_nakshatra_sync.py

class DashaNakshatraSync:

    def synchronize(
        self,
        dasha_lord,
        transit_lord,
        natal_lord
    ):

        score = 0

        if dasha_lord == natal_lord:
            score += 40

        if transit_lord == natal_lord:
            score += 30

        if dasha_lord == transit_lord:
            score += 30

        return score
