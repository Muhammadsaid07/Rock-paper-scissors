from flask import Flask, jsonify
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)  

objects = [{"x": 100, "y": 200, "type": "rock"}, {"x": 300, "y": 400, "type": "scissors"}]

@app.route('/get_objects')
def get_objects():
    return jsonify(objects)

if __name__ == '__main__':
    app.run(debug=True)
