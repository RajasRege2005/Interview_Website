import React from 'react';
import { Link } from 'react-router-dom';

function Interview() {
  const interviewCategories = [
    {
      title: "Behavioral Interviews",
      description: "Practice answering questions about your past experiences and behavior",
      icon: "🧠",
      examples: ["Tell me about a time when...", "Describe a situation where...", "How did you handle..."],
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Technical Interviews", 
      description: "Test your technical skills and problem-solving abilities",
      icon: "💻",
      examples: ["Coding challenges", "System design", "Technical concepts"],
      color: "from-purple-500 to-purple-700"
    },
    {
      title: "Situational Interviews",
      description: "Practice handling hypothetical workplace scenarios",
      icon: "🎯", 
      examples: ["What would you do if...", "How would you approach...", "In this scenario..."],
      color: "from-green-500 to-green-700"
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 mt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Interview Type
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Select the type of interview you want to practice. Each session includes 1 minute of preparation time 
            followed by 2 minutes of recording with AI-powered analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {interviewCategories.map((category, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{category.title}</h3>
                <p className="text-white/70 mb-6">{category.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white/90 mb-3">Example Questions:</h4>
                  <ul className="text-sm text-white/60 space-y-1">
                    {category.examples.map((example, i) => (
                      <li key={i}>• {example}</li>
                    ))}
                  </ul>
                </div>

                <Link 
                  to="/interview-session" 
                  state={{ category: category.title }}
                >
                  <button className={`w-full bg-gradient-to-r ${category.color} text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-300`}>
                    Start Practice
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">1</div>
              <h3 className="font-semibold text-white mb-2">Choose Category</h3>
              <p className="text-white/70 text-sm">Select the type of interview you want to practice</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">2</div>
              <h3 className="font-semibold text-white mb-2">Get Question</h3>
              <p className="text-white/70 text-sm">Receive a tailored question and prepare for 1 minute</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">3</div>
              <h3 className="font-semibold text-white mb-2">Record Answer</h3>
              <p className="text-white/70 text-sm">Answer the question in 2 minutes with video recording</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">4</div>
              <h3 className="font-semibold text-white mb-2">AI Analysis</h3>
              <p className="text-white/70 text-sm">Get detailed feedback and download your recording</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;