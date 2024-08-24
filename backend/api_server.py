# api_server.py

from flask import Flask, Response, jsonify
from flask_cors import CORS
from detection_model import run_pose_detection, get_counts

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
        run_pose_detection(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )

# Main function to start Flask server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
