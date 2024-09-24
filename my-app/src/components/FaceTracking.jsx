// src/FaceTracking.js
import React, { useEffect } from 'react';
import 'aframe';
import 'mind-ar/dist/mindar-face-aframe.prod.js';

const FaceTracking = () => {


  return (
    <a-scene mindar-face embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
      <a-assets>
	<a-asset-item id="glassesModel" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/glasses/scene.gltf"></a-asset-item>
      </a-assets>

      <a-camera active="false" position="0 0 0"></a-camera>
      <a-entity mindar-face-target="anchorIndex: 168">
	<a-gltf-model rotation="0 0 0" position="0 0 0" scale="0.01 0.01 0.01" src="#glassesModel"></a-gltf-model>
      </a-entity>
    </a-scene>
  );
};

export default FaceTracking;
