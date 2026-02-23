'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Card } from '@/components/ui/card'
export default function InterviewPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const categoriesAnimation = useScrollAnimation()

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
      icon: "🧠",
      examples: ["Tell me about a time when...", "Describe a situation where...", "How did you handle..."]
    },
    {
      title: "Technical Interviews", 
      description: "Test your technical skills and problem-solving abilities",
      icon: "💻",
      examples: ["Coding challenges", "System design", "Technical concepts"]
    },
    {
      title: "Situational Interviews",
      description: "Practice handling hypothetical workplace scenarios",
      icon: "🎯", 
      examples: ["What would you do if...", "How would you approach...", "In this scenario..."]
    }
  ]

  return (
    <div className="mt-0 min-h-screen bg-background noise-bg pt-20 pb-16 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-float"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 mt-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Interview Type
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Select the type of interview you want to practice. Each session includes 1 minute of preparation time 
            followed by 2 minutes of recording with AI-powered analysis.
          </p>
        </div>

        <div ref={categoriesAnimation.ref} className="grid md:grid-cols-3 gap-6 mb-12">
          {interviewCategories.map((category, index) => (
            <div 
              key={index} 
              className={`bg-card border border-border rounded-xl shadow-sm p-8 hover:border-primary/30 hover:shadow-[0_0_20px_oklch(0.72_0.19_180/0.1)] transition-all duration-700 transform hover:scale-[1.02] ${
                categoriesAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: categoriesAnimation.isVisible ? `${index * 150}ms` : '0ms' }}
            >
              <div className="text-center">
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
                  <button className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-200 shadow-[0_0_20px_oklch(0.72_0.19_180/0.3)]">
                    Start Practice
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
