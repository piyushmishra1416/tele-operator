import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreeScene() {
  const mountRef = useRef(null);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 20;

    let points;

    const loader = new PLYLoader();
    loader.load("/models/room.ply", (geometry) => {
      const hasVertexColors = geometry.hasAttribute("color");

      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: hasVertexColors,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
    });

    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);


    const handleClick = (event) => {
      if (!points) return;

      const boundingRect = mountRef.current.getBoundingClientRect();
      const x = (event.clientX - boundingRect.left) / boundingRect.width * 2 - 1;
      const y = -(event.clientY - boundingRect.top) / boundingRect.height * 2 + 1;

      mouse.current.x = x;
      mouse.current.y = y;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObject(points);

      if (intersects.length > 0) {
        const selectedPoint = intersects[0].point;
        setSelectedPoints((prev) => [...prev, selectedPoint]);
        console.log("Selected Point:", selectedPoint);
      }
    };
    mountRef.current.addEventListener("click", handleClick);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeEventListener("click", handleClick);
      controls.dispose();
      renderer.dispose();
      if (points) {
        scene.remove(points);
        points.geometry.dispose();
        points.material.dispose();
      }
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative h-full group">
      <div ref={mountRef} className="w-full h-full rounded-lg overflow-hidden" />

      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm p-4 rounded-lg text-white max-w-[240px] border border-purple-500/20 transform transition-all duration-300 hover:scale-105">
        <h3 className="text-sm font-semibold mb-3 text-purple-300 flex items-center">
          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
          Selected Points
        </h3>
        <div className="max-h-[200px] overflow-auto custom-scrollbar">
          <ul className="space-y-2">
            {selectedPoints.map((point, index) => (
              <li key={index} className="text-xs bg-white/5 p-2 rounded">
                <span className="text-pink-400">Point {index + 1}:</span>
                <br />
                <span className="font-mono">
                  ({point.x.toFixed(2)}, {point.y.toFixed(2)}, {point.z.toFixed(2)})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
