# nakshatra/nakshatra_visualizer.py

def render_nakshatra(data):

    return f"""
    Nakshatra : {data['nakshatra']}
    Lord      : {data['lord']}
    Pada      : {data['pada']}
    Degrees   : {data['degrees_inside']}
    """
