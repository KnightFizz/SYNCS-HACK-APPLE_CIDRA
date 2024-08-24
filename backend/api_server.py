<<<<<<< HEAD
import socket
import threading
import json
import time
from flask import Flask, jsonify, Response
from flask_cors import CORS
from detection_model import get_counts, run_pose_detection
=======
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from detection_model import get_counts, run_pose_detection
import threading
import requests
import time
import argparse
>>>>>>> 16a084f63edea49fa1d3afefe1ba38eff0ec33fa

# Flask application
app = Flask(__name__)
CORS(app)
data_to_send = {}

# Flask route to get exercise counts
@app.route("/get_counts", methods=["GET"])
def get_counts_route():
    global data_to_send
    data_to_send = get_counts() 
    return jsonify(data_to_send)

# Flask route to stream video
@app.route("/video_feed")
def video_feed():
    return Response(
        run_pose_detection(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )

<<<<<<< HEAD
# TCP Server: Function to send data to connected clients
def tcp_server(host='0.0.0.0', port=5002):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(5)
    print(f"Server listening on {host}:{port}")

    while True:
        client_socket, client_address = server_socket.accept()
        print(f"Accepted connection from {client_address}")
        threading.Thread(target=handle_client, args=(client_socket,)).start()

def handle_client(client_socket):
    try:
        while True:
            data = get_counts()  # Get the latest counts
            json_data = json.dumps(data) + '\n'  # Serialize data and add a newline for separation
            client_socket.sendall(json_data.encode('utf-8'))  # Send data over TCP
            time.sleep(1)  # Send data every second
    except Exception as e:
        print(f"Client disconnected: {e}")
    finally:
        client_socket.close()

# TCP Client: Function to connect to the server and receive data
def tcp_client(target_host, port=5002):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((target_host, port))
    print(f"Connected to server at {target_host}:{port}")

    try:
        while True:
            data = client_socket.recv(1024).decode('utf-8')  # Receive data from server
            if data:
                print("Received data from server:", data)
            else:
                break
    except Exception as e:
        print(f"Error receiving data: {e}")
    finally:
        client_socket.close()

# Function to run the Flask server
def run_server(host='0.0.0.0', receive_port=5000):
    app.run(host=host, port=receive_port, debug=True, use_reloader=False)

if __name__ == "__main__":
    import argparse

    # Set up argument parser
    parser = argparse.ArgumentParser(description='Run a Flask server and optionally send data to another device using TCP.')
    parser.add_argument('target_host', nargs='?', type=str, default=None, help='IP address of the target host (leave empty to act as host only)')
    parser.add_argument('--tcp_port', type=int, default=5002, help='Port number to use for TCP communication (default is 5002)')
    parser.add_argument('--receive_port', type=int, default=5000, help='Port number to run the Flask server (default is 5000)')
=======
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
    port = target_port
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
>>>>>>> 16a084f63edea49fa1d3afefe1ba38eff0ec33fa

    args = parser.parse_args()

    # Extract target host and port from arguments
    target_host = args.target_host
<<<<<<< HEAD
    tcp_port = args.tcp_port
    receive_port = args.receive_port

    # Start the Flask server in a separate thread
    server_thread = threading.Thread(target=run_server, args=('0.0.0.0', receive_port))
    server_thread.start()

    # Start the TCP server in a separate thread
    tcp_server_thread = threading.Thread(target=tcp_server, args=('0.0.0.0', tcp_port))
    tcp_server_thread.start()

    # If a target host is specified, act as a client and connect to the target host
    if target_host:
        tcp_client(target_host, tcp_port)
    else:
        print("Running as host only. Not connecting to another server.")
=======
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
>>>>>>> 16a084f63edea49fa1d3afefe1ba38eff0ec33fa
