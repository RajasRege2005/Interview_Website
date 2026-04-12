/**
 * Extract audio from video blob as WAV format
 * @param videoBlob - The recorded video blob
 * @returns Audio blob in WAV format suitable for analysis
 */
export async function extractAudioFromVideo(videoBlob: Blob): Promise<Blob> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const arrayBuffer = await videoBlob.arrayBuffer();
  
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  const wavBlob = await audioBufferToWav(audioBuffer, 16000);
  
  await audioContext.close();
  
  return wavBlob;
}

/**
 * Convert AudioBuffer to WAV blob
 * @param buffer - AudioBuffer from decodeAudioData
 * @param targetSampleRate - Target sample rate (16000 recommended for speech)
 */
async function audioBufferToWav(buffer: AudioBuffer, targetSampleRate: number = 16000): Promise<Blob> {
  const numberOfChannels = 1; 
  const originalSampleRate = buffer.sampleRate;
  
  let channelData = buffer.getChannelData(0) as Float32Array; 
  
  if (originalSampleRate !== targetSampleRate) {
    channelData = downsampleBuffer(channelData, originalSampleRate, targetSampleRate);
  }
  
  const length = channelData.length;
  const buffer16 = new Int16Array(length);
  
  for (let i = 0; i < length; i++) {
    const s = Math.max(-1, Math.min(1, channelData[i]));
    buffer16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const wavData = encodeWAV(buffer16, targetSampleRate, numberOfChannels);
  return new Blob([wavData], { type: 'audio/wav' });
}

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

function encodeWAV(samples: Int16Array, sampleRate: number, numChannels: number): ArrayBuffer {
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);
  
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * bytesPerSample, true);
  
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
