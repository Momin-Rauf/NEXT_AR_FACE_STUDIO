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
  const initialized = useRef<boolean>(false);

  const disposeObject = (object: THREE.Object3D) => {
    object.traverse((child) => {
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
      if ((child as THREE.Mesh).material) {
        const material = (child as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach((mat) => mat.dispose());
        } else {
          material.dispose();
        }
      }
    });
    if (object.parent) object.parent.remove(object);
  };

  const clearScene = (scene: THREE.Scene) => {
    scene.traverse((object) => disposeObject(object));
    while (scene.children.length) {
      scene.remove(scene.children[0]);
    }
  };

  // Fetch filter data
  useEffect(() => {
    const fetchFilter = async () => {
      try {
        const response = await fetch(`/api/get-filter/${params.filterId}`);
        if (response.ok) {
          const data = await response.json();
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

  useEffect(() => {
    if (!filter || initialized.current) return;
  
    const initAR = async () => {
      try {
        if (!containerRef.current) return;
  
        const mindarThree = new MindARThree({ container: containerRef.current! });
        const { renderer, scene, camera } = mindarThree;
        mindarThreeRef.current = mindarThree;
  
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
  
        const anchor = mindarThree.addAnchor(filter.anchor || 168);
        const loader = new GLTFLoader();
        const loadModel = async (url: string) => {
          try {
            const gltf = await loader.loadAsync(url);
  
            if (modelRef.current) {
              disposeObject(modelRef.current);
              modelRef.current = null;
            }
  
            const model = gltf.scene;
            model.scale.set(...filter.scale);
            model.position.set(...filter.position);
            model.rotation.set(...filter.rotation);
  
            anchor.group.add(model);
            modelRef.current = model;
          } catch (error) {
            console.error("Error loading model:", error);
          }
        };
  
        if (filter) {
          await loadModel(filter.model_data);
        }
  
        try {
          await mindarThree.start();
        } catch (error) {
          console.error("MindARThree initialization failed:", error);
          return;
        }
  
        renderer.setAnimationLoop(() => renderer.render(scene, camera));
        initialized.current = true;
  
        return () => {
          renderer.setAnimationLoop(null);
          mindarThree.stop();
          clearScene(scene);
          renderer.dispose();
          if (modelRef.current) disposeObject(modelRef.current);
          initialized.current = false;
        };
      } catch (error) {
        console.error("Error initializing AR:", error);
      }
    };
  
    initAR();
  
    return () => {
      initialized.current = false;
    };
  }, [filter]);
    



  


  // Function to update model scale, position, and rotation in real-time
  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setScale((prevScale) => {
      const newScale: [number, number, number] = [...prevScale]; // Ensure it's a tuple
      if (axis === 'x') newScale[0] = value;
      if (axis === 'y') newScale[1] = value;
      if (axis === 'z') newScale[2] = value;
      if (modelRef.current) {
        modelRef.current.scale.set(...newScale);
      }
      return newScale; // Return the correct tuple type
    });
  };
  

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setPosition((prevPosition) => {
      const newPosition: [number, number, number] = [...prevPosition]; // Ensure it's a tuple
      if (axis === 'x') newPosition[0] = value;
      if (axis === 'y') newPosition[1] = value;
      if (axis === 'z') newPosition[2] = value;
      if (modelRef.current) {
        modelRef.current.position.set(...newPosition);
      }
      return newPosition; // Return the correct tuple type
    });
  };
  

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setRotation((prevRotation) => {
      const newRotation: [number, number, number] = [...prevRotation]; // Ensure the type is a tuple
      if (axis === 'x') newRotation[0] = value;
      if (axis === 'y') newRotation[1] = value;
      if (axis === 'z') newRotation[2] = value;
      if (modelRef.current) {
        modelRef.current.rotation.set(...newRotation);
      }
      return newRotation; // This will now always return a tuple of exactly three numbers
    });
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
    <div className="h-[120vh] flex bg-white flex-row items-center justify-center ">
      {/* Camera View */}
        <div
          className="w-[50%] h-[70%]  relative  m-2 flex flex-row items-center justify-center z-0"
          ref={containerRef}
        ></div>
     

      {/* Dashboard */}
      <div className="mt-8 p-4 bg-[#6632f1] h-[60%] rounded-lg shadow-lg w-[50%]">
        <h2 className="text-white text-2xl font-semibold mb-4">Model Customization</h2>

        <div className="grid grid-cols-2 gap-8 space-y-8">
          {/* Scale Controls */}
          <div className='bg-white flex h-[35%] flex-col px-4 gap-4 rounded-lg text-[#6632f1]' >
          <h2 className="text-white text-xl font-semibold mb-4">Scale</h2>
          <div className="flex items-center">
            <label className="text-[#6632f1] mr-2">Scale X</label>
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
            <label className="text-[#6632f1] mr-2">Scale Y</label>
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
            <label className="text-[#6632f1] mr-2">Scale Z</label>
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
          </div>

          {/* Position Controls */}
          <div className='bg-white flex flex-col h-[45%] px-4 gap-4 rounded-lg text-[#6632f1]' >
          <h2 className="text-white text-xl font-semibold mb-4">Position</h2>
          <div className="flex items-center">
            <label className="text-[#6632f1] mr-2">Position X</label>
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
            <label className="text-[#6632f1] mr-2">Position Y</label>
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
            <label className="text-[#6632f1] mr-2">Position Z</label>
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
          </div>
<div className='bg-white flex flex-col h-[45%] px-4 gap-4 rounded-lg text-[#6632f1]' >
          {/* Rotation Controls */}
          <h2 className="text-white  text-xl font-semibold mb-4">Rotation</h2>
          <div className="flex items-center">
            <label className="text-[#6632f1] mr-2">Rotation X</label>
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
            <label className="text-[#6632f1] mr-2">Rotation Y</label>
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
            <label className="text-[#6632f1] mr-2">Rotation Z</label>
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
            className="w-full py-2  bg-white text-[#6632f1] h-16 font-semibold rounded-lg shadow-md hover:bg-green-600 mt-4"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeFilter;