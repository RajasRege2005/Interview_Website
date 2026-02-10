'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const reports: any[] = []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Interview Reports
          </h1>
          <p className="text-lg text-slate-300">
            Review your past interview sessions and track your progress
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">No Reports Yet</h2>
            <p className="text-slate-600 mb-8">
              Complete an interview session to see your detailed performance analysis here
            </p>
            <button
              onClick={() => router.push('/interview')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Start Your First Interview
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report: any, index: number) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-600 font-semibold">{report.date}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {report.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">{report.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Overall Score</span>
                    <span className="text-sm font-bold text-green-600">{report.score}%</span>
                  </div>
                </div>

                <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors text-sm">
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
