'use client';
import 'aframe';
import 'mind-ar/dist/mindar-face-aframe.prod.js';
import { useFilterContext } from '@/context/FilterContext'; // Import the context hook

const FaceTracking = () => {
  const { selectedFilter } = useFilterContext(); // Access the selected filter from the context

  // Log the selected filter ID
  console.log('Selected Filter:', selectedFilter);

  return (
    <div className="w-[50%] h-[90%] relative top-10 m-2 flex flex-col items-center justify-center z-10">
      <a-scene mindar-face embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
      
        {/* Consolidated a-assets for glasses models */}
        <a-assets>
          <a-asset-item className='glasses' id="Model1" src="/Assets/glasses/scene.gltf"></a-asset-item>
          <a-asset-item className='glasses' id="Model2" src="/Assets/black-glasses/scene.gltf"></a-asset-item>
          <a-asset-item className='glasses' id="Model3" src="/Assets/new_glasses/scene.gltf"></a-asset-item>
          {/* <a-asset-item className='hat' id="Model4" src="/Assets/hat/scene.gltf"></a-asset-item> */}
          <a-asset-item className='hat' id="Model4" src="/Assets/hat1/scene.gltf"></a-asset-item>
          <a-asset-item className='hat' id="Model5" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/hat/scene.gltf"></a-asset-item>
          <a-asset-item className='hat' id="Model6" src="/Assets/mustache/scene.gltf"></a-asset-item>
        </a-assets>

        <a-camera active="false" position="0 0 0"></a-camera>

        {/* Render the selected model with dynamic transformations */}
        {selectedFilter && (
          <a-entity mindar-face-target="anchorIndex: 10">
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
