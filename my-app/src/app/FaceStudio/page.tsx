'use client';
import '../globals.css';
import React, { useEffect, useState } from 'react';
import FilterBoard from '@/components/FilterBoard';
import dynamic from 'next/dynamic';
import Upload from '@/components/Upload';
import { FilterProvider } from '@/context/FilterContext'; // Import your context provider

// Dynamically import FaceTracking component, disabling SSR
const FaceTracking = dynamic(() => import('@/components/FaceTracking'), { ssr: false });

export default function FaceStudio() {
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <span className="loading w-[200px] h-[200px] loading-infinity"></span>
      </div>
    );
  }

  return (
    <FilterProvider>
      
      <div className = 'sm:relative  sm:top-0 sm:flex sm:flex-col sm:gap-5' >
      <div className="bg-white sm:pl-2 px-2 flex justify-between sm:flex-row flex-col">
        <FaceTracking />
        <div className="border-2 relative bg-white ml-0 right-0 sm:mt-20 mt-[410px] w-[100%] sm:w-[50%]">
          <FilterBoard />
        </div>
      </div>
        <Upload/>
      </div>
    </FilterProvider>
  );
}