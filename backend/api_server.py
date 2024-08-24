<<<<<<< HEAD
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from detection_model import run_pose_detection, get_counts
import logging
import threading
=======
import socket
import threading
import json
import time
from flask import Flask, jsonify, Response
from flask_cors import CORS
from detection_model import get_counts, run_pose_detection
>>>>>>> new_models

# Flask application
app = Flask(__name__)
CORS(app)
<<<<<<< HEAD
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Global dictionary to store user data
users = {}
user_lock = threading.Lock()

# Flask route to register or update user
@app.route("/register_user", methods=["POST"])
def register_user():
    user_data = request.get_json()
    username = user_data.get("username")
    if username:
        with user_lock:  # Lock around the critical section
            if username not in users:
                users[username] = {"score": 0}
                logging.debug(f"User '{username}' registered successfully.")
                return jsonify({"message": f"User '{username}' registered successfully."}), 200
            else:
                logging.debug(f"User '{username}' already exists.")
                return jsonify({"error": f"User '{username}' already exists."}), 400
    else:
        logging.debug("Username is required.")
        return jsonify({"error": "Username is required."}), 400

# Flask route to get exercise counts for a specific user
@app.route("/get_counts/<username>", methods=["GET"])
def get_counts_route(username):
    if username in users:
        counts = get_counts(username)
        return jsonify({"username": username, "counts": counts}), 200
    else:
        logging.debug(f"User '{username}' not found.")
        return jsonify({"error": "User not found."}), 404
=======
data_to_send = {}

# Flask route to get exercise counts
@app.route("/get_counts", methods=["GET"])
def get_counts_route():
    global data_to_send
    data_to_send = get_counts() 
    return jsonify(data_to_send)
>>>>>>> new_models

# Flask route to stream video
@app.route("/video_feed/<username>")
def video_feed(username):
    if username in users:
        logging.debug(f"Starting video feed for user '{username}'")
        return Response(run_pose_detection(username), mimetype="multipart/x-mixed-replace; boundary=frame")
    else:
        logging.debug(f"User '{username}' not found for video feed.")
        return jsonify({"error": "User not found."}), 404

@socketio.on('connect')
def on_connect():
    logging.debug("A client connected.")

@socketio.on('disconnect')
def on_disconnect():
    logging.debug("A client disconnected.")

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
<<<<<<< HEAD
    logging.debug("Starting Flask server with SocketIO...")
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, use_reloader=False)
=======
    import argparse

    # Set up argument parser
    parser = argparse.ArgumentParser(description='Run a Flask server and optionally send data to another device using TCP.')
    parser.add_argument('target_host', nargs='?', type=str, default=None, help='IP address of the target host (leave empty to act as host only)')
    parser.add_argument('--tcp_port', type=int, default=5002, help='Port number to use for TCP communication (default is 5002)')
    parser.add_argument('--receive_port', type=int, default=5000, help='Port number to run the Flask server (default is 5000)')

    args = parser.parse_args()

    # Extract target host and port from arguments
    target_host = args.target_host
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
>>>>>>> new_models
