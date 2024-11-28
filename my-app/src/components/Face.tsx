import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Face(props) {
  const { nodes, materials } = useGLTF('/face_model.glb');

  // TypeScript type assertion to tell TypeScript that nodes.Object_2 is a mesh
  const meshNode = nodes['Object_2'] as THREE.Mesh;

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        scale={[0.01, 0.01, 0.01]}  // Scale adjusted to be smaller
        position={[0, 0, 0]}  
        geometry={meshNode.geometry}  // Access geometry on the mesh
        material={materials['04___Default']}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload('/face_model.glb');
