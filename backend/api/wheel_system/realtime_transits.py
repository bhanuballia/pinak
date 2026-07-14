# wheel_system/realtime_transits.py

import time


class RealtimeTransits:

    def stream(self, callback):

        while True:

            callback()

            time.sleep(1)
