# sanghatta_chakra/websocket_server.py

from fastapi import WebSocket


class WebSocketServer:

    async def connect(

        self,
        websocket: WebSocket

    ):

        await websocket.accept()

        while True:

            await websocket.send_json({

                "event":
                    "Critical Sanghatta Activation"

            })
