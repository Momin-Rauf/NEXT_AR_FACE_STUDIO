'use client';
import 'aframe';
import {useEffect} from 'react';
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
          <a-asset-item id="Model1" src="/Assets/glasses/scene.gltf"></a-asset-item>
          <a-asset-item id="Model2" src="/Assets/black-glasses/scene.gltf"></a-asset-item>
          <a-asset-item id="Model3" src="https://firebasestorage.googleapis.com/v0/b/ar-face-studio.appspot.com/o/models%2Fmodel.glb-1728413802452.glb?alt=media&token=67780f65-ef3f-4dac-92cb-fb770c494f46"></a-asset-item>
          <a-asset-item id="Model4" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/hat/scene.gltf"></a-asset-item>
          <a-asset-item id="Model5" src="/Assets/meshy_glasses/model.glb"></a-asset-item>
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
            mindar-face-target={`anchorIndex:${selectedFilter?.anchor}`}>
            <a-gltf-model
              animation-mixer="enabled: false"
              rotation={selectedFilter.rotation}
              position={selectedFilter.position}
              scale={selectedFilter.scale}
              src={`#Model${selectedFilter.id}`} // Use the selected filter's ID to choose the model
              onLoaded={() => console.log(`Model ${selectedFilter.id} loaded successfully.`)} // Log when the model is loaded
            ></a-gltf-model>
          </a-entity>
        )}
      </a-scene>
    </div>
  );
};

export default FaceTracking;
