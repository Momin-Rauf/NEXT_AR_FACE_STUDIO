"use client";

import Image from "next/image";
import { useState, ChangeEvent } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

interface ModelResult {

  taskId: string;
  status: string;
  modelUrl: string; // Example, change according to actual response
}

export default function Upload() {

  const [file, setFile] = useState<File | null>(null); // State to store the selected file
  const [uploading, setUploading] = useState<boolean>(false); // State to indicate the upload status
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null); // State to store the uploaded image URL

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null); // Set the selected file or null if no file is selected
  };

  const handleUpload = async () => {
    if (!file) return; // Return if no file is selected

    setUploading(true); // Set uploading state to true
    const storageRef = ref(storage, `images/${file.name}`); // Create a reference to the file in Firebase Storage

    try {
      await uploadBytes(storageRef, file); // Upload the file to Firebase Storage
      const url = await getDownloadURL(storageRef); // Get the download URL of the uploaded file
      setUploadedUrl(url); // Set the uploaded image URL
      console.log("File Uploaded Successfully");
    } catch (error) {
      console.error("Error uploading the file", error);
    } finally {
      setUploading(false); // Set uploading state to false
    }
  };

  const fetchModelAndGenerate = async () => {
    if (!uploadedUrl) return;

    const payload = {
      image_url: uploadedUrl,
      enable_pbr: true,
    };

    const YOUR_API_KEY = "msy_3ISMmzdtT6WYkLQw9YTCNFstajd77yszx8Ky";

    try {
      // First API request to start the 3D model generation
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
      console.log("taskid:", result);

      // Call the function to fetch the 3D model after taskId is retrieved
      await imgToModel(result);
    } catch (error) {
      console.error("Error starting 3D model generation:", error);
      setError("Error starting 3D model generation.");
      setUploading(false);
    }
  };

  const imgToModel = async (taskID: string) => {
    if (!taskID) return;

    const YOUR_API_KEY = "msy_3ISMmzdtT6WYkLQw9YTCNFstajd77yszx8Ky";

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
      setModelData(modelResult);
      console.log(modelResult);
    } catch (error) {
      console.error("Error fetching the 3D model:", error);
      setError("Error fetching the 3D model.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        id="secondScreen"
        className="bg-gray-50 h-screen flex justify-center items-center text-black"
      >
        <div className="flex flex-col justify-center items-center gap-6 bg-white p-10 rounded-lg shadow-md mx-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input file-input-bordered file-input-accent w-full max-w-md p-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            type="submit"
            className="btn bg-blue-600 text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-700 disabled:opacity-50"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>

          <div className="dropdown dropdown-right">
            <button
              tabIndex={0}
              className="btn bg-gray-100 text-black hover:bg-gray-200 m-1 px-4 py-2 rounded-md"
            >
              Select Category
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-box w-52 p-2 shadow-lg border border-gray-200"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>

          {uploadedUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Uploaded image:</p>
              <Image
                src={uploadedUrl}
                alt="Uploaded image"
                width={300}
                height={300}
                layout="responsive"
                className="rounded-md shadow-md"
              />
            </div>
          )}

          <button
            className="btn bg-green-600 text-white px-6 py-2 rounded-md mt-4 hover:bg-green-700"
            onClick={fetchModelAndGenerate}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

function setModelData(modelResult: ModelResult) {
  throw new Error("Function not implemented.");
}

