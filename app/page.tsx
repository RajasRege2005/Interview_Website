'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowRight, Zap } from 'lucide-react'
import { 
  Briefcase, 
  BrainCircuit, 
  BarChart3, 
  BookOpen 
} from "lucide-react"
export default function Home() {
  const { user } = useAuth()
  
  const features = [
    { icon:<Briefcase className="w-6 h-6 bg-black " />, title: 'Realistic Mock Interviews', desc: 'Practice with industry-standard questions and real interview scenarios' },
    { icon:<BrainCircuit className="w-6 h-6 bg-black" />, title: 'AI-Powered Feedback', desc: 'Get instant, detailed analysis of your responses and body language' },
    { icon:<BarChart3 className="w-6 h-6 bg-black" />, title: 'Performance Analytics', desc: 'Track your progress with comprehensive reports and insights' },
    { icon:<BookOpen className="w-6 h-6 bg-black" />, title: 'Expert Resources', desc: 'Access curated tips and strategies from top industry professionals' }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-background noise-bg">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/8 blur-3xl"
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-primary/3 blur-3xl"
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.19_180/0.08)_0%,transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20 text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary font-mono">AI-Powered Platform</span>
            <span className="text-sm text-muted-foreground">— Interview Mastery</span>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.05] mb-6 text-balance"
          >
            Ace Your Next
            <br />
            <span className="glow-text text-primary">Job Interview</span>
          </h1>

          <p
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 text-pretty"
          >
            Practice with AI, get instant feedback, and land your dream role with confidence. 
            Master behavioral, technical, and situational interviews.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href={user ? '/interview' : '/signup'}>
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_oklch(0.72_0.19_180/0.4)] hover:shadow-[0_0_50px_oklch(0.72_0.19_180/0.6)] transition-all text-base px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2">
                {user ? 'Start Practicing' : 'Get Started Free'}
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="border border-border bg-background hover:bg-secondary hover:border-primary/30 transition-all text-base px-8 py-4 rounded-xl text-foreground font-semibold"
            >
              Learn More
            </button>
          </div>

          <div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-border"
          >
            {[
              { value: '95%', label: 'Success Rate' },
              { value: '<2 min', label: 'Instant Feedback' },
              { value: '24/7', label: 'Practice Anytime' },
              { value: '100+', label: 'Question Bank' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 px-6">
                <span className="text-3xl md:text-4xl font-bold text-foreground font-mono">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section id="features" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive tools to prepare you for any interview
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-card border border-border rounded-xl p-8 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_oklch(0.72_0.19_180)]"
              >
                <div className="text-5xl mb-4 ">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get interview-ready in just a few simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {([
              { num: '01', title: 'Choose Your Path', desc: 'Select from behavioral, technical, or situational interviews' },
              { num: '02', title: 'Practice & Record', desc: 'Answer real interview questions with our AI system' },
              { num: '03', title: 'Get Feedback', desc: 'Receive detailed analysis and personalized tips' }
            ]).map((step, index) => (
              <div 
                key={index} 
                className="relative"
              >
                <div className="text-7xl font-bold text-primary/10 mb-4 font-mono glow-text text-[oklch(0.72_0.19_180)]">{step.num}</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.19_180/0.1)_0%,transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="bg-card border border-border rounded-2xl p-12 shadow-xl glow-border">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join thousands of professionals who improved their interview skills
            </p>
            <Link href="/signup">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-5 rounded-xl font-bold transition-all transform hover:scale-105 shadow-[0_0_30px_oklch(0.72_0.19_180/0.4)] text-lg inline-flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
