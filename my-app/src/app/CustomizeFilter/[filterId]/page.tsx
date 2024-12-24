'use client';
import { useEffect, useRef, useState } from 'react';
import { MindARThree } from 'mind-ar/dist/mindar-face-three.prod.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface Filter {
  model_data: string;
  scale: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  anchor?: number;
}

const CustomizeFilter = ({ params }: { params: { filterId: string } }) => {
  const [filter, setFilter] = useState<Filter | null>(null);
  const [scale, setScale] = useState<[number, number, number]>([1, 1, 1]);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mindarThreeRef = useRef<MindARThree | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const initialized = useRef<boolean>(false);

  // Fetch filter data
  useEffect(() => {
    const fetchFilter = async () => {
      try {
        const response = await fetch(`/api/get-filter/${params.filterId}`);
        if (response.ok) {
          const data = await response.json();
          setFilter(data.filter);
        } else {
          console.error('Error fetching filter data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilter();
  }, [params.filterId]);

  // Initialize AR
  useEffect(() => {
    if (!filter || initialized.current) return;

    const initAR = async () => {
      try {
        const mindarThree = new MindARThree({ container: containerRef.current! });
        const { renderer, scene, camera } = mindarThree;

        mindarThreeRef.current = mindarThree;
        sceneRef.current = scene;

        // Add lighting
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        // Add anchor and model
        const anchor = mindarThree.addAnchor(filter.anchor || 168);
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(filter.model_data);
        const model = gltf.scene;
        model.scale.set(...filter.scale);
        model.position.set(...filter.position);
        model.rotation.set(...filter.rotation);
        anchor.group.add(model);
        modelRef.current = model;

        // Start rendering
        await mindarThree.start();
        renderer.setAnimationLoop(() => renderer.render(scene, camera));

        initialized.current = true;
      } catch (error) {
        console.error('Error during AR initialization:', error);
      }
    };

    initAR();

    // Cleanup function
    return () => {
      if (mindarThreeRef.current) {
        try {
          mindarThreeRef.current.stop();
          mindarThreeRef.current = null;
        } catch (error) {
          console.error('Error stopping AR:', error);
        }
      }

      if (modelRef.current) {
        try {
          modelRef.current.parent?.remove(modelRef.current);
          modelRef.current.traverse((object: THREE.Object3D) => {
            if ((object as THREE.Mesh).geometry) {
              (object as THREE.Mesh).geometry.dispose();
            }
            if ((object as THREE.Mesh).material) {
              if (Array.isArray((object as THREE.Mesh).material)) {
                
                // @ts-ignore
                (object as THREE.Mesh).material.forEach((material) => material.dispose());
              } else {
                // @ts-ignore
                (object as THREE.Mesh).material.dispose();
              }
            }
          });
          modelRef.current = null;
        } catch (error) {
          console.error('Error disposing model:', error);
        }
      }

      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0) {
          const child = sceneRef.current.children[0];
          sceneRef.current.remove(child);
        }
        sceneRef.current = null;
      }

      initialized.current = false;
    };
  }, [filter]);

  // Real-time update functions
  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setScale((prev) => {
      const newScale = [...prev] as [number, number, number];
      newScale[['x', 'y', 'z'].indexOf(axis)] = value;
      if (modelRef.current) modelRef.current.scale.set(...newScale);
      return newScale;
    });
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setPosition((prev) => {
      const newPosition = [...prev] as [number, number, number];
      newPosition[['x', 'y', 'z'].indexOf(axis)] = value;
      if (modelRef.current) modelRef.current.position.set(...newPosition);
      return newPosition;
    });
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setRotation((prev) => {
      const newRotation = [...prev] as [number, number, number];
      newRotation[['x', 'y', 'z'].indexOf(axis)] = value;
      if (modelRef.current) modelRef.current.rotation.set(...newRotation);
      return newRotation;
    });
  };

  const saveModelState = async () => {
    try {
      const response = await fetch(`/api/update-model/${params.filterId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scale, position, rotation }),
      });
      if (response.ok) {
        alert('Model state saved successfully!');
      } else {
        console.error('Error saving model state:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving model state:', error);
    }
  };

  if (!filter) return <div>Loading...</div>;

  return (
    <div className="h-[120vh] flex bg-white flex-row items-center justify-center">
      <div className="w-full flex justify-center">
        <div
          className="w-[50%] h-[70%] relative border-2 border-gray-400 m-2 flex flex-row items-center justify-center z-0"
          ref={containerRef}
        ></div>
      </div>
      <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-lg w-[40%]">
  <h2 className="text-white text-xl font-semibold mb-4">Model Customization</h2>
  
  {/* Scale Controls */}
  <div className="space-y-4">
    <div className="flex items-center">
      <label className="text-white mr-2">Scale X</label>
      <input
        type="range"
        min="0.1"
        max="3"
        step="0.1"
        value={scale[0]}
        onChange={(e) => handleScaleChange('x', parseFloat(e.target.value))}
        className="slider"
      />
    </div>
    <div className="flex items-center">
      <label className="text-white mr-2">Scale Y</label>
      <input
        type="range"
        min="0.1"
        max="3"
        step="0.1"
        value={scale[1]}
        onChange={(e) => handleScaleChange('y', parseFloat(e.target.value))}
        className="slider"
      />
    </div>
    <div className="flex items-center">
      <label className="text-white mr-2">Scale Z</label>
      <input
        type="range"
        min="0.1"
        max="3"
        step="0.1"
        value={scale[2]}
        onChange={(e) => handleScaleChange('z', parseFloat(e.target.value))}
        className="slider"
      />
    </div>

    {/* Position Controls */}
    <div className="flex items-center">
      <label className="text-white mr-2">Position X</label>
      <input
        type="range"
        min="-2"
        max="2"
        step="0.1"
        value={position[0]}
        onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
        className="slider"
      />
    </div>
    <div className="flex items-center">
      <label className="text-white mr-2">Position Y</label>
      <input
        type="range"
        min="-2"
        max="2"
        step="0.1"
        value={position[1]}
        onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
        className="slider"
      />
    </div>
    <div className="flex items-center">
      <label className="text-white mr-2">Position Z</label>
      <input
        type="range"
        min="-2"
        max="2"
        step="0.1"
        value={position[2]}
        onChange={(e) => handlePositionChange('z', parseFloat(e.target.value))}
        className="slider"
      />
    </div>

    {/* Rotation Controls */}
    <div className="flex items-center">
      <label className="text-white mr-2">Rotation X</label>
      <input
        type="range"
        min="-3.14"
        max="3.14"
        step="0.1"
        value={rotation[0]}
        onChange={(e) => handleRotationChange('x', parseFloat(e.target.value))}
        className="slider"
      />
    </div>
    <div className="flex items-center">
      <label className="text-white mr-2">Rotation Y</label>
      <input
        type="range"
        min="-3.14"
        max="3.14"
        step="0.1"
        value={rotation[1]}
        onChange={(e) => handleRotationChange('y', parseFloat(e.target.value))}
        className="slider"
      />
    </div>
    <div className="flex items-center">
      <label className="text-white mr-2">Rotation Z</label>
      <input
        type="range"
        min="-3.14"
        max="3.14"
        step="0.1"
        value={rotation[2]}
        onChange={(e) => handleRotationChange('z', parseFloat(e.target.value))}
        className="slider"
      />
    </div>
  </div>

  {/* Save Button */}
  <button
    onClick={saveModelState}
    className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 mt-4"
  >
    Save Changes
  </button>
</div>

    </div>
  );
};

export default CustomizeFilter;
