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
      <div className="max-w-4xl mx-auto px-6">

        <div className="bg-card border border-border rounded-xl shadow-xl p-8 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-3xl font-bold text-primary-foreground">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user.name || 'User'}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-secondary p-6 rounded-xl border border-border">
              <h3 className="text-sm text-muted-foreground mb-2">Member Since</h3>
              <p className="text-xl font-bold text-foreground font-mono">
                {new Date(user.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>

            <div className="bg-secondary p-6 rounded-xl border border-border">
              <h3 className="text-sm text-muted-foreground mb-2">User ID</h3>
              <p className="text-sm font-mono text-muted-foreground">{user.id.substring(0, 8)}...</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-foreground font-mono mb-2">0</div>
            <p className="text-sm text-muted-foreground">Practice Sessions</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-foreground font-mono mb-2">0</div>
            <p className="text-sm text-muted-foreground">Reports Generated</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-foreground font-mono mb-2">0</div>
            <p className="text-sm text-muted-foreground">Avg. Score</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div>
                <h3 className="text-foreground font-bold">Email Address</h3>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
              <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors text-sm">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-border">
              <div>
                <h3 className="text-foreground font-bold">Password</h3>
                <p className="text-muted-foreground text-sm">••••••••</p>
              </div>
              <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors text-sm">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <h3 className="text-foreground font-bold">Delete Account</h3>
                <p className="text-muted-foreground text-sm">Permanently delete your account and data</p>
              </div>
              <button className="px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive font-semibold rounded-lg transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
