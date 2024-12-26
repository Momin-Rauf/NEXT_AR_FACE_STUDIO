"use client";

import { useState, useCallback,useEffect,ChangeEvent } from "react";
import {useDropzone} from 'react-dropzone';
import { GrUpload } from "react-icons/gr";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from 'next/image';

import { MultiStepLoader as Loader } from "./ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { useRouter } from 'next/navigation';
import { storage } from "../firebase";

interface ModelResult {
  model_urls: any;
  taskId: string;
  status: string;
  progress: string;
  modelUrl: string;
}

export default function Upload() {

  const [Modelfile, setModelFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [image_url, setUploadedUrl] = useState<string | null>(null);
  const [modelData, setModelData] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("Nature");
  const [progress, setProgress] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const loadingStates = [
    {
      text: "Did you know? FaceMesh tracks 468 key facial landmarks for precise expression recognition.",
    },
    {
      text: "AI-based face tracking is used in everything from security systems to virtual avatars.",
    },
    {
      text: "FaceMesh can map facial features with incredible accuracy, enabling real-time interaction in apps.",
    },
    {
      text: "AI can generate 3D facial models from 2D images, bringing avatars and animations to life.",
    },
    {
      text: "Face detection algorithms can recognize faces in diverse lighting, angles, and poses.",
    },
    {
      text: "Facial recognition technology is used for everything from unlocking phones to identifying suspects in security footage.",
    },
    {
      text: "3D modeling powered by AI allows virtual avatars to mimic real-world facial expressions with high precision.",
    },
    {
      text: "AI-driven facial landmark detection can help create realistic animated characters for movies and games.",
    },
  ];
  

const onDrop = useCallback(async (acceptedFiles: File[]) => {
  if (acceptedFiles.length > 0) {
    const selectedFile = acceptedFiles[0];
  
    // Generate preview URL
    const preview = URL.createObjectURL(selectedFile);
    console.log(preview);
    setPreviewUrl(preview);
    console.log(selectedFile,'selectedFile');
    // Ensure handleUpload is properly awaited
    try {
      setUploading(true)
      await handleUpload(selectedFile); // Pass the file if needed
      setUploading(false);
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
}, []);

useEffect(() => {
  return () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };
}, [previewUrl]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const router = useRouter();
  // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = event.target.files?.[0];
  //   console.log(selectedFile);
   
  // };

  const ModelFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    setModelFile(selectedFile || null);

    console.log("Modelfile:",Modelfile)
  };

  const handleUpload = async (SelectedFile) => {
    console.log('file',SelectedFile);
    if (!SelectedFile) return;
    setUploading(true);

    const storageRef = ref(storage, `images/${SelectedFile.name}`);
    try {
      await uploadBytes(storageRef, SelectedFile);
      const url = await getDownloadURL(storageRef);
      setUploadedUrl(url);
    } catch (error) {
      console.error("Error uploading the file", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  const storeData = async (model_data) => {
    console.log("saving:", image_url, model_data, category);
    try {
      const response = await fetch("/api/add-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({ image_url, model_data, category }),
      }); 

      console.log(response);
      if (!response.ok) throw new Error("Failed to store the data.");
      const data = await response.json(); // Parse the response body
      console.log("Data stored successfully.", data.newFilter._id);
      const filterId = data.newFilter._id.toString(); // Get the filter ID from the response

      // Redirect to the CustomizeFilter page with the filter ID
      router.push(`/CustomizeFilter/${filterId}`);
    } catch (error) {
      console.error("Error storing data", error);
    }
  };
  
  const handleModelUpload = async () => {
    if (!Modelfile) return;
    setUploading(true);
    
    const storageRef = ref(storage, `images/${Modelfile.name}-${Date.now()}.glb`);
    try {
      await uploadBytes(storageRef, Modelfile);
      const model_data = await getDownloadURL(storageRef);
      await setModelData(model_data);
      console.log("GLB file uploaded successfully:", model_data);
      await storeData(model_data);
    } catch (error) {
      console.error("Error uploading the GLB file", error);
    } finally {
      setUploading(false);
    }
  };
  
  const fetchModelAndGenerate = async () => {
    console.log(image_url);
    if (!image_url) return;
    
    const payload = { image_url, enable_pbr: true };
    const YOUR_API_KEY = process.env.NEXT_PUBLIC_MESHY_API_KEY;
    
    setUploading(true);
    try {
      const response = await fetch("https://api.meshy.ai/v1/image-to-3d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${YOUR_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to start the 3D model generation.");
      const resultRes = await response.json();
      const { result } = resultRes;
      console.log("Task ID:", result);

      await pollForModel(result);
    } catch (error) {
      console.error("Error starting 3D model generation:", error);
    } finally {
      setUploading(false);
    }
  };
  
  const pollForModel = async (taskID: string) => {
    const YOUR_API_KEY = process.env.NEXT_PUBLIC_MESHY_API_KEY;
    const POLL_INTERVAL = 5000;
    
    const checkStatus = async () => {
      try {
        const modelResponse = await fetch(
          `https://api.meshy.ai/v1/image-to-3d/${taskID}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${YOUR_API_KEY}` },
          }
        );
        
        if (!modelResponse.ok) throw new Error("Failed to fetch the generated 3D model.");
        
        const modelResult: ModelResult = await modelResponse.json();
        setStatus(modelResult.status);
        setProgress(modelResult.progress);
        
        if (modelResult.status === "SUCCEEDED") {
          const modelUrl = modelResult.model_urls.glb;
          setModelData(modelUrl);
          console.log("Model data:", modelUrl);
          return;
        } else if (modelResult.status === "FAILED") {
          console.error("Model generation failed.");
          return;
        } else {
          setTimeout(checkStatus, POLL_INTERVAL);
        }
      } catch (error) {
        console.error("Error polling the 3D model:", error);
      }
    };
    checkStatus();
  };
  
  return (
    
    <div className="flex h-auto p-10 flex-col md:flex-row mt-24 justify-between items-start bg-white shadow-lg rounded-lg">

      <section className="flex  flex-col  p-4 mx-auto mb-4  justify-start items-start mt-3 w-[40%]" >
      <h1 className="text-3xl font-semibold text-gray-800  mb-4 ">Create and Upload Personalized 3D Models</h1>
      <p className='text-lg mt-5' > With just a few clicks, you can upload your designs or pictures and convert them into fully functional 3D models. These models can then be customized and used as AR filters</p>
      </section>

      <Loader loadingStates={loadingStates} loading={uploading} duration={2000} />
      
      
      {/* {uploading && (

// <div className="flex justify-center items-center w-full">
        //   <span className="loading loading-spinner loading-lg text-[#ff275b]"></span>
        // </div>
        )} */}

      

      <div className="w-full md:w-[40%] p-8 bg-[#C1D1E2] rounded-md  mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800  mb-4">Upload Your Image</h2>
        <p className="text-gray-600 mb-6">Upload an image to generate a 3D mesh for an AR face filter.</p>
       
         <div className="w-full max-w-4xl hover:translate-x-1 hover:shadow-black  mx-auto min-h-24 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
         <div
  {...getRootProps()}
  className="w-full max-w-4xl    hover:shadow-md  mx-auto min-h-24 flex flex-row justify-center items-align  border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-6 text-center"
>
  <input className='  flex flex-col justify-center items-align' {...getInputProps()} />
  {isDragActive ? (
    <>
    <p>Drop the file here ...</p>
   
    </>
  ) : previewUrl ? (
    <div className="relative flex flex-row justify-center items-center h-full">
      <Image
        src={previewUrl}
        alt="Uploaded preview"
        className="object-cover rounded-lg"
        width={300}
        height={300}
        />
     
    </div>
  ) : (
    <GrUpload  size={50} />
  )}
</div>

{uploading && (
  <button
  className="fixed top-4 right-4 text-black dark:text-white z-[120]"
  onClick={() => setUploading(false)}
  >
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )}


{previewUrl && (
  <div className="flex flex-col w-full md:w-[100%] justify-center items-center p-8  shadow-md rounded-md">
         
         
          <label className="text-lg text-gray-700 mb-2">Select 3D Model Category</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="select bg-white select-bordered mt-2 w-full max-w-md border-gray-300 text-gray-700"
            >
            <option value="">Choose a landmark</option>
            <option value="architecture">Eyes</option>
            <option value="nature">Nose</option>
            <option value="technology">Chin</option>
            <option value="art">Head</option>
          </select>
          <button
            className="btn bg-[#6631f7] text-white px-6 py-2 rounded-md mt-4 hover:bg-[#5a2dd6] transition-all"
            onClick={fetchModelAndGenerate}
            disabled={!category}
            >
            Generate 3D Model
          </button>
        </div>
      )}

    </div>


       
        
        {status && (
          <div className="mt-6 text-center">
            <p className="text-gray-700">Status: {status}</p>
            <p className="text-gray-700">Progress: {progress}%</p>
            {status === "SUCCEEDED" && modelData ? (
              <div className="mt-4">
                <a
                  className="inline-block bg-[#6631f7] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#5a2dd6] transition-all"
                  href={modelData}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download 3D Model
                </a>
                <div className="mt-6">
                  <input
                    type="file"
                    onChange={ModelFileChange}
                    className="file-input file-input-ghost w-full max-w-md p-2 mb-4 border-gray-300 rounded-md"
                  />
                  <button
                    className="btn bg-[#6631f7] w-full text-white px-6 py-2 rounded-md mt-4 hover:bg-[#5a2dd6] transition-all"
                    onClick={handleModelUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload GLB Model"}
                  </button>
                </div>
              </div>
              
            ) : null}

             
          </div>
        )}
      </div>
      
    </div>
  );
}
