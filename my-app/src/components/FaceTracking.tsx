import { MindARThree } from "mind-ar/dist/mindar-face-three.prod.js";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useFilterContext } from "@/context/FilterContext";
import ButtonPanel from "./ButtonPanel";

const FaceTracking = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const faceMeshRef = useRef<THREE.Object3D | null>(null);
  const mindarThreeRef = useRef<MindARThree | null>(null);
  const { selectedFilter } = useFilterContext();
  const [loading, setLoading] = useState(false);

  const disposeObject = (object: THREE.Object3D | null) => {
    if (!object) return;
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

  const updateFilterContent = async (scene: THREE.Scene, anchor: any) => {
    if (loading) return;
    setLoading(true);

    // Clear previously loaded model and face mesh
    if (modelRef.current) {
      anchor.group.remove(modelRef.current);
      disposeObject(modelRef.current);
      modelRef.current = null;
    }
    if (faceMeshRef.current) {
      scene.remove(faceMeshRef.current);
      disposeObject(faceMeshRef.current);
      faceMeshRef.current = null;
    }

    // Load face paint filter
    if (selectedFilter?.category === "Face Paint" && !faceMeshRef.current) {
      const faceMesh = mindarThreeRef.current!.addFaceMesh();
      const texture = new THREE.TextureLoader().load(selectedFilter.image_url);
      faceMesh.material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 1.0,
      });
      scene.add(faceMesh);
      faceMeshRef.current = faceMesh;
    } else if (selectedFilter?.model && !modelRef.current) {
      // Load 3D model using GLTFLoader with caching
      const loader = new GLTFLoader();
      try {
        let gltf;
        const cached = THREE.Cache.get(selectedFilter.model);
        if (cached) {
          // Use the cached model
          gltf = cached;
        } else {
          // Load the model and cache it
          gltf = await loader.loadAsync(selectedFilter.model);
          THREE.Cache.add(selectedFilter.model, gltf);
        }
        const model = gltf.scene;

        // Scale, position, and rotate the model
        model.scale.set(...selectedFilter.scale);
        model.position.set(...selectedFilter.position);
        model.rotation.set(...selectedFilter.rotation);

        // Add the model to the anchor group
        anchor.group.add(model);
        modelRef.current = model;
      } catch (error) {
        console.error("Error loading model:", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if ((selectedFilter?.category !== "Face Paint") && (!selectedFilter?.model)) return;
    console.log('hello')
    const initAR = async () => {
      if (initialized.current) return;

      const containerElement = containerRef.current?.querySelector(".filter-wrapper") as HTMLElement | null;
      if (!containerElement) {
        console.error("Container element is not found or null.");
        return;
      }

      const mindarThree = new MindARThree({ container: containerElement });
      const { renderer, scene, camera } = mindarThree;
      mindarThreeRef.current = mindarThree;
      const anchor = mindarThree.addAnchor(selectedFilter?.anchor || 168);

      // Add lighting
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Load and add the face occluder
      const loader = new GLTFLoader();
      const headModelUrl =
        "https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/sparkar/headOccluder.glb";

      try {
        const gltf = await loader.loadAsync(headModelUrl);
        const headModel = gltf.scene;

        headModel.scale.set(0.07, 0.07, 0.07);
        headModel.position.set(0, -0.3, 0.15);
        headModel.rotation.set(0, 0, 0);

        headModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({
              colorWrite: false,
              depthWrite: true,
              depthTest: true,
            });
          }
        });

        anchor.group.add(headModel);
      } catch (error) {
        console.error("Error loading head model:", error);
      }

      await updateFilterContent(scene, anchor);

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
        disposeObject(modelRef.current);
        disposeObject(faceMeshRef.current);
        initialized.current = false;
      };
    };

    initAR();

    return () => {
      initialized.current = false;
    };
  }, [selectedFilter]);

  return (
    <>
      {selectedFilter ? (
        <div
          className="sm:w-[50%] sm:h-[90%] relative top-60 sm:relative sm:top-28 sm:m-2 sm:flex sm:flex-col sm:items-center sm:justify-center sm:z-0"
          ref={containerRef}
        >
          <ButtonPanel containerRef={containerRef} />
          <div className="filter-wrapper w-full h-full sm:relative sm:top-48 pointer-events-none"></div>
        </div>
      ) : ( 
        <div className="sm:w-[50%] sm:h-[500px] h-[400px]  absolute w-full  top-0 sm:relative sm:top-20 sm:m-2 flex flex-col bg-slate-200 animate-ping items-center justify-center sm:z-0">
        <img src='/camera.svg' ></img>
         <p className='text-black'>Please Select a filter</p>
        </div>
      )}
    </>
  );
  
};

export default FaceTracking;
