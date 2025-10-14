import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/moving-border';
import { 
  IconEye, 
  IconMicrophone, 
  IconBrain, 
  IconChart, 
  IconDownload,
  IconArrowLeft,
  IconStar,
  IconTrendingUp,
  IconAlertCircle,
  IconCheckCircle
} from '@tabler/icons-react';

const Reports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [reportData, setReportData] = useState(null);

  // Get session data from navigation state or load from storage
  useEffect(() => {
    const sessionData = location.state;
    if (sessionData) {
      generateAIReport(sessionData);
    } else {
      // Load mock data for demonstration
      loadMockReportData();
    }
  }, [location.state]);

  const generateAIReport = (sessionData) => {
    // Simulate AI analysis - in real app, send data to AI service
    const mockReport = {
      sessionId: sessionData.sessionId,
      category: sessionData.category,
      title: sessionData.title,
      completedAt: new Date().toISOString(),
      overallScore: 8.3,
      scores: {
        bodyLanguage: 8.5,
        eyeContact: 7.8,
        speechClarity: 8.9,
        contentQuality: 8.2,
        confidence: 8.0,
        grammar: 8.7
      },
      insights: {
        strengths: [
          'Maintained excellent posture throughout the interview',
          'Clear and articulate speech patterns',
          'Provided structured responses with good examples',
          'Demonstrated confidence in technical knowledge'
        ],
        improvements: [
          'Increase eye contact with camera by 15%',
          'Reduce use of filler words ("um", "uh")',
          'Provide more specific quantitative examples',
          'Speak slightly slower for better clarity'
        ]
      },
      detailedAnalysis: {
        bodyLanguage: {
          score: 8.5,
          details: 'Excellent posture and professional appearance. Minimal fidgeting observed. Hand gestures were natural and complemented verbal communication.',
          recommendations: 'Continue maintaining good posture. Consider using more purposeful hand gestures to emphasize key points.'
        },
        eyeContact: {
          score: 7.8,
          details: 'Good eye contact overall with 78% camera engagement. Brief periods of looking away during complex explanations.',
          recommendations: 'Practice maintaining eye contact during explanations. Try to look at the camera even when thinking through complex topics.'
        },
        speechClarity: {
          score: 8.9,
          details: 'Very clear pronunciation and good pace. Minimal use of filler words. Voice projection was appropriate.',
          recommendations: 'Excellent clarity. Continue practicing to maintain this level of articulation under pressure.'
        },
        contentQuality: {
          score: 8.2,
          details: 'Responses were well-structured and relevant. Good use of STAR method in behavioral questions. Could benefit from more specific examples.',
          recommendations: 'Include more quantitative results in examples (percentages, timelines, team sizes, etc.)'
        }
      },
      questionAnalysis: sessionData.recordings?.map((recording, index) => ({
        questionNumber: index + 1,
        question: recording.question,
        score: Math.random() * 2 + 7, // Mock score between 7-9
        transcript: sessionData.transcripts?.[index]?.text || 'Transcript not available',
        feedback: [
          'Good structure and clear examples',
          'Could provide more specific metrics',
          'Confident delivery'
        ]
      })) || []
    };

    setReportData(mockReport);
  };

  const loadMockReportData = () => {
    // Mock report data for demonstration
    const mockReport = {
      sessionId: 'behavioral_demo',
      category: 'behavioral',
      title: 'Behavioral Interview',
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      overallScore: 8.3,
      scores: {
        bodyLanguage: 8.5,
        eyeContact: 7.8,
        speechClarity: 8.9,
        contentQuality: 8.2,
        confidence: 8.0,
        grammar: 8.7
      },
      insights: {
        strengths: [
          'Maintained excellent posture throughout the interview',
          'Clear and articulate speech patterns',
          'Provided structured responses with good examples',
          'Demonstrated confidence in technical knowledge'
        ],
        improvements: [
          'Increase eye contact with camera by 15%',
          'Reduce use of filler words ("um", "uh")',
          'Provide more specific quantitative examples',
          'Speak slightly slower for better clarity'
        ]
      },
      detailedAnalysis: {
        bodyLanguage: {
          score: 8.5,
          details: 'Excellent posture and professional appearance. Minimal fidgeting observed. Hand gestures were natural and complemented verbal communication.',
          recommendations: 'Continue maintaining good posture. Consider using more purposeful hand gestures to emphasize key points.'
        },
        eyeContact: {
          score: 7.8,
          details: 'Good eye contact overall with 78% camera engagement. Brief periods of looking away during complex explanations.',
          recommendations: 'Practice maintaining eye contact during explanations. Try to look at the camera even when thinking through complex topics.'
        },
        speechClarity: {
          score: 8.9,
          details: 'Very clear pronunciation and good pace. Minimal use of filler words. Voice projection was appropriate.',
          recommendations: 'Excellent clarity. Continue practicing to maintain this level of articulation under pressure.'
        },
        contentQuality: {
          score: 8.2,
          details: 'Responses were well-structured and relevant. Good use of STAR method in behavioral questions. Could benefit from more specific examples.',
          recommendations: 'Include more quantitative results in examples (percentages, timelines, team sizes, etc.)'
        }
      },
      questionAnalysis: [
        {
          questionNumber: 1,
          question: "Tell me about a time when you faced a significant challenge at work.",
          score: 8.4,
          transcript: "Thank you for the question. In my previous role, I faced a significant challenge when our main database crashed during peak business hours...",
          feedback: ['Good use of STAR method', 'Clear timeline provided', 'Could mention specific impact metrics']
        },
        {
          questionNumber: 2,
          question: "Describe a situation where you had to work with a difficult team member.",
          score: 8.1,
          transcript: "I believe effective communication is key when working with difficult team members...",
          feedback: ['Showed empathy and problem-solving', 'Good conflict resolution approach', 'Could provide more specific outcome']
        }
      ]
    };

    setReportData(mockReport);
  };

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'text-green-400';
    if (score >= 7.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score) => {
    if (score >= 8.5) return 'from-green-500 to-emerald-500';
    if (score >= 7.0) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const downloadReport = () => {
    const reportContent = `
AI Interview Analysis Report
============================

Session: ${reportData.title}
Date: ${new Date(reportData.completedAt).toLocaleDateString()}
Overall Score: ${reportData.overallScore}/10

DETAILED SCORES:
- Body Language: ${reportData.scores.bodyLanguage}/10
- Eye Contact: ${reportData.scores.eyeContact}/10
- Speech Clarity: ${reportData.scores.speechClarity}/10
- Content Quality: ${reportData.scores.contentQuality}/10
- Confidence: ${reportData.scores.confidence}/10
- Grammar: ${reportData.scores.grammar}/10

STRENGTHS:
${reportData.insights.strengths.map(s => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${reportData.insights.improvements.map(i => `• ${i}`).join('\n')}

QUESTION ANALYSIS:
${reportData.questionAnalysis.map(q => `
Question ${q.questionNumber}: ${q.question}
Score: ${q.score.toFixed(1)}/10
Feedback: ${q.feedback.join(', ')}
`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_report_${reportData.sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!reportData) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Generating AI Report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/interview')}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <IconArrowLeft className="w-5 h-5" />
            <span>Back to Interview</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">{reportData.title} Report</h1>
            <p className="text-white/70">
              Completed on {new Date(reportData.completedAt).toLocaleDateString()}
            </p>
          </div>
          
          <Button
            borderRadius="1rem"
            className="bg-white/10 text-white px-4 py-2 hover:bg-white/20 transition-all duration-300"
            onClick={downloadReport}
          >
            <div className="flex items-center space-x-2">
              <IconDownload className="w-4 h-4" />
              <span>Download Report</span>
            </div>
          </Button>
        </div>

        {/* Overall Score */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r ${getScoreBackground(reportData.overallScore)} mb-6`}>
              <div className="text-4xl font-bold text-white">
                {reportData.overallScore}
                <span className="text-xl">/10</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Overall Performance</h2>
            <p className="text-white/70 text-lg">
              {reportData.overallScore >= 8.5 ? 'Excellent performance! You\'re well-prepared for interviews.' :
               reportData.overallScore >= 7.0 ? 'Good performance with room for improvement.' :
               'Consider more practice to improve your interview skills.'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: IconChart },
            { id: 'detailed', label: 'Detailed Analysis', icon: IconBrain },
            { id: 'questions', label: 'Question Analysis', icon: IconMicrophone },
            { id: 'insights', label: 'Insights & Tips', icon: IconTrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white border border-white/40'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white mb-6">Performance Overview</h3>
              
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                {Object.entries(reportData.scores).map(([category, score]) => (
                  <div key={category} className="text-center">
                    <div className={`w-20 h-20 rounded-full border-4 border-current ${getScoreColor(score)} flex items-center justify-center mx-auto mb-3`}>
                      <span className="text-xl font-bold">{score}</span>
                    </div>
                    <h4 className="font-medium text-white capitalize">{category.replace(/([A-Z])/g, ' $1')}</h4>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/5 p-6 rounded-xl">
                  <IconStar className="w-8 h-8 text-yellow-400 mb-3" />
                  <h4 className="font-semibold text-white mb-2">Top Strength</h4>
                  <p className="text-white/70">Speech Clarity ({reportData.scores.speechClarity}/10)</p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-xl">
                  <IconTrendingUp className="w-8 h-8 text-green-400 mb-3" />
                  <h4 className="font-semibold text-white mb-2">Biggest Improvement</h4>
                  <p className="text-white/70">Eye Contact (+15%)</p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-xl">
                  <IconChart className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="font-semibold text-white mb-2">Questions Answered</h4>
                  <p className="text-white/70">{reportData.questionAnalysis.length} Questions</p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Analysis Tab */}
          {activeTab === 'detailed' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Detailed Analysis</h3>
              
              {Object.entries(reportData.detailedAnalysis).map(([category, analysis]) => (
                <div key={category} className="bg-white/5 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-white capitalize">
                      {category.replace(/([A-Z])/g, ' $1')}
                    </h4>
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getScoreBackground(analysis.score)}`}>
                      <span className="text-white font-medium">{analysis.score}/10</span>
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-4">{analysis.details}</p>
                  
                  <div className="bg-blue-500/10 p-4 rounded-lg border-l-4 border-blue-400">
                    <h5 className="font-medium text-blue-400 mb-2">Recommendation:</h5>
                    <p className="text-white/70">{analysis.recommendations}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Question Analysis Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Question-by-Question Analysis</h3>
              
              {reportData.questionAnalysis.map((question, index) => (
                <div key={index} className="bg-white/5 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">
                      Question {question.questionNumber}
                    </h4>
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getScoreBackground(question.score)}`}>
                      <span className="text-white font-medium">{question.score.toFixed(1)}/10</span>
                    </div>
                  </div>
                  
                  <p className="text-white/90 mb-4 italic">"{question.question}"</p>
                  
                  <div className="bg-white/5 p-4 rounded-lg mb-4">
                    <h5 className="font-medium text-white mb-2">Your Response:</h5>
                    <p className="text-white/70 text-sm">
                      {question.transcript.length > 200 
                        ? question.transcript.substring(0, 200) + '...'
                        : question.transcript}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-white mb-2">Feedback:</h5>
                    <div className="space-y-1">
                      {question.feedback.map((feedback, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <IconCheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-white/70 text-sm">{feedback}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Insights & Tips Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white mb-6">Insights & Improvement Tips</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Strengths */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <IconCheckCircle className="w-6 h-6 text-green-400" />
                    <h4 className="text-xl font-semibold text-white">Your Strengths</h4>
                  </div>
                  <div className="space-y-3">
                    {reportData.insights.strengths.map((strength, index) => (
                      <div key={index} className="bg-green-500/10 p-4 rounded-lg border-l-4 border-green-400">
                        <p className="text-white/80">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <IconAlertCircle className="w-6 h-6 text-orange-400" />
                    <h4 className="text-xl font-semibold text-white">Areas for Improvement</h4>
                  </div>
                  <div className="space-y-3">
                    {reportData.insights.improvements.map((improvement, index) => (
                      <div key={index} className="bg-orange-500/10 p-4 rounded-lg border-l-4 border-orange-400">
                        <p className="text-white/80">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-400/20">
                <h4 className="text-xl font-semibold text-white mb-4">Recommended Action Items</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white/80">Practice maintaining eye contact while explaining complex topics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white/80">Record yourself answering questions to identify filler words</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white/80">Prepare specific examples with quantitative results</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white/80">Take another practice interview in 1-2 weeks to track improvement</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Button
            borderRadius="1rem"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 text-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            onClick={() => navigate('/interview')}
          >
            Start Another Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
