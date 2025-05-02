// app/api/generate-model/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

// Modern Next.js App Router config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Constants
const HF_API_URL = 'https://ahmad-sarmad-ali-3d-model-ai.hf.space/generate-3d/';
const MAX_RETRIES = 3;
const RETRY_DELAY = 3000; // 3 seconds

// Helper for delayed retry
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

    // Implement retry logic with exponential backoff
    let lastError;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt} of ${MAX_RETRIES-1}...`);
          // Exponential backoff
          await sleep(RETRY_DELAY * Math.pow(2, attempt - 1));
        }
        
        const uploadForm = new FormData();
        uploadForm.append('image', buffer, file.name || 'upload.png');

        console.log('Sending request to HuggingFace space...');
        // Proxy request to HuggingFace space
        const apiResponse = await axios.post(
          HF_API_URL,
          uploadForm,
          {
            headers: {
              ...uploadForm.getHeaders(),
              'Connection': 'keep-alive',
              'Keep-Alive': 'timeout=300, max=1000'
            },
            responseType: 'arraybuffer',
            // No timeout - wait indefinitely for response
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
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
          continue; // Try again
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
        lastError = error;
        console.error(`Attempt ${attempt + 1} failed:`, error.message || error);
        
        // Check if we should retry based on error type
        const isNetworkError = error.message?.includes('timeout') || 
                             error.message?.includes('socket') || 
                             error.code === 'ECONNABORTED' ||
                             error.code === 'ECONNRESET' ||
                             error.message?.includes('Network Error');
                             
        if (!isNetworkError) {
          // Don't retry for non-network errors
          break;
        }
      }
    }
    
    // If we've exhausted all retries
    console.error('All retry attempts failed');
    
    return NextResponse.json({ 
      error: 'Model generation service unavailable',
      details: lastError?.message || 'Service unavailable after multiple attempts',
      code: 'SERVICE_UNAVAILABLE'
    }, { status: 503 });
  } catch (error: any) {
    console.error('3D model proxy error:', error.message || error);
    
    // Generic error case
    return NextResponse.json({ 
      error: 'Failed to generate 3D model',
      details: error.message,
      code: 'UNKNOWN_ERROR'
    }, { status: 500 });
  }
}
