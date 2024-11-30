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

  const containerRef = useRef(null);
  const mindarThreeRef = useRef<MindARThree | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const initialized = useRef<boolean>(false);

  // Fetch filter data
  useEffect(() => {
    const fetchFilter = async () => {
      console.log('Fetching filter data...');
      try {
        const response = await fetch(`/api/get-filter/${params.filterId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Filter data fetched successfully:', data);
          setFilter(data.filter);
        } else {
          console.error('Error fetching filter data: Response not OK');
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
        const mindarThree = new MindARThree({ container: containerRef.current });
        const { renderer, scene, camera } = mindarThree;

        mindarThreeRef.current = mindarThree;

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

    // Cleanup
    return () => {
      if (mindarThreeRef.current) {
        try {
          mindarThreeRef.current.stop(); // Safely stop the AR session
          mindarThreeRef.current = null;
        } catch (error) {
          console.error('Error stopping AR:', error);
        }
      }

      if (modelRef.current) {
        try {
          modelRef.current.parent?.remove(modelRef.current); // Remove the 3D model
          modelRef.current = null;
        } catch (error) {
          console.error('Error removing model:', error);
        }
      }

      initialized.current = false; // Reset initialization flag
    };
  }, [filter]);

  // Function to update model scale, position, and rotation in real-time
  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newScale = [...scale];
    if (axis === 'x') newScale[0] = value;
    if (axis === 'y') newScale[1] = value;
    if (axis === 'z') newScale[2] = value;
    setScale(newScale);
    if (modelRef.current) {
      modelRef.current.scale.set(...newScale);
    }
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newPosition = [...position];
    if (axis === 'x') newPosition[0] = value;
    if (axis === 'y') newPosition[1] = value;
    if (axis === 'z') newPosition[2] = value;
    setPosition(newPosition);
    if (modelRef.current) {
      modelRef.current.position.set(...newPosition);
    }
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newRotation = [...rotation];
    if (axis === 'x') newRotation[0] = value;
    if (axis === 'y') newRotation[1] = value;
    if (axis === 'z') newRotation[2] = value;
    setRotation(newRotation);
    if (modelRef.current) {
      modelRef.current.rotation.set(...newRotation);
    }
  };

  // Function to save rotation, scale, and position to the API
  const saveModelState = async () => {
    try {
      const response = await fetch(`/api/update-model/${params.filterId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scale,
          position,
          rotation,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Model state saved successfully!');
        console.log(data);
      } else {
        console.error('Error saving model state:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving model state:', error);
    }
  };

  if (!filter) {
    console.log('Filter data is not yet loaded.');
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[120vh] flex bg-white flex-row items-center justify-center bg-gray-900">
      {/* Camera View */}
      <div className="w-full flex justify-center">
        <div
          className="w-[50%] h-[70%] relative border-2 border-gray-400 m-2 flex flex-row items-center justify-center z-0"
          ref={containerRef}
        ></div>
      </div>

      {/* Dashboard */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-lg w-[40%]">
        <h2 className="text-white text-xl font-semibold mb-4">Model Customization</h2>

        <div className="space-y-4">
          {/* Scale Controls */}
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
              min="-180"
              max="180"
              step="1"
              value={rotation[0]}
              onChange={(e) => handleRotationChange('x', parseFloat(e.target.value))}
              className="slider"
            />
          </div>
          <div className="flex items-center">
            <label className="text-white mr-2">Rotation Y</label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotation[1]}
              onChange={(e) => handleRotationChange('y', parseFloat(e.target.value))}
              className="slider"
            />
          </div>
          <div className="flex items-center">
            <label className="text-white mr-2">Rotation Z</label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotation[2]}
              onChange={(e) => handleRotationChange('z', parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          {/* Save button */}
          <button onClick={saveModelState} className="bg-blue-500 text-white py-2 px-4 rounded-full mt-4">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeFilter;
