from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from detection_model import get_counts, run_pose_detection
import threading
import requests
import time
import argparse

# Flask application
app = Flask(__name__)
CORS(app)

# Flask route to get exercise counts
@app.route("/get_counts", methods=["GET"])
def get_counts_route():
    return jsonify(get_counts())

# Flask route to stream video
@app.route("/video_feed")
def video_feed():
    return Response(
        detection_model.run_pose_detection(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )

# Define a route to receive the dictionary
@app.route('/send_dict', methods=['POST'])
def receive_dict():
    if request.is_json:
        data = request.get_json()  # Get JSON data from the request
        print(f"Received dict: {data}")
        return jsonify({"message": "Dict received successfully!", "received_data": data}), 200
    else:
        return jsonify({"error": "Invalid JSON format"}), 400

def run_server(host='0.0.0.0', port=5000):
    app.run(host=host, port=port, debug=True, use_reloader=False)

def send_dict(target_host, target_port, data_dict):
    url = f'http://{target_host}:{target_port}/send_dict'
    while True:
        try:
            response = requests.post(url, json=data_dict)  # Send POST request with JSON data
            if response.status_code == 200:
                print("Successfully sent the dict!")
                print("Response from server:", response.json())
            else:
                print("Failed to send the dict. Status code:", response.status_code)
                print("Response:", response.text)
        except Exception as e:
            print(f"Error sending request: {e}")

        time.sleep(5)  # Send data every 5 seconds

if __name__ == "__main__":
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Run a Flask server and optionally send data to another device.')
    parser.add_argument('target_host', nargs='?', type=str, default=None, help='IP address of the target host (leave empty to act as host only)')
    parser.add_argument('--port', type=int, default=5000, help='Port number to use (default is 5000)')

    args = parser.parse_args()

    # Extract target host and port from arguments
    target_host = args.target_host
    target_port = args.port

    # Start the Flask server in a separate thread
    server_thread = threading.Thread(target=run_server, args=('0.0.0.0', target_port))
    server_thread.start()

    # Check if a target host is specified, if so, send data to it
    if target_host:
        data_to_send = get_counts()  # Get initial data to send
        send_dict(target_host, target_port, data_to_send)
    else:
        print("Running as host only. Not sending data to another device.")
