'use client';

import { MindARThree } from "mind-ar/dist/mindar-face-three.prod.js";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useFilterContext } from "@/context/FilterContext";
import { CiEdit } from "react-icons/ci";
import { MdBlurOn, MdBrightness4, MdContrast, MdOutlineFilterVintage } from "react-icons/md";
import { FaTint, FaAdjust } from "react-icons/fa";

const filterButtons = [
  { label: "Blur", id: "blur", icon: <MdBlurOn /> },
  { label: "Brightness", id: "brightness", icon: <MdBrightness4 /> },
  { label: "Contrast", id: "contrast", icon: <MdContrast /> },
  { label: "Grayscale", id: "grayscale", icon: <FaTint /> },
  { label: "Hue Rotate", id: "hue-rotate", icon: <MdOutlineFilterVintage /> },
  { label: "Saturate", id: "saturate", icon: <FaAdjust /> },
];

const FaceTracking = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const faceMeshRef = useRef<THREE.Object3D | null>(null);
  const mindarThreeRef = useRef<MindARThree | null>(null);
  const { selectedFilter } = useFilterContext();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState(
    filterButtons.reduce((acc, filter) => ({ ...acc, [filter.id]: 0 }), {}) // Default to 0
  );

  const handleSliderChange = (id: string, value: number) => {
    setFilterValues((prev) => ({ ...prev, [id]: value }));
  };

  const applyFilters = () => {
    if (!containerRef.current) return;

    const filterWrapper = containerRef.current.querySelector(".filter-wrapper") as HTMLDivElement;
    if (!filterWrapper) return;

    const filters = filterButtons
      .map(({ id }) => {
        const value = filterValues[id];
        switch (id) {
          case "blur":
            return `blur(${value}px)`; // Keep value as px for blur
          case "brightness":
            return `brightness(${value / 10 || 1})`; // Default 1 for no change
          case "contrast":
            return `contrast(${value / 10 || 1})`;
          case "grayscale":
            return `grayscale(${value / 100})`;
          case "hue-rotate":
            return `hue-rotate(${(value / 100) * 360}deg)`;
          case "saturate":
            return `saturate(${value / 50 || 1})`;
          default:
            return "";
        }
      })
      .join(" ");

    filterWrapper.style.filter = filters;
  };

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
    // Properly dispose of the previous model and face mesh only if necessary
    if (modelRef.current) {
      anchor.group.remove(modelRef.current); // Remove from anchor group
      disposeObject(modelRef.current);
      modelRef.current = null;
    }
    if (faceMeshRef.current) {
      scene.remove(faceMeshRef.current); // Remove from the scene
      disposeObject(faceMeshRef.current);
      faceMeshRef.current = null;
    }

    // Add face paint filter
    if (selectedFilter?.category === "Face Paint" && !faceMeshRef.current) {
      const faceMesh = mindarThreeRef.current!.addFaceMesh();
      const texture = new THREE.TextureLoader().load(selectedFilter.image_url);

      faceMesh.material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 1.0,
      });

      faceMesh.material.needsUpdate = true;
      scene.add(faceMesh);
      faceMeshRef.current = faceMesh;
    } else if (selectedFilter?.model && !modelRef.current) {
      // Load and add 3D model only if it is not already loaded
      const loader = new GLTFLoader();
      try {
        const gltf = await loader.loadAsync(selectedFilter.model);
        const model = gltf.scene;

        // Scale, position, and rotate the model
        model.scale.set(...selectedFilter.scale);
        model.position.set(...selectedFilter.position);
        model.rotation.set(...selectedFilter.rotation);

        // Add model to the anchor group
        anchor.group.add(model);
        modelRef.current = model;
      } catch (error) {
        console.error("Error loading model:", error);
      }
    }
    applyFilters();
  };

  useEffect(() => {
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

        headModel.scale.set(0.07, 0.07, 0.07); // Adjust scale as needed
        headModel.position.set(0, -0.3, 0.15); // Adjust position as needed
        headModel.rotation.set(0, 0, 0); // Adjust rotation as needed

        // Use a material that acts as an occluder
        headModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({
              colorWrite: false, // Prevent the material from rendering visually
              depthWrite: true, // Ensure it writes depth to occlude
              depthTest: true,
            });
          }
        });

        // Add head model to the scene
        anchor.group.add(headModel);
      } catch (error) {
        console.error("Error loading head model:", error);
      }

      // Add filters and 3D content
      await updateFilterContent(scene, anchor);

      // Start AR
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
    <div
      className="w-[50%] h-[70%] relative top-28 m-2 flex flex-col items-center justify-center z-0"
      ref={containerRef}
    >
      <button
        className="absolute top-[-35px] z-30 left-2 p-2 text-blue-500 bg-white rounded-full shadow-lg hover:text-white hover:bg-blue-500 transition-all duration-200"
        title="Edit"
        onClick={() => setShowFilters((prev) => !prev)}
      >
        <CiEdit size={24} />
      </button>

      {showFilters && (
        <div className="absolute top-[40px] left-2 z-40 flex flex-col gap-2 bg-gray-100 p-3 rounded-lg shadow-lg pointer-events-auto">
          {filterButtons.map((filter) => (
            <div
              key={filter.id}
              className="relative flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200"
              onClick={() => setActiveFilter((prev) => (prev === filter.id ? null : filter.id))}
            >
              <span className="text-blue-500 text-sm">{filter.icon}</span>
              <span className="text-sm">{filter.label}</span>
              {activeFilter === filter.id && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filterValues[filter.id]}
                  onChange={(e) => handleSliderChange(filter.id, Number(e.target.value))}
                  className="absolute top-[-10px] left-[120px] w-[150px]"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="filter-wrapper w-full h-full pointer-events-none"></div>
    </div>
  );
};

export default FaceTracking;
