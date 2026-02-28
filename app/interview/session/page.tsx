'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { extractAudioFromVideo, analyzeAudio, AudioAnalysisResult } from '@/lib/audioUtils'
import AttentionTracker, { AttentionMetrics } from '@/components/AttentionTracker'
import TranscriptCapture from '@/components/TranscriptCapture'
import InterviewAnalysisResults from '@/components/InterviewAnalysisResults'

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
  const [liveTranscript, setLiveTranscript] = useState<string>('')
  const [attentionMetrics, setAttentionMetrics] = useState<AttentionMetrics | null>(null)
  
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

      mediaRecorder.onstop = async () => {
        console.log('📹 MediaRecorder stopped, saving blob...')
        const blob = new Blob(chunks, { type: 'video/webm' })
        setRecordedBlob(blob)
        setSessionPhase('completed')
        
        // Ensure camera is stopped even if stopRecording didn't do it
        stopCamera()
        
        // Automatically analyze audio
        console.log('🎤 Starting automatic audio analysis...')
        setIsAnalyzing(true)
        try {
          const audioBlob = await extractAudioFromVideo(blob)
          const result = await analyzeAudio(audioBlob)
          setAnalysisResult(result)
          console.log('✅ Audio analysis complete')
        } catch (error) {
          console.error('❌ Audio analysis error:', error)
        } finally {
          setIsAnalyzing(false)
        }
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
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left side - Question and Timer */}
            <div className="lg:col-span-2 space-y-6">
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

              {/* Video Feed */}
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

            {/* Right side - Live Metrics */}
            <div className="space-y-6">
              {/* Attention Tracker - Running in background, UI hidden */}
              <AttentionTracker 
                videoRef={videoRef}
                isActive={sessionPhase === 'recording'}
                showUI={false}
                onMetricsUpdate={setAttentionMetrics}
              />

              {/* Recording Status Indicator */}
              {sessionPhase === 'recording' && (
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Tracking Active</h3>
                      <p className="text-xs text-muted-foreground">Recording attention metrics...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Transcript Capture - Active during recording */}
              <TranscriptCapture 
                isActive={sessionPhase === 'recording'}
                onTranscriptUpdate={setLiveTranscript}
              />
            </div>
          </div>
        )}

        {sessionPhase === 'completed' && recordedBlob && (
          <div className="space-y-6">
            {/* Success Message */}
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
              
              {isAnalyzing && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <span className="text-blue-600 font-semibold">🎤 Analyzing your audio delivery...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Comprehensive Analysis Results */}
            <InterviewAnalysisResults
              attentionMetrics={attentionMetrics}
              audioAnalysis={analysisResult}
              transcript={liveTranscript}
            />

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
