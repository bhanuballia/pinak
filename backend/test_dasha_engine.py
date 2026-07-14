from datetime import datetime
import sys
import os

# Add the current directory to sys.path to allow imports from dasha_engine
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dasha_engine.mahadasha import MahadashaEngine
from dasha_engine.antardasha import AntardashaEngine
from dasha_engine.pratyantar import PratyantarEngine
from dasha_engine.sukshma import SukshmaEngine
from dasha_engine.event_prediction import EventPredictionEngine
from dasha_engine.remedies import DashaRemedies
from dasha_engine.ai_writer import DashaAIWriter

def main():
    birth_date = datetime(1990, 10, 1)

    print("--- Initializing Mahadasha Engine ---")
    md_engine = MahadashaEngine(
        birth_date,
        moon_nakshatra_lord="Jupiter"
    )

    mahadashas = md_engine.generate()
    current_md = mahadashas[0]
    print(f"Current Mahadasha: {current_md['planet']} ({current_md['duration_years']} years)")

    print("\n--- Generating Antardashas ---")
    ad_engine = AntardashaEngine()
    antardashas = ad_engine.generate(
        current_md["planet"],
        current_md["duration_years"]
    )
    current_ad = antardashas[0]
    print(f"First Antardasha: {current_ad['planet']} ({current_ad['duration_years']} years)")

    print("\n--- Predicting Events ---")
    prediction_engine = EventPredictionEngine()
    predictions = prediction_engine.predict(
        current_md["planet"],
        current_ad["planet"],
        {}
    )

    print("\n--- Fetching Remedies ---")
    remedy_engine = DashaRemedies()
    remedies = remedy_engine.get_remedies(
        current_md["planet"]
    )

    print("\n--- Generating AI Summary ---\n")
    writer = DashaAIWriter()
    summary = writer.generate_summary(
        current_md["planet"],
        current_ad["planet"],
        predictions,
        remedies
    )

    print(summary)

if __name__ == "__main__":
    main()
