# astottaramsa/sign_mapping.py

class SignMapping:

    def cyclic_mapping(
        self,
        base_sign,
        division
    ):

        return (
            base_sign + division
        ) % 12
