"use client";

import { useState, ChangeEvent, Suspense } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

interface ModelResult {
  taskId: string;
  status: string;
  modelUrl: string;
}

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [modelData, setModelData] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
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

  const fetchModelAndGenerate = async () => {
    if (!uploadedUrl) return;

    const payload = {
      image_url: uploadedUrl,
      enable_pbr: true,
    };

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

      if (!response.ok) {
        throw new Error("Failed to start the 3D model generation.");
      }

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
            headers: {
              Authorization: `Bearer ${YOUR_API_KEY}`,
            },
          }
        );

        if (!modelResponse.ok) {
          throw new Error("Failed to fetch the generated 3D model.");
        }

        const modelResult: ModelResult = await modelResponse.json();
        setStatus(modelResult.status);
        setProgress(modelResult.status);

        if (modelResult.status === "SUCCEEDED") {
          setModelData(modelResult.model_urls.glb); // Set the GLB model URL
          console.log("Model generation succeeded", modelResult);
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

  function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={1} />;
  }

  return (
    <div className="flex h-screen p-24 flex-row justify-between items-center rounded-none shadow-xl">
      {uploading && (
        <span className="loading ml-24 loading-spinner loading-lg"></span>
      )}

      {uploadedUrl && (
        <div className="flex flex-col justify-center p-10 rounded-md items-center shadow-md shadow-black">
          <img
            className="w-[300px] m-4 h-[300px] object-fit overflow-hidden"
            src={uploadedUrl}
            alt="Uploaded"
          />
          <button
            className="btn bg-green-600 text-white px-6 py-2 rounded-md mt-4 hover:bg-green-700"
            onClick={fetchModelAndGenerate}
          >
            Generate 3D Model
          </button>
        </div>
      )}

      <div className="w-[500px]">
        <h1>Upload your file here</h1>
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input file-input-bordered bg-white shadow-sm shadow-black file-input-accent w-full max-w-md p-2 border border-gray-300 rounded-md text-sm"
        />
        <button
          type="submit"
          className="btn bg-blue-600 w-[400px] text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-700 disabled:opacity-50"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        {status && (
          <div>
            <p className="mt-4 text-sm text-gray-700">Status: {status} </p>
            <p className="mt-4 text-sm text-gray-700">progress: {progress} </p>
            {status === "SUCCEEDED" ? (
              <div>
                <p className="mt-4 text-sm text-green-700">Model generated!</p>
                <Canvas style={{ width: "500px", height: "500px" }}>
                  <Suspense fallback={null}>
                    {modelData && <Model url={modelData} />}
                    <OrbitControls />
                  </Suspense>
                </Canvas>
              </div>
            ) : (
              <progress className="progress w-56"></progress>
            )}
          </div>
        )}
      </div>
    </div>
  );
}