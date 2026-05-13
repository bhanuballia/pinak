from reports.report_data import assemble_report_data
import time

def debug_rishi():
    print("starting assemble...")
    data = assemble_report_data('Test', '1990-01-01', '12:00:00', 5.5, 28.61, 77.21)
    
    print("importing rishi modules...")
    from core.rishi.neural_mode import run_rishi_neural_mode
    from core.rishi.pattern_memory import learn_from_chart
    from core.rishi.adaptive_strength import adjust_prediction_strength
    
    print("calling run_rishi_neural_mode...")
    t = time.time()
    data = run_rishi_neural_mode(data)
    print(f"done run_rishi_neural_mode in {time.time()-t:.2f}s")
    
    print("calling learn_from_chart...")
    t = time.time()
    learn_from_chart(data)
    print(f"done learn_from_chart in {time.time()-t:.2f}s")
    
    print("calling adjust_prediction_strength...")
    t = time.time()
    data["rishi_strength"] = adjust_prediction_strength(data)
    print(f"done adjust_prediction_strength in {time.time()-t:.2f}s")

if __name__ == '__main__':
    debug_rishi()
