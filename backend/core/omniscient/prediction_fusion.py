def fuse_predictions(predictions, timeline, yogas, akashic):

    fused = {}

    for section, text in predictions.items():

        extra = ""

        if yogas:
            extra += " Powerful yogas influence outcomes."

        if akashic.get("soul_age", {}).get("stage") == "Ancient Soul":
            extra += " Decisions guided by deep karmic memory."

        if isinstance(text, dict):
            new_val = text.copy()
            new_val["text"] = new_val.get("text", "") + extra
            fused[section] = new_val
        else:
            fused[section] = str(text) + extra

    fused["timeline"] = timeline

    return fused
