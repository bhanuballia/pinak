from api.main import app
import sys

for route in app.routes:
    print(f"{getattr(route, 'methods', 'WS')} {route.path}")
