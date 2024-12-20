"use client";
import React, { useEffect, useRef, useState } from "react";
import FilterCustomizer from "./FilterCustomizer";

const AboutSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex flex-row p-12 h-[100vh] bg-white justify-center items-center"
    >
      {/* Left Content: Text Section */}
      <div className="flex w-[50%] gap-6 text-black flex-col">
        <h1 className="font-bold text-4xl mb-4 text-[#6f40f9]">
          Create Real-Time Filters
        </h1>
        <p className="m-2 text-lg leading-relaxed text-gray-700">
          Transform your creativity into reality by creating real-time filters
          with just a picture. Our platform simplifies the process, empowering
          you to design and customize filters effortlessly. Whether you're an
          influencer or a brand, bring your ideas to life in seconds.
        </p>
      </div>

      {/* Right Content: 3D Scene */}
      <div className="w-[40%] m-2 rounded-lg shadow-lg">
        {/* Render FilterCustomizer only when visible */}
        {isVisible && <FilterCustomizer model={1} />}
      </div>
    </div>
  );
};

export default AboutSection;
