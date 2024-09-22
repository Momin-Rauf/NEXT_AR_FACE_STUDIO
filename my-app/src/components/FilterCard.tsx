'use client'
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const FilterCard = ({ filter }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverContentRef = useRef(null); // Reference for hover content

  // GSAP animation for hover effect
  useEffect(() => {
    if (isHovered) {
      gsap.to(hoverContentRef.current, {
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    } else {
      gsap.to(hoverContentRef.current, {
        x: '-100%',
        duration: 0.5,
        ease: 'power3.out',
      });
    }
  }, [isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', overflow: 'hidden' }}
      className="card card-compact bg-white w-54 text-black shadow-xl"
    >
      <figure>
        <img
          src={filter.image}
          alt={filter.title}
          className="w-full h-48 object-cover transition-transform duration-300"
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
        <div
          ref={hoverContentRef}
          className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4"
          style={{ top: 0, left: 0, transform: 'translateX(-100%)' }}
        >
          <h3 className="text-lg font-bold mb-2">{filter.title}</h3>
          <p className="text-sm">{truncateText(filter.description, 100)}</p>
        </div>
      </figure>
      <div className="rating">
        <input type="radio" name="rating-2" className="mask m-1 mask-star-2 bg-orange-400" />
      </div>
    </div>
  );
};

export default FilterCard;
