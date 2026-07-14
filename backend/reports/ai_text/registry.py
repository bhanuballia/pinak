from .dosha_explainer import explain_dosha
from .varga_explainer import generate_all_varga_explanations

def generate_ai_text(report_data: dict, style="minimal") -> dict:
    output = {}

    # Map internal dosha names to report keys
    dosha_map = {
        "Kalsarpa": "kalsarpa_dosha",
        "Manglik": "manglik_dosha",
        "Pitra": "pitra_dosha", 
        "SadeSati": "sadesati_analysis"
    }

    for dosha in report_data.get("dosha", {}).values():
        if dosha.get("present"):
            explanation = explain_dosha(dosha, style=style)
            # explanation has {title, en, hi, ...}
            # key for output
            d_name = dosha.get("dosha")
            out_key = dosha_map.get(d_name, d_name.lower() + "_dosha")
            
            # Store as dictionary for PDF generator language selection
            output[out_key] = {
                "en": explanation['en'],
                "hi": explanation['hi']
            }
    
    # Generate varga chart explanations
    varga_explanations = generate_all_varga_explanations(report_data, style=style)
    output["varga_explanations"] = varga_explanations

    return output

