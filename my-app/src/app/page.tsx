'use client';
import './globals.css';
import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';
import FilterBoard from '@/components/FilterBoard';
import dynamic from 'next/dynamic';

// Dynamically import FaceTracking component, disabling SSR
const FaceTracking = dynamic(() => import('@/components/FaceTracking'), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true); // Loading state

  // Simulating an artificial loading delay (e.g., waiting for data or assets)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Hide loader after components are ready
    }, 2000); // Adjust this delay as needed

    return () => clearTimeout(timer); // Cleanup the timeout on unmount
  }, []);

  if (loading) {
    // Show full-screen loader until the website finishes loading
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <span className="loading w-[200px] h-[200px] loading-infinity"></span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-r pl-2 from-[#d2bcbc] to-[#9270ed] h-screen flex justify-between flex-row">
        <div className="w-[50%]">
          <FilterBoard />
        </div>
        {/* VideoPlayer can be added back if needed */}
        <FaceTracking />
      </div>
    </>
  );
}
