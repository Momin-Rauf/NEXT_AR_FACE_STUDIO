
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function AlternateGlasses(props) {
  const { nodes, materials } = useGLTF('/3d_glasses.glb')
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
    
   
    <group {...props} scale={1} position={[-31.5,-10,42.5]} dispose={null}>
      <group  rotation={[-Math.PI / 2, 0, 0]}>
        <mesh  
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials.Bluelen1Mtl}
        />
        <mesh  
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials.Redlen1Mtl}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials.Middle1Mtl}
        />
      </group>
    </group>
    </>
  )
}

useGLTF.preload('/3d_glasses.glb')


