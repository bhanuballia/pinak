# ayanamsha/realtime_precession.py

import asyncio


class RealtimePrecession:

    async def stream(self):

        while True:

            print(
                "Realtime precession update"
            )

            await asyncio.sleep(5)
