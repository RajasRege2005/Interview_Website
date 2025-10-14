import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/moving-border';
import { IconPlay, IconClock, IconUser, IconMicrophone, IconVideo, IconChartBar, IconBrain, IconCode, IconPuzzle } from '@tabler/icons-react';

const Interview = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('behavioral');

  // Redirect to login if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const interviewCategories = {
    behavioral: {
      title: 'Behavioral Interview',
      description: 'Practice STAR method and behavioral questions with AI feedback on communication skills',
      icon: <IconUser className="w-10 h-10" />,
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Beginner',
      duration: '15-20 min',
      questions: [
        "Tell me about a time when you faced a significant challenge at work.",
        "Describe a situation where you had to work with a difficult team member.",
        "Give me an example of when you had to meet a tight deadline.",
        "Tell me about a time when you made a mistake and how you handled it.",
        "Describe a situation where you showed leadership skills."
      ]
    },
    technical: {
      title: 'Technical Interview',
      description: 'Test your technical knowledge and problem-solving abilities with coding challenges',
      icon: <IconCode className="w-10 h-10" />,
      color: 'from-green-500 to-emerald-500',
      difficulty: 'Advanced', 
      duration: '25-30 min',
      questions: [
        "Explain the difference between synchronous and asynchronous programming.",
        "How would you optimize a slow database query?",
        "Describe the MVC architecture pattern and its benefits.",
        "What is the difference between REST and GraphQL APIs?",
        "Design a scalable web application architecture."
      ]
    },
    situational: {
      title: 'Situational Interview',
      description: 'Handle hypothetical workplace scenarios and demonstrate problem-solving skills',
      icon: <IconPuzzle className="w-10 h-10" />,
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Intermediate',
      duration: '20-25 min',
      questions: [
        "How would you handle a project falling behind schedule?",
        "What would you do if you disagreed with your manager's decision?",
        "How would you approach a completely unfamiliar task?",
        "How would you handle a colleague violating company policy?",
        "How do you manage competing priorities from different stakeholders?"
      ]
    }
  };

  const startInterview = (category) => {
    // Generate a unique session ID
    const sessionId = `${category}_${Date.now()}`;
    navigate(`/interview/session/${sessionId}`, { 
      state: { 
        category, 
        questions: interviewCategories[category].questions,
        title: interviewCategories[category].title
      } 
    });
  };

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Choose Your
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Interview Type
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto">
            Select the type of interview you want to practice and get AI-powered feedback on your performance
          </p>
        </div>

        {/* Interview Categories Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {Object.entries(interviewCategories).map(([key, category]) => (
            <div
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedCategory === key ? 'ring-2 ring-white/30' : ''
              }`}
            >
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 h-full">
                <div className={`bg-gradient-to-r ${category.color} p-6 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6`}>
                  {category.icon}
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-3">{category.title}</h3>
                  <p className="text-white/70 mb-4 leading-relaxed">{category.description}</p>
                  
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="bg-white/10 px-3 py-1 rounded-full">
                      <span className="text-white/80 text-sm">{category.difficulty}</span>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-full">
                      <span className="text-white/80 text-sm">{category.duration}</span>
                    </div>
                  </div>

                  <div className={`w-full h-1 bg-gradient-to-r ${category.color} rounded-full transition-all duration-300 ${
                    selectedCategory === key ? 'opacity-100' : 'opacity-30'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Category Details */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-10 mb-16">
          <div className="text-center mb-10">
            <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-r ${interviewCategories[selectedCategory].color} mb-6 shadow-2xl`}>
              {interviewCategories[selectedCategory].icon}
            </div>
            <h3 className="text-4xl font-bold text-white mb-4">
              {interviewCategories[selectedCategory].title}
            </h3>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              {interviewCategories[selectedCategory].description}
            </p>

            <div className="flex justify-center gap-6 mb-10">
              <div className="text-center">
                <div className="bg-white/10 p-4 rounded-2xl mb-2">
                  <IconClock className="w-6 h-6 text-blue-400 mx-auto" />
                </div>
                <div className="text-white/80 text-sm">Duration</div>
                <div className="text-white font-semibold">{interviewCategories[selectedCategory].duration}</div>
              </div>
              
              <div className="text-center">
                <div className="bg-white/10 p-4 rounded-2xl mb-2">
                  <IconBrain className="w-6 h-6 text-purple-400 mx-auto" />
                </div>
                <div className="text-white/80 text-sm">Difficulty</div>
                <div className="text-white font-semibold">{interviewCategories[selectedCategory].difficulty}</div>
              </div>
              
              <div className="text-center">
                <div className="bg-white/10 p-4 rounded-2xl mb-2">
                  <IconMicrophone className="w-6 h-6 text-green-400 mx-auto" />
                </div>
                <div className="text-white/80 text-sm">Questions</div>
                <div className="text-white font-semibold">{interviewCategories[selectedCategory].questions.length}</div>
              </div>
            </div>
          </div>

          {/* Sample Questions Preview */}
          <div className="mb-10">
            <h4 className="text-2xl font-semibold text-white mb-6 text-center">Sample Questions</h4>
            <div className="grid gap-4">
              {interviewCategories[selectedCategory].questions.slice(0, 3).map((question, index) => (
                <div key={index} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-r ${interviewCategories[selectedCategory].color} text-white font-bold text-sm px-3 py-1 rounded-full flex-shrink-0 mt-1`}>
                      {index + 1}
                    </div>
                    <p className="text-white/90 text-lg">{question}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Process Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-blue-500/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <IconClock className="w-8 h-8 text-blue-400" />
              </div>
              <h5 className="font-semibold text-white mb-2">1 Min Prep</h5>
              <p className="text-white/70 text-sm">Think about your answer</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <IconMicrophone className="w-8 h-8 text-green-400" />
              </div>
              <h5 className="font-semibold text-white mb-2">2 Min Answer</h5>
              <p className="text-white/70 text-sm">Record your response</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <IconChartBar className="w-8 h-8 text-purple-400" />
              </div>
              <h5 className="font-semibold text-white mb-2">AI Feedback</h5>
              <p className="text-white/70 text-sm">Get detailed analysis</p>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <Button
              borderRadius="1rem"
              className={`bg-gradient-to-r ${interviewCategories[selectedCategory].color} text-white px-8 py-4 text-lg font-semibold cursor-pointer transition-all duration-300 hover:scale-105`}
              onClick={() => startInterview(selectedCategory)}
            >
              <div className="flex items-center space-x-2">
                <IconPlay className="w-5 h-5" />
                <span>Start {interviewCategories[selectedCategory].title}</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Recent Interview Sessions</h3>
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Behavioral Interview</h4>
                <p className="text-white/70 text-sm">Completed 2 hours ago • Score: 8.5/10</p>
              </div>
              <Link to="/reports">
                <Button
                  borderRadius="0.5rem"
                  className="bg-white/10 text-white px-4 py-2 text-sm hover:bg-white/20 transition-all duration-300"
                >
                  View Report
                </Button>
              </Link>
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Technical Interview</h4>
                <p className="text-white/70 text-sm">Completed yesterday • Score: 7.8/10</p>
              </div>
              <Link to="/reports">
                <Button
                  borderRadius="0.5rem"
                  className="bg-white/10 text-white px-4 py-2 text-sm hover:bg-white/20 transition-all duration-300"
                >
                  View Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
