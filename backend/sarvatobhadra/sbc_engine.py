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
            if isinstance(birth_data, dict):
                # Try to find natal Moon Nakshatra
                chart = birth_data.get("chart", {})
                if isinstance(chart, dict):
                    planets = chart.get("planets", [])
                    if isinstance(planets, list):
                        for p in planets:
                            if isinstance(p, dict) and p.get("name") == "Moon":
                                natal_moon_nak = p.get("nakshatra")

                # Try to find active Dasha/Antardasha lord
                # If not found directly, check standard locations in the payload
                dasha_lord = birth_data.get("active_dasha", {}).get("antardasha") or birth_data.get("active_dasha", {}).get("mahadasha") or "Saturn"
                
                personalized_context = {
                    "janma_nakshatra": natal_moon_nak or "Rohini",
                    "active_antardasha": dasha_lord,
                    "transit_planets": transit_data
                }

        report = GPTReportEngine().generate(vedha, personalized_context=personalized_context)

        return {
            "grid": grid,
            "activations": activations,
            "vedha": vedha,
            "report": report
        }
