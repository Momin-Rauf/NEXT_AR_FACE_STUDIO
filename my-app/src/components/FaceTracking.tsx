import { MindARThree } from "mind-ar/dist/mindar-face-three.prod.js";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useFilterContext } from "@/context/FilterContext";

type Filter = {
  model?: string;
  anchor?: number;
  scale: [number, number, number]; // Tuple for 3D scaling factors
  position: [number, number, number]; // Tuple for 3D position
  rotation: [number, number, number]; // Tuple for 3D rotation
};

const FaceTracking = () => {
 
  const [modelURL, setModelURL] = useState("");
  const containerRef = useRef(null);
  const initialized = useRef(false);
  const modelRef = useRef(null); // Current model reference
  const mindarThreeRef = useRef(null); // Store MindARThree instance
  const { selectedFilter } = useFilterContext();

  // Utility to dispose of objects
  const disposeObject = (object) => {
    object.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat.map) mat.map.dispose();
            if (mat.normalMap) mat.normalMap.dispose();
            mat.dispose();
          });
        } else {
          if (child.material.map) child.material.map.dispose();
          if (child.material.normalMap) child.material.normalMap.dispose();
          child.material.dispose();
        }
      }
    });
    if (object.parent) object.parent.remove(object);
  };

  const clearScene = (scene) => {
    scene.traverse((object) => disposeObject(object));
    while (scene.children.length) {
      scene.remove(scene.children[0]);
    }
  };

  useEffect(() => {
    console.log(selectedFilter);
    if (!selectedFilter?.model) return;

    const initAR = async () => {
      if (initialized.current) return;

      const mindarThree = new MindARThree({ container: containerRef.current });
      const { renderer, scene, camera } = mindarThree;

      mindarThreeRef.current = mindarThree;

      // Setup lighting
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Setup anchor
      const anchor = mindarThree.addAnchor(selectedFilter.anchor || 168);

      // GLTF Loader
      const loader = new GLTFLoader();

      const loadModel = async (url) => {
        try {
          const gltf = await loader.loadAsync(url);
          
          // Dispose of the previous model
          if (modelRef.current) {
            disposeObject(modelRef.current);
            modelRef.current = null;
          }

          // Configure and add the new model
          const model = gltf.scene;
          model.scale.set(selectedFilter.scale[0],selectedFilter.scale[1],selectedFilter.scale[2]);
          model.position.set(selectedFilter.position[0],selectedFilter.position[1],selectedFilter.position[2]);
          model.rotation.set(selectedFilter.rotation[0],selectedFilter.rotation[1],selectedFilter.rotation[2]);

          anchor.group.add(model);
          modelRef.current = model;
        } catch (error) {
          console.error("Error loading model:", error);
        }
      };

      // Initial model load
      if (selectedFilter.model) {
        await loadModel(selectedFilter.model);
      }

      // Start rendering
      try {
        await mindarThree.start();
      } catch (error) {
        console.error("MindARThree initialization failed:", error);
        return;
      }

      // Rendering loop
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
    };

    initAR();

    return () => {
      initialized.current = false;
    };
  }, [selectedFilter]);

  return (
    <div
      className="w-[50%] h-[70%] relative top-28 m-2 flex flex-col items-center justify-center z-0"
      ref={containerRef}
    ></div>
  );
};

export default FaceTracking;
