'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { extractAudioFromVideo, analyzeAudio, AudioAnalysisResult } from '@/lib/audioUtils'

function InterviewSessionContent() {
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get('category') || 'Behavioral Interviews'
  
  const [sessionPhase, setSessionPhase] = useState('question') 
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AudioAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const behavioralQuestions = [
    "Tell me about a time when you had to work under pressure. How did you handle it?",
    "Describe a situation where you had to resolve a conflict with a team member.",
    "Give me an example of a goal you reached and tell me how you achieved it.",
    "Tell me about a time when you made a mistake. How did you handle it?",
    "Describe a time when you had to learn something new quickly.",
    "Tell me about a time when you had to give difficult feedback to someone.",
    "Describe a situation where you had to adapt to a significant change at work.",
    "Give me an example of how you worked effectively under pressure."
  ]

  const technicalQuestions = [
    "Explain how you would optimize the performance of a web application.",
    "Describe your approach to debugging a complex technical issue.",
    "How would you design a scalable system for handling millions of users?",
    "Explain the difference between SQL and NoSQL databases and when you'd use each.",
    "Describe your experience with version control systems like Git.",
    "How do you ensure code quality and maintainability in your projects?",
    "Explain your approach to testing and quality assurance.",
    "Describe how you would implement security best practices in a web application."
  ]

  const situationalQuestions = [
    "How would you handle a situation where you disagree with your manager's decision?",
    "What would you do if you were assigned a project with an unrealistic deadline?",
    "How would you approach a situation where a team member is not contributing?",
    "What would you do if you discovered an error in a product that's already been released?",
    "How would you handle a difficult client or customer?",
    "What would you do if you had to present to a group and you're nervous about public speaking?",
    "How would you prioritize multiple urgent tasks?",
    "What would you do if you had to work with limited resources?"
  ]

  const getRandomQuestion = (cat: string) => {
    let questions
    switch (cat) {
      case 'Technical Interviews':
        questions = technicalQuestions
        break
      case 'Situational Interviews':
        questions = situationalQuestions
        break
      default:
        questions = behavioralQuestions
    }
    return questions[Math.floor(Math.random() * questions.length)]
  }

  const stopCamera = () => {
    console.log('🛑 Stopping camera...')
    
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks()
      tracks.forEach(track => {
        track.enabled = false
        track.stop()
      })
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
      videoRef.current.src = ''
      videoRef.current.load()
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null
    }

    console.log('✓ Camera stopped')
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    setCurrentQuestion(getRandomQuestion(category))
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      stopCamera()
    }
  }, [category])

  const startTimer = (duration: number, phase: string) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    setTimeLeft(duration)
    setSessionPhase(phase)
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          if (phase === 'preparation') {
            startRecording()
          } else if (phase === 'recording') {
            stopRecording()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startPreparation = () => {
    startTimer(60, 'preparation')
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        console.log('📹 MediaRecorder stopped, saving blob...')
        const blob = new Blob(chunks, { type: 'video/webm' })
        setRecordedBlob(blob)
        setSessionPhase('completed')
        
        // Ensure camera is stopped even if stopRecording didn't do it
        stopCamera()
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      startTimer(120, 'recording')
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access camera/microphone. Please grant permissions.')
    }
  }

  const stopRecording = () => {
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    setIsRecording(false)
  }


  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `interview-${Date.now()}.webm`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleAnalyzeAudio = async () => {
    if (!recordedBlob) {
      alert('No recording available to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const audioBlob = await extractAudioFromVideo(recordedBlob);
      const result = await analyzeAudio(audioBlob);
      
      setAnalysisResult(result);
    } catch (error) {
      console.error('Audio analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background noise-bg pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6 mt-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">{category}</h1>
          <div className="inline-block px-4 py-2 bg-card/60 backdrop-blur-sm rounded-lg border border-border">
            <span className="text-foreground text-sm font-semibold">
              {sessionPhase === 'question' && 'Read the question'}
              {sessionPhase === 'preparation' && 'Preparation Time'}
              {sessionPhase === 'recording' && 'Recording in Progress'}
              {sessionPhase === 'completed' && 'Session Complete'}
            </span>
          </div>
        </div>

        {sessionPhase === 'question' && (
          <>
            <div className="bg-card border border-border rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Question:</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">{currentQuestion}</p>
            </div>
            <div className="text-center">
              <button
                onClick={startPreparation}
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-[0_0_20px_oklch(0.72_0.19_180/0.3)] hover:shadow-[0_0_30px_oklch(0.72_0.19_180/0.5)] text-lg transform hover:scale-[1.02]"
              >
                Start Preparation (1 min)
              </button>
            </div>
          </>
        )}

        {(sessionPhase === 'preparation' || sessionPhase === 'recording') && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-3">Your Question:</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{currentQuestion}</p>
              </div>
              
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl shadow-xl p-8 text-center">
                <div className="text-5xl font-bold text-foreground font-mono mb-2">{formatTime(timeLeft)}</div>
                <p className="text-muted-foreground font-semibold">
                  {sessionPhase === 'preparation' ? 'Prepare your answer' : 'Recording your response'}
                </p>
              </div>
            </div>

            {/* Right side - Video Feed - ONLY RENDER DURING PREP/RECORDING */}
            <div className="bg-secondary rounded-2xl overflow-hidden shadow-2xl border-2 border-border">
              {(sessionPhase === 'preparation' || sessionPhase === 'recording') && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-video"
                />
              )}
            </div>
          </div>
        )}

        {sessionPhase === 'completed' && recordedBlob && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl shadow-xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-4">🎉 Great job!</h3>
              <p className="text-muted-foreground mb-6">Your interview session has been recorded successfully.</p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={downloadRecording}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-[0_0_20px_oklch(0.72_0.19_180/0.3)] hover:shadow-[0_0_30px_oklch(0.72_0.19_180/0.5)]"
                >
                  Download Recording
                </button>
                <button
                  onClick={handleAnalyzeAudio}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Delivery'}
                </button>
                <button
                  onClick={() => router.push('/interview')}
                  className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-xl transition-colors border border-border"
                >
                  Practice Another
                </button>
                <button
                  onClick={() => router.push('/reports')}
                  className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-xl transition-colors border border-border"
                >
                  View Reports
                </button>
              </div>
            </div>

            {/* Audio Analysis Results */}
            {analysisResult && (
              <div className="bg-card border border-border rounded-2xl shadow-xl p-8 mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-6">Delivery Analysis</h3>
                
                {/* No Speech Warning */}
                {analysisResult.note && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-yellow-600 mb-2">⚠️ {analysisResult.note}</h4>
                    <p className="text-muted-foreground text-sm">
                      The analysis could not detect any speech in your recording. Please ensure your microphone is working and speak clearly during the interview.
                    </p>
                  </div>
                )}
                
                {/* Transcript Display */}
                {analysisResult.transcript && analysisResult.transcript.length > 0 && (
                  <div className="bg-secondary/50 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-foreground mb-3">📝 Your Response</h4>
                    <p className="text-muted-foreground leading-relaxed">{analysisResult.transcript}</p>
                    {analysisResult.word_count && (
                      <div className="text-sm text-muted-foreground mt-3">
                        Word count: {analysisResult.word_count}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <div className="text-sm text-muted-foreground mb-1">Delivery Score</div>
                    <div className="text-3xl font-bold text-primary">{analysisResult.delivery_score}/100</div>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <div className="text-sm text-muted-foreground mb-1">Speech Rate</div>
                    <div className="text-3xl font-bold text-foreground">{analysisResult.speech_rate}</div>
                    <div className="text-xs text-muted-foreground">words/min</div>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <div className="text-sm text-muted-foreground mb-1">Long Pauses</div>
                    <div className="text-3xl font-bold text-foreground">{analysisResult.long_pauses}</div>
                    <div className="text-xs text-muted-foreground">pauses &gt; 0.8s</div>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <div className="text-sm text-muted-foreground mb-1">Pitch Variance</div>
                    <div className="text-3xl font-bold text-foreground">{analysisResult.pitch_variance}</div>
                    <div className="text-xs text-muted-foreground">confidence signal</div>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <div className="text-sm text-muted-foreground mb-1">Energy Variation</div>
                    <div className="text-3xl font-bold text-foreground">{analysisResult.energy_std}</div>
                  </div>
                </div>

                {/* Feedback based on scores */}
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
                  <h4 className="font-bold text-foreground mb-3">💡 Feedback</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    {analysisResult.delivery_score === 0 && analysisResult.note && (
                      <li className="text-yellow-600 font-semibold">⚠️ No speech detected - please check your microphone and speak during recording</li>
                    )}
                    {analysisResult.speech_rate > 0 && analysisResult.speech_rate < 130 && (
                      <li>• Try speaking a bit faster - aim for 130-170 words per minute</li>
                    )}
                    {analysisResult.speech_rate > 170 && (
                      <li>• Slow down slightly - you're speaking quite fast</li>
                    )}
                    {analysisResult.long_pauses > 4 && (
                      <li>• Reduce long pauses - practice your responses to improve flow</li>
                    )}
                    {analysisResult.pitch_variance < 80 && analysisResult.pitch_variance > 0 && (
                      <li>• Add more vocal variety - vary your pitch to show enthusiasm and engagement</li>
                    )}
                    {analysisResult.delivery_score >= 80 && (
                      <li className="text-green-600 font-semibold">✓ Excellent delivery! Keep up the great work!</li>
                    )}
                    {analysisResult.delivery_score >= 60 && analysisResult.delivery_score < 80 && (
                      <li>• Good delivery overall - review the specific metrics above for areas to improve</li>
                    )}
                    {analysisResult.delivery_score > 0 && analysisResult.delivery_score < 60 && (
                      <li>• Focus on improving the areas highlighted above - practice makes perfect!</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Recorded Video Preview */}
            <div className="bg-card border border-border rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Your Recording</h3>
              <div className="bg-secondary rounded-lg overflow-hidden border border-border">
                <video
                  src={URL.createObjectURL(recordedBlob)}
                  controls
                  className="w-full max-w-2xl mx-auto"
                />
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/interview')}
            className="text-muted-foreground hover:text-foreground transition-colors font-semibold"
          >
            ← Back to Interview Selection
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InterviewSessionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    }>
      <InterviewSessionContent />
    </Suspense>
  )
}
