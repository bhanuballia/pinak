# tithi_pravesha/realtime_activation.py

import asyncio


class RealtimeActivation:

    async def stream(self):

        while True:

            print(
                "Realtime Tithi activation"
            )

            await asyncio.sleep(5)
