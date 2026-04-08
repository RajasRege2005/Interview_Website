"""
Audio Delivery Analysis Script with Whisper Speech Recognition
Accurately detects actual speech vs silence/noise
"""

import sys
import json
import numpy as np
import librosa
import warnings
warnings.filterwarnings('ignore')

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.integer, np.int32, np.int64)):
            return int(obj)
        elif isinstance(obj, (np.floating, np.float32, np.float64)):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyEncoder, self).default(obj)

def analyze_audio(audio_path):
    """
    Analyze audio file for delivery metrics using Whisper for speech detection
    Returns: dict with speech_rate, long_pauses, total_silence_sec, pitch_variance, energy_std
    """
    try:
        try:
            import whisper
            use_whisper = True
        except ImportError:
            print(json.dumps({
                "error": "Whisper not installed. Install with: pip install openai-whisper",
                "speech_rate": 0,
                "long_pauses": 0,
                "total_silence_sec": 0,
                "pitch_variance": 0,
                "energy_std": 0,
                "delivery_score": 0,
                "speaking_time_sec": 0,
                "transcript": "ERROR: Whisper not installed"
            }))
            sys.exit(1)
        
        y, sr = librosa.load(audio_path, sr=16000, mono=True)
        duration = len(y) / sr
        
        model = whisper.load_model("base") 
        result = model.transcribe(audio_path, language="en", word_timestamps=True)
        
        transcript = result["text"].strip()
        segments = result.get("segments", [])
        
        if not transcript or len(transcript) < 5:
            return {
                "speech_rate": 0,
                "long_pauses": 0,
                "total_silence_sec": round(duration, 1),
                "pitch_variance": 0,
                "energy_std": 0,
                "delivery_score": 0,
                "speaking_time_sec": 0,
                "transcript": "",
                "note": "No speech detected"
            }
        
        speaking_time = 0
        pauses = []
        
        for i, segment in enumerate(segments):
            start = segment["start"]
            end = segment["end"]
            speaking_time += (end - start)
            
            if i > 0:
                prev_end = segments[i-1]["end"]
                pause_duration = start - prev_end
                if pause_duration > 0:
                    pauses.append(pause_duration)
        
        long_pauses = sum(1 for p in pauses if p > 0.8)
        
        word_count = len(transcript.split())
        speech_rate = round((word_count / speaking_time) * 60, 1) if speaking_time > 0 else 0
        
        intervals = librosa.effects.split(y, top_db=30)  
        
        if len(intervals) > 0:
            voiced_audio = []
            for start, end in intervals:
                voiced_audio.extend(y[start:end])
            voiced_audio = np.array(voiced_audio)
            
            if len(voiced_audio) > sr * 0.5:  
                f0, voiced_flag, voiced_probs = librosa.pyin(
                    voiced_audio,
                    fmin=librosa.note_to_hz('C2'),
                    fmax=librosa.note_to_hz('C7'),
                    sr=sr
                )
                valid_f0 = f0[~np.isnan(f0)]
                pitch_variance = round(np.var(valid_f0), 2) if len(valid_f0) > 0 else 0
            else:
                pitch_variance = 0
            
            rms = librosa.feature.rms(y=voiced_audio)[0]
            energy_std = round(np.std(rms), 3)
        else:
            pitch_variance = 0
            energy_std = 0
        
        delivery_score = calculate_delivery_score(
            speech_rate, long_pauses, pitch_variance, energy_std, speaking_time
        )
        
        return {
            "speech_rate": float(speech_rate),
            "long_pauses": int(long_pauses),
            "total_silence_sec": float(round(duration - speaking_time, 1)),
            "pitch_variance": float(pitch_variance),
            "energy_std": float(energy_std),
            "delivery_score": int(delivery_score),
            "speaking_time_sec": float(round(speaking_time, 1)),
            "transcript": transcript,
            "word_count": int(word_count)
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "speech_rate": 0,
            "long_pauses": 0,
            "total_silence_sec": 0,
            "pitch_variance": 0,
            "energy_std": 0,
            "delivery_score": 0,
            "speaking_time_sec": 0
        }

def calculate_delivery_score(speech_rate, long_pauses, pitch_variance, energy_std, speaking_time):
    """
    Calculate overall delivery score (0-100)
    """
    score = 100
    
    if speaking_time < 5:
        return 0
    
    if speech_rate < 110:
        score -= 20
    elif speech_rate < 130:
        score -= 10
    elif speech_rate > 180:
        score -= 15
    elif speech_rate > 170:
        score -= 5
    
    score -= min(long_pauses * 3, 20)
    
    if pitch_variance < 50:
        score -= 15
    elif pitch_variance < 100:
        score -= 5
    
    if energy_std < 0.01:
        score -= 10
    
    return int(max(0, round(score)))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No audio file provided"}))
        sys.exit(1)
    
    audio_path = sys.argv[1]
    result = analyze_audio(audio_path)
    print(json.dumps(result, cls=NumpyEncoder))
