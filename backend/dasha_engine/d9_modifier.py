class D9ModifierEngine:

    def modify(self, dasha_score, d9_strength):

        if d9_strength >= 15:
            dasha_score *= 1.25

        elif d9_strength <= 7:
            dasha_score *= 0.75

        return round(dasha_score, 2)
