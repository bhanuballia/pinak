# jaimini_pro/authentic_rules/bpjs_rules.py
class BPHSJaiminiRules:
    CHARA_SIGN_DIRECTIONS = { "odd": "forward", "even": "reverse" }
    RASHI_ASPECTS = { "movable": "fixed", "fixed": "dual", "dual": "movable" }
    ARGALA_HOUSES = [2, 4, 11]
    VIRODH_ARGALA = { 2: 12, 4: 10, 11: 3 }
