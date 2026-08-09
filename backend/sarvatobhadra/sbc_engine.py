from sarvatobhadra.nakshatra_grid import NakshatraGrid
from sarvatobhadra.vedha_engine import VedhaEngine
from sarvatobhadra.transit_activation import TransitActivation
from sarvatobhadra.ai.gpt_report_engine import GPTReportEngine

class SarvatobhadraEngine:

    def generate(self, transit_data, birth_data=None):

        grid = NakshatraGrid().build_grid()

        activations = TransitActivation().activate(
            transit_data
        )

        vedha = VedhaEngine().calculate(
            grid, activations
        )
        
        # Build personalized context if birth_data is provided
        personalized_context = None
        if birth_data:
            natal_moon_nak = None
            dasha_lord = None
            if isinstance(birth_data, dict):
                # 1. Inspect planet_positions (array of objects)
                planet_positions = birth_data.get("planet_positions", [])
                if isinstance(planet_positions, list):
                    for p in planet_positions:
                        if isinstance(p, dict) and p.get("planet") == "Moon":
                            natal_moon_nak = p.get("nakshatra") or p.get("nakshatra_name")
                
                # 2. Inspect chart -> planets
                if not natal_moon_nak:
                    chart = birth_data.get("chart", {})
                    if isinstance(chart, dict):
                        planets = chart.get("planets", [])
                        if isinstance(planets, list):
                            for p in planets:
                                if isinstance(p, dict) and (p.get("name") == "Moon" or p.get("planet") == "Moon"):
                                    natal_moon_nak = p.get("nakshatra")

                # 3. Inspect active dasha
                active_dasha = birth_data.get("active_dasha") or birth_data.get("current_dasha") or birth_data.get("dasha", {})
                if isinstance(active_dasha, dict):
                    dasha_lord = active_dasha.get("antardasha") or active_dasha.get("mahadasha") or active_dasha.get("lord")
                
                personalized_context = {
                    "janma_nakshatra": natal_moon_nak or "Rohini",
                    "active_antardasha": dasha_lord or "Saturn",
                    "transit_planets": transit_data
                }

        report = GPTReportEngine().generate(vedha, personalized_context=personalized_context)

        return {
            "grid": grid,
            "activations": activations,
            "vedha": vedha,
            "report": report
        }
