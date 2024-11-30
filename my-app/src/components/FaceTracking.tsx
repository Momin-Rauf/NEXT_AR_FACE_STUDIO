'use client';

import { MindARThree } from "mind-ar/dist/mindar-face-three.prod.js";
import { useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);
  const modelRef = useRef<THREE.Object3D | null>(null); // Current model reference
  const mindarThreeRef = useRef<MindARThree | null>(null); // Store MindARThree instance
  const { selectedFilter } = useFilterContext();

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

  useEffect(() => {
    if (!selectedFilter?.model) return;

    const initAR = async () => {
      if (initialized.current) return;

      if (!containerRef.current) return;

      const mindarThree = new MindARThree({ container: containerRef.current });
      const { renderer, scene, camera } = mindarThree;

      mindarThreeRef.current = mindarThree;

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      const anchor = mindarThree.addAnchor(selectedFilter.anchor || 168);
      const loader = new GLTFLoader();

      const loadModel = async (url: string) => {
        try {
          const gltf = await loader.loadAsync(url);

          if (modelRef.current) {
            disposeObject(modelRef.current);
            modelRef.current = null;
          }

          const model = gltf.scene;
          model.scale.set(...selectedFilter.scale);
          model.position.set(...selectedFilter.position);
          model.rotation.set(...selectedFilter.rotation);

          anchor.group.add(model);
          modelRef.current = model;
        } catch (error) {
          console.error("Error loading model:", error);
        }
      };

      if (selectedFilter.model) {
        await loadModel(selectedFilter.model);
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
