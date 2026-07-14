# jaimini_system/sign_direction.py

ODD_SIGNS = [1, 3, 5, 7, 9, 11]
EVEN_SIGNS = [2, 4, 6, 8, 10, 12]

class SignDirection:
    @staticmethod
    def is_forward(sign):
        return sign in ODD_SIGNS

    @staticmethod
    def next_sign(current, forward=True):
        if forward:
            return ((current) % 12) + 1
        return ((current - 2) % 12) + 1
