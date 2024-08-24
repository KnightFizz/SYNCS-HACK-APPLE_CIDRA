import cv2
import mediapipe as mp
import numpy as np


# Initialize Mediapipe Pose and drawing utilities
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

<<<<<<< HEAD
# Global dictionary to store user states
user_states = {}
=======

# Function to calculate angle between three points
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

# Function to run pose detection
def run_pose_detection(username):
    # Attempt to open a new camera instance for each user
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print(f"Error: Unable to open webcam for user {username}")
        return

    # Initialize user state if not already present
    if username not in user_states:
        user_states[username] = {
            "squat_count": 0,
            "curl_count": 0,
            "squat_position": None,
            "curl_position": None,
            "cap": cap
        }
    else:
        user_states[username]["cap"] = cap

<<<<<<< HEAD
    with mp_pose.Pose(min_detection_confidence=0.3, min_tracking_confidence=0.3) as pose:

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
>>>>>>> new_models
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
                left_shoulder = [
                    landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y,
                ]
                left_elbow = [
                    landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y,
                ]
                left_wrist = [
                    landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y,
                ]
                left_hip = [
                    landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y,
                ]
                left_knee = [
                    landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y,
                ]
                left_ankle = [
                    landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y,
                ]

                # Calculate angles for squat and curl
                squat_angle = calculate_angle(left_hip, left_knee, left_ankle)
                curl_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)

                if squat_angle < 140:
                    user_states[username]['squat_position'] = "down"
                if user_states[username]['squat_position'] == "down" and squat_angle > 160:
                    user_states[username]['squat_position'] = "up"
                    user_states[username]['squat_count'] += 1

                if curl_angle < 50:
                    user_states[username]['curl_position'] = "curl"
                if user_states[username]['curl_position'] == "curl" and curl_angle > 160:
                    user_states[username]['curl_position'] = "uncurl"
                    user_states[username]['curl_count'] += 1

            except Exception as e:
                print(f"Error processing frame for {username}: {e}")

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
                    curl_position = "curl"
                if curl_position == "curl" and curl_angle > 160:
                    curl_position = "uncurl"
                    curl_count += 1

                # Lateral Raise detection with hand position
                lateral_angle = calculate_angle(left_hip, left_shoulder, left_elbow)
                if lateral_angle > 90 and lateral_angle < 110 and left_wrist[1] < left_shoulder[1]:  # Arm raised above shoulder
                    lateral_position = "raise"
                if lateral_position == "raise" and lateral_angle < 60:
                    lateral_position = "down"
                    lateral_raise_count += 1

                # Squat detection with stricter angles
                squat_angle = calculate_angle(left_hip, left_knee, left_ankle)

                # Check if the ankle is below the hip for squat detection
                if squat_angle < 120 and left_ankle[1] > left_hip[1]:  # Ankle below hip level (squat)
                    squat_position = "down"
                    print(f"the squat angle is {squat_angle}")
                if squat_position == "down" and squat_angle > 170:  # Ensure full extension
                    squat_position = "up"
                    squat_count += 1

            except:
                pass
>>>>>>> new_models

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
    del user_states[username]['cap']


# Function to get current counts
def get_counts(username):
    if username in user_states:
        return {"squats": user_states[username]['squat_count'], "curls": user_states[username]['curl_count']}
    else:
        return {"error": "User not found"}
def get_counts():
    return {
        "squats": squat_count,
        "curls": curl_count,
        "lateral_raises": lateral_raise_count,
        "punches": punch_count
    }
>>>>>>> new_models
