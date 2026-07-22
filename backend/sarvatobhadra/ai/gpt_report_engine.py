from sarvatobhadra.nakshatra_grid import NakshatraGrid

class GPTReportEngine:

    def generate(self, data, personalized_context=None):
        if personalized_context:
            janma = personalized_context.get("janma_nakshatra") or "Rohini"
            antardasha = personalized_context.get("active_antardasha") or "Saturn"
            
            # Find the row/col coordinates of the Janma Nakshatra in the SBC grid
            grid = NakshatraGrid().build_grid()
            target_cell = next((c for c in grid if c["label"] == janma and c["type"] == "nakshatra"), None)
            
            hits = []
            if target_cell:
                target_r = target_cell["id"] // 9
                target_c = target_cell["id"] % 9
                
                # Check which transiting planets cast Vedha on these coordinates
                for item in data:
                    planet = item.get("planet")
                    nak = item.get("nakshatra")
                    paths = item.get("paths", [])
                    
                    is_hit = False
                    for path_obj in paths:
                        cells = path_obj.get("cells", [])
                        if [target_r, target_c] in cells:
                            is_hit = True
                            break
                            
                    if is_hit:
                        is_malefic = planet in ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]
                        impact = "malefic" if is_malefic else "benefic"
                        hits.append({
                            "planet": planet,
                            "nakshatra": nak,
                            "impact": impact
                        })
            
            if hits:
                sentences = []
                for hit in hits:
                    p = hit["planet"]
                    nak = hit["nakshatra"]
                    is_dasha_active = p.lower() == antardasha.lower()
                    dasha_str = f" (which is active in your current {antardasha} Antardasha)" if is_dasha_active else ""
                    
                    if hit["impact"] == "malefic":
                        sentences.append(f"Transit {p} in {nak} casts a malefic Vedha to your Janma Nakshatra ({janma}){dasha_str}, indicating potential hurdles, increased pressure, or slower progress.")
                    else:
                        sentences.append(f"Transit {p} in {nak} casts a supportive benefic Vedha to your Janma Nakshatra ({janma}){dasha_str}, bringing protective energies and opportunities.")
                
                return " ".join(sentences)
            else:
                return f"Currently, there are no direct planet Vedhas aspecting your Janma Nakshatra ({janma}). The general transit flow indicates a stable and neutral period, with standard focus on your current {antardasha} Antardasha activities."

        return """

        Sarvatobhadra Analysis Report

        Strong karmic activation detected.

        Transit overlays indicate
        important life developments.

        Marriage and financial sectors
        highly activated.

        """
