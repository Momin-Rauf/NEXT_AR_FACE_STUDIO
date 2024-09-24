'use client';
import 'aframe';
import 'mind-ar/dist/mindar-face-aframe.prod.js';

const FaceTracking = () => {


  return (
    <div className="w-[50%] h-[90%] relative top-10 m-2 flex flex-col items-center justify-center z-10" >
        <a-scene mindar-face embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
      <a-assets>
	<a-asset-item id="glassesModel" src="/Assets/glasses/scene.gltf"></a-asset-item>
      </a-assets>

      <a-camera active="false" position="0 0 0"></a-camera>
      <a-entity mindar-face-target="anchorIndex: 168">
	<a-gltf-model rotation="0 0 0" position="0 0.2 0" scale="0.2 0.2 0.2" src="#glassesModel"></a-gltf-model>
      </a-entity>
    </a-scene>
    </div>
  );
};

export default FaceTracking;
