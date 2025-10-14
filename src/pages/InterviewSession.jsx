import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/moving-border';
import { 
  IconMicrophone, 
  IconMicrophoneOff, 
  IconVideo, 
  IconVideoOff,
  IconClock,
  IconCheck,
  IconArrowLeft,
  IconDownload,
  IconPlayerRecord,
  IconPlayerStop
} from '@tabler/icons-react';

const InterviewSession = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get interview data from navigation state
  const { category, questions, title } = location.state || {};
  
  // Session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phase, setPhase] = useState('preparation'); // 'preparation', 'recording', 'completed'
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds prep time
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [recordings, setRecordings] = useState([]);
  const [transcripts, setTranscripts] = useState([]);
  
  // Refs for media
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (timeLeft > 0 && (phase === 'preparation' || phase === 'recording')) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handlePhaseTransition();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, phase]);

  // Initialize camera and microphone
  useEffect(() => {
    initializeMedia();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Please allow camera and microphone access to continue with the interview.');
    }
  };

  const handlePhaseTransition = () => {
    if (phase === 'preparation') {
      setPhase('recording');
      setTimeLeft(120); // 2 minutes for recording
      startRecording();
    } else if (phase === 'recording') {
      stopRecording();
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setPhase('preparation');
        setTimeLeft(60);
      } else {
        setPhase('completed');
      }
    }
  };

  const startRecording = async () => {
    if (streamRef.current) {
      try {
        recordedChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(streamRef.current, {
          mimeType: 'video/webm;codecs=vp8,opus'
        });
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, {
            type: 'video/webm'
          });
          const url = URL.createObjectURL(blob);
          setRecordings(prev => [...prev, { 
            questionIndex: currentQuestionIndex,
            blob,
            url,
            question: questions[currentQuestionIndex]
          }]);
          
          // Simulate transcript generation (in real app, use speech-to-text API)
          generateMockTranscript(currentQuestionIndex);
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const generateMockTranscript = (questionIndex) => {
    // Mock transcript - in real app, integrate with speech-to-text service
    const mockTranscripts = [
      "Thank you for the question. In my previous role, I faced a significant challenge when our main database crashed during peak business hours. I immediately assembled a crisis team, communicated with stakeholders about the situation, and worked with our IT team to restore service within 2 hours. We also implemented better backup procedures to prevent future issues.",
      "I believe effective communication is key when working with difficult team members. I once had a colleague who was resistant to new processes. I took the time to understand their concerns, found common ground, and worked together to find a solution that addressed both their needs and the project requirements.",
      "When facing tight deadlines, I prioritize tasks based on impact and urgency. For example, when we had to deliver a project two weeks early, I broke down the work into smaller chunks, identified critical path items, and coordinated with team members to ensure we met the deadline without compromising quality."
    ];
    
    const transcript = mockTranscripts[questionIndex % mockTranscripts.length];
    setTranscripts(prev => [...prev, {
      questionIndex,
      text: transcript,
      timestamp: new Date().toISOString()
    }]);
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const downloadRecording = (recording) => {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `interview_question_${recording.questionIndex + 1}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Session Not Found</h2>
          <p className="text-white/70 mb-6">Please start an interview from the main interview page.</p>
          <Button
            borderRadius="1rem"
            className="bg-blue-500/80 text-white px-6 py-3"
            onClick={() => navigate('/interview')}
          >
            Back to Interview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/interview')}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <IconArrowLeft className="w-5 h-5" />
            <span>Back to Interview</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-white/70">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <IconClock className="w-5 h-5 text-white/70" />
            <span className="text-white font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {phase !== 'completed' ? (
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Side - Question and Instructions */}
            <div className="space-y-6">
              
              {/* Current Question */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  {questions[currentQuestionIndex]}
                </p>
              </div>

              {/* Phase Instructions */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                {phase === 'preparation' ? (
                  <div className="text-center">
                    <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <IconClock className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Preparation Time</h3>
                    <p className="text-white/70">Take this time to think about your answer. Recording will start automatically when the timer ends.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-red-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <IconMicrophone className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Recording in Progress</h3>
                    <p className="text-white/70">Speak clearly and maintain eye contact with the camera. You have 2 minutes to answer.</p>
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="flex justify-between text-white/70 text-sm mb-2">
                  <span>Progress</span>
                  <span>{currentQuestionIndex + 1} / {questions.length}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Video and Controls */}
            <div className="space-y-6">
              
              {/* Video Feed */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-64 bg-black rounded-xl object-cover"
                  />
                  
                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500/90 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-sm font-medium">REC</span>
                    </div>
                  )}
                  
                  {/* Phase Indicator */}
                  <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium capitalize">
                      {phase === 'preparation' ? 'Prep Time' : 'Recording'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Media Controls */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      isVideoEnabled 
                        ? 'bg-white/20 text-white hover:bg-white/30' 
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    }`}
                  >
                    {isVideoEnabled ? <IconVideo className="w-6 h-6" /> : <IconVideoOff className="w-6 h-6" />}
                  </button>
                  
                  <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      isAudioEnabled 
                        ? 'bg-white/20 text-white hover:bg-white/30' 
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    }`}
                  >
                    {isAudioEnabled ? <IconMicrophone className="w-6 h-6" /> : <IconMicrophoneOff className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="text-center space-y-8">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
              <div className="bg-green-500/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <IconCheck className="w-10 h-10 text-green-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Interview Completed!</h2>
              <p className="text-xl text-white/70 mb-8">
                Great job! You've completed all {questions.length} questions.
              </p>

              {/* Recordings Summary */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-white">Your Recordings</h3>
                {recordings.map((recording, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                    <div className="text-left">
                      <h4 className="font-medium text-white">Question {index + 1}</h4>
                      <p className="text-white/70 text-sm">{recording.question.substring(0, 60)}...</p>
                    </div>
                    <button
                      onClick={() => downloadRecording(recording)}
                      className="flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300"
                    >
                      <IconDownload className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  borderRadius="1rem"
                  className="bg-white/10 text-white px-6 py-3 hover:bg-white/20 transition-all duration-300"
                  onClick={() => navigate('/interview')}
                >
                  Start New Interview
                </Button>
                <Button
                  borderRadius="1rem"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  onClick={() => navigate('/reports', { state: { sessionId, recordings, transcripts, category, title } })}
                >
                  View AI Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
