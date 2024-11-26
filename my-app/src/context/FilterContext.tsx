import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the Filter interface
interface Filter {
  id: number; 
  scale: [number, number, number]; // Tuple for 3D scaling factors
  position: [number, number, number]; // Tuple for 3D position
  rotation: [number, number, number];
  anchor:number;
  model:string
}

// Define the context properties
interface FilterContextProps {
  selectedFilter: Filter | null;
  setSelectedFilter: (filter: Filter | null) => void;
}

// Create the context
const FilterContext = createContext<FilterContextProps | undefined>(undefined);

// Create the FilterProvider component
export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize selectedFilter state to hold the filter object
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);

  return (
    <FilterContext.Provider value={{ selectedFilter, setSelectedFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook for accessing the FilterContext
export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};
