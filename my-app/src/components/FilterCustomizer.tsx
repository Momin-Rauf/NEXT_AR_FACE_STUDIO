'use client';
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Face } from './Face';
import { AlternateGlasses } from "./AlternateGlasses";
import { Glasses } from './Glasses';

const FilterCustomizer = (props) => {
  const position: [number, number, number] = [0, 0, 0]; // Model position
  const rotation: [number, number, number] = [0, 0, 0]; // Model rotation

  // Directional light settings
  const lightColor = "#6331f5";
  const lightIntensity = 0.9;
  const lightPosition: [number, number, number] = [0, 5, 15];

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      {/* 3D Scene */}
      <Canvas>
        {/* Ambient Light: Adds soft, even light to illuminate the scene */}
        <ambientLight intensity={0.3} color="#ffffff" />

        {/* Directional Light: Creates focused lighting, like sunlight */}
        <directionalLight
          color={lightColor}
          intensity={lightIntensity}
          position={lightPosition}
        />

        {/* Face Component */}
        <Face position={position} rotation={rotation} />

        {/* Conditional Rendering for Glasses */}
        {props.model === 1 && (
          <Glasses position={position} rotation={rotation} />
        )}

        {props.model === 2 && <AlternateGlasses />}

        {/* OrbitControls for camera interaction */}
        <OrbitControls
          minAzimuthAngle={-Math.PI / 12} // -15 degrees (left)
          maxAzimuthAngle={Math.PI / 12}  // 15 degrees (right)
          enableZoom={false}  // Disable zoom
          enableRotate={true}  // Enable rotation
        />
      </Canvas>
    </div>
  );
};

export default FilterCustomizer;
