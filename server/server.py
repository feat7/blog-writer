from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
import requests

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

api_key = "iJm0i7mw7CURkbvYQvRvlN1sC8I67z2m2qXlf76Ffb4"

@app.route("/sentiment",methods=['GET','POST'])
@cross_origin()
def get_sentiment():
    data = {
        "api_key": api_key,
        "text": request.args.get('text')
    }
    response = requests.post("https://apis.paralleldots.com/v3/sentiment", data = data)
    response = response.json()
    return jsonify(response)

@app.route("/")
@cross_origin()
def index():
    data = {
        "Team Name": "ShaktiMaan",
        "Category": "BlockChain, ML",
        "Hackathon": "Rajasthan Online Hackathon"
    }
    return jsonify(data)