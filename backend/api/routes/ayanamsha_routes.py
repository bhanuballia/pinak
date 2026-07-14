# api/routes/ayanamsha_routes.py

from fastapi import APIRouter

from ayanamsha.true_chitra import (
    TrueChitraAyanamsha
)

router = APIRouter()


@router.get("/ayanamsha")

def get_ayanamsha():

    engine = (
        TrueChitraAyanamsha()
    )

    value = engine.calculate(
        203.8375
    )

    return {
        "true_chitra":
            value
    }
