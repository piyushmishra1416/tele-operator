import { useRef, useState, useEffect } from 'react';

export default function CameraFeed() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [frameRate, setFrameRate] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const remoteVideoRef = useRef(null);


  useEffect(() => {
    let frameRateInterval;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setStream(stream);
      
        let frames = 0;
        let lastTime = performance.now();
        
        const calculateFPS = () => {
          const now = performance.now();
          frames++;
          
          if (now - lastTime >= 1000) {
            setFrameRate(Math.round(frames));
            frames = 0;
            lastTime = now;
          }
          requestAnimationFrame(calculateFPS);
        };

        requestAnimationFrame(calculateFPS);
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
      });

    return () => {
      if (frameRateInterval) {
        clearInterval(frameRateInterval);
      }
    };
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
    setRecordingDuration(0); 
    const interval = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
    recorder.onstop = () => clearInterval(interval);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const uploadRecording = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    setRecordedChunks([]);
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
    <div className="camera-feed h-full flex flex-col items-center justify-center bg-gray-900 p-6">
      <div className="relative w-full max-w-3xl">

        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          muted 
          className="w-full aspect-video object-cover rounded-xl shadow-2xl border-2 border-purple-500/20"
        />
        
        <video 
          ref={remoteVideoRef}
          autoPlay 
          playsInline
          className="absolute top-4 right-4 w-48 aspect-video object-cover rounded-lg border-2 border-pink-500/50 shadow-lg"
        />

        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-purple-300 font-medium">
            {frameRate} FPS
          </p>
        </div>

        {isRecording && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 px-4 py-2 rounded-full">
            <p className="text-white font-medium flex items-center gap-2">
              <span className="animate-pulse">●</span>
              Recording: {recordingDuration}s
            </p>
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-lg font-medium shadow-lg transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          
          {recordedChunks.length > 0 && (
            <button 
              onClick={uploadRecording}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow-lg transition-all"
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
}