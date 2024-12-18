'use client';

import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { Mesh, Material } from 'three'; // Import necessary types

type FaceGLTF = {
  nodes: {
    faceMesh_defaultMaterial_0: Mesh;
  };
  materials: {
    defaultMaterial: Material;
  };
};

export function Face(props: GroupProps) {
  const { nodes, materials } = useGLTF('/face.glb') as unknown as FaceGLTF;

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
