class GovernmentServiceYoga:
    """
    Detects government service and administrative authority yogas.
    Requires strong Sun/Saturn and specific 10H placements.
    """
    def detect(
        self,
        sun_strength,
        saturn_strength,
        tenth_house
    ):
        if (
            sun_strength > 70
            and saturn_strength > 70
            and tenth_house == 10
        ):
            return {
                "government_service": True,
                "type": "Administrative Authority"
            }

        return {
            "government_service": False
        }
