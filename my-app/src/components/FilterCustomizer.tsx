'use client';
import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Face } from './Face';
import { Glasses } from './Glasses';
import gsap from 'gsap';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';




// Model Component
const Model = ({ url, position, rotation, color }) => {
  if (!url) return null;

  const { scene } = useGLTF(url);

  // Applying the color to the model's material
  React.useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(color); // Apply the color
        }
      });
    }
  }, [color, scene]);

  

  return (
    <mesh position={position} rotation={rotation}>
      <primitive object={scene} />
    </mesh>
  );
};

const FilterCustomizer = () => {
  const position = [0, 0, 0]; // Model position
  const rotation = [0, 0, 0]; // Model rotation

  // Directional light settings
  const lightColor = "#6331f5";
  const lightIntensity = 0.9;
  const lightPosition = [0, 5, 45];

  // Animation logic
 

  return (
    <div style={{ width: "60%", height: "80vh" }}>
      {/* 3D Scene */}
      <Canvas>
        {/* Directional Light */}
        <directionalLight
          color={lightColor}
          intensity={lightIntensity}
          position={lightPosition}
        />

        {/* Face and Glasses Components */}
        <Face  className="face" position={position} rotation={rotation} />
        <Glasses className="glasses" position={position} rotation={rotation} />
        
        {/* OrbitControls with restricted Y-axis rotation to 30 degrees (15 left, 15 right) */}
        <OrbitControls 
          minAzimuthAngle={-Math.PI / 12}  // -15 degrees (left)
          maxAzimuthAngle={Math.PI / 12}   // 15 degrees (right)
          enableZoom={false}  // Disable zoom
          enableRotate={true}  // Enable rotation
        />
      </Canvas>
    </div>
  );
};

export default FilterCustomizer;
