import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the Filter interface
interface Filter {
  id: number; // Assuming ID is a number
  image: string;
  title: string;
  description: string;
}

// Define the context properties
interface FilterContextProps {
  selectedFilterId: number | null; // Only store the ID of the selected filter
  setSelectedFilterId: (filterId: number | null) => void; // Function to update the selected filter ID
}

// Create the context
const FilterContext = createContext<FilterContextProps | undefined>(undefined);

// Create the FilterProvider component
export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize selectedFilterId state to hold the filter ID
  const [selectedFilterId, setSelectedFilterId] = useState<number | null>(null);

  return (
    <FilterContext.Provider value={{ selectedFilterId, setSelectedFilterId }}>
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
