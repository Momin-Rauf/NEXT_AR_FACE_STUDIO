"use client";

import { useState, ChangeEvent } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from 'next/image';

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
  const [file, setFile] = useState<File | null>(null);
  const [Modelfile, setModelFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [image_url, setUploadedUrl] = useState<string | null>(null);
  const [modelData, setModelData] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("Nature");
  const [progress, setProgress] = useState<string>("");

  const router = useRouter();
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
  };

  const ModelFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    setModelFile(selectedFile || null);
    console.log("Modelfile:",Modelfile)
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const storageRef = ref(storage, `images/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
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
    <div className="flex h-auto p-10 flex-col md:flex-row justify-between items-center bg-white shadow-lg rounded-lg">
      {uploading && (
        <div className="flex justify-center items-center w-full">
          <span className="loading loading-spinner loading-lg text-[#ff275b]"></span>
        </div>
      )}

      {image_url && (
        <div className="flex flex-col w-full md:w-[40%] justify-center items-center p-8 bg-[#f3f4f6] shadow-md rounded-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Uploaded Image</h2>
          <Image
  className="w-[300px] h-[300px] object-cover rounded-md shadow-md mb-4"
  src={image_url}
  alt="Uploaded"
  width={300}
  height={300}
/>
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

      <div className="w-full md:w-[40%] p-8 bg-[#f3f4f6] shadow-md rounded-md mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Upload Your Image</h2>
        <p className="text-gray-600 mb-6">Upload an image to generate a 3D mesh for an AR face filter.</p>
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input file-input-ghost w-full max-w-md p-2 mb-4 border-gray-300 rounded-md"
        />
        <button
          className="btn bg-[#ff275b] w-full text-white px-6 py-2 rounded-md mt-4 hover:bg-[#e4555c] transition-all"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
        <div className="mt-6">
                  
                 
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
      {/* <FilterCustomizer/> */}
    </div>
  );
}
