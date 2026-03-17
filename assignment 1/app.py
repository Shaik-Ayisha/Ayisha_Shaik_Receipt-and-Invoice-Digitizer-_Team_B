from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if username == "admin" and password == "123":
        return jsonify({"message": "Login success"})
    else:
        return jsonify({"message": "Invalid credentials"}), 401
    
@app.route("/hello", methods=["GET"])
def hello():
    print("Hello function called")   
    return jsonify({"message": "Hello World"})


if __name__ == "__main__":
    app.run(debug=True)