import socket
import threading
import json
import time
from flask import Flask, jsonify, Response, request
from flask_cors import CORS
from detection_model import get_counts, run_pose_detection


# Flask application
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
client_sockets = []  # List to store connected client sockets
DMG_TO_SEND = 0
lock = threading.Lock()  # Lock to synchronize access to DMG_TO_SEND

# Flask route to get exercise counts
@app.route("/get_counts", methods=["GET"])
def get_counts_route():
    global data_to_send
    data_to_send = get_counts() 
    return jsonify(data_to_send)

# Flask route to stream video
@app.route("/video_feed")
def video_feed():
    # Assuming this function streams video, return the necessary response
    return Response(
        run_pose_detection(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )

@app.route("/send_dmg_to_frontend")
def send_dmg_to_frontend():
    with lock:
        dmg_to_send = DMG_TO_SEND
    return jsonify({'dmg': dmg_to_send})

# Function to send total_damage to all connected TCP clients
def send_damage_to_clients(total_damage):
    message = json.dumps({'totalDamage': total_damage}) + '\n'  # Serialize data
    for client_socket in client_sockets:
        try:
            client_socket.sendall(message.encode('utf-8'))  # Send data to each client
        except Exception as e:
            print(f"Error sending data to client: {e}")
            client_sockets.remove(client_socket)  # Remove client if sending fails

@app.route("/read_damage", methods=["POST"])
def read_damage_info():
    try:
        data = request.json  # Receive JSON data from the request
        total_damage = data.get('totalDamage', 0)  # Extract the 'totalDamage' field from the JSON data
        print(f"Received Total Damage: {total_damage}")
        send_damage_to_clients(total_damage)  # Send the total_damage to all connected TCP clients
        return jsonify({'status': 'success', 'receivedDamage': total_damage}), 200
    except Exception as e:
        print(f"Error reading value: {e}")
        return jsonify({'status': 'error', 'message': 'Failed to read damage info'}), 500

# TCP Server: Function to accept client connections and store sockets
def tcp_server(host='0.0.0.0', port=5002):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(5)
    print(f"Server listening on {host}:{port}")

    while True:
        client_socket, client_address = server_socket.accept()
        print(f"Accepted connection from {client_address}")
        client_sockets.append(client_socket)  # Store client socket
        threading.Thread(target=handle_client, args=(client_socket,)).start()

def handle_client(client_socket):
    try:
        while True:
            time.sleep(1)  # Keep the connection alive
    except Exception as e:
        print(f"Client disconnected: {e}")
    finally:
        client_socket.close()
        client_sockets.remove(client_socket)  # Remove client from the list

# TCP Client: Function to connect to the server and receive data
def tcp_client(target_host, port=5002):
    global DMG_TO_SEND
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((target_host, port))
    print(f"Connected to server at {target_host}:{port}")

    try:
        while True:
            data = client_socket.recv(1024).decode('utf-8')  # Receive data from server
            if data:
                total_damage_data = json.loads(data)
                with lock:
                    DMG_TO_SEND = total_damage_data['totalDamage']
                print(f"Received data from server: {DMG_TO_SEND}")

                # Give time for the Flask endpoint to read the value before resetting it
                time.sleep(0.5)  # Delay the reset to allow the frontend to read it
                with lock:
                    DMG_TO_SEND = 0
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

    args = parser.parse_args()

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
