from flask import jsonify, request
from app.util.db_util import *
from app.service.player_service import *
from app import app
import os

@app.route("/draft/data")
def draft_data():
    persist_new_data()
    players = [p.serialize_lazy for p in get_players()]
    tournaments = [t[0] for t in get_tournaments()]
    return jsonify({"playerList": players, "tournaments": tournaments})


@app.route("/upload", methods=["POST"])
def upload():
    if request.files:
        uploaded_file = request.files["filename"]
        fp = os.path.join(app.config["CSV_FILE_PATH"], uploaded_file.filename)
        uploaded_file.save(fp)
        persist_new_data()


@app.route("/players/combinations", methods=["GET"])
def player_combinations():
    tournaments = request.args.get("tournaments", default="", type=str).split(",")
    positions = request.args.get("positions", default="", type=str).split(",")
    players = request.args.get("playerIds", default="", type=str).split(",")
    return jsonify(get_exposure_combinations(players, tournaments, positions))
