# nakshatra_advanced/heatmaps/chakra_visualizer.py

def map_nakshatras_to_chakras(nakshatra_name: str):
    """
    Stub mapping 27 Nakshatras to the 7 major human energy chakras.
    """
    chakra_map = {
        "Ashwini": "Muladhara",
        "Bharani": "Muladhara",
        "Rohini": "Anahata"
    }
    return chakra_map.get(nakshatra_name, "Sahasrara")
