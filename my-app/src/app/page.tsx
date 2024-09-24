'use client';
import './globals.css';
import Navbar from '@/components/Navbar';
import React, { useEffect, useRef, useState } from 'react';
import FilterBoard from '@/components/FilterBoard';
// import VideoPlayer from '@/components/VideoPlayer';
import FaceTracking from '@/components/FaceTracking';
export default function Home() {
  // Specify the type for videoRef as HTMLVideoElement
  const [loading, setLoading] = useState(true); // Loading state

  // Access the webcam on component mount
  useEffect(() => {
    // Simulating an artificial loading delay (e.g., waiting for data or assets)
    setTimeout(() => {
      setLoading(false); // Hide loader after components are ready
    }, 2000); // Adjust this delay as needed

    
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
        {/* <VideoPlayer /> */}
        <FaceTracking />
      </div>
    </>
  );
}
