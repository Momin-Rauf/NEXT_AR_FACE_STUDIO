'use client';

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Image from 'next/image';
import { FaCog } from 'react-icons/fa'; // Import gear icon from react-icons

import { useFilterContext } from '@/context/FilterContext';

// Define Filter type
interface Filter {
  _id: number;
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
  const [filter_id,setFilterId] = useState(0);
  const { setSelectedFilter } = useFilterContext();
  const router = useRouter();

  useEffect(() => {
    console.log(filter); // Log filter details for debugging
  }, [filter]);

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
      id: filter._id,
      rotation: filter.rotation,
      position: filter.position,
      scale: filter.scale,
      anchor: filter.anchor,
      model: filter.model_data,
      category: filter.category,
      image_url: filter.image_url,
    });
  };

  const navigateToCustomizeFilter = (filterId: number) => {
    console.log(filterId);
    
    router.push(`/CustomizeFilter/${filterId}`);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', overflow: 'hidden' }}
      className="card bg-white shadow-[#6631f7] sm:w-44 w-24 cursor-pointer rounded-lg border border-gray-200 text-white shadow-lg transition-transform transform duration-300 hover:scale-105"
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
          src={filter.image_url || '/fallback-image.jpg'}
          alt={filter.title || 'Filter Image'}
          className="absolute top-0 left-0 rounded-t-lg object-cover transition-transform duration-300 ease-in-out"
          fill
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
      </div>
      <div className="sm:p-3">
        <h3 className="text-lg text-black sm:block hidden font-semibold truncate">{filter.title}</h3>
      </div>
      {isHovered && (
        <div
          ref={hoverContentRef}
          className="absolute  hidden inset-0 bg-black bg-opacity-50 sm:flex items-center justify-center text-sm text-gray-200 p-4"
        >
          <p>{filter.description}</p>
          <p>{filter._id}</p>
        </div>
      )}

      {/* Icon Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the card click event
          console.log(filter._id);
          setFilterId(filter._id)
          navigateToCustomizeFilter(filter._id);
        }}
      
        className="absolute sm:block hidden bottom-3 right-3 p-2 bg-purple-500 rounded-full text-white hover:bg-purple-400 focus:outline-none"
        aria-label="Customize Filter"
      >
       
        <FaCog className="text-lg" /> {/* Gear icon */}
      </button>
    </div>
  );
};

export default FilterCard;
