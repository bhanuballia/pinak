from datetime import datetime
from dateutil.relativedelta import relativedelta
import random

class MonthlyPredictionTimeline:

    def generate(self, start_date, months=12):
        
        predictions = [
            ("High career momentum. Favorable transits in the 10th house indicate professional growth and recognition.", "High"),
            ("Focus on financial consolidation. Watch out for unexpected expenses and avoid risky investments.", "Moderate"),
            ("Excellent period for relationships. Venus transit brings harmony, romance, and new social connections.", "High"),
            ("Stable planetary activity. This is a grounded period best used for planning and routine work.", "Moderate"),
            ("Karmic shifts expected. A highly favorable time for spiritual growth, meditation, and deep introspection.", "Intense"),
            ("Health requires attention. Saturn's aspect suggests a need for adequate rest and a strict routine.", "Caution"),
            ("Sudden gains possible. Jupiter aspects the 11th house strongly, bringing opportunities for wealth.", "High"),
            ("Travel indicated. A very favorable period for learning, higher education, and expanding horizons.", "Moderate"),
            ("Communication is key. Mercury's position favors negotiations, writing, and resolving past conflicts.", "Moderate"),
            ("Dynamic energy levels. Mars transit gives you the drive to initiate new projects and overcome obstacles.", "Intense")
        ]

        result = []
        current = start_date

        # Use a seed based on the start_date year and month to keep it consistent for the same request
        random.seed(start_date.year + start_date.month)

        for i in range(months):
            # Select a semi-random prediction, ensuring variation
            pred_idx = (i + random.randint(0, 5)) % len(predictions)
            pred_text, intensity = predictions[pred_idx]

            result.append({
                "month": current.strftime("%B %Y"),
                "prediction": pred_text,
                "intensity": intensity
            })

            current += relativedelta(months=1)

        return result
