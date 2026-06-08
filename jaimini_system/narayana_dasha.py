# jaimini_system/narayana_dasha.py

class NarayanaDasha:
    def calculate(self, lagna_sign):
        periods = []
        for i in range(12):
            sign = ((lagna_sign + i - 1) % 12) + 1
            periods.append({
                "sign": sign,
                "years": sign
            })
        return periods
