# backend/api/quantum_numerology_engine.py
"""
Quantum Numerology Engine
Fuses Vedic Astrology planetary alignments, Lo Shu 3x3 Grid Superposition,
and Frequency Resonance Matrix calculations.
"""

from typing import Dict, List, Any
import datetime

# Planetary & Frequency Map
PLANET_FREQUENCY_MAP = {
    1: {"planet": "Sun", "mantra": "Om Hram Hreem Hroum Sah Suryaya Namaha", "solfeggio": 528, "element": "Fire", "vibration": "Alpha (111 Hz)"},
    2: {"planet": "Moon", "mantra": "Om Shram Shreem Shroum Sah Chandraya Namaha", "solfeggio": 432, "element": "Water", "vibration": "Theta (222 Hz)"},
    3: {"planet": "Jupiter", "mantra": "Om Gram Greem Groum Sah Gurave Namaha", "solfeggio": 639, "element": "Ether", "vibration": "Delta (333 Hz)"},
    4: {"planet": "Rahu", "mantra": "Om Bhram Bhreem Bhroum Sah Rahave Namaha", "solfeggio": 741, "element": "Air/Shadow", "vibration": "Gamma (444 Hz)"},
    5: {"planet": "Mercury", "mantra": "Om Bram Breem Broum Sah Budhaya Namaha", "solfeggio": 852, "element": "Earth/Air", "vibration": "Beta (555 Hz)"},
    6: {"planet": "Venus", "mantra": "Om Dram Dreem Droum Sah Shukraya Namaha", "solfeggio": 963, "element": "Water/Luxury", "vibration": "Epsilon (666 Hz)"},
    7: {"planet": "Ketu", "mantra": "Om Stram Streem Stroum Sah Ketave Namaha", "solfeggio": 174, "element": "Fire/Moksha", "vibration": "Lambda (777 Hz)"},
    8: {"planet": "Saturn", "mantra": "Om Pram Preem Proum Sah Shanaishcharaya Namaha", "solfeggio": 285, "element": "Earth/Karma", "vibration": "Sub-Delta (888 Hz)"},
    9: {"planet": "Mars", "mantra": "Om Kram Kreem Kroum Sah Bhaumaya Namaha", "solfeggio": 396, "element": "Fire/Action", "vibration": "High Beta (999 Hz)"}
}

CHALDEAN_MAP = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3,
    'H': 5, 'I': 1, 'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5,
    'O': 7, 'P': 8, 'Q': 1, 'R': 2, 'S': 3, 'T': 4, 'U': 6,
    'V': 6, 'W': 6, 'X': 5, 'Y': 1, 'Z': 7
}

def reduce_to_single_digit(n: int) -> int:
    while n > 9:
        n = sum(int(d) for d in str(n))
    return n

def calculate_name_quantum_frequency(name: str) -> Dict[str, Any]:
    if not name:
        return {"name_number": 0, "frequency_hz": 432, "quantum_state": "Zero Point"}
    total = sum(CHALDEAN_MAP.get(char.upper(), 0) for char in name)
    single_digit = reduce_to_single_digit(total)
    freq_info = PLANET_FREQUENCY_MAP.get(single_digit, {"solfeggio": 528, "vibration": "Standard"})
    return {
        "raw_total": total,
        "name_number": single_digit,
        "frequency_hz": freq_info["solfeggio"],
        "vibration_mode": freq_info["vibration"],
        "ruling_planet": freq_info["planet"]
    }

def compute_quantum_grid_superposition(dob: str) -> Dict[str, Any]:
    """
    Parses birth date YYYY-MM-DD or DD/MM/YYYY into Lo Shu Quantum Grid
    Categorizes numbers into Active Superposition (>=2), Latent (1), and Quantum Void (0).
    """
    digits = [int(c) for c in dob if c.isdigit()]
    grid_counts = {i: 0 for i in range(1, 10)}
    
    for d in digits:
        if d in grid_counts:
            grid_counts[d] += 1
            
    mulank = reduce_to_single_digit(digits[0] * 10 + digits[1]) if len(digits) >= 2 else 0
    bhagyank = reduce_to_single_digit(sum(digits))
    
    # Categorize states
    active_superposition = [num for num, count in grid_counts.items() if count >= 2]
    latent_states = [num for num, count in grid_counts.items() if count == 1]
    quantum_voids = [num for num, count in grid_counts.items() if count == 0]
    
    grid_analysis = []
    for num in range(1, 10):
        count = grid_counts[num]
        planet_data = PLANET_FREQUENCY_MAP[num]
        state = "Superposition (Amplified)" if count >= 2 else ("Latent" if count == 1 else "Quantum Void")
        grid_analysis.append({
            "number": num,
            "count": count,
            "state": state,
            "planet": planet_data["planet"],
            "solfeggio": planet_data["solfeggio"],
            "element": planet_data["element"]
        })
        
    return {
        "mulank": mulank,
        "bhagyank": bhagyank,
        "grid_counts": grid_counts,
        "grid_analysis": grid_analysis,
        "active_superposition": active_superposition,
        "latent_states": latent_states,
        "quantum_voids": quantum_voids
    }

def calculate_quantum_resonance(dob: str, name: str) -> Dict[str, Any]:
    grid_info = compute_quantum_grid_superposition(dob)
    name_info = calculate_name_quantum_frequency(name)
    
    # Calculate Phase Coherence between Life Path (Bhagyank), Driver (Mulank), and Name Frequency
    mulank = grid_info["mulank"]
    bhagyank = grid_info["bhagyank"]
    namank = name_info["name_number"]
    
    # Phase Coherence Formula
    harmony_score = 100 - (abs(mulank - namank) * 10 + abs(bhagyank - namank) * 5)
    harmony_score = max(35, min(98, harmony_score))
    
    # Void Remedies
    remedies = []
    for void_num in grid_info["quantum_voids"][:3]: # top 3 missing
        p_info = PLANET_FREQUENCY_MAP[void_num]
        remedies.append({
            "missing_number": void_num,
            "planet": p_info["planet"],
            "solfeggio_freq": f"{p_info['solfeggio']} Hz",
            "bija_mantra": p_info["mantra"],
            "quantum_tuning": f"Listen to {p_info['solfeggio']} Hz audio for 11 mins daily to fill the {p_info['planet']} Void."
        })
        
    return {
        "dob": dob,
        "name": name,
        "quantum_grid": grid_info,
        "name_frequency": name_info,
        "phase_coherence_percent": harmony_score,
        "quantum_entanglement_status": "Constructive Resonance" if harmony_score >= 75 else "Quantum Phase Shift Required",
        "quantum_remedies": remedies
    }
