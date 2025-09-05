import React, { useState, useEffect } from 'react'
import { useWorkouts } from '../context/WorkoutContext'
import { Brain, Lightbulb, Target, TrendingUp, RefreshCw } from 'lucide-react'

const Recommendations = () => {
  const { workouts, getWorkoutStats } = useWorkouts()
  const [recommendations, setRecommendations] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const stats = getWorkoutStats()

  // Simulated AI recommendations based on workout data
  const generateRecommendations = async () => {
    setIsGenerating(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const insights = [
      {
        type: 'strength',
        title: 'Progressive Overload Opportunity',
        description: 'Your bench press has plateaued at 185 lbs for 2 weeks. Consider increasing weight by 5-10 lbs or adding an extra set.',
        priority: 'high',
        action: 'Increase bench press to 190-195 lbs next session'
      },
      {
        type: 'frequency',
        title: 'Optimize Training Frequency',
        description: 'Based on your recovery patterns, you could benefit from training legs twice per week instead of once.',
        priority: 'medium',
        action: 'Add a second leg day with lighter intensity'
      },
      {
        type: 'balance',
        title: 'Muscle Group Balance',
        description: 'You\'re training chest 40% more than back. Consider adding more pulling exercises to maintain balance.',
        priority: 'medium',
        action: 'Add 2 more back exercises to your routine'
      },
      {
        type: 'recovery',
        title: 'Recovery Optimization',
        description: 'Your workout intensity has been high for 5 consecutive sessions. Consider a deload week or active recovery.',
        priority: 'low',
        action: 'Plan a deload week with 70% of normal intensity'
      },
      {
        type: 'technique',
        title: 'Form Focus Recommendation',
        description: 'Your squat volume has increased rapidly. Focus on form and consider recording sets to ensure proper technique.',
        priority: 'high',
        action: 'Record squat form or work with a trainer'
      }
    ]
    
    setRecommendations(insights)
    setIsGenerating(false)
  }

  useEffect(() => {
    generateRecommendations()
  }, [])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'strength': return <Target className="w-5 h-5" />
      case 'frequency': return <TrendingUp className="w-5 h-5" />
      case 'balance': return <Brain className="w-5 h-5" />
      case 'recovery': return <RefreshCw className="w-5 h-5" />
      case 'technique': return <Lightbulb className="w-5 h-5" />
      default: return <Brain className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Insights</h1>
          <p className="text-white/70">Personalized recommendations to optimize your training</p>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={isGenerating}
          className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Brain className={`w-5 h-5 ${isGenerating ? 'animate-pulse' : ''}`} />
          {isGenerating ? 'Analyzing...' : 'Generate New Insights'}
        </button>
      </div>

      {/* Quick Stats for AI Context */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Training Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.totalWorkouts}</p>
            <p className="text-white/70 text-sm">Total Workouts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.avgDuration}m</p>
            <p className="text-white/70 text-sm">Avg Duration</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {Object.keys(stats.exerciseFrequency).length}
            </p>
            <p className="text-white/70 text-sm">Unique Exercises</p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {isGenerating ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">AI is analyzing your data...</h3>
          <p className="text-white/70">Generating personalized recommendations based on your workout history</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
                  {getTypeIcon(rec.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="text-white/70 mb-3">{rec.description}</p>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-sm font-medium text-white mb-1">Recommended Action:</p>
                    <p className="text-sm text-green-400">{rec.action}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Tips */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Pro Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2">Progressive Overload</h4>
            <p className="text-white/70 text-sm">Gradually increase weight, reps, or sets every 1-2 weeks to continue making progress.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2">Recovery Time</h4>
            <p className="text-white/70 text-sm">Allow 48-72 hours between training the same muscle groups for optimal recovery.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2">Consistency Beats Intensity</h4>
            <p className="text-white/70 text-sm">Regular moderate workouts are more effective than sporadic intense sessions.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2">Track Everything</h4>
            <p className="text-white/70 text-sm">Log all exercises, weights, and reps to identify patterns and areas for improvement.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recommendations