# ayanamsha/precision_validator.py

class PrecisionValidator:

    def validate(
        self,
        expected,
        calculated
    ):

        diff = abs(
            expected - calculated
        )

        return {
            "difference": diff,
            "valid": diff < 0.01
        }
