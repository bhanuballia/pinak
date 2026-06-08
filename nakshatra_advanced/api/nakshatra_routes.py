# nakshatra_advanced/api/nakshatra_routes.py

try:
    from flask import Blueprint, jsonify
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False
    
    # Elegant mock classes to prevent import crashes in FastAPI environments
    class Blueprint:
        def __init__(self, name, import_name, **kwargs):
            self.name = name
            
        def route(self, rule, **options):
            def decorator(f):
                return f
            return decorator
            
    def jsonify(data):
        return data


nakshatra_api = Blueprint(
    "nakshatra_api",
    __name__
)

@nakshatra_api.route(
    "/nakshatra/<name>"
)
def get_nakshatra(name):

    return jsonify({

        "nakshatra": name,
        "status": "active"
    })
