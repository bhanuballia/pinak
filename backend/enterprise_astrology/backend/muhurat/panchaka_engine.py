# backend/muhurat/panchaka_engine.py

class PanchakaEngine:
    PANCHAKA_DOSHAS = {
        1: "Mrityu Panchaka (Danger of death/severe distress)",
        2: "Agni Panchaka (Danger of fire/disaster/severe disputes)",
        4: "Raja Panchaka (Danger of state/regulatory disputes or loss of status)",
        6: "Chora Panchaka (Danger of theft, fraud, or financial loss)",
        8: "Roga Panchaka (Danger of illness, disease, or extreme physical weakness)"
    }

    def evaluate_panchaka(self, tithi_idx: int, day_idx: int, nakshatra_idx: int, lagna_idx: int):
        """
        Evaluate Panchaka Dosha (5 pillars of destruction) using classical Vedic formula:
        (Tithi + Vara + Nakshatra + Lagna) % 9
        """
        # Vara: Sunday=1, Monday=2, ... Saturday=7
        total = tithi_idx + day_idx + nakshatra_idx + lagna_idx
        remainder = total % 9
        
        dosha_name = self.PANCHAKA_DOSHAS.get(remainder, None)
        is_adverse = dosha_name is not None
        
        return {
            "remainder": remainder,
            "has_dosha": is_adverse,
            "dosha_name": dosha_name if is_adverse else "No Panchaka Dosha (Auspicious / Safe)",
            "score": 20 if is_adverse else 100
        }
