# relationships/api/relationship_routes.py

from flask import (
    Blueprint,
    jsonify
)

relationship_api = Blueprint(
    "relationship_api",
    __name__
)

@relationship_api.route(
    "/relationship"
)
def relationship():

    return jsonify({

        "status":
            "active"
    })
