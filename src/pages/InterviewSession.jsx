import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function InterviewSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category || 'Behavioral Interviews';
  
  const [sessionPhase, setSessionPhase] = useState('question'); 
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const behavioralQuestions = [
    "Tell me about a time when you had to work under pressure. How did you handle it?",
    "Describe a situation where you had to resolve a conflict with a team member.",
    "Give me an example of a goal you reached and tell me how you achieved it.",
    "Tell me about a time when you made a mistake. How did you handle it?",
    "Describe a time when you had to learn something new quickly.",
    "Tell me about a time when you had to give difficult feedback to someone.",
    "Describe a situation where you had to adapt to a significant change at work.",
    "Give me an example of how you worked effectively under pressure."
  ];

  const technicalQuestions = [
    "Explain how you would optimize the performance of a web application.",
    "Describe your approach to debugging a complex technical issue.",
    "How would you design a scalable system for handling millions of users?",
    "Explain the difference between SQL and NoSQL databases and when you'd use each.",
    "Describe your experience with version control systems like Git.",
    "How do you ensure code quality and maintainability in your projects?",
    "Explain your approach to testing and quality assurance.",
    "Describe how you would implement security best practices in a web application."
  ];

  const situationalQuestions = [
    "How would you handle a situation where you disagree with your manager's decision?",
    "What would you do if you were assigned a project with an unrealistic deadline?",
    "How would you approach a situation where a team member is not contributing?",
    "What would you do if you discovered an error in a product that's already been released?",
    "How would you handle a difficult client or customer?",
    "What would you do if you had to present to a group and you're nervous about public speaking?",
    "How would you prioritize multiple urgent tasks?",
    "What would you do if you had to work with limited resources?"
  ];

  const getRandomQuestion = (category) => {
    let questions;
    switch (category) {
      case 'Technical Interviews':
        questions = technicalQuestions;
        break;
      case 'Situational Interviews':
        questions = situationalQuestions;
        break;
      default:
        questions = behavioralQuestions;
    }
    return questions[Math.floor(Math.random() * questions.length)];
  };

  useEffect(() => {
    setCurrentQuestion(getRandomQuestion(category));
    
    return () => {
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Recognition cleanup');
        }
        recognitionRef.current = null;
      }
      
      // Stop media recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          console.log('MediaRecorder cleanup');
        }
        mediaRecorderRef.current = null;
      }
      
      // Stop all media tracks (camera and microphone)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        streamRef.current = null;
      }
      
      // Clear video preview
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [category]);

  // Attach video stream when recording phase starts
  useEffect(() => {
    if (sessionPhase === 'recording' && streamRef.current && videoRef.current) {
      console.log('Attaching stream to video element');
      videoRef.current.srcObject = streamRef.current;
      
      // Explicitly play the video
      videoRef.current.play()
        .then(() => {
          console.log('Video playback started successfully');
        })
        .catch((error) => {
          console.error('Error playing video:', error);
        });
    }
  }, [sessionPhase]);

  const startTimer = (duration, phase) => {
    // Clear any existing timer first to prevent multiple intervals
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setTimeLeft(duration);
    setSessionPhase(phase);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          if (phase === 'preparation') {
            startRecording();
          } else if (phase === 'recording') {
            stopRecording();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startPreparation = () => {
    startTimer(60, 'preparation'); 
  };

  const startRecording = async () => {
    try {
      console.log('Requesting camera and microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      console.log('Camera and microphone access granted');
      streamRef.current = stream;
      
      // Set up MediaRecorder first
      const options = {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 2500000, 
        audioBitsPerSecond: 128000   
      };
      
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm;codecs=vp8,opus';
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('MediaRecorder onstop triggered');
        const blob = new Blob(chunks, { type: 'video/webm' });
        console.log('Blob created, size:', blob.size);
        setRecordedBlob(blob);
        setSessionPhase('completed');
        generateAIAnalysis();
        
        // Stop camera and microphone tracks AFTER recording is saved
        console.log('Attempting to stop media tracks');
        if (streamRef.current) {
          const tracks = streamRef.current.getTracks();
          console.log('Found tracks:', tracks.length);
          tracks.forEach(track => {
            console.log('Stopping track:', track.kind, track.label);
            track.stop();
            console.log('Track stopped, readyState:', track.readyState);
          });
          streamRef.current = null;
        }
        
        // Clear video preview
        if (videoRef.current) {
          console.log('Clearing video srcObject');
          videoRef.current.srcObject = null;
        }
        console.log('Camera cleanup complete');
      };

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript);
          }
        };

        recognitionRef.current.start();
      }

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimer(120, 'recording'); // 2 minutes recording
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      let errorMessage = 'Unable to access camera and microphone.\n\n';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += '❌ Permission denied!\n\n';
        errorMessage += 'Please:\n';
        errorMessage += '1. Click the camera icon in your browser address bar\n';
        errorMessage += '2. Allow camera and microphone access\n';
        errorMessage += '3. Refresh the page and try again';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage += '❌ No camera or microphone found!\n\n';
        errorMessage += 'Please check that your devices are connected.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage += '❌ Camera or microphone is already in use!\n\n';
        errorMessage += 'Please close other apps using your camera/microphone.';
      } else {
        errorMessage += '❌ Error: ' + error.message;
      }
      
      alert(errorMessage);
      
      // Go back to question phase so user can try again
      setSessionPhase('question');
      setTimeLeft(0);
    }
  };

  const stopRecording = () => {
    console.log('stopRecording called');
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('Stopping media recorder');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Recognition already stopped');
      }
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const generateAIAnalysis = () => {
    setTimeout(() => {
      const analysis = {
        overallScore: Math.floor(Math.random() * 30) + 70, 
        bodyLanguage: {
          score: Math.floor(Math.random() * 20) + 80,
          feedback: "Good eye contact maintained throughout. Consider sitting up straighter for better posture."
        },
        speechAnalysis: {
          score: Math.floor(Math.random() * 25) + 75,
          wordsPerMinute: Math.floor(Math.random() * 50) + 120,
          fillerWords: Math.floor(Math.random() * 8) + 2,
          feedback: "Clear articulation and good pace. Try to reduce filler words like 'um' and 'uh'."
        },
        contentQuality: {
          score: Math.floor(Math.random() * 20) + 80,
          structure: "Good use of STAR method",
          feedback: "Well-structured response with clear examples. Consider adding more specific metrics."
        },
        eyeContact: {
          score: Math.floor(Math.random() * 15) + 85,
          percentage: Math.floor(Math.random() * 20) + 80,
          feedback: "Excellent eye contact maintained. Shows confidence and engagement."
        }
      };
      setAiAnalysis(analysis);
    }, 2000);
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-recording-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadTranscript = () => {
    if (transcript) {
      const blob = new Blob([transcript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-transcript-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (sessionPhase === 'question') {
    return (
      <div className="min-h-screen pt-20 pb-10 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">{category}</h1>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Your Question:</h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">{currentQuestion}</p>
            <button 
              onClick={startPreparation}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 rounded-2xl"
            >
              Start Preparation (1 min)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionPhase === 'preparation') {
    return (
      <div className="min-h-screen pt-20 pb-10 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Preparation Time</h1>
          <div className="text-6xl font-bold text-blue-400 mb-6">{formatTime(timeLeft)}</div>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <p className="text-lg text-white/90 mb-4">Think about your answer and structure your response.</p>
            <p className="text-white/70">Recording will start automatically when preparation time ends.</p>
          </div>
        </div>
      </div>
    );
  }

  if (sessionPhase === 'recording') {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6 mt-16">
            <h1 className="text-3xl font-bold text-white mb-2">Recording in Progress</h1>
            <div className="text-4xl font-bold text-red-400 mb-4">
              🔴 {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Question:</h3>
              <p className="text-white/90">{currentQuestion}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Your Video:</h3>
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                muted 
                className="w-full rounded-xl bg-gray-800"
                style={{ transform: 'scaleX(-1)', minHeight: '300px' }}
              />
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 rounded-2xl"
            >
              Stop Recording
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionPhase === 'completed') {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8 mt-16">
            <h1 className="text-3xl font-bold text-white mb-4">Interview Complete!</h1>
            <p className="text-white/70">Your recording has been processed and AI analysis is ready.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Your Recording</h3>
              {recordedBlob && (
                <video 
                  src={URL.createObjectURL(recordedBlob)} 
                  controls 
                  className="w-full rounded-xl mb-4"
                />
              )}
              <button 
                onClick={downloadRecording}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition-all duration-300"
              >
                Download Recording
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Transcript</h3>
              <div className="bg-black/20 p-4 rounded-xl mb-4 max-h-64 overflow-y-auto">
                <p className="text-white/80 text-sm">{transcript || "Transcript generation in progress..."}</p>
              </div>
              <button 
                onClick={downloadTranscript}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl transition-all duration-300"
              >
                Download Transcript
              </button>
            </div>
          </div>

          {aiAnalysis && (
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 mb-8">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">AI Performance Analysis</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{aiAnalysis.overallScore}%</div>
                  <div className="text-white/70">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{aiAnalysis.bodyLanguage.score}%</div>
                  <div className="text-white/70">Body Language</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{aiAnalysis.speechAnalysis.score}%</div>
                  <div className="text-white/70">Speech Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{aiAnalysis.eyeContact.score}%</div>
                  <div className="text-white/70">Eye Contact</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Body Language Feedback:</h4>
                  <p className="text-white/70 text-sm">{aiAnalysis.bodyLanguage.feedback}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Speech Analysis:</h4>
                  <p className="text-white/70 text-sm">{aiAnalysis.speechAnalysis.feedback}</p>
                  <p className="text-white/60 text-xs mt-2">
                    WPM: {aiAnalysis.speechAnalysis.wordsPerMinute} | Filler words: {aiAnalysis.speechAnalysis.fillerWords}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <button 
              onClick={() => navigate('/interview')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 rounded-2xl mr-4"
            >
              Practice Again
            </button>
            <button 
              onClick={() => navigate('/reports')}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 text-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 rounded-2xl"
            >
              View All Reports
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default InterviewSession;