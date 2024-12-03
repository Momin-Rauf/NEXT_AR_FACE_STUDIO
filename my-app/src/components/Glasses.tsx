import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';

export function Glasses(props) {
  const { nodes, materials } = useGLTF('/glasses (2).glb');
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      // Set initial position, rotation, and scale
      groupRef.current.position.set(2, 1, 4);
      groupRef.current.rotation.set(Math.PI / 2, Math.PI / 4, 0); // Initial rotation
      groupRef.current.scale.set(0.5, 0.5, 0.5); // Example starting scale

      // Animate position, rotation, and scale to the final state
      gsap.to(groupRef.current.position, {
        x: 0,
        y: 0.5,
        z: 1.8,
        duration: 3,
        ease: 'power2.out',
        delay: 2,
      });

      gsap.to(groupRef.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: 'power2.out',
      });

      gsap.to(groupRef.current.scale, {
        x: 0.09,
        y: 0.1,
        z: 0.1,
        duration: 2,
        ease: 'power2.out',
      });
    }
  }, []);

  return (
    <>
      {/* Ambient Light for overall soft lighting */}
      <ambientLight intensity={0.5} />

      {/* Directional Light for sharp highlights */}
      <directionalLight
        intensity={1}
        position={[5, 15, 2]} // Above and to the side of the glasses
        castShadow
      />

      {/* Point Light to add focused light effect */}
      <pointLight
        intensity={0.8}
        position={[0, 2, 2]} // Near the glasses
        color="white"
        decay={2} // Attenuation effect
      />

      <group {...props} ref={groupRef} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Glasses_Glasses2_0.geometry}
          material={materials.Glasses2}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Glasses_Lenses_0.geometry}
          material={materials.Lenses}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Glasses_Glasses1_0.geometry}
          material={materials.Glasses1}
        />
      </group>
    </>
  );
}

useGLTF.preload('/glasses (2).glb');
