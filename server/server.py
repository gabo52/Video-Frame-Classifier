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

    idx = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        output_path = os.path.join(tmp_path,f"frame_{idx}.png")
        cv2.imwrite(output_path, frame)
        idx = idx +1
    frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)

    return jsonify(frame_count)

@app.route("/api/video/extractResults", methods=['POST'])
def write_results():
    labeled_data = request.json['labels']
    video_duration = float(request.json['videoDuration'])
    # print(video_duration)
    # print(labeled_data)

    empty_series = pd.Series(index=range(int(video_duration) + 1), dtype=str)
    pd_labels = pd.DataFrame(empty_series, columns=['label'])
    pd_labels.index.name = 'seconds'

    for rangeLabel in labeled_data:
        label = rangeLabel['label']
        ranges_clip = rangeLabel['rangesClip']
        for range_clip in ranges_clip:
            start_range = int(range_clip['rStart'])/100*video_duration
            end_range = int(range_clip['rEnd'])/100*video_duration

            start_range = int(start_range)
            end_range = int(end_range)
            pd_labels.iloc[start_range:end_range+1] = label


    results_path = os.path.join('..','web','public','results.csv')
    pd_labels.to_csv(results_path,index=True, header=['Label assigned'])

    return jsonify(True)

if __name__ == "__main__":
    app.run(debug=True)