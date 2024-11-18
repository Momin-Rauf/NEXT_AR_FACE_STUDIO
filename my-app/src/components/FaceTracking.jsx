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
      // Update the model attributes dynamically
      modelRef.current.setAttribute('src', selectedFilter?.model || ''); // Set model source
      modelRef.current.setAttribute('position', selectedFilter?.position || '0 0 0');
      modelRef.current.setAttribute('rotation', selectedFilter?.rotation || '0 0 0');
      modelRef.current.setAttribute('scale', selectedFilter?.scale || '1 1 1');

  if (selectedFilter.id === 6  || selectedFilter.id === 2  ) {
        modelRef.current.setAttribute('animation', 'property: position; to: 1 1 1; dur: 1000; loop: true; ');
        modelRef.current.setAttribute('animation__rotation', 'property: rotation; to: 0 360 0; dur: 5000; loop: true');
        console.log('Cockroach animation applied!');
      } else {
        // Remove animations for other models
        modelRef.current.removeAttribute('animation');
        modelRef.current.removeAttribute('animation__rotation');
      }

      console.log('Updated model:', selectedFilter?.model);
    }
  }, [selectedFilter]); // Re-run effect whenever selectedFilter changes

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
            key={`filter-${selectedFilter.id}`} 
            mindar-face="true" // Track the face with mindar-face component
            mindar-face-target={`anchorIndex:${selectedFilter?.anchor}`}
          >
            <a-gltf-model
              ref={modelRef} // Attach ref to model
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
