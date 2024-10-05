'use client';
// import { listAll, ref, getDownloadURL } from "firebase/storage";
// import { storage } from "../firebase";
// import Image from "next/image";

import Upload from '@/components/Upload';
import Navbar from '@/components/Navbar';
import '../app/globals.css';

const AssetsPage: React.FC = () => {

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     const imagesRef = ref(storage, "images/"); // Reference to the images directory in Firebase Storage

  //     try {
  //       const result = await listAll(imagesRef); // List all items in the images directory
  //       const urls = await Promise.all(result.items.map(item => getDownloadURL(item))); // Get the download URLs for all images
  //       setImages(urls); // Set the list of image URLs
  //     } catch (error) {
  //       console.error("Error fetching images", error);
  //     }
  //   };

  //   fetchImages(); // Fetch images when the component mounts
  // }, []);

  // useEffect(() => {
  //   async function loadAssets() {
  //     // Dynamically import A-Frame and MindAR
  //     await import('aframe');
  //     await import('mind-ar/dist/mindar-face-aframe.prod.js');
  //   }
  //   loadAssets();
  // }, []);



  return (
    <>
      <Navbar />
      <div className='bg-white h-screen flex flex-col justify-center items-center text-black'>
        <h1 className='font-bold text-[50px]'>Generate your own 3D filters from Images</h1>
        <button className="btn text-white bg-blue-900 mt-5">Get Started</button>
      </div>
      <Upload />
    </>
  );
};

export default AssetsPage;
