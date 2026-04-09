'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'

export default function CodingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [questions, setQuestions] = useState<any[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All')
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 100

  const toggleDone = async (questionId: number, currentDone: boolean) => {
    const currentStatus = Boolean(currentDone)
    const newDoneState = !currentStatus
    
    const updateState = (prev: any[]) => prev.map(q => q.id === questionId ? { ...q, done: newDoneState } : q)
    setQuestions(updateState)
    setFilteredQuestions(updateState)

    const { error } = await supabase
      .from('coding_questions')
      .update({ done: newDoneState })
      .eq('id', questionId)
      
    if (error) {
      console.error('Error updating done status:', error)
      const revertState = (prev: any[]) => prev.map(q => q.id === questionId ? { ...q, done: currentStatus } : q)
      setQuestions(revertState)
      setFilteredQuestions(revertState)
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true)
      setFetchError(null)
      const { data, error } = await supabase
        .from('coding_questions')
        .select('id, frontend_id, title, title_slug, difficulty, topic_tags, done')
        .order('id', { ascending: true })
        
      if (error) {
        console.error('Error fetching questions:', error)
        setFetchError(error.message)
      } else if (data) {
        const sortedData = data.sort((a, b) => {
          const idA = parseInt(a.frontend_id) || a.id
          const idB = parseInt(b.frontend_id) || b.id
          return idA - idB
        })
        setQuestions(sortedData)
        setFilteredQuestions(sortedData)
      }
      setLoadingQuestions(false)
    }

    fetchQuestions()
  }, [])

  useEffect(() => {
    if (filterDifficulty === 'All') {
      setFilteredQuestions(questions)
    } else {
      setFilteredQuestions(questions.filter(q => q.difficulty === filterDifficulty))
    }
    setPage(1) 
  }, [filterDifficulty, questions])

  const currentItems = filteredQuestions.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = currentItems.length < filteredQuestions.length

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Coding Challenges</h1>
      
      <div className="flex justify-center gap-4 mb-8">
        {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
          <button
            key={diff}
            onClick={() => setFilterDifficulty(diff)}
            className={`px-4 py-2 rounded-full border transition-all ${
              filterDifficulty === diff 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-card text-foreground hover:border-primary/50'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {loadingQuestions && questions.length === 0 ? (
        <div className="text-center text-muted-foreground">Loading challenges...</div>
      ) : fetchError ? (
        <div className="text-center text-red-500">Error: {fetchError}</div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center text-muted-foreground">No challenges found.</div>
      ) : (
        <>
          <div className="grid gap-4">
            {currentItems.map((question) => {
              const tags = typeof question.topic_tags === 'string' 
                ? JSON.parse(question.topic_tags) 
                : question.topic_tags || []
                
              const isSolved = Boolean(question.done)
                
              return (
                <div 
                  key={question.id}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 text-muted-foreground w-8 text-center font-mono">
                      #{question.frontend_id || question.id}
                    </div>
                    
                    <button 
                      className={`flex-shrink-0 focus:outline-none transition-colors ${isSolved ? 'text-green-500 hover:text-green-600' : 'text-muted-foreground hover:text-primary'}`}
                      title={isSolved ? "Mark as Not Done" : "Mark as Done"}
                      onClick={() => toggleDone(question.id, isSolved)}
                    >
                      {isSolved ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                    
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-3">
                        {question.title}
                        <span className={`text-xs px-2 py-1 rounded-md border font-semibold ${
                          question.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          question.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {question.difficulty}
                        </span>
                      </h3>
                      
                      <div className="flex gap-2 flex-wrap">
                        {Array.isArray(tags) && tags.slice(0, 4).map((tag: any, idx: number) => (
                          <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                            {tag.name || tag}
                          </span>
                        ))}
                        {Array.isArray(tags) && tags.length > 4 && (
                          <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                            +{tags.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link href={`/coding/${question.title_slug}`} className="w-full md:w-auto">
                    <button className="w-full md:w-auto px-6 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
                      View Challenge <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              )
            })}
          </div>
          
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => setPage(p => p + 1)}
                className="px-8 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors font-medium"
              >
                Load More Challenges
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}