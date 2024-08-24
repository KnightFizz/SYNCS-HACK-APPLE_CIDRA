from flask import Flask, request, jsonify
import threading
import requests
import time
import detection_model
import argparse

app = Flask(__name__)


data_to_send = detection_model.get_counts()

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
    app.run(host=host, port=port)

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
    parser = argparse.ArgumentParser(description='Run a Flask server and send data to another device.')
    parser.add_argument('target_host', type=str, help='IP address of the target host')
    parser.add_argument('--port', type=int, default=5000, help='Port number to use (default is 5000)')

    args = parser.parse_args()

    # Extract target host and port from arguments
    target_host = args.target_host
    target_port = args.port

    # Start the Flask server in a separate thread
    server_thread = threading.Thread(target=run_server, args=('0.0.0.0', 5000))
    server_thread.start()

    # Start sending data to the other device
    send_dict(target_host, target_port, data_to_send)
