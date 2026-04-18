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
        console.log("Transcript stalled, restarting...");
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
    <>

    </>
  );
}
