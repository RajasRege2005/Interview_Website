'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft } from 'lucide-react'

export default function ProblemDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [problem, setProblem] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    const fetchProblem = async () => {
      const slug = params.slug as string
      if (!slug) return
      
      setLoading(true)
      const { data, error } = await supabase
        .from('coding_questions')
        .select('*')
        .eq('title_slug', slug)
        .single()
        
      if (error) {
        console.error('Error fetching problem details:', error)
      } else {
        setProblem(data)
      }
      setLoading(false)
    }

    fetchProblem()
  }, [params.slug])

  if (loading || authLoading) {
    return <div className="container mx-auto p-8 text-center text-xl">Loading problem details...</div>
  }

  if (!problem) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Problem not found</h1>
        <Link href="/coding" className="text-primary hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Challenges
        </Link>
      </div>
    )
  }

  const tags = typeof problem.topic_tags === 'string' ? JSON.parse(problem.topic_tags) : problem.topic_tags || []
  const hints = typeof problem.hints === 'string' ? JSON.parse(problem.hints) : problem.hints || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <Link href="/coding" className="text-primary hover:underline flex items-center gap-2 mb-6 group w-max">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Challenges
      </Link>

      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
          <h1 className="text-3xl font-bold text-foreground">
            {problem.frontend_id}. {problem.title}
          </h1>
          <div className={`px-4 py-1 rounded-full text-sm font-semibold border ${
            problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
            problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
            'bg-red-500/10 text-red-500 border-red-500/20'
          }`}>
            {problem.difficulty}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {tags.map((tag: any, idx: number) => (
              <span key={idx} className="bg-muted px-3 py-1 rounded-md text-xs text-muted-foreground font-medium">
                {tag.name || tag}
              </span>
            ))}
          </div>
        )}

        <div 
          className="prose prose-invert max-w-none 
                    prose-pre:bg-muted prose-pre:text-muted-foreground prose-pre:border prose-pre:border-border
                    prose-a:text-primary prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1 prose-code:rounded
                    prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: problem.content }} 
        />
        
      </div>
      
      {hints.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Hints</h3>
          <div className="grid gap-3">
            {hints.map((hint: string, index: number) => (
              <details key={index} className="bg-card border border-border rounded-lg group">
                <summary className="p-4 font-medium cursor-pointer list-none flex justify-between items-center">
                  <span>Hint {index + 1}</span>
                  <span className="transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="p-4 pt-0 text-muted-foreground border-t border-border mt-2" dangerouslySetInnerHTML={{ __html: hint }} />
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
