class TransitActivationEngine:

    def check_activation(
        self,
        transit_jupiter_house,
        transit_saturn_house,
        natal_7th_house
    ):

        activation = {
            "marriage_activation": False,
            "career_activation": False,
            "wealth_activation": False
        }

        if transit_jupiter_house == natal_7th_house:
            activation["marriage_activation"] = True

        if transit_saturn_house == 10:
            activation["career_activation"] = True

        if transit_jupiter_house in [2, 11]:
            activation["wealth_activation"] = True

        return activation


class TransitActivationScoring:

    def score(
        self,
        transit_jupiter_house,
        transit_saturn_house,
        natal_house
    ):

        score = 0

        if transit_jupiter_house == natal_house:
            score += 40

        if transit_saturn_house == natal_house:
            score += 25

        if transit_jupiter_house in [2,5,7,9,11]:
            score += 20

        return min(score, 100)
