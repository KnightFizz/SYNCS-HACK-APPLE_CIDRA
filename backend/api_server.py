from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from detection_model import run_pose_detection, get_counts
import logging
import threading

# Flask application
app = Flask(__name__)
CORS(app)
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

# Main function to start Flask server
if __name__ == "__main__":
    logging.debug("Starting Flask server with SocketIO...")
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, use_reloader=False)
