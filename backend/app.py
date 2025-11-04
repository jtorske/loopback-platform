from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Flask is running!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)