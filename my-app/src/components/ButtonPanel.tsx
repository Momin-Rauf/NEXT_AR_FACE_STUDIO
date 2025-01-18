import React, { useEffect } from 'react';
import { MdBlurOn, MdBrightness4, MdContrast, MdOutlineFilterVintage } from "react-icons/md";
import { FaTint, FaAdjust } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

const ButtonPanel = ({ containerRef }) => {
  const filterButtons = [
    { label: "Blur", id: "blur", icon: <MdBlurOn /> },
    { label: "Brightness", id: "brightness", icon: <MdBrightness4 /> },
    { label: "Contrast", id: "contrast", icon: <MdContrast /> },
    { label: "Grayscale", id: "grayscale", icon: <FaTint /> },
    { label: "Hue Rotate", id: "hue-rotate", icon: <MdOutlineFilterVintage /> },
    { label: "Saturate", id: "saturate", icon: <FaAdjust /> },
  ];

  // Explicitly set type of activeFilter to string | null
  const [showFilters, setShowFilters] = React.useState<boolean>(false);
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  const [filterValues, setFilterValues] = React.useState(
    filterButtons.reduce((acc, filter) => ({ ...acc, [filter.id]: 0 }), {}) // Default to 0
  );

  const handleSliderChange = (id: string, value: number) => {
    setFilterValues(prev => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const filterWrapper = containerRef.current.querySelector(".filter-wrapper");
    if (!filterWrapper) return;

    const filters = filterButtons
      .map(({ id }) => {
        const value = filterValues[id];
        switch (id) {
          case "blur":
            return `blur(${value}px)`;
          case "brightness":
            return `brightness(${value / 10 || 1})`;
          case "contrast":
            return `contrast(${value / 10 || 1})`;
          case "grayscale":
            return `grayscale(${value / 100})`;
          case "hue-rotate":
            return `hue-rotate(${(value / 100) * 360}deg)`;
          case "saturate":
            return `saturate(${value / 50 || 1})`;
          default:
            return "";
        }
      })
      .join(" ");

    filterWrapper.style.filter = filters;
  }, [filterValues, containerRef]);

  return (
    <>
      <button
        className="absolute top-[-35px] z-30 left-2 p-2 text-blue-500 bg-white rounded-full shadow-lg hover:text-white hover:bg-blue-500 transition-all duration-200"
        title="Edit"
        onClick={() => setShowFilters(prev => !prev)}
      >
        <CiEdit size={24} />
      </button>

      {showFilters && (
        <div className="absolute top-[40px] left-2 z-40 flex flex-col gap-2 bg-gray-100 p-3 rounded-lg shadow-lg pointer-events-auto">
        {filterButtons.map((filter) => (
          <div
            key={filter.id}
            className="relative flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
            onClick={() => setActiveFilter(prev => (prev === filter.id ? null : filter.id))}
          >
            <span className="text-blue-500 text-sm cursor-pointer">{filter.icon}</span>
            <span className="text-sm cursor-pointer">{filter.label}</span>
            {activeFilter === filter.id && (
              <input
                type="range"
                min="0"
                max="100"
                value={filterValues[filter.id]}
                onChange={(e) => handleSliderChange(filter.id, Number(e.target.value))}
                className="absolute top-[-10px] left-[120px] w-[150px]"
              />
            )}
          </div>
        ))}
      </div>
      
      )}
    </>
  );
};

export default ButtonPanel;
