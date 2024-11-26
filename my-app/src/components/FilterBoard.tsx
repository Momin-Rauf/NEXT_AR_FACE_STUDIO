import React, { useEffect, useState } from "react";
import dummy_data from "../lib/dummy_data.json";
import FilterCard from "./FilterCard";

const FilterBoard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [selectedCategory, setSelectedCategory] = useState("All"); // State for category filter
    const [filteredData, setFilteredData] = useState(dummy_data); // Filtered and searched data state

    // Update data when category changes
    useEffect(() => {
        let filtered = dummy_data;

        // Apply category filter
        if (selectedCategory !== "All") {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        setFilteredData(filtered);
        setCurrentPage(1); // Reset to the first page when category changes
    }, [selectedCategory]);

    // Search handler
    const handleSearch = () => {
        let filtered = dummy_data.filter(item =>
            selectedCategory === "All" || item.category === selectedCategory
        );

        // Apply search query filter
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(item =>
                item.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredData(filtered);
        setCurrentPage(1); // Reset to the first page when filters change
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="w-full bg-white px-6 py-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#6631f7] mb-4 text-center">Filter Items</h2>

            {/* Search and Dropdown */}
            <div className="flex flex-row gap-4 mb-4">
                {/* Search Input */}
                <div className="w-[60%] bg-white text-black">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-2 bg-white text-black border-gray-300 rounded-lg py-2 px-4 w-full"
                    />
                </div>

                {/* Search Button */}
                <div className="flex items-center">
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition duration-300 w-auto"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Dropdown for category selection */}
            <div className="mb-4 w-[20%]">
                <select
                    className="border-2 bg-white text-black border-gray-300 rounded-lg py-2 px-4 w-full"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Horror">Horror</option>
                    <option value="Glasses">Glasses</option>
                    <option value="snowfall">Weather</option>
                    <option value="beard">Beard</option>
                    <option value="mask">Mask</option>
                </select>
            </div>

            {/* Display filtered and searched items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentItems.map((filter, index) => (
                    <div className="m-1 transform scale-90" key={index}>
                        <FilterCard filter={filter} />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                {totalPages > 1 && [...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 rounded-lg mx-1 ${
                            currentPage === index + 1
                                ? "bg-red-600 text-white"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        } transition duration-300`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBoard;
