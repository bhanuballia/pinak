# api/routes/karaka_routes.py

from fastapi import APIRouter

from jaimini_karakas.karaka_engine import (
    KarakaEngine
)

router = APIRouter()


@router.post("/karakas")

def calculate_karakas():

    planets = {

        "Sun": 18.2,
        "Moon": 20.5,
        "Mars": 5.1,
        "Mercury": 11.7,
        "Jupiter": 2.9,
        "Venus": 29.1,
        "Saturn": 25.4

    }

    result = (
        KarakaEngine()
        .calculate(planets)
    )

    return result
