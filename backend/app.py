from flask import Flask
app = Flask(__name__)

# This means that if the backend is running we will be able to reach it at the root address.
#  Whenever the client sends an HTTP request to the root address this hello() function will be executed.
@app.route("/")
def hello():
    return "Hello, World!"

if __name__ == "__main__":
    app.run("localhost", 6969)