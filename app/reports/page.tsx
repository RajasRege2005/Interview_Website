'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
export default function ReportsPage() {
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

  const reports: any[] = []

  return (
    <div className="min-h-screen bg-background noise-bg pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Interview Reports
          </h1>
          <p className="text-lg text-muted-foreground">
            Review your past interview sessions and track your progress
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="bg-card border border-border rounded-xl shadow-xl p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4">
              <BarChart3 className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">No Reports Yet</h2>
            <p className="text-muted-foreground mb-8">
              Complete an interview session to see your detailed performance analysis here
            </p>
            <button
              onClick={() => router.push('/interview')}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-[0_0_20px_oklch(0.72_0.19_180/0.3)] hover:shadow-[0_0_30px_oklch(0.72_0.19_180/0.5)]"
            >
              Start Your First Interview
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report: any, index: number) => (
              <div key={index} className="bg-card border border-border rounded-xl shadow-sm p-6 hover:border-primary/30 hover:shadow-[0_0_20px_oklch(0.72_0.19_180/0.1)] transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground font-semibold">{report.date}</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                    {report.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-2">{report.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Score: </span>
                    <span className="text-2xl font-bold text-foreground font-mono">{report.score}%</span>
                  </div>
                </div>

                <button className="w-full py-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors text-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
