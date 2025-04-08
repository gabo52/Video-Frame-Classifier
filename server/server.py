from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import shutil
import cv2
import pandas as pd

app = Flask(__name__)
CORS(app, origins='*')

@app.route("/api/video", methods=['GET'])
def video():
    return jsonify({"message": "Hello"})

@app.route("/api/video", methods=['POST'])
def extract_frames():
    video_path = request.json['video_path']
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened() :
        return jsonify(0)
    
    tmp_path = os.path.join('..','web','public','tmp_frames')
    shutil.rmtree(tmp_path, ignore_errors=True)
    os.makedirs(tmp_path, exist_ok=True)

    fps = cap.get(cv2.CAP_PROP_FPS)
    print(f"Fps: {fps}")

    idx = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        output_path = os.path.join(tmp_path,f"frame_{idx}.png")
        if idx % 3==0:
            cv2.imwrite(output_path, frame)
        idx = idx +1
    frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    print(f"Frame count {frame_count}")
    return jsonify(frame_count)

@app.route("/api/video/extractResults", methods=['POST'])
def write_results():
    video_path = request.json['labels']
    
    labels_series = pd.DataFrame({"labels_classified":video_path})
    labels_series["labels_classified"] = labels_series["labels_classified"].fillna('Not assigned')

    results_path = os.path.join('..','web','public','results.csv')
    labels_series.to_csv(results_path,index=True, header=['Label assigned'])

    return jsonify(True)

if __name__ == "__main__":
    app.run(debug=True)