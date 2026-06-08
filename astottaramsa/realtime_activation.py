# astottaramsa/realtime_activation.py

import asyncio


class RealtimeActivation:

    async def stream(self):

        while True:

            print(
                "Realtime D108 activation"
            )

            await asyncio.sleep(5)
