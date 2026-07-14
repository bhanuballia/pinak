class PhoneticEngine:

    LETTERS = [
        "अ", "आ", "इ", "ई",
        "उ", "ऊ", "ए", "ऐ"
    ]

    def activate(self, letter):

        return letter in self.LETTERS
