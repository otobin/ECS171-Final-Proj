from flask import Flask
from flask import jsonify

app = Flask(__name__)

# Dummy function to add the points to 
def add_points(points_list):
    lat_sum = 0
    lng_sum = 0
    for point in points_list:
        lat_sum += point[0]
        lnt_sum += point[1]

# This means that if the backend is running we will be able to reach it at the root address.
#  Whenever the client sends an HTTP request to the root address this hello() function will be executed.
@app.route("/")
def hello():
    return "Hello, World!"

if __name__ == "__main__":
    app.run("localhost", 6969)