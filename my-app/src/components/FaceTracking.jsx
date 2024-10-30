'use client';
import 'aframe';
import { useEffect } from 'react';
import 'mind-ar/dist/mindar-face-aframe.prod.js';
import { useFilterContext } from '@/context/FilterContext'; // Import the context hook

const FaceTracking = () => {
  const { selectedFilter } = useFilterContext(); // Access the selected filter from the context

  useEffect(() => {
    // Logic to handle when selectedFilter changes
    console.log('Anchor changed to:', selectedFilter?.anchor);
  }, [selectedFilter]);

  // Log the selected filter ID
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
            src={
              selectedFilter?.model_data
            }
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
            key={`filter-${selectedFilter.anchor}`} // Unique key for re-rendering
            mindar-face-target={`anchorIndex:${selectedFilter?.anchor}`}
          >
            <a-gltf-model
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
