"use client"
import React from "react";
import Asset from './Asset';

const AssetsPage = () => {

  // Array of image paths 
  const imagePaths = [
    "/Assets/myassets/glasses.jpeg",
    "/Assets/myassets/glasses1.jpeg",
    "/Assets/myassets/cat.jpg",
    "/Assets/myassets/dog.jpg",
    "/Assets/myassets/glasses.jpeg",
    "/Assets/myassets/glasses1.jpeg",
    "/Assets/myassets/cat.jpg",
    "/Assets/myassets/dog.jpg"
  ];

  // RETURN JSX
  return (
    <main className="w-full h-[200vh] flex items-center flex-col bg-gradient-to-r from-[#d2bcbc] to-[#9270ed]">
      <div className="assetsBtnBox my-4">
        <h1 className="assetsBtn bg-primary border-primary border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-[#1B44C8] hover:border-[#1B44C8] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#1B44C8] active:border-[#1B44C8]">
          My Assets
        </h1>
      </div> 
      <div className="assetsBox container bg-slate-100 p-4 shadow-xl rounded-3xl flex flex-wrap gap-4">
        {imagePaths.map((imagePath, index) => (
          <Asset key={index} imageSrc={imagePath} /> 
        ))}
      </div>
    </main>
  );
};

export default AssetsPage;

// 'use client'
// import React from 'react'

// const AssetsPage = () => {
//   return (
//     <div>
//       <h1 className="bg-black" >Hello</h1>
//     </div>
//   )
// }

// export default AssetsPage