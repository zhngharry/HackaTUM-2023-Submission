from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/data', methods=['GET'])
def get_data():
    # Logic for handling GET requests
    return 'This is a GET request response.'

@app.route('/api/data', methods=['POST'])
def post_data():
    # Logic for handling POST requests
    data = request.json
    processed_data = {'message': 'Data received successfully!', 'data': data}
    return jsonify(processed_data)

if __name__ == '__main__':
    app.run(debug=True)
