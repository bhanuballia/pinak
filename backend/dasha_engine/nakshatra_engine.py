NAKSHATRAS = [
    "Ashwini","Bharani","Krittika","Rohini",
    "Mrigashira","Ardra","Punarvasu","Pushya",
    "Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
    "Hasta","Chitra","Swati","Vishakha",
    "Anuradha","Jyeshtha","Mula","Purva Ashadha",
    "Uttara Ashadha","Shravana","Dhanishta","Shatabhisha",
    "Purva Bhadrapada","Uttara Bhadrapada","Revati"
]


class NakshatraEngine:

    def calculate(self, longitude):

        nak_length = 13.3333333333

        nak_index = int(longitude / nak_length)

        pada_length = nak_length / 4

        remainder = longitude % nak_length

        pada = int(remainder / pada_length) + 1

        return {
            "nakshatra": NAKSHATRAS[nak_index],
            "pada": pada
        }
