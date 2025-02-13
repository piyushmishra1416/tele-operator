import ThreeScene from './components/ThreeScene';
import CameraFeed from './components/CameraFeed';
import './App.css';

export default function App() {
  return (
    <div className="app min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 text-center">
          Teleoperator Control Center
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-purple-300 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
              3D Room Viewer
            </h2>
            <div className="rounded-xl overflow-hidden h-[400px] md:h-[600px] border border-purple-500/20 shadow-lg shadow-purple-500/10">
              <ThreeScene />
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-pink-300 flex items-center">
              <span className="w-2 h-2 bg-pink-400 rounded-full mr-2 animate-pulse"></span>
              Camera Feed
            </h2>
            <div className="rounded-xl overflow-hidden h-[400px] md:h-[600px] border border-pink-500/20 shadow-lg shadow-pink-500/10">
              <CameraFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}