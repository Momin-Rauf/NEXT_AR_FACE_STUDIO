// app/api/generate-model/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

// Required to enable FormData parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  console.log('Received request for 3D model generation');
  
  try {
    // Parse the uploaded file from the FormData
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      console.log('No file found in request');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadForm = new FormData();
    uploadForm.append('image', buffer, file.name || 'upload.png');

    console.log('Sending request to HuggingFace space...');
    // Proxy request to HuggingFace space
    const apiResponse = await axios.post(
      'https://ahmad-sarmad-ali-3d-model-ai.hf.space/generate-3d/',
      uploadForm,
      {
        headers: uploadForm.getHeaders(),
        responseType: 'arraybuffer',
        timeout: 300000, // 5 minutes timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          console.log(`Upload progress: ${percentCompleted}% (${progressEvent.loaded}/${progressEvent.total} bytes)`);
        },
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Download progress: ${percentCompleted}% (${progressEvent.loaded}/${progressEvent.total} bytes)`);
          } else {
            console.log(`Downloaded: ${progressEvent.loaded} bytes`);
          }
        },
      }
    );

    if (!apiResponse.data || apiResponse.data.length === 0) {
      console.error('Received empty response from HuggingFace');
      return NextResponse.json({ error: 'Empty response from model generation service' }, { status: 500 });
    }

    console.log(`Successfully received GLB model from HuggingFace (${apiResponse.data.length} bytes)`);
    return new NextResponse(apiResponse.data, {
      status: 200,
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Content-Disposition': 'attachment; filename="model.glb"',
      },
    });
  } catch (error: any) {
    console.error('3D model proxy error:', error.message || error);
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out after 5 minutes');
      return NextResponse.json({ error: 'Model generation timed out' }, { status: 504 });
    }
    if (error.response) {
      console.error('HuggingFace API response:', error.response.status, error.response.data);
      return NextResponse.json({ 
        error: 'Failed to generate 3D model',
        details: error.response.data 
      }, { status: error.response.status });
    }
    return NextResponse.json({ error: 'Failed to generate 3D model' }, { status: 500 });
  }
}
