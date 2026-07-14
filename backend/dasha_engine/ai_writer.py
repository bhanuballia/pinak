class DashaAIWriter:

    def generate_summary(
        self,
        mahadasha,
        antardasha,
        predictions,
        remedies
    ):

        text = []

        text.append(
            f"You are currently running {mahadasha} Mahadasha and {antardasha} Antardasha."
        )

        text.append("\nCareer Indications:")

        for item in predictions.get("career", []):
            text.append(f"- {item}")

        text.append("\nMarriage Indications:")

        for item in predictions.get("marriage", []):
            text.append(f"- {item}")

        text.append("\nWealth Indications:")

        for item in predictions.get("wealth", []):
            text.append(f"- {item}")

        text.append("\nHealth Indications:")

        for item in predictions.get("health", []):
            text.append(f"- {item}")

        text.append("\nRecommended Remedies:")

        for item in remedies:
            text.append(f"- {item}")

        return "\n".join(text)
