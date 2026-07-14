
from core.wealth.wealth_engine import run_wealth_engine

def run_main_analysis_pipeline(report_data):
    """
    Orchestrates the advanced analysis modules.
    """
    # 1. Run Wealth Prediction Engine
    wealth = run_wealth_engine(report_data)
    report_data["wealth_prediction"] = wealth
    
    # You can add other specialized engines here (Marriage, Health, etc.)
    
    return report_data
