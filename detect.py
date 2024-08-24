import cv2
import mediapipe as mp
import numpy as np

# Initialize Mediapipe Pose and drawing utilities
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Function to calculate angle between three points
def calculate_angle(a, b, c):
    a = np.array(a)  # First point
    b = np.array(b)  # Second point (the angle vertex)
    c = np.array(c)  # Third point

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

# OpenCV video capture (for webcam)
cap = cv2.VideoCapture(0)

# Initialize counts and states
squat_count = 0
curl_count = 0

squat_position = None
curl_position = None

# Set up the Mediapipe Pose model
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        
        # Convert the image to RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        
        # Get the pose landmarks
        results = pose.process(image)
        
        # Convert the image back to BGR for rendering
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        # Extract pose landmarks
        try:
            landmarks = results.pose_landmarks.landmark
            
            # Get coordinates for relevant body parts
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

            # Squat Detection
            squat_angle = calculate_angle(left_hip, left_knee, left_ankle)
            if squat_angle < 140:
                squat_position = "down"
            if squat_position == "down" and squat_angle > 160:
                squat_position = "up"
                squat_count += 1
            
            # Bicep Curl Detection (using shoulder, elbow, wrist)
            curl_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
            if curl_angle < 50:
                curl_position = "curl"
            if curl_position == "curl" and curl_angle > 160:
                curl_position = "uncurl"
                curl_count += 1

            # Display the counts
            cv2.putText(image, f"Squats: {squat_count}", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
            cv2.putText(image, f"Curls: {curl_count}", (10, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

        except:
            pass
        
        # Render the pose landmarks on the video
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                  mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                                  mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2))
        
        # Display the video frame
        cv2.imshow('Exercise Detector', image)
        
        # Press 'q' to quit
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

# Release video capture and close windows
cap.release()
cv2.destroyAllWindows()
