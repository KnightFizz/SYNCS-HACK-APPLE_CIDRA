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
        counts = get_counts()
        users[username]["score"] += counts["total"]  # Update user score
        logging.debug(f"Counts for user '{username}': {counts}, Total score: {users[username]['score']}")
        return jsonify({"username": username, "counts": counts, "score": users[username]["score"]}), 200
    else:
        logging.debug(f"User '{username}' not found.")
        return jsonify({"error": "User not found."}), 404

# Flask route to stream video
@app.route("/video_feed/<username>")
def video_feed(username):
    if username in users:
        logging.debug(f"Starting video feed for user '{username}'")
        return Response(
            run_pose_detection(), mimetype="multipart/x-mixed-replace; boundary=frame"
        )
    else:
        logging.debug(f"User '{username}' not found for video feed.")
        return jsonify({"error": "User not found."}), 404

# SocketIO event for joining a competition room
@socketio.on('join_competition')
def handle_join(data):
    username = data.get("username")
    if username in users:
        join_room('competition')
        logging.debug(f"User '{username}' joined the competition.")
        emit('user_joined', {'username': username, 'score': users[username]['score']}, room='competition')
    else:
        logging.debug(f"User '{username}' not found.")
        emit('error', {'message': 'User not found'})

# SocketIO event for updating scores
@socketio.on('update_score')
def handle_update_score(data):
    username = data.get("username")
    if username in users:
        users[username]["score"] = data.get("score")
        logging.debug(f"Score updated for user '{username}': {users[username]['score']}")
        emit('score_update', {'username': username, 'score': users[username]["score"]}, room='competition')
    else:
        logging.debug(f"User '{username}' not found for score update.")
        emit('error', {'message': 'User not found'})

# Flask route to get all users' scores (for online competition)
@app.route("/get_scores", methods=["GET"])
def get_scores():
    logging.debug("Fetching all users' scores.")
    return jsonify(users), 200

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
