"use client"

import React, { useState } from 'react';
import { AttentionMetrics } from './AttentionTracker';
import { AudioAnalysisResult } from '@/lib/audioUtils';

interface InterviewAnalysisResultsProps {
  attentionMetrics: AttentionMetrics | null;
  audioAnalysis: AudioAnalysisResult | null;
  transcript: string;
}

export default function InterviewAnalysisResults({
  attentionMetrics,
  audioAnalysis,
  transcript
}: InterviewAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'attention' | 'audio'>('overview');

  // Calculate final combined score
  const calculateFinalScore = () => {
    let totalScore = 0;
    let componentsCount = 0;

    // Attention score (50% weight if available)
    if (attentionMetrics) {
      totalScore += attentionMetrics.avgAttention * 0.5;
      componentsCount += 0.5;
    }

    // Audio delivery score (50% weight if available)
    if (audioAnalysis && audioAnalysis.delivery_score > 0) {
      totalScore += audioAnalysis.delivery_score * 0.5;
      componentsCount += 0.5;
    }

    // Calculate final score out of 100 (scores are already percentages 0-100)
    const finalScore = componentsCount > 0 ? Math.round(totalScore / componentsCount) : 0;
    
    return {
      score: finalScore,
      hasAttention: !!attentionMetrics,
      hasAudio: !!(audioAnalysis && audioAnalysis.delivery_score > 0)
    };
  };

  const finalScoreData = calculateFinalScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-card border border-border rounded-2xl shadow-xl p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-transparent text-muted-foreground hover:bg-secondary'
            }`}
          >
            Overall Score
          </button>
          <button
            onClick={() => setActiveTab('attention')}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'attention'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-transparent text-muted-foreground hover:bg-secondary'
            }`}
          >
            Attention Analysis
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'audio'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-transparent text-muted-foreground hover:bg-secondary'
            }`}
          >
            Audio Analysis
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">📊 Overall Performance</h3>

          {/* Final Score Display */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-2xl p-8 mb-6 text-center">
            <div className="text-sm text-muted-foreground mb-2">Final Interview Score</div>
            <div className={`text-7xl font-bold ${getScoreColor(finalScoreData.score)} mb-2`}>
              {finalScoreData.score}
            </div>
            <div className="text-3xl font-bold text-primary mb-4">
              Grade: {getScoreGrade(finalScoreData.score)}
            </div>
            <div className="text-sm text-muted-foreground">
              Based on {finalScoreData.hasAttention && finalScoreData.hasAudio ? 'Attention + Audio' : 
                        finalScoreData.hasAttention ? 'Attention only' : 
                        finalScoreData.hasAudio ? 'Audio only' : 'No data'} Analysis
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {attentionMetrics && (
              <div className="bg-secondary/50 rounded-xl p-6">
                <h4 className="font-bold text-foreground mb-4">👁️ Attention Component</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Attention</span>
                    <span className={`text-2xl font-bold ${getScoreColor(attentionMetrics.avgAttention)}`}>
                      {attentionMetrics.avgAttention}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Eye Contact Quality</span>
                    <span className="text-lg font-bold text-foreground">
                      {attentionMetrics.earScore.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Focus Status</span>
                    <span className="text-lg">
                      {attentionMetrics.isDistracted ? '⚠️ Distracted' : '✅ Focused'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {audioAnalysis && audioAnalysis.delivery_score > 0 && (
              <div className="bg-secondary/50 rounded-xl p-6">
                <h4 className="font-bold text-foreground mb-4">🎤 Audio Component</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Delivery Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(audioAnalysis.delivery_score)}`}>
                      {audioAnalysis.delivery_score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Speech Rate</span>
                    <span className="text-lg font-bold text-foreground">
                      {audioAnalysis.speech_rate} wpm
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pauses</span>
                    <span className="text-lg font-bold text-foreground">
                      {audioAnalysis.long_pauses}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Overall Feedback */}
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
            <h4 className="font-bold text-foreground mb-3">💡 Overall Feedback</h4>
            <ul className="space-y-2 text-muted-foreground">
              {finalScoreData.score >= 90 && (
                <li className="text-green-600 font-semibold">Outstanding performance! You nailed this interview!</li>
              )}
              {finalScoreData.score >= 80 && finalScoreData.score < 90 && (
                <li className="text-green-600 font-semibold">Excellent work! Very strong interview performance.</li>
              )}
              {finalScoreData.score >= 70 && finalScoreData.score < 80 && (
                <li className="text-yellow-600">Good performance with room for improvement in some areas.</li>
              )}
              {finalScoreData.score >= 60 && finalScoreData.score < 70 && (
                <li className="text-yellow-600">Decent performance, but focus on the specific feedback in each section.</li>
              )}
              {finalScoreData.score < 60 && (
                <li className="text-red-600">Significant improvement needed. Review the detailed feedback below.</li>
              )}
              
              {!finalScoreData.hasAttention && (
                <li className="text-orange-600">Attention tracking data not available - ensure camera is working</li>
              )}
              {!finalScoreData.hasAudio && (
                <li className="text-orange-600">Audio analysis not available - ensure microphone is working</li>
              )}
              
              <li>• Switch to the Attention or Audio tabs above for detailed insights</li>
            </ul>
          </div>
        </div>
      )}

      {/* Attention Analysis Tab */}
      {activeTab === 'attention' && attentionMetrics && (
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">👁️ Attention Analysis</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Average Attention</div>
              <div className={`text-3xl font-bold ${getScoreColor(attentionMetrics.avgAttention)}`}>
                {attentionMetrics.avgAttention}%
              </div>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Final Score</div>
              <div className="text-3xl font-bold text-primary">{attentionMetrics.attentionScore}%</div>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Eye Contact (EAR)</div>
              <div className="text-3xl font-bold text-foreground">
                {attentionMetrics.earScore.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Gaze Score</div>
              <div className="text-3xl font-bold text-foreground">
                {attentionMetrics.gazeScore.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
            <h4 className="font-bold text-foreground mb-3">💡 Attention Feedback</h4>
            <ul className="space-y-2 text-muted-foreground">
              {attentionMetrics.avgAttention < 20 && (
                <li className="text-red-600 font-semibold">
                  Very low attention score - you were likely not in front of the camera for most of the interview. 
                  Stay centered in frame throughout the recording.
                </li>
              )}
              {attentionMetrics.avgAttention >= 20 && attentionMetrics.avgAttention < 40 && (
                <li className="text-orange-600 font-semibold">
                  Poor attention score - ensure you remain visible in the camera frame throughout the interview.
                </li>
              )}
              {attentionMetrics.avgAttention >= 40 && attentionMetrics.avgAttention < 60 && (
                <li className="text-yellow-600">
                Below average attention - stay in frame and maintain focus on the camera
                </li>
              )}
              {attentionMetrics.avgAttention >= 60 && attentionMetrics.avgAttention < 80 && (
                <li> Good attention overall - maintain eye contact with the camera</li>
              )}
              {attentionMetrics.avgAttention >= 80 && (
                <li className="text-green-600 font-semibold">Excellent focus throughout the interview!</li>
              )}
              {attentionMetrics.lookingAway && attentionMetrics.avgAttention >= 60 && (
                <li>You looked away several times - practice maintaining steady eye contact</li>
              )}
              {attentionMetrics.earScore < 0.5 && attentionMetrics.earScore > 0 && (
                <li>Keep your eyes open and alert - it shows confidence and engagement</li>
              )}
              {attentionMetrics.isAsleep && (
                <li className="text-red-600">Your eyes were closed for extended periods - stay alert!</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Audio Analysis Tab */}
      {activeTab === 'audio' && audioAnalysis && (
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">🎤 Audio Delivery Analysis</h3>
          
          {audioAnalysis.note && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-yellow-600 mb-2">⚠️ {audioAnalysis.note}</h4>
              <p className="text-muted-foreground text-sm">
                The analysis could not detect any speech in your recording. Please ensure your microphone is working and speak clearly during the interview.
              </p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Delivery Score</div>
              <div className={`text-3xl font-bold ${getScoreColor(audioAnalysis.delivery_score)}`}>
                {audioAnalysis.delivery_score}/100
              </div>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Speech Rate</div>
              <div className="text-3xl font-bold text-foreground">{audioAnalysis.speech_rate}</div>
              <div className="text-xs text-muted-foreground">words/min</div>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Long Pauses</div>
              <div className="text-3xl font-bold text-foreground">{audioAnalysis.long_pauses}</div>
              <div className="text-xs text-muted-foreground">pauses &gt; 0.8s</div>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Pitch Variance</div>
              <div className="text-3xl font-bold text-foreground">{audioAnalysis.pitch_variance}</div>
              <div className="text-xs text-muted-foreground">confidence signal</div>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Energy Variation</div>
              <div className="text-3xl font-bold text-foreground">{audioAnalysis.energy_std}</div>
            </div>

            {audioAnalysis.word_count && (
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-1">Word Count</div>
                <div className="text-3xl font-bold text-foreground">{audioAnalysis.word_count}</div>
              </div>
            )}
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
            <h4 className="font-bold text-foreground mb-3">💡 Audio Feedback</h4>
            <ul className="space-y-2 text-muted-foreground">
              {audioAnalysis.delivery_score === 0 && audioAnalysis.note && (
                <li className="text-yellow-600 font-semibold">⚠️ No speech detected - please check your microphone and speak during recording</li>
              )}
              {audioAnalysis.speech_rate > 0 && audioAnalysis.speech_rate < 130 && (
                <li>• Try speaking a bit faster - aim for 130-170 words per minute</li>
              )}
              {audioAnalysis.speech_rate > 170 && (
                <li>• Slow down slightly - you're speaking quite fast</li>
              )}
              {audioAnalysis.long_pauses > 4 && (
                <li>• Reduce long pauses - practice your responses to improve flow</li>
              )}
              {audioAnalysis.pitch_variance < 80 && audioAnalysis.pitch_variance > 0 && (
                <li>• Add more vocal variety - vary your pitch to show enthusiasm and engagement</li>
              )}
              {audioAnalysis.delivery_score >= 80 && (
                <li className="text-green-600 font-semibold">✓ Excellent delivery! Keep up the great work!</li>
              )}
              {audioAnalysis.delivery_score >= 60 && audioAnalysis.delivery_score < 80 && (
                <li>• Good delivery overall - review the specific metrics above for areas to improve</li>
              )}
              {audioAnalysis.delivery_score > 0 && audioAnalysis.delivery_score < 60 && (
                <li>• Focus on improving the areas highlighted above - practice makes perfect!</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && transcript.length > 0 && (
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">📝 Your Transcript</h3>
          
          <div className="bg-secondary/50 rounded-xl p-6 mb-4">
            <div className="text-sm text-muted-foreground mb-2">
              Word Count: {transcript.trim().split(/\s+/).filter((w: string) => w.length > 0).length} words
            </div>
            <div className="text-foreground leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {transcript}
            </div>
          </div>

          <button
            onClick={() => {
              const blob = new Blob([transcript], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `interview-transcript-${Date.now()}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-lg transition-colors border border-primary/30"
          >
            Download Transcript
          </button>
        </div>
      )}
    </div>
  );
}
