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

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup Function
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
    <div className="relative h-full">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-black/50 p-3 rounded text-white max-w-[200px] overflow-auto">
        <h3 className="text-sm font-semibold mb-2">Selected Points:</h3>
        <ul className="text-xs">
          {selectedPoints.map((point, index) => (
            <li key={index} className="mb-1">
              Point {index + 1}: ({point.x.toFixed(2)}, {point.y.toFixed(2)},{" "}
              {point.z.toFixed(2)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
