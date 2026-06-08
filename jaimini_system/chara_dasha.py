# jaimini_system/chara_dasha.py

from datetime import datetime, timedelta
from .sign_direction import SignDirection

class CharaDasha:
    def calculate(self, start_sign, years=12):
        result = []
        current = start_sign
        current_date = datetime.now()
        forward = SignDirection.is_forward(start_sign)

        for _ in range(years):
            next_date = current_date + timedelta(days=365)
            result.append({
                "sign": current,
                "start": current_date.date(),
                "end": next_date.date()
            })
            current = SignDirection.next_sign(current, forward)
            current_date = next_date
        return result
