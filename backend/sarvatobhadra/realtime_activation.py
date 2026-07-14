import asyncio


class RealtimeActivation:

    async def stream(self):

        while True:

            print("Realtime transit activation")

            await asyncio.sleep(5)
