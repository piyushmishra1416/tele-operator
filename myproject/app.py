from flask import Flask, request, send_from_directory
from flask_cors import CORS
import os
import time

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'recording' not in request.files:
        return 'No file uploaded.', 400

    file = request.files['recording']
    timestamp = int(time.time())
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    return 'File uploaded successfully!', 200

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(port=5000)