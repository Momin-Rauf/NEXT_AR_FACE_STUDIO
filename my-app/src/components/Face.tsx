'use client';

import React, { useRef } from 'react';
import { useGLTF} from '@react-three/drei';

export function Face(props) {
  const { nodes, materials } = useGLTF('/face.glb');
  
  // Load the texture


 
  return (
    <group {...props} scale={0.2} position={[0, 0, 1.9]} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.faceMesh_defaultMaterial_0.geometry}
        material={materials.defaultMaterial}
      />
    </group>
  );
}

useGLTF.preload('/face.glb');
