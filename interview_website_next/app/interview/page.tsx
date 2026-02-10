'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function InterviewPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

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

  const interviewCategories = [
    {
      title: "Behavioral Interviews",
      description: "Practice answering questions about your past experiences and behavior",
      icon: "🧠",
      examples: ["Tell me about a time when...", "Describe a situation where...", "How did you handle..."],
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Technical Interviews", 
      description: "Test your technical skills and problem-solving abilities",
      icon: "💻",
      examples: ["Coding challenges", "System design", "Technical concepts"],
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Situational Interviews",
      description: "Practice handling hypothetical workplace scenarios",
      icon: "🎯", 
      examples: ["What would you do if...", "How would you approach...", "In this scenario..."],
      color: "from-blue-500 to-blue-700"
    }
  ]

  return (
    <div className="mt-0 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Interview Type
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Select the type of interview you want to practice. Each session includes 1 minute of preparation time 
            followed by 2 minutes of recording with AI-powered analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {interviewCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{category.title}</h3>
                <p className="text-slate-600 mb-6">{category.description}</p>
                
                <div className="mb-6">
                  <p className="text-sm text-slate-700 mb-3 font-semibold">Example Questions:</p>
                  <ul className="text-left text-sm text-slate-600 space-y-2">
                    {category.examples.map((example, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/interview/session?category=${encodeURIComponent(category.title)}`}
                  className="inline-block w-full"
                >
                  <button className={`w-full py-3 bg-gradient-to-r ${category.color} hover:opacity-90 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl`}>
                    Start Practice
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">What to Expect</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">⏱️</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">1 Minute Prep Time</h3>
                <p className="text-slate-600 text-sm">Read the question carefully and organize your thoughts</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-3xl">🎥</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">2 Minutes Recording</h3>
                <p className="text-slate-600 text-sm">Answer the question while being recorded</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-3xl">🤖</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Analysis</h3>
                <p className="text-slate-600 text-sm">Get instant feedback on your performance</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Detailed Report</h3>
                <p className="text-slate-600 text-sm">Review comprehensive analysis and suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
