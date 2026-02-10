'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user.name || 'User'}</h2>
              <p className="text-slate-600">{user.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
              <h3 className="text-slate-600 text-sm mb-2 font-semibold">Member Since</h3>
              <p className="text-xl font-bold text-slate-900">
                {new Date(user.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
              <h3 className="text-slate-600 text-sm mb-2 font-semibold">User ID</h3>
              <p className="text-sm font-mono text-slate-700">{user.id.substring(0, 8)}...</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
            <p className="text-slate-600 font-semibold">Practice Sessions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
            <p className="text-slate-600 font-semibold">Reports Generated</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">0</div>
            <p className="text-slate-600 font-semibold">Avg. Score</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b-2 border-slate-200">
              <div>
                <h3 className="text-slate-900 font-bold">Email Address</h3>
                <p className="text-slate-600 text-sm">{user.email}</p>
              </div>
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors text-sm">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-b-2 border-slate-200">
              <div>
                <h3 className="text-slate-900 font-bold">Password</h3>
                <p className="text-slate-600 text-sm">••••••••</p>
              </div>
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors text-sm">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <h3 className="text-slate-900 font-bold">Delete Account</h3>
                <p className="text-slate-600 text-sm">Permanently delete your account and data</p>
              </div>
              <button className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
