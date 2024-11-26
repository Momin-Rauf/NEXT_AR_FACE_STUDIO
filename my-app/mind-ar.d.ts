declare module 'mind-ar/dist/mindar-face-three.prod.js' {
  import * as THREE from 'three';

  export class MindARThree {
    constructor(options: { container: HTMLElement });

    // Methods
    start(): Promise<void>;
    stop(): void;
    getLatestEstimate(): {
      blendshapes?: {
        categories: Array<{ categoryName: string; score: number }>;
      };
    } | null;
    addAnchor(index: number): { group: THREE.Group };
    addFaceMesh(): THREE.Mesh;

    // Properties
    video: HTMLVideoElement;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
  }
}
