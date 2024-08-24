# detection_model.py

import cv2
import mediapipe as mp
import numpy as np

# Initialize Mediapipe Pose and drawing utilities
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils


 #Function to calculate angle between three points
def calculate_angle(a, b, c):
    a = np.array(a)  # First point
    b = np.array(b)  # Second point (the angle vertex)
    c = np.array(c)  # Third point

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle



squat_count = 0
curl_count = 0
lateral_raise_count = 0
shoulder_press_count = 0

squat_position = None
curl_position = None
lateral_position = None
shoulder_position = None

# Initialize the movement status for each exercise
squat_detected = 0
curl_detected = 0
lateral_raise_detected = 0
punch_detected = 0

# Modify the run_pose_detection function
def run_pose_detection():
    global squat_detected, curl_detected, lateral_raise_detected, punch_detected
    global squat_position, curl_position, lateral_position, punch_position

    cap = cv2.VideoCapture(0)
    
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()

            if not ret:
                break

            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False

            results = pose.process(image)

            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            try:
                landmarks = results.pose_landmarks.landmark

                # Extract the landmarks for relevant joints
                left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                                 landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                              landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                              landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                            landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                             landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                              landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

                # Curl detection with wrist position and stricter angle checking
                curl_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
                if curl_angle < 50 and left_wrist[1] > left_shoulder[1]:  # Wrist below shoulder
                    curl_detected = 1
                elif curl_angle > 160:
                    curl_detected = 0

                # Lateral Raise detection with hand position
                lateral_angle = calculate_angle(left_hip, left_shoulder, left_elbow)
                if 90 < lateral_angle < 110 and left_wrist[1] < left_shoulder[1]:  # Arm raised above shoulder
                    lateral_raise_detected = 1
                elif lateral_angle < 60:
                    lateral_raise_detected = 0

                # Squat detection with stricter angles
                squat_angle = calculate_angle(left_hip, left_knee, left_ankle)
                if squat_angle < 120 and left_ankle[1] > left_hip[1]:  # Ankle below hip level (squat)
                    squat_detected = 1
                elif squat_angle > 170:  # Full extension
                    squat_detected = 0

            except:
                pass

            mp_drawing.draw_landmarks(
                image,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2),
            )

            ret, buffer = cv2.imencode(".jpg", image)
            frame = buffer.tobytes()
            yield b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"

    cap.release()
    cv2.destroyAllWindows()

# Function to get current movement detection status
def get_counts():
    return {
        "squats": squat_detected,
        "curls": curl_detected,
        "lateral_raises": lateral_raise_detected
    }
