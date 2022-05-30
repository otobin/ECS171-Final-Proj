from flask import Flask, render_template, request, url_for, jsonify
import joblib
from model import getCrimeWeight

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")

@app.route('/reroute')
def reroute():
    return render_template("reroute.html")

@app.route('/model', methods = ['POST'])
def model():
    if request.method == 'POST':
        lat_lng_array = request.get_json()
        print(lat_lng_array)
        crimeWeight = getCrimeWeight(lat_lng_array)
        return jsonify(crimeWeight)

if __name__ == "__main__":
    app.run(debug = True)
