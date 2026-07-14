from typing import Dict, Any

class DoshaCalculator:
    def __init__(self):
        self.gandamoola_nakshatras = [
            "Ashwini", "Ashlesha", "Magha", 
            "Jyeshtha", "Mula", "Revati"
        ]
        
    def calculate_panchaka(self, moon_sign: int) -> Dict[str, Any]:
        """
        Panchaka occurs when Moon is in Aquarius (11) or Pisces (12).
        """
        if moon_sign in [11, 12]:
            return {
                "active": True,
                "bhanga": False,
                "status": "Active",
                "description": "Panchaka is active (Moon is in Aquarius or Pisces). Generally avoided for auspicious events like building a house or traveling south.",
                "bhanga_reason": None,
                "remedies": [
                    "🚫 Strictly Avoid: Traveling South, repairing or building a house roof, buying wooden furniture or fuel, cremation without proper rituals.",
                    "✅ Safe to do: Routine daily tasks, spiritual practices, buying clothes or jewelry (if other muhurtas align)."
                ]
            }
        
        return {
            "active": False,
            "bhanga": False,
            "status": "Clear",
            "description": "Panchaka Dosha is not active.",
            "bhanga_reason": None,
            "remedies": [
                "✅ Safe to do: Since Panchaka is not active, you can proceed with all standard auspicious activities like house construction, buying furniture, and traveling south."
            ]
        }

    def calculate_bhadra(self, karana: str, moon_sign: int) -> Dict[str, Any]:
        """
        Bhadra Dosha occurs when the Karana is Vishti.
        Bhanga (Cancellation) based on Moon Sign:
        Swarga Loka (Heaven): Aries, Taurus, Gemini, Scorpio -> Benign/Auspicious
        Patala Loka (Underworld): Virgo, Libra, Sagittarius, Capricorn -> Wealth giving
        Mrityu Loka (Earth): Cancer, Leo, Aquarius, Pisces -> Highly Malefic (No Bhanga)
        """
        if karana.lower() != "vishti":
            return {
                "active": False,
                "bhanga": False,
                "status": "Clear",
                "description": "Bhadra Dosha is not active (Karana is not Vishti).",
                "bhanga_reason": None,
                "remedies": [
                    "✅ Safe to do: No Bhadra Dosha is present. Auspicious tasks like marriage, Griha Pravesh, and business inaugurations can safely proceed if other muhurtas align."
                ]
            }

        # Bhadra is active, check for Bhanga
        # 1=Aries, 2=Taurus, 3=Gemini, 8=Scorpio (Swarga)
        swarga = [1, 2, 3, 8]
        # 6=Virgo, 7=Libra, 9=Sagittarius, 10=Capricorn (Patala)
        patala = [6, 7, 9, 10]
        # 4=Cancer, 5=Leo, 11=Aquarius, 12=Pisces (Mrityu)

        if moon_sign in swarga:
            return {
                "active": True,
                "bhanga": True,
                "status": "Cancelled",
                "description": "Bhadra is active, but it resides in Swarga Loka (Heaven).",
                "bhanga_reason": "Bhadra is cancelled and becomes auspicious because the Moon is in Aries, Taurus, Gemini, or Scorpio.",
                "remedies": ["✅ Safe to do: Auspicious activities can proceed as Bhadra is residing in Swarga (Heaven) and gives good results."]
            }
        elif moon_sign in patala:
            return {
                "active": True,
                "bhanga": True,
                "status": "Cancelled",
                "description": "Bhadra is active, but it resides in Patala Loka (Underworld).",
                "bhanga_reason": "Bhadra is cancelled and becomes wealth-giving because the Moon is in Virgo, Libra, Sagittarius, or Capricorn.",
                "remedies": ["✅ Safe to do: Auspicious activities can proceed as Bhadra is residing in Patala (Underworld) and gives wealth."]
            }
        else:
            return {
                "active": True,
                "bhanga": False,
                "status": "Active",
                "description": "Bhadra is active and highly malefic (Mrityu Loka).",
                "bhanga_reason": "Moon is in Cancer, Leo, Aquarius, or Pisces. Bhadra is highly destructive on Earth. Strictly avoid auspicious tasks.",
                "remedies": [
                    "🚫 Strictly Avoid: Marriage, starting a new business, entering a new home (Griha Pravesh), long journeys.",
                    "✅ Safe to do: Destructive acts like surgery, filing lawsuits, cutting trees, lighting fires, or fierce spiritual sadhanas."
                ]
            }

    def calculate_gandamoola(self, nakshatra: str, pada: int) -> Dict[str, Any]:
        """
        Gandamoola occurs when Moon is in Ketu or Mercury ruled Nakshatras.
        Bhanga logic varies slightly by text, but generally:
        - Revati pada 4 is bad, others might be okay.
        - Ashwini pada 1 is bad, others okay.
        - Magha pada 1 is bad.
        - Ashlesha pada 4 is bad.
        - Mula pada 1 and 2 are bad.
        - Jyeshtha pada 4 is bad.
        For simplicity, we check if the pada is the exact junction (Gandanata).
        Junction padas: 
        Ashwini (1), Magha (1), Mula (1) -> Starting padas
        Ashlesha (4), Jyeshtha (4), Revati (4) -> Ending padas
        """
        if nakshatra not in self.gandamoola_nakshatras:
            return {
                "active": False,
                "bhanga": False,
                "status": "Clear",
                "description": f"Gandamoola Dosha is not active.",
                "bhanga_reason": None,
                "remedies": [
                    "✅ Safe to do: Birth/Event did not occur in a Gandamoola Nakshatra. No special Shanti Pooja is required for this placement."
                ]
            }

        # It is a Gandamoola Nakshatra. Check if it's the specific bad pada.
        bad_padas = {
            "Ashwini": [1],
            "Magha": [1],
            "Mula": [1, 2],
            "Ashlesha": [4],
            "Jyeshtha": [4],
            "Revati": [4]
        }

        if pada in bad_padas.get(nakshatra, []):
            return {
                "active": True,
                "bhanga": False,
                "status": "Active",
                "description": f"Gandamoola Dosha is highly active (Nakshatra: {nakshatra}, Pada: {pada}).",
                "bhanga_reason": "Moon is in the exact Gandanta (junction) quarter. Intense Shanti Pooja is typically recommended.",
                "remedies": [
                    "🚫 Strictly Avoid: Starting major life events without performing the Gandamoola Shanti Pooja.",
                    "✅ What to do: Perform Shanti Pooja exactly 27 days after birth when the Moon returns to this Nakshatra. Donate green or black items."
                ]
            }
        else:
            return {
                "active": True,
                "bhanga": True,
                "status": "Cancelled",
                "description": f"Gandamoola Dosha is active (Nakshatra: {nakshatra}, Pada: {pada}).",
                "bhanga_reason": f"Bhanga applies because the Moon is NOT in the dangerous Gandanta Pada. The malefic effects are largely neutralized.",
                "remedies": [
                    "✅ Safe to do: Since it's in a safe pada, regular activities are fine. A minor Shanti Homa is optional for peace of mind."
                ]
            }

    def evaluate_doshas(self, moon_sign: int, karana: str, nakshatra: str, pada: int) -> Dict[str, Any]:
        return {
            "panchaka": self.calculate_panchaka(moon_sign),
            "bhadra": self.calculate_bhadra(karana, moon_sign),
            "gandamoola": self.calculate_gandamoola(nakshatra, pada)
        }
