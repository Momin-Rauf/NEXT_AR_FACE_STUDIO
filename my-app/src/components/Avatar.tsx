import { useEffect } from 'react';
import * as THREE from 'three';
import { MindARThree } from 'mind-ar/dist/mindar-face-three.prod.js';

const Avatar = () => {
  useEffect(() => {
    // Declare variables with appropriate types
    let mindarThree: MindARThree | null = null;
    let material: THREE.material | null=null
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.Camera | null = null;
    let anchor: { group: THREE.Group } | null = null;

    const initMindAR = async () => {
      const container = document.querySelector('#container') as HTMLElement | null;
      if (!container) {
        console.error('Container element not found!');
        return;
      }

      // Initialize MindARThree
      mindarThree = new MindARThree({
        container, // Correct container assignment
      });

      // Extract renderer, scene, and camera
      renderer = mindarThree.renderer;
      scene = mindarThree.scene;
      camera = mindarThree.camera;

      // Create a sphere and attach it to an anchor
      anchor = mindarThree.addAnchor(1);
     
      const geometry = new THREE.SphereGeometry(0.1, 32, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.5,
      });
      const sphere = new THREE.Mesh(geometry, material);
      anchor.group.add(sphere);
      
      

      // Start AR session
      const startAR = async () => {
        if (!mindarThree || !renderer || !scene || !camera) {
          console.error('AR components are not properly initialized.');
          return;
        }
        await mindarThree.start();
        renderer.setAnimationLoop(() => {
          renderer!.render(scene!, camera!);
        });
      };

      const faceMesh = mindarThree.addFaceMesh();
      

      document.querySelector('#startButton')?.addEventListener('click', () => {
        startAR();
      });
      console.log(mindarThree.addFaceMesh())
      document.querySelector('#stopButton')?.addEventListener('click', () => {
        if (mindarThree && renderer) {
          mindarThree.stop();
          renderer.setAnimationLoop(null);
        }
      });
    };

    // Initialize MindAR on mount
    initMindAR();

    // Cleanup on unmount
    return () => {
      if (mindarThree) {
        try {
          mindarThree.stop(); // Safely attempt to stop
        } catch (error) {
          console.error('Error while stopping MindAR:', error);
        }
      }
      
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div>
      <div id="control">
        <button id="startButton">Start</button>
        <button id="stopButton">Stop</button>
      </div>
      <div id="container" className='z-10' style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}></div>
    </div>
  );
};

export default Avatar;
