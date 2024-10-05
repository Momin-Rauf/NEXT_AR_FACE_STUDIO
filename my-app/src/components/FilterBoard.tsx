'use client';
import React, { useState } from 'react';

import dummy_data from "../lib/dummy_data.json";
import FilterCard from './FilterCard';

const FilterBoard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
   

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dummy_data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dummy_data.length / itemsPerPage);

  

    return (
        <div className="w-full bg-blue-400 ">
            <div role="tablist" className="tabs tabs-bordered tabs-lg">
            <input 
    type="radio" 
    name="my_tabs_2" 
    role="tab" 
    className="tab flex-grow bg-white w-[300px] text-black"  // Increase this width as per your needs
    aria-label="Face" 
    defaultChecked 
/>
                <div role="tabpanel" className="tab-content text-black rounded-box p-3">
                   
                    <div className="max-w-md">
                        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
                            <div className="grid place-items-center h-full w-12 text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                className="peer h-full w-full bg-white outline-none text-sm text-gray-700 pr-2"
                                type="text"
                                id="search"
                                placeholder="Search something.."
                            />
                        </div>
                    </div>

                    {/* Display current items */}
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-1">
                        {currentItems.map((filter, index) => (
                            <div className="m-1 transform scale-90" key={index}>
                                <FilterCard filter={filter} />
                            </div>
                        ))}
                    </div>

                    {/* Pagination buttons */}
                    <div className="join mt-4">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`join-item btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
           
        </div>
    );
};

export default FilterBoard;
