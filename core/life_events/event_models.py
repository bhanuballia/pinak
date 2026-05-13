from dataclasses import dataclass

@dataclass
class LifeEvent:
    year: int
    category: str
    title: str
    intensity: float
    summary: str
