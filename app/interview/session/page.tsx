'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

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

  // Single centralized camera cleanup function
  const stopCamera = () => {
    console.log('🛑 Stopping camera...')
    
    // Stop all media tracks
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks()
      tracks.forEach(track => {
        track.enabled = false
        track.stop()
      })
      streamRef.current = null
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
      videoRef.current.src = ''
      videoRef.current.load()
    }

    // Clear MediaRecorder
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
        const blob = new Blob(chunks, { type: 'video/webm' })
        setRecordedBlob(blob)
        stopCamera()
        setSessionPhase('completed')
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
      mediaRecorderRef.current.stop() // This triggers onstop which calls stopCamera()
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6 mt-8">
          <h1 className="text-3xl font-bold text-white mb-3">{category}</h1>
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <span className="text-white text-sm font-semibold">
              {sessionPhase === 'question' && 'Read the question'}
              {sessionPhase === 'preparation' && 'Preparation Time'}
              {sessionPhase === 'recording' && 'Recording in Progress'}
              {sessionPhase === 'completed' && 'Session Complete'}
            </span>
          </div>
        </div>

        {sessionPhase === 'question' && (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Question:</h2>
              <p className="text-xl text-slate-700 leading-relaxed">{currentQuestion}</p>
            </div>
            <div className="text-center">
              <button
                onClick={startPreparation}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-xl hover:shadow-2xl text-lg transform hover:scale-[1.02]"
              >
                Start Preparation (1 min)
              </button>
            </div>
          </>
        )}

        {(sessionPhase === 'preparation' || sessionPhase === 'recording') && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left side - Question and Timer */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3">Your Question:</h2>
                <p className="text-lg text-slate-700 leading-relaxed">{currentQuestion}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
                <div className="text-5xl font-bold text-white mb-2">{formatTime(timeLeft)}</div>
                <p className="text-white/90 font-semibold">
                  {sessionPhase === 'preparation' ? 'Prepare your answer' : 'Recording your response'}
                </p>
              </div>
            </div>

            {/* Right side - Video Feed - ONLY RENDER DURING PREP/RECORDING */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
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
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">🎉 Great job!</h3>
              <p className="text-slate-600 mb-6">Your interview session has been recorded successfully.</p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={downloadRecording}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-lg"
                >
                  Download Recording
                </button>
                <button
                  onClick={() => router.push('/interview')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg"
                >
                  Practice Another
                </button>
                <button
                  onClick={() => router.push('/reports')}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors shadow-lg"
                >
                  View Reports
                </button>
              </div>
            </div>

            {/* Recorded Video Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Your Recording</h3>
              <div className="bg-slate-900 rounded-lg overflow-hidden">
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
            className="text-white/80 hover:text-white transition-colors font-semibold"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <InterviewSessionContent />
    </Suspense>
  )
}
