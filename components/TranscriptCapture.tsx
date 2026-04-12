"use client"

import React, { useEffect, useState, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface TranscriptCaptureProps {
  isActive: boolean;
  onTranscriptUpdate?: (transcript: string) => void;
  language?: string;
}

export default function TranscriptCapture({ 
  isActive, 
  onTranscriptUpdate,
  language = "en-US" 
}: TranscriptCaptureProps) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [prevTranscript, setPrevTranscript] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startListening = async () => {
    try {
      await SpeechRecognition.startListening({
        continuous: true,
        language: language,
      });
      console.log("🎤 Speech recognition started");
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  };

  const stopListening = () => {
    try {
      SpeechRecognition.stopListening();
      SpeechRecognition.abortListening();
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  };

  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const restartRecognition = async () => {
    await stopListening();
    await new Promise(resolve => setTimeout(resolve, 500));
    if (isActiveRef.current) {
      await startListening();
    }
  };

  useEffect(() => {
    if (isActive) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      isActiveRef.current = false;
      stopListening();
      if (restartTimerRef.current) {
        clearInterval(restartTimerRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    restartTimerRef.current = setInterval(() => {
      if (prevTranscript === transcript && listening) {
        console.log("⚠️ Transcript stalled, restarting...");
        restartRecognition();
      } else {
        setPrevTranscript(transcript);
      }
    }, 5000);

    return () => {
      if (restartTimerRef.current) {
        clearInterval(restartTimerRef.current);
      }
    };
  }, [transcript, prevTranscript, listening, isActive]);

  useEffect(() => {
    if (onTranscriptUpdate) {
      onTranscriptUpdate(transcript);
    }
    
    const words = transcript.trim().split(/\s+/).filter((w: string) => w.length > 0);
    setWordCount(words.length);
  }, [transcript, onTranscriptUpdate]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
        <p className="text-red-500 font-semibold">
          Browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    // <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 space-y-3">
    //   <div className="flex items-center justify-between mb-2">
    //     <h3 className="text-lg font-bold text-foreground">📝 Live Transcript</h3>
    //     <div className="flex items-center gap-2">
    //       {listening ? (
    //         <span className="flex items-center gap-2 text-green-500 text-sm font-semibold">
    //           <span className="relative flex h-3 w-3">
    //             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    //             <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
    //           </span>
    //           Recording
    //         </span>
    //       ) : (
    //         <span className="text-muted-foreground text-sm font-semibold">
    //           🔴 Not Recording
    //         </span>
    //       )}
    //     </div>
    //   </div>

    //   {/* Word Count */}
    //   <div className="bg-secondary/50 rounded-lg p-3">
    //     <div className="text-xs text-muted-foreground mb-1">Words Spoken</div>
    //     <div className="text-2xl font-bold text-primary">{wordCount}</div>
    //   </div>

    //   {/* Transcript Display */}
    //   <div className="bg-secondary/80 rounded-lg p-4 min-h-[150px] max-h-[300px] overflow-y-auto">
    //     {transcript && transcript.length > 0 ? (
    //       <p className="text-foreground leading-relaxed whitespace-pre-wrap">
    //         {transcript}
    //       </p>
    //     ) : (
    //       <p className="text-muted-foreground italic">
    //         {isActive ? "Speak to see transcript..." : "Start recording to capture transcript"}
    //       </p>
    //     )}
    //   </div>

    //   {/* Manual Controls (optional) */}
    //   <div className="flex gap-2 pt-2">
    //     <button
    //       onClick={resetTranscript}
    //       className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-semibold rounded-lg transition-colors border border-border"
    //     >
    //       Clear
    //     </button>
    //     <button
    //       onClick={restartRecognition}
    //       disabled={!isActive}
    //       className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold rounded-lg transition-colors border border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
    //     >
    //       Restart Recognition
    //     </button>
    //   </div>
    // </div>
    <></>
  );
}
