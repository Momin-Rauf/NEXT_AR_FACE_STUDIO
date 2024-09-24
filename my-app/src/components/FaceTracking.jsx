'use client';
import 'aframe';
import 'mind-ar/dist/mindar-face-aframe.prod.js';
import { useFilterContext } from '@/context/FilterContext'; // Import the context hook

const FaceTracking = () => {
  const { selectedFilterId } = useFilterContext(); // Access the selected filter from the context

  // Log the selected filter ID
  console.log('Selected Filter ID:', selectedFilterId);

  return (
    <div className="w-[50%] h-[90%] relative top-10 m-2 flex flex-col items-center justify-center z-10">
      <a-scene mindar-face embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
      
        {/* Consolidated a-assets for glasses models */}
        <a-assets>
          <a-asset-item id="glassesModel1" src="/Assets/glasses/scene.gltf"></a-asset-item>
          <a-asset-item id="glassesModel2" src="/Assets/black-glasses/scene.gltf"></a-asset-item>
          <a-asset-item id="glassesModel3" src="/Assets/new_glasses/scene.gltf"></a-asset-item>
        </a-assets>

        <a-camera active="false" position="0 0 0"></a-camera>

        {/* Check if a filter is selected and render the corresponding glasses model */}
        {selectedFilterId && (
          <a-entity mindar-face-target="anchorIndex: 168">
            <a-gltf-model 
              rotation="0 0 0" 
              position="0 0.2 0" 
              scale="0.2 0.2 0.2" 
              src={`#glassesModel${selectedFilterId}`} // Use the selected filter's ID to choose the model
              onLoaded={() => console.log(`Model ${selectedFilterId} loaded successfully.`)} // Log when the model is loaded
            ></a-gltf-model>
          </a-entity>
        )}
      </a-scene>
    </div>
  );
};

export default FaceTracking;
