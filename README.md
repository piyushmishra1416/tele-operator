# Tele-Operator Video Recording System

A web application that displays laptop camera feed alongside point cloud visualization, built with React and Flask.

## 🚀 Features

- Real-time video capture and display
- Video recording with WebM format
- Live FPS (Frames Per Second) monitoring
- Recording duration tracking
- Simple file upload system
- Point Cloud Model visualisation
- Camera controls for the model.


## 🛠 Tech Stack

### Frontend
- React
- TailwindCSS for styling
- MediaRecorder API for video capture
- Three.JS for model rendering.


### Backend
- Flask (Python)
- Flask-CORS for cross-origin handling
- Native file system for storage

## 📋 Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/piyushmishra1416/tele-operator.git
   ```

2. **Frontend Setup**
   ```bash
   cd tele-operator
   npm install
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Backend Setup**
   ```bash
   cd myproject
   python -m venv .venv
   source .venv/bin/activate  
   pip install flask flask-cors
   python app.py
   ```
   The backend will run on `http://localhost:5000`

## 📁 Project Structure

## Architecture/ Flow:
<img width="746" alt="image" src="https://github.com/user-attachments/assets/5d33fc82-c057-428f-8f71-e5053b8168df" />


## Technical Decisions:

-  **React:** It is most widely-used and also required in the assignment.
- **Flask:** A simple light-weight backend python framework, suitable for this task.
- **Three.Js**:  Three.js was used for rendering the 3D point cloud and handling camera controls (zoom, rotate, pan) as it is a powerful and flexible library for 3D graphics in the browser. It supports loading PLY files and provides utilities like OrbitControls for user interaction.
- **Camera and Recording:** The MediaDevices API was used to access webcam feed and MediaRecorder API was used to record the webcam feed. These APIs are builtin browser APIs and provides straightforward way to handle the tasks.



## Known Limitations

- Camera stream requires HTTPS in production
- 3D room model loading depends on internet connection
- Recorded video file size can be large, which could lead to upload failures.
- This is designed for single user only.

## Further Improvements

- Add authentication in the backend for security reasons.
- Add WebRTC for real time streaming with multiple users as well.
- Instead of uploading the entire recording at once, split the video into smaller chunks and upload them sequentially.
