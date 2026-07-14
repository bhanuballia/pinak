# nakshatra_advanced/api/compatibility_routes.py

try:
    from flask import Blueprint, jsonify
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False
    
    class Blueprint:
        def __init__(self, name, import_name, **kwargs):
            self.name = name
        def route(self, rule, **options):
            def decorator(f):
                return f
            return decorator
    def jsonify(data):
        return data

compatibility_api = Blueprint(
    "compatibility_api",
    __name__
)

@compatibility_api.route("/compatibility/<boy_nak>/<girl_nak>")
def get_compatibility(boy_nak, girl_nak):
    return jsonify({
        "boy_nakshatra": boy_nak,
        "girl_nakshatra": girl_nak,
        "compatibility": "evaluated"
    })
