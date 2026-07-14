from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/locations/search")
def search_locations(q: str):
    return [
        {"display_name": f"{q}, India", "lat": 28.6139, "lon": 77.2090},
        {"display_name": f"{q}, USA", "lat": 40.7128, "lon": -74.0060},
    ]

@app.post("/api/report/generate-report")
def generate_report(payload: dict = Body(...)):
    # Return a dummy PDF URL or just a success message
    return JSONResponse({"url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
