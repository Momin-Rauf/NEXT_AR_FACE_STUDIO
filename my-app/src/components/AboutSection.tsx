'use client';
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import FilterCustomizer from './FilterCustomizer';
// Placeholder image URLs (replace with your preferred images)

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
    <section className="scroll-section-outer bg-white text-black py-20">
      <div ref={triggerRef} className="container mx-auto">
        <div ref={sectionRef} className="flex scroll-section-inner space-x-10">
          {/* Custom Filters Section */}
          <FilterCustomizer/>
          </div>
        </div>
      
    </section>
  );
};

export default AboutSection;
