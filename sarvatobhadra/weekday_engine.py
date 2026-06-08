from datetime import datetime


class WeekdayEngine:

    def get_today(self):

        return datetime.now().strftime("%A")
