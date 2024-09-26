'use client';
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const AboutSection = () => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const pin = gsap.fromTo(
      sectionRef.current,
      {
        translateX: 0,
      },
      {
        translateX: "-200vw", // Adjust for three sections
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "1500 top", // Adjust end point for three sections
          scrub: 0.6,
          pin: true,
        },
      }
    );
    return () => {
      // Cleanup animation on component unmount
      pin.kill();
    };
  }, []);

  return (
   
    <section className="scroll-section-outer bg-white text-black py-10">
      <div ref={triggerRef}>
        <div ref={sectionRef} className="text-[80px] font-semibold scroll-section-inner space-y-10">
          <div className="scroll-section">
            <div className="font-extrabold  text-indigo-600 font-sans tracking-wider">
                CUSTOM FILTERS
            </div>
            
          </div>
          <div className="scroll-section">
            <div className="italic mb-1 text-gray-800 font-serif">
              FACE FILTERS
            </div>
            
          </div>
          <div className="scroll-section">
            <div className="text-red-500 font-bold font-mono">
              MAGIC FILTERS AND OVERLAYS
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
