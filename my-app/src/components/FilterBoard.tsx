import React, { useEffect, useState } from 'react';
import dummy_data from "../lib/dummy_data.json";
import FilterCard from './FilterCard';

const FilterBoard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredData = dummy_data.filter(item => item.category !== "Face Paint");
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const filteredData1 = dummy_data.filter(item => item.category === "Face Paint");
    const currentItems2 = filteredData1.slice(indexOfFirstItem, indexOfLastItem);
    
    const totalPages1 = Math.ceil(filteredData.length / itemsPerPage);
    const totalPages2 = Math.ceil(filteredData1.length / itemsPerPage);
    const [FilterData, setFilterData] = useState([]);

    useEffect(() => {
        console.log(currentItems,"1")
        console.log(currentItems2,"2")

        const fetchFilter = async () => {
            const res = await fetch('/api/getFilter');
            const data = await res.json();
            const { modelData } = data;
            console.log(modelData);
            setFilterData(modelData);
        };

        fetchFilter();
    }, []);

    return (
        <div className="w-full bg-white px-6 py-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#6631f7] mb-4 text-center">Filter Items</h2>
            <div role="tablist" className="tabs tabs-bordered">
                <input 
                    type="radio" 
                    name="my_tabs" 
                    role="tab" 
                    className="tab flex-grow text-[#6631f7] rounded-lg py-2 px-4 mx-1 cursor-pointer hover:underline transition duration-300" 
                    aria-label="Face" 
                    defaultChecked 
                />
                <div role="tabpanel" className="tab-content text-black rounded-box p-3">
                   
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {currentItems.map((filter, index) => (
    <div className="m-1 transform scale-90" key={index}>
      {/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */}
      {/* @ts-ignore */}
      <FilterCard filter={filter} />
    </div>
  ))}
</div>



                    
                    








                    <div className="flex justify-center mt-4">
                        {[...Array(totalPages1)].map((_, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-lg mx-1 ${currentPage === index + 1 ? 'bg-red-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'} transition duration-300`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <input 
                    type="radio" 
                    name="my_tabs" 
                    role="tab" 
                    className="tab flex-grow text-[#6631f7] rounded-lg py-2 px-4 mx-1 cursor-pointer hover:underline transition duration-300" 
                    aria-label="Paints"
                />
                <div role="tabpanel" className="tab-content text-black rounded-box p-3">
                    

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
                    {currentItems2.map((filter, index) => (
                            
                            <div className="m-1 transform scale-90" key={index}>
                                 
                                 {/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */}
                                 {/* @ts-ignore */}
                                <FilterCard filter={filter} />
                
                            </div>
                        ))}
</div>


                    <div className="flex justify-center mt-4">
                        {[...Array(totalPages2)].map((_, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-lg mx-1 ${currentPage === index + 1 ? 'bg-red-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'} transition duration-300`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>

















                

                 <input 
                    type="radio" 
                    name="my_tabs" 
                    role="tab" 
                    className="tab flex-grow text-[#6631f7] rounded-lg py-2 px-4 mx-1 cursor-pointer hover:underline transition duration-300" 
                    aria-label="Custom"
                />
                <div role="tabpanel" className="tab-content text-black rounded-box p-3">
                    <div className="max-w-md mx-auto mb-4">
                        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
                            <div className="grid place-items-center h-full w-12 text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                           
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {FilterData && FilterData.map((filter, index) => (
        <div className="m-1 transform scale-90" key={index}>
            {/* Render specific properties of the filter object */}

            <FilterCard filter={filter} />
        </div>
    ))}
</div>

                    </div>

                    <div className="flex justify-center mt-4">
                        {[...Array(totalPages1)].map((_, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-lg mx-1 ${currentPage === index + 1 ? 'bg-red-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'} transition duration-300`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>










                
            </div>
        </div>
    );
};

export default FilterBoard;