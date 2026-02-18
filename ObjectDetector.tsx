import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { ModelType } from '../types';

interface ObjectDetectorProps {
  onFrame: (fps: number, detections: any[]) => void;
  onModelLoaded: () => void;
  threshold: number;
  modelType: ModelType; 
}

const ObjectDetector: React.FC<ObjectDetectorProps> = ({ onFrame, onModelLoaded, threshold }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const cocoModelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  
  const requestRef = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const isMounted = useRef(true);
  const onFrameRef = useRef(onFrame);

  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    isMounted.current = true;
    let isActive = true;

    const loadModel = async () => {
      setLoading(true);
      setError(null);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);

      try {
        await tf.ready(); 

        if (cocoModelRef.current) {
             cocoModelRef.current.dispose();
             cocoModelRef.current = null;
        }

        if (!isActive) return;

        if (!cocoModelRef.current) {
            cocoModelRef.current = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        }

        if (isActive) {
            setLoading(false);
            onModelLoaded();
            detectLoop();
        }

      } catch (err: any) {
        console.error("Model load error:", err);
        if (isActive) setError(`Failed to load COCO-SSD: ${err.message}`);
      }
    };

    loadModel();

    return () => {
      isActive = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const detectLoop = () => {
    if (!isMounted.current) return;

    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        if (canvasRef.current) {
            if (canvasRef.current.width !== videoWidth) {
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;
            }
        }

        runInference(video, videoWidth, videoHeight);
    }

    requestRef.current = requestAnimationFrame(detectLoop);
  };

  const runInference = async (video: HTMLVideoElement, width: number, height: number) => {
      const startTime = performance.now();
      let detectedObjects: any[] = [];

      try {
          if (cocoModelRef.current) {
              const predictions = await cocoModelRef.current.detect(video);
              detectedObjects = predictions
                .filter(p => p.score >= threshold)
                .map(p => ({
                    bbox: p.bbox,
                    class: p.class,
                    score: p.score
                }));
          }
          
          const endTime = performance.now();
          const fps = 1000 / ((endTime - lastFrameTime.current) || 1); 
          lastFrameTime.current = endTime;

          if (onFrameRef.current) {
            onFrameRef.current(fps, detectedObjects);
          }

          drawDetections(detectedObjects, width, height);

      } catch (e) {
          console.warn("Inference error:", e);
      }
  };

  const drawDetections = (detections: any[], width: number, height: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    
    detections.forEach((prediction: any) => {
        const [x, y, w, h] = prediction['bbox'];
        const text = prediction['class'];
        const score = (prediction['score'] * 100).toFixed(0) + '%';
        const isPerson = text === 'person';
        
        // Mobile Pro Style: Thin borders, semi-transparent fill
        const color = isPerson ? '#627bea' : '#00D4FF'; // Primary or Cyan Accent
        
        ctx.save();
        
        // 1. Box Border
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.stroke();

        // 2. Box Fill
        ctx.fillStyle = isPerson ? 'rgba(98, 123, 234, 0.1)' : 'rgba(0, 212, 255, 0.1)';
        ctx.fillRect(x, y, w, h);

        // 3. Label Tag (Top-Inside or Top-Outside)
        const labelText = `${text.toUpperCase()} ${score}`;
        ctx.font = 'bold 12px Inter, sans-serif';
        const textMetrics = ctx.measureText(labelText);
        const textWidth = textMetrics.width + 12;
        const textHeight = 20;

        // Label Background
        ctx.fillStyle = color;
        ctx.fillRect(x, y - textHeight > 0 ? y - textHeight : y, textWidth, textHeight);

        // Label Text
        ctx.fillStyle = '#0A0F1E'; // Dark Navy Text
        ctx.fillText(labelText, x + 6, (y - textHeight > 0 ? y - textHeight : y) + 14);
        
        ctx.restore();
    });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-background-dark/80 backdrop-blur-sm transition-opacity duration-300">
           <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
           <p className="text-white font-mono text-sm">Initializing Neural Engine...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
         <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/90 p-8">
            <div className="text-center max-w-md">
               <span className="material-symbols-outlined text-red-500 text-4xl mb-2">error_outline</span>
               <h3 className="text-white font-bold text-lg mb-2">Sensor Error</h3>
               <p className="text-red-400 text-sm mb-4">{error}</p>
               <button 
                 onClick={() => window.location.reload()}
                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold"
               >
                 Reboot System
               </button>
            </div>
         </div>
      )}

      <Webcam
        ref={webcamRef}
        muted={true} 
        screenshotFormat="image/jpeg"
        videoConstraints={{
           facingMode: "environment",
           // Allow responsive width/height instead of forcing mobile 720/1280
           width: { ideal: 1920 },
           height: { ideal: 1080 } 
        }}
        className="absolute inset-0 w-full h-full object-cover"
        onUserMediaError={() => setError("Camera access denied.")}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
};

export default ObjectDetector;