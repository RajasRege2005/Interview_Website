'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, signOut, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    router.prefetch('/interview')
    router.prefetch('/reports')
    router.prefetch('/profile')
    router.prefetch('/coding')
    router.prefetch('/login')
    router.prefetch('/signup')
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    {label: 'Dashboard', href: '/dashboard'},
    { label: 'Coding', href: '/coding' },
    { label: 'Interview', href: '/interview' },
    { label: 'Reports', href: '/reports' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-lg'
          : 'bg-background/60 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Rehearse<span className="text-primary font-mono">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-4 py-2 text-sm transition-colors rounded-lg ${
                pathname === link.href
                  ? 'text-foreground bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => router.push('/profile')}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              >
                Profile
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_oklch(0.72_0.19_180/0.3)]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              >
                Log in
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_oklch(0.72_0.19_180/0.3)]"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-3 text-sm transition-colors rounded-lg ${
                  pathname === link.href
                    ? 'text-foreground bg-secondary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      router.push('/profile')
                      setMobileOpen(false)
                    }}
                    className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground text-left rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileOpen(false)
                    }}
                    className="px-4 py-3 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      router.push('/login')
                      setMobileOpen(false)
                    }}
                    className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground text-left rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      router.push('/signup')
                      setMobileOpen(false)
                    }}
                    className="px-4 py-3 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
