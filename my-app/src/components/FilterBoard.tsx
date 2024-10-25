'use client';
import React, { useState } from 'react';

import dummy_data from "../lib/dummy_data.json";
import FilterCard from './FilterCard';

const FilterBoard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("Face"); // Manage active tab state
    const itemsPerPage = 3;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dummy_data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dummy_data.length / itemsPerPage);

    return (
        <div className="w-full bg-white px-6 py-4 rounded-lg shadow-lg">
            <div role="tablist" className="flex justify-center mb-6">
                {["Face", "Hat", "Glasses", "Custom"].map((tab) => (
                    <input
                        key={tab}
                        type="radio"
                        name="tabs"
                        role="tab"
                        className={`tab flex-grow text-[#6631f7] rounded-lg py-2 px-4 mx-1 cursor-pointer 
                            hover:bg-[#6631f7] hover:text-white transition duration-300 
                            ${activeTab === tab ? 'bg-[#6631f7] text-white' : ''}`}
                        aria-label={tab}
                        defaultChecked={tab === "Face"}
                        onClick={() => setActiveTab(tab)}
                    />
                ))}
            </div>

            {/* Tab Panel for Face, Hat, Glasses, and Custom */}
            {["Face", "Hat", "Glasses", "Custom"].map((tab) => (
                <div
                    key={tab}
                    role="tabpanel"
                    className={`p-4 bg-white shadow-sm shadow-black rounded-lg underline ${activeTab === tab ? '' : 'hidden'}`}
                >
                    <div className="max-w-md mx-auto bg-white mb-4">
                        <div className="relative flex items-center w-full h-12 rounded-lg bg-white shadow-md overflow-hidden">
                            <div className="grid place-items-center h-full w-12 text-[#6631f7]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                className="h-full bg-white no-underline w-full outline-none text-sm text-gray-700 pr-2"
                                type="text"
                                id="search"
                                placeholder={`Search ${tab.toLowerCase()}...`}
                            />
                        </div>
                    </div>

                    {/* Display current items */}
                    <div className="grid grid-cols-3 gap-3">
                        {currentItems.map((filter, index) => (
                            <div className="m-1 transform scale-90" key={index}>
                                <FilterCard filter={filter} />
                            </div>
                        ))}
                    </div>

                    {/* Pagination buttons */}
                    <div className="flex justify-center mt-4">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-lg mx-1 ${currentPage === index + 1
                                    ? 'bg-[#ff275b] text-white'
                                    : 'bg-[#6631f7] text-white hover:bg-[#ff275b]'} transition duration-300`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FilterBoard;
