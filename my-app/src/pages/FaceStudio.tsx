'use client';
import '../app/globals.css';
import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';
import FilterBoard from '@/components/FilterBoard';
import dynamic from 'next/dynamic';
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
      <Navbar />
      <div className="bg-white pl-2  h-screen flex justify-between flex-row">
        <div className="mt-24 w-[50%]">
          <FilterBoard />
        </div>
        <FaceTracking />
      </div>
    </FilterProvider>
  );
}