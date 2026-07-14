from sarvatobhadra.nakshatra_grid import NakshatraGrid
from sarvatobhadra.vedha_engine import VedhaEngine
from sarvatobhadra.transit_activation import TransitActivation
from sarvatobhadra.ai.gpt_report_engine import GPTReportEngine

class SarvatobhadraEngine:

    def generate(self, transit_data):

        grid = NakshatraGrid().build_grid()

        activations = TransitActivation().activate(
            transit_data
        )

        vedha = VedhaEngine().calculate(
            grid, activations
        )
        
        report = GPTReportEngine().generate(vedha)

        return {
            "grid": grid,
            "activations": activations,
            "vedha": vedha,
            "report": report
        }
