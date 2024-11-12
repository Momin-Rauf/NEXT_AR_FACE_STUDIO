'use client';
import 'aframe';
import { useEffect, useRef } from 'react';
import 'mind-ar/dist/mindar-face-aframe.prod.js';
import { useFilterContext } from '@/context/FilterContext'; // Import the context hook

const FaceTracking = () => {
  const { selectedFilter } = useFilterContext(); // Access the selected filter from the context
  const modelRef = useRef(null); // Create a ref to access the model directly

  useEffect(() => {
    if (modelRef.current && selectedFilter) {
      // Manually update the model attributes
      modelRef.current.setAttribute('src', selectedFilter?.model || '');
      modelRef.current.setAttribute('position', selectedFilter?.position || '0 0 0');
      modelRef.current.setAttribute('rotation', selectedFilter?.rotation || '0 0 0');
      modelRef.current.setAttribute('scale', selectedFilter?.scale || '1 1 1');
      console.log('Updated model:', selectedFilter?.model);
    }
  }, [selectedFilter]); // Run this effect whenever the selectedFilter changes

  // Log the selected filter ID (for debugging purposes)
  console.log('Selected Filter:', selectedFilter?.anchor);

  return (
    <div className="w-[50%] h-[70%] relative top-28 m-2 flex flex-col items-center justify-center z-0">
      <a-scene
        mindar-face
        embedded
        color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        {/* Consolidated a-assets for glasses models */}
        <a-assets>
          <a-asset-item
            id="Model"
            src={selectedFilter?.model} // Update the model source dynamically
          ></a-asset-item>
        </a-assets>

        <a-camera
          className="w-[50%] shadow-md shadow-black h-[70%] border-2 border-black relative top-20 m-2 flex flex-col items-center justify-center z-0"
          active="false"
          position="0 0 0"
        ></a-camera>

        {/* Render the selected model with dynamic transformations */}
        {selectedFilter && (
          <a-entity
            key={`filter-${selectedFilter.id}`} // Unique key for re-rendering
            mindar-face-target={`anchorIndex:${selectedFilter?.anchor}`}
          >
            <a-gltf-model
              ref={modelRef} // Attach ref to model
              animation-mixer="enabled: false"
              rotation={selectedFilter.rotation || '0 0 0'}
              position={selectedFilter.position || '0 0 0'}
              scale={selectedFilter.scale || '1 1 1'} // Ensure scale is visible
              src="#Model" // Use the asset ID directly
              onLoaded={() => console.log(`Model ${selectedFilter.id} loaded successfully.`)} // Log when the model is loaded
              onError={() => console.error('Model failed to load')} // Log on model load failure
            ></a-gltf-model>
          </a-entity>
        )}
      </a-scene>
    </div>
  );
};

export default FaceTracking;
