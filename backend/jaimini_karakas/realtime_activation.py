# jaimini_karakas/realtime_activation.py

import asyncio


class RealtimeActivation:

    async def stream(self):

        while True:

            print(

                "Realtime Karaka activation"

            )

            await asyncio.sleep(5)
