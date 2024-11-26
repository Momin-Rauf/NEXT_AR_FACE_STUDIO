'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { useFilterContext } from '@/context/FilterContext';

// Utility function to truncate text
const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

interface Filter {
  id: number;
  image_url: string;
  title: string;
  description?: string; // Made optional to avoid errors when missing
  scale: [number, number, number]; // Tuple for 3D scaling factors
  position: [number, number, number]; // Tuple for 3D position
  rotation: [number, number, number];
  anchor: number;
  model_data: string;
}

interface FilterCardProps {
  filter: Filter;
}

const FilterCard: React.FC<FilterCardProps> = ({ filter }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverContentRef = useRef<HTMLDivElement | null>(null);
  const { setSelectedFilter } = useFilterContext();

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
    console.log('Selected Filter:', filter);
    setSelectedFilter({
      id: filter.id,
      rotation: filter.rotation,
      position: filter.position,
      scale: filter.scale,
      anchor: filter.anchor,
      model: filter.model_data,
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', overflow: 'hidden' }}
      className="card card-compact bg-white w-54 h-54 cursor-pointer text-black shadow-xl transition-transform duration-300"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsHovered((prev) => !prev);
        }
      }}
      onClick={handleFilterSelection}
    >
      <figure>
        <Image
          src={filter.image_url}
          alt={filter.title || ''}
          className="w-full"
          width={216}
          height={192}
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
        {filter.description && (
          <div
            ref={hoverContentRef}
            className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4"
            style={{ top: 0, left: 0 }}
          >
            <h3 className="text-lg font-bold mb-2">{filter.title}</h3>
            <p className="text-sm">{truncateText(filter.description, 100)}</p>
          </div>
        )}
      </figure>
    </div>
  );
};

export default FilterCard;
