/**
 * Converts an image file to PNG format using Canvas
 * @param file The image file to convert
 * @returns A promise that resolves to a File object in PNG format
 */
export const convertToPNG = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        const img = new Image();
        img.onload = () => {
          try {
            // Create canvas with proper type handling
            // First cast to unknown, then to HTMLCanvasElement
            // @ts-ignore
            const canvas = document.createElement('canvas');
            
            // TypeScript safety check for canvas properties
            if (!('width' in canvas) || !('height' in canvas) || !('getContext' in canvas)) {
              throw new Error('Canvas element does not have required properties');
            }
            
            // @ts-ignore
            canvas.width = img.width;
            // @ts-ignore
            canvas.height = img.height;
            
            // @ts-ignore
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Failed to create canvas context'));
              return;
            }
            
            // Draw image and convert to PNG
            // @ts-ignore
            ctx.drawImage(img, 0, 0);
            
            // Check if toBlob exists
            // @ts-ignore
            if (!('toBlob' in canvas)) {
              // Fallback for environments where toBlob isn't available
              try {
                // @ts-ignore
                const dataURL = canvas.toDataURL('image/png');
                const binStr = atob(dataURL.split(',')[1]);
                const arr = new Uint8Array(binStr.length);
                for (let i = 0; i < binStr.length; i++) {
                  arr[i] = binStr.charCodeAt(i);
                }
                const blob = new Blob([arr], { type: 'image/png' });
                
                const convertedFile = new File(
                  [blob], 
                  `${file.name.split('.')[0]}.png`,
                  { type: 'image/png' }
                );
                
                resolve(convertedFile);
              } catch (err) {
                reject(new Error('Failed to convert canvas to PNG: ' + err));
              }
              return;
            }
            
            // @ts-ignore
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Failed to convert image to PNG'));
                return;
              }
              
              // Create a new File object
              const convertedFile = new File(
                [blob], 
                `${file.name.split('.')[0]}.png`,
                { type: 'image/png' }
              );
              
              resolve(convertedFile);
            }, 'image/png');
          } catch (err) {
            reject(new Error('Canvas operation failed: ' + err));
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        // Set the image source
        img.src = event.target.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      // Read the file as a data URL
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}; 