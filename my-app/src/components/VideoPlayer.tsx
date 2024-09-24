// 'use client';
// import React, { useEffect, useRef } from 'react';

// const VideoPlayer = () => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   // Access the webcam on component mount
//   useEffect(() => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then((stream) => {
//           const video = videoRef.current; // Changed let to const
//           if (video) {
//             video.srcObject = stream;
//             video.play();
//           }
//         })
//         .catch((err) => {
//           console.log('Error accessing the camera: ', err);
//         });
//     }
//   }, []);

//   return (
//     <div className="w-[50%] h-[90%] relative top-10 m-2 flex flex-col items-center justify-center">
//       <video
//         style={{ transform: 'scaleX(-1)' }}
//         ref={videoRef}
//         className="w-full h-full object-cover rounded-lg mirror-effect"
//         autoPlay
//         playsInline
//       />
//       <div className="w-[80%] rounded-l-full shadow-sm shadow-black rounded-r-full relative bottom-32 z-20 h-[20%] bg-blue-200 bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
//         <div className="carousel h-[100%] carousel-center rounded-box max-w-md space-x-2 p-4">
//           <div className="carousel-item w-[40%]">
//             <img
//               src="https://img.freepik.com/free-photo/eyeglasses-wear_1203-2605.jpg?t=st=1726340619~exp=1726344219~hmac=bd4211363949f81cc925d1018c44231466940f700a722ac2a5e9450b7ad299b5&w=826"
//               className="rounded-full shadow-md shadow-black"
//               alt="Eyeglasses"
//             />
//           </div>
         
//           <div className="carousel-item w-[40%]">
//             <img
//               src="https://img.freepik.com/free-photo/isolated-white-cap_125540-1024.jpg?t=st=1726340937~exp=1726344537~hmac=521544bfae12fbc791d0a2618fe27da19005388c9bea59b31ee67221cd956619&w=826"
//               className="rounded-full shadow-md shadow-black"
//               alt="White Cap"
//             />
//           </div>

//           <div className="carousel-item w-[40%]">
//             <img
//               src="https://img.freepik.com/premium-photo/flat-design-as-glasses-icon-with-copy-space-blue-background-concept-as-vector-image-glasse_980716-410961.jpg?w=996"
//               className="rounded-full shadow-md shadow-black"
//               alt="Glasses Icon"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VideoPlayer;


'use client';
import FaceTracking from '../components/FaceTracking';
import React from 'react'

const VideoPlayer = () => {
  return (
    <div><FaceTracking/></div>
  )
}

export default VideoPlayer