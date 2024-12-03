import React, { useEffect,useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap';
export function Face(props) {
  const { nodes, materials } = useGLTF('/chmil_mannequin_bust_2024 (1).glb')
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      // Set initial position, rotation, and scale
      groupRef.current.position.set(2, 1, -4);
      groupRef.current.rotation.set(Math.PI / 2, Math.PI / 4, 0); // Initial rotation
      groupRef.current.scale.set(0.5, 0.5, 0.5); // Example starting scale

      // Animate position, rotation, and scale to the final state
      gsap.to(groupRef.current.position, {
        x: 0,
        y: -1,
        z:0,
        duration: 3,
        ease: 'power2.out',
        delay: 2,
      });

      
      gsap.to(groupRef.current.rotation, {
        x: -Math.PI/2,
        y: 0,
        z: 0,
        duration: 2,
        ease: 'power2.out',
      });
      gsap.to(groupRef.current.scale, {
        x: 8,
        y: 8,
        z: 8,
        duration: 2,
        ease: 'power2.out',
      });
    }
  }, []);
  return (
    <group {...props} dispose={null}>
      <group ref={groupRef} scale={8} position={[0,-1,0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.final_for_upload_final_for_upload0_0.geometry}
          material={materials.final_for_upload0}

          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/chmil_mannequin_bust_2024 (1).glb')
