import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/moving-border';

function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({ users: 0, interviews: 0, success: 0 });

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Google",
      quote: "This platform helped me ace my technical interviews. The AI feedback was incredibly detailed and actionable!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Product Manager at Meta",
      quote: "The video analysis feature gave me insights I never knew I needed. Improved my confidence dramatically.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist at Netflix",
      quote: "Best interview prep tool I've used. The mock interviews felt so real, I was ready for anything.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "UX Designer at Apple",
      quote: "The personalized feedback helped me identify and fix my weak points. Landed my dream job in 3 weeks!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How does the AI feedback work?",
      answer: "Our AI analyzes your voice tone, speech patterns, body language, and content quality to provide comprehensive feedback on areas like confidence, clarity, and professionalism."
    },
    {
      question: "Can I practice different types of interviews?",
      answer: "Yes! We offer behavioral, technical, situational, and industry-specific interview questions across various fields including tech, finance, healthcare, and more."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. All your practice sessions are encrypted and stored securely. We never share your data with third parties, and you can delete your recordings anytime."
    },
    {
      question: "How long are the practice sessions?",
      answer: "Each session includes 1 minute of prep time followed by 2 minutes of response time, mimicking real interview conditions."
    },
    {
      question: "What kind of reports do I get?",
      answer: "You'll receive detailed reports covering speech analysis, body language assessment, content quality scoring, and personalized improvement recommendations."
    },
    {
      question: "Can I download my practice recordings?",
      answer: "Yes, you can download both your video recordings and detailed PDF reports for offline review and continuous improvement."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const animateStats = () => {
      const targetStats = { users: 50000, interviews: 250000, success: 89 };
      const duration = 2000;
      const steps = 60;
      const increment = {
        users: targetStats.users / steps,
        interviews: targetStats.interviews / steps,
        success: targetStats.success / steps
      };

      let currentStep = 0;
      const timer = setInterval(() => {
        if (currentStep >= steps) {
          setStats(targetStats);
          clearInterval(timer);
          return;
        }
        
        setStats({
          users: Math.floor(increment.users * currentStep),
          interviews: Math.floor(increment.interviews * currentStep),
          success: Math.floor(increment.success * currentStep)
        });
        currentStep++;
      }, duration / steps);
    };

    const timeout = setTimeout(animateStats, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-10">
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16 mt-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Master Your
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Interview Skills</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto mb-8 leading-relaxed">
            Welcome to the ultimate interview preparation platform. Practice mock interviews, 
            get AI-powered feedback, and land your dream job with confidence.
          </p>
          
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold text-white mb-4">Voice Recording</h3>
            <p className="text-white/70">Practice speaking clearly with high-quality audio recording and analysis</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-white mb-4">Video Analysis</h3>
            <p className="text-white/70">Get feedback on body language, eye contact, and presentation skills</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-white mb-4">AI Feedback</h3>
            <p className="text-white/70">Receive detailed reports and personalized improvement recommendations</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
              {stats.users.toLocaleString()}+
            </div>
            <p className="text-white/70 text-lg">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
              {stats.interviews.toLocaleString()}+
            </div>
            <p className="text-white/70 text-lg">Practice Interviews</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
              {stats.success}%
            </div>
            <p className="text-white/70 text-lg">Success Rate</p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">What Our Users Say</h2>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              
              <blockquote className="text-xl text-white/90 mb-6 italic">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="text-white font-semibold">
                {testimonials[currentTestimonial].name}
              </div>
              <div className="text-white/60">
                {testimonials[currentTestimonial].role}
              </div>
            </div>
            
            {/* Testimonial Navigation Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-blue-400' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-white/10 last:border-b-0">
                  <details className="group p-6">
                    <summary className="flex justify-between items-center cursor-pointer text-white font-semibold text-lg hover:text-blue-300 transition-colors duration-300">
                      {faq.question}
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        ↓
                      </span>
                    </summary>
                    <div className="mt-4 text-white/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">How It Works</h2>
          
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-6 min-w-max px-4">
              {[
                { step: 1, title: "Choose Category", desc: "Select from behavioral, technical, or situational interviews", icon: "📋" },
                { step: 2, title: "Get Question", desc: "Receive a tailored question based on your selection", icon: "❓" },
                { step: 3, title: "Prepare (1 min)", desc: "Take time to think and structure your response", icon: "⏱️" },
                { step: 4, title: "Record (2 min)", desc: "Give your answer with video and audio recording", icon: "🎬" },
                { step: 5, title: "AI Analysis", desc: "Our AI analyzes your performance in real-time", icon: "🤖" },
                { step: 6, title: "Get Feedback", desc: "Receive detailed reports and improvement tips", icon: "📊" }
              ].map((item) => (
                <div key={item.step} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center min-w-72 hover:bg-white/15 transition-all duration-300">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-8 rounded-2xl border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Ace Your Next Interview?</h2>
            <p className="text-xl text-white/70 mb-8">Join thousands of professionals improving their interview skills</p>
            
            <Link to="/interview">
              <Button
                borderRadius="1rem"
                className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 transition-all duration-300 px-4 py-2 text-sm font-medium cursor-pointer"
              >
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;