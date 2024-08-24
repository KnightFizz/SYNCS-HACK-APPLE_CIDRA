from flask import Flask, jsonify
import threading
from detect import run_pose_detection, get_counts

# Flask application
app = Flask(__name__)

# Flask route to get exercise counts
@app.route('/get_counts', methods=['GET'])
def get_counts_route():
    return jsonify(get_counts())

# Main function to start both the Flask server and the pose detection thread
if __name__ == '__main__':
    # Start the pose detection in a separate thread
    pose_thread = threading.Thread(target=run_pose_detection)
    pose_thread.start()

    # Run the Flask app
    app.run(debug=True, use_reloader=False)  # use_reloader=False prevents double execution
