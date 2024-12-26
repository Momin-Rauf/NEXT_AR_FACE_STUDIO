'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { useEffect } from 'react';

import { useFilterContext } from '@/context/FilterContext';

// Utility function to truncate text


interface Filter {
  id: number;
  image_url: string;
  title: string;
  description?: string;
  scale: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  anchor: number;
  model_data: string;
  category: string;
}

interface FilterCardProps {
  filter: Filter;
}

const FilterCard: React.FC<FilterCardProps> = ({ filter }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverContentRef = useRef<HTMLDivElement | null>(null);
  const { setSelectedFilter } = useFilterContext();
 

  useEffect(() => {
    console.log(filter);
  }, []);

  // GSAP animation for hover effect
  useLayoutEffect(() => {
    if (hoverContentRef.current) {
      gsap.to(hoverContentRef.current, {
        x: isHovered ? 0 : '-100%',
        duration: 0.5,
        ease: 'power3.out',
      });
    }
  }, [isHovered]);

  const handleFilterSelection = () => {
   
    console.log('Selected Filter in Filter card:', filter);
    setSelectedFilter({
      id: filter.id,
      rotation: filter.rotation,
      position: filter.position,
      scale: filter.scale,
      anchor: filter.anchor,
      model: filter.model_data,
      category: filter.category,
      image_url: filter.image_url,
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', overflow: 'hidden' }}
      className="card bg-white text-black shadow-sm shadow-[#6631f7] w-44  cursor-pointer rounded-lg border border-gray-200 text-white shadow-lg transition-transform transform duration-300 hover:scale-105"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleFilterSelection();
        }
      }}
      onClick={handleFilterSelection}
    >
      {/* Container with aspect ratio */}
      <div className="relative w-full pb-[80.71%]"> {/* Aspect ratio of ~2:3 */}
        <Image
          src={filter.image_url}
          alt={filter.title || ''}
          className="absolute top-0 left-0 rounded-t-lg object-cover transition-transform duration-300 ease-in-out"
          fill
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
      </div>
      <div className="p-3">
        <h3 className="text-lg text-black font-semibold truncate">{filter.title}</h3>
      </div>
      {isHovered && (
        <div
          ref={hoverContentRef}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-sm text-gray-200 p-4"
        >
          <p>{filter.description}</p>
        </div>
      )}



    </div>
  );
};

export default FilterCard;
