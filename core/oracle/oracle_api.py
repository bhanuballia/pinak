from fastapi import APIRouter
from .oracle_engine import oracle_answer

router = APIRouter()

@router.post("/oracle/ask")
def ask_oracle(data: dict):

    question = data["question"]
    chart = data["chart"]
    strength = data["strength"]
    dosha = data["dosha"]
    dasha = data["dasha"]
    cosmic = data["cosmic"]

    return oracle_answer(
        question,
        chart,
        strength,
        dosha,
        dasha,
        cosmic
    )
