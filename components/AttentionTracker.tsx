"use client"

import React, { useEffect, useRef, useState } from "react";
import FaceLandmarkManager from "@/lib/FaceLandmarkManager";

export interface AttentionMetrics {
  earScore: number;
  gazeScore: number;
  attentionScore: number;
  isDistracted: boolean;
  isAsleep: boolean;
  lookingAway: boolean;
  avgAttention: number;
}

interface AttentionTrackerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  showUI?: boolean; // Whether to show the UI (default: true)
  onMetricsUpdate?: (metrics: AttentionMetrics) => void;
}

export default function AttentionTracker({ 
  videoRef, 
  isActive,
  showUI = true,
  onMetricsUpdate 
}: AttentionTrackerProps) {
  const [metrics, setMetrics] = useState<AttentionMetrics>({
    earScore: 0,
    gazeScore: 0,
    attentionScore: 100,
    isDistracted: false,
    isAsleep: false,
    lookingAway: false,
    avgAttention: 100
  });
  
  const lastVideoTimeRef = useRef(-1);
  const requestRef = useRef<number>(0);
  const attentionHistoryRef = useRef<number[]>([]);
  const distractionTimeRef = useRef(0);
  const asleepTimeRef = useRef(0);
  const lookingAwayTimeRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const totalFramesRef = useRef(0);
  const noFaceFramesRef = useRef(0);
  
  // More sensitive thresholds
  const EAR_EXCELLENT = 0.75;  // Wide open eyes
  const EAR_GOOD = 0.50;       // Normal open eyes
  const EAR_DROWSY = 0.30;     // Partially closed
  const EAR_CLOSED = 0.20;     // Very closed/sleeping
  
  const GAZE_EXCELLENT = 0.3;  // Looking straight at camera
  const GAZE_GOOD = 0.6;       // Minor eye movement
  const GAZE_DISTRACTED = 0.9; // Noticeable looking away
  const GAZE_AWAY = 1.2;       // Clearly looking elsewhere
  
  const SUSTAINED_THRESHOLD = 1000;  // 1 second for sustained issues

  const animate = () => {
    if (!isActive || !videoRef.current) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    // Check if video is playing and has loaded
    if (videoRef.current.readyState < 2 || videoRef.current.paused) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      
      try {
        const faceLandmarkManager = FaceLandmarkManager.getInstance();
        
        // Use performance.now() for MediaPipe timestamps
        const timestamp = performance.now();
        
        // Ensure we don't process the same frame twice
        if (timestamp - lastTimestampRef.current < 16) { // ~60fps
          requestRef.current = requestAnimationFrame(animate);
          return;
        }
        lastTimestampRef.current = timestamp;
        
        const landmarks = faceLandmarkManager.detectLandmarks(
          videoRef.current,
          timestamp
        );

        // Track total frames processed
        totalFramesRef.current++;
        
        // Default values for when no face is detected
        let attentionScore = 0;
        let earScore = 0;
        let gazeScore = 0;
        let isAsleep = false;
        let lookingAway = false;
        let isDistracted = true; // If no face, they're distracted

        if (landmarks && landmarks.faceBlendshapes && landmarks.faceBlendshapes.length > 0) {
          // Face detected - calculate metrics
          // Extract eye blend shapes
          const blendshapes = landmarks.faceBlendshapes[0].categories;
          
          const eyeLookUpLeft = blendshapes.find(s => s.categoryName === "eyeLookUpLeft")?.score ?? 0;
          const eyeLookUpRight = blendshapes.find(s => s.categoryName === "eyeLookUpRight")?.score ?? 0;
          const eyeLookDownLeft = blendshapes.find(s => s.categoryName === "eyeLookDownLeft")?.score ?? 0;
          const eyeLookDownRight = blendshapes.find(s => s.categoryName === "eyeLookDownRight")?.score ?? 0;
          const eyeLookInLeft = blendshapes.find(s => s.categoryName === "eyeLookInLeft")?.score ?? 0;
          const eyeLookInRight = blendshapes.find(s => s.categoryName === "eyeLookInRight")?.score ?? 0;
          const eyeLookOutLeft = blendshapes.find(s => s.categoryName === "eyeLookOutLeft")?.score ?? 0;
          const eyeLookOutRight = blendshapes.find(s => s.categoryName === "eyeLookOutRight")?.score ?? 0;
          
          // Eye blink detection
          const eyeBlinkLeft = blendshapes.find(s => s.categoryName === "eyeBlinkLeft")?.score ?? 0;
          const eyeBlinkRight = blendshapes.find(s => s.categoryName === "eyeBlinkRight")?.score ?? 0;

          // Calculate EAR (Eye Aspect Ratio) - lower means eyes closing
          const earLeft = 1 - eyeBlinkLeft;
          const earRight = 1 - eyeBlinkRight;
          earScore = (earLeft + earRight) / 2;

          // Calculate Gaze Score (weighted sum of eye movements)
          const weights = {
            upLeft: 1, upRight: 1,
            downLeft: 1, downRight: 1,
            inLeft: 0.5, inRight: 0.5,
            outLeft: 0.5, outRight: 0.5,
          };
          
          gazeScore =
            weights.upLeft * eyeLookUpLeft +
            weights.upRight * eyeLookUpRight +
            weights.downLeft * eyeLookDownLeft +
            weights.downRight * eyeLookDownRight +
            weights.inLeft * eyeLookInLeft +
            weights.inRight * eyeLookInRight +
            weights.outLeft * eyeLookOutLeft +
            weights.outRight * eyeLookOutRight;

          // Calculate attention score with gradual penalties (0-100)
          attentionScore = 100;
          
          // Eye closure penalties (gradual based on how closed)
          if (earScore >= EAR_EXCELLENT) {
            // Perfect - no penalty
          } else if (earScore >= EAR_GOOD) {
            // Slightly squinting - minor penalty
            attentionScore -= 10;
          } else if (earScore >= EAR_DROWSY) {
            // Drowsy, partially closed - moderate penalty
            attentionScore -= 30;
          } else if (earScore >= EAR_CLOSED) {
            // Very closed eyes - heavy penalty
            attentionScore -= 60;
            isAsleep = true;
          } else {
            // Eyes completely closed - maximum penalty
            attentionScore -= 80;
            isAsleep = true;
          }
          
          // Gaze direction penalties (gradual based on how far away)
          if (gazeScore <= GAZE_EXCELLENT) {
            // Perfect eye contact - no penalty
          } else if (gazeScore <= GAZE_GOOD) {
            // Minor eye movement - small penalty
            attentionScore -= 10;
          } else if (gazeScore <= GAZE_DISTRACTED) {
            // Noticeably distracted - moderate penalty
            attentionScore -= 25;
          } else if (gazeScore <= GAZE_AWAY) {
            // Looking away - heavy penalty
            attentionScore -= 45;
            lookingAway = true;
          } else {
            // Clearly looking elsewhere - maximum penalty
            attentionScore -= 60;
            lookingAway = true;
          }
          
          // Track sustained issues for state flags
          const now = Date.now();
          
          if (earScore < EAR_DROWSY) {
            if (asleepTimeRef.current === 0) {
              asleepTimeRef.current = now;
            } else if (now - asleepTimeRef.current > SUSTAINED_THRESHOLD) {
              isAsleep = true;
            }
          } else {
            asleepTimeRef.current = 0;
            isAsleep = false;
          }
          
          if (gazeScore > GAZE_DISTRACTED) {
            if (lookingAwayTimeRef.current === 0) {
              lookingAwayTimeRef.current = now;
            } else if (now - lookingAwayTimeRef.current > SUSTAINED_THRESHOLD) {
              lookingAway = true;
            }
          } else {
            lookingAwayTimeRef.current = 0;
            lookingAway = false;
          }
          
          // Overall distraction flag
          isDistracted = isAsleep || lookingAway || (earScore < EAR_GOOD) || (gazeScore > GAZE_GOOD);
          
          // Ensure score stays in valid range
          attentionScore = Math.max(0, Math.min(100, attentionScore));
        } else {
          // No face detected - count as no attention
          noFaceFramesRef.current++;
          attentionScore = 0;
          isDistracted = true;
        }

        // ALWAYS track attention (whether face detected or not)
        attentionHistoryRef.current.push(attentionScore);
        
        // Keep reasonable history size
        if (attentionHistoryRef.current.length > 300) { // ~5 seconds at 60fps
          attentionHistoryRef.current.shift();
        }
        
        // Calculate average attention over ALL frames
        const avgAttention = attentionHistoryRef.current.reduce((a, b) => a + b, 0) / attentionHistoryRef.current.length;

        const newMetrics: AttentionMetrics = {
          earScore: Math.round(earScore * 100) / 100,
          gazeScore: Math.round(gazeScore * 100) / 100,
          attentionScore: Math.round(attentionScore),
          isDistracted,
          isAsleep,
          lookingAway,
          avgAttention: Math.round(avgAttention)
        };

        setMetrics(newMetrics);
        if (onMetricsUpdate) {
          onMetricsUpdate(newMetrics);
        }
      } catch (e) {
        console.error("Error in attention tracking:", e);
      }
    }
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isActive) {
      // Small delay to ensure video is ready
      const timer = setTimeout(() => {
        requestRef.current = requestAnimationFrame(animate);
      }, 500);
      
      return () => {
        clearTimeout(timer);
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive, videoRef.current]);

  // Don't render UI if showUI is false (collecting metrics silently)
  if (!showUI) {
    return null;
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 space-y-3">
      <h3 className="text-lg font-bold text-foreground mb-3">👁️ Attention Metrics</h3>
      
      {/* Status Indicators */}
      <div className="flex flex-wrap gap-2">
        {metrics.isAsleep && (
          <span className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full text-sm font-semibold">
            ASLEEP
          </span>
        )}
        {metrics.lookingAway && (
          <span className="px-3 py-1 bg-orange-500/20 text-orange-500 border border-orange-500/30 rounded-full text-sm font-semibold">
            LOOKING AWAY
          </span>
        )}
        {metrics.isDistracted && (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-full text-sm font-semibold">
            DISTRACTED
          </span>
        )}
        {!metrics.isDistracted && isActive && (
          <span className="px-3 py-1 bg-green-500/20 text-green-500 border border-green-500/30 rounded-full text-sm font-semibold">
            FOCUSED
          </span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Attention Score</div>
          <div className={`text-2xl font-bold ${
            metrics.attentionScore >= 80 ? 'text-green-500' : 
            metrics.attentionScore >= 50 ? 'text-yellow-500' : 
            'text-red-500'
          }`}>
            {metrics.attentionScore}%
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Average Score</div>
          <div className="text-2xl font-bold text-primary">
            {metrics.avgAttention}%
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Eye Opening (EAR)</div>
          <div className="text-xl font-bold text-foreground">
            {metrics.earScore}
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Gaze Score</div>
          <div className="text-xl font-bold text-foreground">
            {metrics.gazeScore}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Overall Attention</span>
          <span>{metrics.avgAttention}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              metrics.avgAttention >= 80 ? 'bg-green-500' : 
              metrics.avgAttention >= 50 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${metrics.avgAttention}%` }}
          />
        </div>
      </div>
    </div>
  );
}
