/**
 * Audio Extraction and Processing Utilities
 */

/**
 * Extract audio from video blob as WAV format
 * @param videoBlob - The recorded video blob
 * @returns Audio blob in WAV format suitable for analysis
 */
export async function extractAudioFromVideo(videoBlob: Blob): Promise<Blob> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Convert blob to array buffer
  const arrayBuffer = await videoBlob.arrayBuffer();
  
  // Decode audio data
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Convert to WAV format (mono, 16kHz for analysis)
  const wavBlob = await audioBufferToWav(audioBuffer, 16000);
  
  return wavBlob;
}

/**
 * Convert AudioBuffer to WAV blob
 * @param buffer - AudioBuffer from decodeAudioData
 * @param targetSampleRate - Target sample rate (16000 recommended for speech)
 */
async function audioBufferToWav(buffer: AudioBuffer, targetSampleRate: number = 16000): Promise<Blob> {
  const numberOfChannels = 1; // Mono for speech analysis
  const originalSampleRate = buffer.sampleRate;
  
  // Get channel data and downsample if needed
  let channelData = buffer.getChannelData(0) as Float32Array; // Get first channel
  
  // Downsample if necessary
  if (originalSampleRate !== targetSampleRate) {
    channelData = downsampleBuffer(channelData, originalSampleRate, targetSampleRate);
  }
  
  // Convert to 16-bit PCM
  const length = channelData.length;
  const buffer16 = new Int16Array(length);
  
  for (let i = 0; i < length; i++) {
    const s = Math.max(-1, Math.min(1, channelData[i]));
    buffer16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  // Create WAV file
  const wavData = encodeWAV(buffer16, targetSampleRate, numberOfChannels);
  return new Blob([wavData], { type: 'audio/wav' });
}

/**
 * Simple downsampling
 */
function downsampleBuffer(buffer: Float32Array, fromSampleRate: number, toSampleRate: number): Float32Array {
  if (fromSampleRate === toSampleRate) {
    return buffer;
  }
  
  const sampleRateRatio = fromSampleRate / toSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  
  let offsetResult = 0;
  let offsetBuffer = 0;
  
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0;
    let count = 0;
    
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    
    result[offsetResult] = accum / count;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  
  return result;
}

/**
 * Encode PCM data as WAV
 */
function encodeWAV(samples: Int16Array, sampleRate: number, numChannels: number): ArrayBuffer {
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);
  
  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // File length
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // Format chunk identifier
  writeString(view, 12, 'fmt ');
  // Format chunk length
  view.setUint32(16, 16, true);
  // Sample format (PCM)
  view.setUint16(20, 1, true);
  // Channel count
  view.setUint16(22, numChannels, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate
  view.setUint32(28, sampleRate * blockAlign, true);
  // Block align
  view.setUint16(32, blockAlign, true);
  // Bits per sample
  view.setUint16(34, 16, true);
  // Data chunk identifier
  writeString(view, 36, 'data');
  // Data chunk length
  view.setUint32(40, samples.length * bytesPerSample, true);
  
  // Write PCM samples
  const offset = 44;
  for (let i = 0; i < samples.length; i++) {
    view.setInt16(offset + i * 2, samples[i], true);
  }
  
  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Send audio to analysis API
 */
export async function analyzeAudio(audioBlob: Blob): Promise<AudioAnalysisResult> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.wav');
  
  const response = await fetch('/api/analyze-audio', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Audio analysis failed');
  }
  
  return await response.json();
}

export interface AudioAnalysisResult {
  speech_rate: number; 
  long_pauses: number; 
  total_silence_sec: number; 
  pitch_variance: number; 
  energy_std: number; 
  delivery_score: number; 
  speaking_time_sec?: number; 
  transcript?: string; 
  word_count?: number; 
  note?: string; 
}
