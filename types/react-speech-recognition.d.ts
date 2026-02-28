declare module 'react-speech-recognition' {
  export interface UseSpeechRecognitionOptions {
    transcribing?: boolean;
    clearTranscriptOnListen?: boolean;
    commands?: Array<{
      command: string | RegExp | Array<string | RegExp>;
      callback: (...args: any[]) => void;
      matchInterim?: boolean;
      isFuzzyMatch?: boolean;
      fuzzyMatchingThreshold?: number;
      bestMatchOnly?: boolean;
    }>;
  }

  export interface SpeechRecognitionResult {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
    finalTranscript: string;
    interimTranscript: string;
  }

  export function useSpeechRecognition(
    options?: UseSpeechRecognitionOptions
  ): SpeechRecognitionResult;

  export interface StartListeningOptions {
    continuous?: boolean;
    language?: string;
  }

  const SpeechRecognition: {
    startListening: (options?: StartListeningOptions) => Promise<void>;
    stopListening: () => Promise<void>;
    abortListening: () => Promise<void>;
    browserSupportsSpeechRecognition: () => boolean;
    getRecognition: () => any;
  };

  export default SpeechRecognition;
}
