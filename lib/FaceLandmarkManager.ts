"use client"

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

if (typeof window !== 'undefined') {
  const originalConsoleLog = console.log;
  const originalConsoleInfo = console.info;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  
  const shouldSuppress = (args: any[]): boolean => {
    const msg = args.join(' ').toLowerCase();
    return (
      msg.includes('tensorflow') || 
      msg.includes('xnnpack') || 
      msg.includes('tflite') ||
      msg.includes('mediapipe') && msg.includes('delegate')
    );
  };
  
  console.log = (...args: any[]) => {
    if (!shouldSuppress(args)) {
      originalConsoleLog(...args);
    }
  };
  
  console.info = (...args: any[]) => {
    if (!shouldSuppress(args)) {
      originalConsoleInfo(...args);
    }
  };
  
  console.warn = (...args: any[]) => {
    if (!shouldSuppress(args)) {
      originalConsoleWarn(...args);
    }
  };
  
  console.error = (...args: any[]) => {
    if (!shouldSuppress(args)) {
      originalConsoleError(...args);
    }
  };
}

class FaceLandmarkManager {
  private static instance: FaceLandmarkManager = new FaceLandmarkManager();
  faceLandmarker!: FaceLandmarker | null;
  private isInitialized: boolean = false;

  private constructor() {
    this.initializeModel();
  }

  static getInstance(): FaceLandmarkManager {
    return FaceLandmarkManager.instance;
  }

  initializeModel = async () => {
    if (this.isInitialized) return;
    
    try {
      this.faceLandmarker = null;
      console.log("🔄 Initializing FaceLandmarker...");
      
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      
      this.faceLandmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );
      
      this.isInitialized = true;
      console.log("FaceLandmarker initialized successfully");
    } catch (error) {
      console.error("Failed to initialize FaceLandmarker:", error);
      this.faceLandmarker = null;
    }
  };

  detectLandmarks = (videoElement: HTMLVideoElement, time: number) => {
    if (!this.faceLandmarker || !this.isInitialized) {
      return null;
    }

    if (!videoElement || videoElement.readyState < 2) {
      return null;
    }

    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      return null;
    }

    try {
      if (typeof this.faceLandmarker.detectForVideo !== 'function') {
        console.error("detectForVideo method not available");
        return null;
      }
      
      const results = this.faceLandmarker.detectForVideo(videoElement, time);
      return results;
    } catch (error) {
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        if (!errorMsg.includes('not initialized') && 
            !errorMsg.includes('tensorflow') && 
            !errorMsg.includes('xnnpack')) {
          console.error("Error detecting landmarks:", error);
        }
      }
      return null;
    }
  };
}

export default FaceLandmarkManager;
