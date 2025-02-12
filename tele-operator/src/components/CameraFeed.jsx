import { useRef, useState, useEffect } from 'react';

export default function CameraFeed() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    // Access the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setStream(stream);
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
      });
  }, []);

  const startRecording = () => {
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const uploadRecording = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('recording', blob, 'recording.webm');

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Recording uploaded successfully!');
    } else {
      alert('Failed to upload recording.');
    }
  };

  return (
    <div className="camera-feed h-full flex flex-col">
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        className="w-full h-full object-cover bg-black"
      />
      <div className="controls absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {recordedChunks.length > 0 && (
          <button 
            onClick={uploadRecording}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Upload Recording
          </button>
        )}
      </div>
    </div>
  );
}