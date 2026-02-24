'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import {
  MessagesSquare,
  Code2,
  ClipboardList,
  Clock,
  Video,
  BrainCircuit,
  BarChart3
} from "lucide-react"
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
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
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
      icon: <BrainCircuit className="w-6 h-6 text-primary" />,
      examples: ["Tell me about a time when...", "Describe a situation where...", "How did you handle..."]
    },
    {
      title: "Technical Interviews", 
      description: "Test your technical skills and problem-solving abilities",
      icon: <Code2 className="w-6 h-6 text-primary" />,
      examples: ["Coding challenges", "System design", "Technical concepts"]
    },
    {
      title: "Situational Interviews",
      description: "Practice handling hypothetical workplace scenarios",
      icon: <MessagesSquare className="w-6 h-6 text-primary" />,
      examples: ["What would you do if...", "How would you approach...", "In this scenario..."]
    }
  ]

  return (
    <div className="mt-0 min-h-screen bg-background noise-bg pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Interview Type
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Select the type of interview you want to practice. Each session includes 1 minute of preparation time 
            followed by 2 minutes of recording with AI-powered analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {interviewCategories.map((category, index) => (
            <div key={index} className="bg-card border border-border rounded-xl shadow-sm p-8 hover:border-primary/30 hover:shadow-[0_0_20px_oklch(0.72_0.19_180/0.1)] transition-all duration-300 transform hover:scale-[1.02]">
              <div className="text-center">
                {category.icon && <div className="text-5xl mb-4 justify-center flex">{category.icon}</div>}
                <h3 className="text-2xl font-bold text-foreground mb-4">{category.title}</h3>
                <p className="text-muted-foreground mb-6">{category.description}</p>
                
                <div className="mb-6">
                  <p className="text-sm text-foreground mb-3 font-semibold">Example Questions:</p>
                  <ul className="text-left text-sm text-muted-foreground space-y-2">
                    {category.examples.map((example, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/interview/session?category=${encodeURIComponent(category.title)}`}
                  className="inline-block w-full"
                >
                  <button className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl transition-all duration-200 shadow-[0_0_20px_oklch(0.72_0.19_180/0.3)]">
                    Start Practice
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">What to Expect</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">1 Minute Prep Time</h3>
                <p className="text-muted-foreground text-sm">Read the question carefully and organize your thoughts</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Video className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">2 Minutes Recording</h3>
                <p className="text-muted-foreground text-sm">Answer the question while being recorded</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Analysis</h3>
                <p className="text-muted-foreground text-sm">Get instant feedback powered by advanced AI</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Detailed Report</h3>
                <p className="text-muted-foreground text-sm">Review comprehensive analysis and suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
