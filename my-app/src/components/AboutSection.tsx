'use client';
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Placeholder image URLs (feel free to replace these with your preferred images)
const customFiltersImage = 'https://img.freepik.com/free-photo/surprised-curly-handsome-man-from-hole-green-paper_231208-1191.jpg?t=st=1729816999~exp=1729820599~hmac=93c10c24d94ada2beddabc0b34a0ff4327707dc2b4ee72e52c4b0d430ea59183&w=900';
const faceFiltersImage = 'https://plus.unsplash.com/premium_photo-1722728055718-20684f6bddbb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const magicFiltersImage = 'https://img.freepik.com/free-photo/portrait-same-young-old-man-smiling-ai-generated_268835-9175.jpg?t=st=1729816528~exp=1729820128~hmac=d57410888f45d06099609f60f8bc1374bdd6cbd8594a237a5751f7d7b2c304d3&w=1380';

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
          <div className="scroll-section flex flex-col items-center">
            <img src={customFiltersImage} alt="Custom Filters" className="h-60 w-60 mb-4 rounded-lg shadow-lg" />
            <h2 className="font-extrabold text-[#6f40f9] text-2xl text-center">
              Custom Filters
            </h2>
            <p className="mt-2 text-lg text-gray-600 text-center">
              Tailor your experience with our customizable filters!
            </p>
          </div>

          {/* Face Filters Section */}
          <div className="scroll-section flex flex-col items-center">
            <img src={faceFiltersImage} alt="Face Filters" className="h-60 w-60 mb-4 rounded-lg shadow-lg" />
            <h2 className="italic text-[#6f40f9] text-2xl text-center">
              Face Filters
            </h2>
            <p className="mt-2 text-lg text-gray-600 text-center">
              Enhance your selfies like never before!
            </p>
          </div>

          {/* Magic Filters Section */}
          <div className="scroll-section flex flex-col items-center">
            <img src={magicFiltersImage} alt="Age Filters" className="h-60 w-60 mb-4 rounded-lg shadow-lg" />
            <h2 className="text-[#ff2759] font-bold text-2xl text-center">
              Age Filters
            </h2>
            <p className="mt-2 text-lg text-gray-600 text-center">
              Add enchanting overlays that bring your videos to life!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
