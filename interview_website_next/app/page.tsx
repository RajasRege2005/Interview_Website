'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function Home() {
  const { user } = useAuth()
  const featuresAnimation = useScrollAnimation()
  const howItWorksAnimation = useScrollAnimation()
  const ctaAnimation = useScrollAnimation()
  
  const features = [
    { icon: '🎯', title: 'Realistic Mock Interviews', desc: 'Practice with industry-standard questions and real interview scenarios' },
    { icon: '🤖', title: 'AI-Powered Feedback', desc: 'Get instant, detailed analysis of your responses and body language' },
    { icon: '📊', title: 'Performance Analytics', desc: 'Track your progress with comprehensive reports and insights' },
    { icon: '🎓', title: 'Expert Resources', desc: 'Access curated tips and strategies from top industry professionals' }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-8 animate-fade-in">
            AI-Powered Interview Preparation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up" style={{animationDelay: '0.1s'}}>
            Ace Your Next
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Job Interview
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Practice with AI, get instant feedback, and land your dream role with confidence
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-slide-up" style={{animationDelay: '0.3s'}}>
            <Link href={user ? '/interview' : '/signup'}>
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50">
                {user ? 'Start Practicing' : 'Get Started Free'}
              </button>
            </Link>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div ref={featuresAnimation.ref} className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${featuresAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive tools to prepare you for any interview
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group p-8 rounded-2xl border-2 border-slate-100 hover:border-blue-500 transition-all hover:shadow-xl duration-700 ${featuresAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{transitionDelay: featuresAnimation.isVisible ? `${index * 150}ms` : '0ms'}}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-slate-50">
        <div ref={howItWorksAnimation.ref} className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${howItWorksAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-slate-600">
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
                className={`relative transition-all duration-700 ${howItWorksAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{transitionDelay: howItWorksAnimation.isVisible ? `${index * 200}ms` : '0ms'}}
              >
                <div className="text-7xl font-bold text-blue-100 mb-4">{step.num}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div ref={ctaAnimation.ref} className={`max-w-4xl mx-auto px-6 text-center transition-all duration-1000 ${ctaAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to land your dream job?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of professionals who improved their interview skills
          </p>
          <Link href="/signup">
            <button className="px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl text-lg">
              Start Free Trial
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
