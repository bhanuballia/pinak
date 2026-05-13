def build_oracle_response(question, intent, context):

    if intent == "career":
        dec = context.get("decision", {})
        return (
            f"Oracle Insight:\n"
            f"{dec.get('decision')} "
            f"Confidence: {dec.get('confidence')}%.\n"
            f"{dec.get('reason')}"
        )

    if intent == "relationship":

        manglik = context.get("dosha", {}).get("present")

        if manglik:
            return (
                "Oracle Insight:\n"
                "Relationship energy exists but requires patience and karmic balance."
            )

        return (
            "Oracle Insight:\n"
            "Planetary harmony supports emotional connection."
        )

    if intent == "finance":
        j = context.get("jupiter_strength", 50)

        if j > 70:
            return "Oracle Insight:\nStrong expansion period for wealth growth."

        return "Oracle Insight:\nMaintain steady financial discipline."

    return "Oracle Insight:\nThe cosmic signals are balanced. Observe patiently."
