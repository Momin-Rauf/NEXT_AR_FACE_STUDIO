// import React, { useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { useGLTF, OrbitControls } from "@react-three/drei";
// import { useControls } from "leva";
// import { useDropzone } from "react-dropzone";
// import {Face} from './Face';


// // Model Component
// const Model = ({ url, position, scale, rotation, color }) => {
//   if (!url) return null;

//   const { scene } = useGLTF(url);

//   // Applying the color to the model's material
//   React.useEffect(() => {
//     if (scene) {
//       scene.traverse((child) => {
//         if (child.isMesh) {
//           child.material.color.set(color); // Apply the color
//         }
//       });
//     }
//   }, [color, scene]);

//   return (
//     <mesh position={position} scale={scale} rotation={rotation}>
//       <primitive object={scene} />
//     </mesh>
//   );
// };

// const FilterCustomizer = () => {
//   const [modelURL, setModelURL] = useState(null);

//   // Leva controls for scale, position, rotation, light, and color
//   const { scale, position, rotation, lightType, lightColor, lightIntensity, lightPosition, modelColor } = useControls({
//     scale: { value: [1, 1, 1], min: 0.5, max: 3, step: 0.1 },
//     position: { value: [0, 0, 0], step: 0.1 },
//     rotation: { value: [0, 0, 0], step: 0.1 },
//     lightType: { value: "ambient", options: ["ambient", "directional", "point"] },
//     lightColor: { value: "#ffffff" },
//     lightIntensity: { value: 1, min: 0, max: 2, step: 0.1 },
//     lightPosition: { value: [5, 5, 5], step: 0.1 },
//     modelColor: { value: "#ff0000" }, // Color control for the model
//   });

//   // Drag-and-drop functionality
//   const { getRootProps, getInputProps } = useDropzone({
//     accept: ".glb",
//     onDrop: (acceptedFiles) => {
//       const file = acceptedFiles[0];
//       if (file) {
//         const url = URL.createObjectURL(file);
//         setModelURL(url);
//       }
//     },
//   });

//   // Light Renderer
//   const renderLight = () => {
//     if (lightType === "ambient") {
//       return <ambientLight color={lightColor} intensity={lightIntensity} />;
//     } else if (lightType === "directional") {
//       return (
//         <directionalLight
//           color={lightColor}
//           intensity={lightIntensity}
//           position={lightPosition}
//         />
//       );
//     } else if (lightType === "point") {
//       return (
//         <pointLight
//           color={lightColor}
//           intensity={lightIntensity}
//           position={lightPosition}
//         />
//       );
//     }
//   };

//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       {/* Drag-and-Drop Zone */}
//       <div
//         {...getRootProps()}
//         style={{
//           padding: "10px",
//           backgroundColor: "#ff1",
//           borderRadius: "4px",
//           boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
//           cursor: "pointer",
//           height:"100px"

//         }}
//       >
//         <input {...getInputProps()} />
//         <p>Drag and drop a .glb file here, or click to upload</p>
//       </div>

//       {/* 3D Scene */}
//       <Canvas>
//         <gridHelper args={[10, 10]} />
//         {renderLight()}
//         <Face></Face>
//         {modelURL && (
//           <Model
//             url={modelURL}
//             position={position}
//             scale={scale}
//             rotation={rotation}
//             color={modelColor} // Pass the color control to the model
//           />
//         )}
//         <OrbitControls />
//       </Canvas>
//     </div>
//   );
// };

// export default FilterCustomizer;


import React from 'react'

const FilterCustomizer = () => {
  return (
    <div>
      hey
    </div>
  )
}

export default FilterCustomizer
