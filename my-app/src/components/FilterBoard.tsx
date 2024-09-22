'use client';
import React, { useState } from 'react';
import Image from 'next/image'; // Import Image from next/image
import dummy_data from "../lib/dummy_data.json";
import FilterCard from './FilterCard';

const FilterBoard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dummy_data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dummy_data.length / itemsPerPage);

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(URL.createObjectURL(uploadedFile));
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFile(null);
    };

    return (
        <div className="w-full">
            <div role="tablist" className="tabs tabs-bordered">
                <input type="radio" name="my_tabs_2" role="tab" className="tab bg-white text-black" aria-label="Custom" defaultChecked />
                <div role="tabpanel" className="tab-content text-black rounded-box p-3">
                    <input
                        type="file"
                        className="file-input-xs m-2 bg-white text-black w-full max-w-xs"
                        onChange={handleFileChange}
                    />
                    <button className="btn btn-xs bg-white text-black hover:bg-gray-400 hover:text-white" onClick={() => setIsModalOpen(true)}>
                        Upload
                    </button>
                    
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

                {/* Other tabs... */}
                {/* Repeat similar structures for other tabs as needed... */}

            </div>

            {/* Modal */}
            {isModalOpen && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Uploaded Image</h3>
                        {file && (
                            <div className="diff aspect-[16/9]">
                                <div className="diff-item-1">
                                    <Image 
                                        alt="daisy" 
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi663GPu5UrYHjQhmR5qG5Uz7Sd_4-bwrIwFU18xrkNLrLeWnc5BlDWvd6FrlPdSWWT8g&usqp=CAU" 
                                        layout="responsive" 
                                        width={640} 
                                        height={360} 
                                    />
                                </div>
                                <div className="diff-item-2">
                                    <Image 
                                        src={file} 
                                        alt="Uploaded" 
                                        layout="responsive" 
                                        width={640} 
                                        height={360} 
                                        className="w-full h-auto mt-4" 
                                    />
                                </div>
                                <div className="diff-resizer"></div>
                            </div>
                        )}
                        <p>Choose the Color of Light </p>
                        <input type="color" name="" id="" />
                        {/* Additional sliders and buttons... */}
                        <div className="modal-action">
                            <button className="btn" onClick={closeModal}>Download</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default FilterBoard;
