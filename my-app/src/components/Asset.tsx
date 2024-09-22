'use client';

import React from "react";
import Image from 'next/image';  

// Define a TypeScript interface for the component props
interface AssetProps {
    imageSrc: string; 
  }


const Asset = ({ imageSrc }: AssetProps) => {  

  // RETURN JSX
  return (
    <div className="bg-slate-300 p-3 rounded-lg">
      <div className="w-[150px] h-[150px] relative">  
        <Image
          src={imageSrc}  
          alt="Asset Image"
          fill  // This ensures the image fills the container
          className="object-cover rounded-lg"  // Ensure aspect ratio is maintained and image is cropped if necessary
        />
      </div>
    </div>
  );
};

export default Asset;
