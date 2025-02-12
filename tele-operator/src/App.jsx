import ThreeScene from './components/ThreeScene';
import CameraFeed from './components/CameraFeed';
import './App.css';

export default function App() {
  return (
    <div className="app min-h-screen p-4 bg-gray-900">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">Teleoperator Application</h1>
      <div className="flex flex-col md:flex-row gap-4">

        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-3 text-white">3D Room Viewer</h2>
          <div className="border border-gray-600 rounded-lg overflow-hidden h-[400px] md:h-[600px]">
            <ThreeScene />
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-3 text-white">Camera Feed</h2>
          <div className="border border-gray-600 rounded-lg overflow-hidden h-[400px] md:h-[600px]">
            <CameraFeed />
          </div>
        </div>
      </div>
    </div>
  );
}