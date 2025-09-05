import React, { useState, useEffect } from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { Brain, Lightbulb, Target, TrendingUp, RefreshCw } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'

const Recommendations = () => {
  const { workouts } = useWorkout()
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState([])

  // Mock AI recommendations based on workout data
  const generateRecommendations = () => {
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const mockRecommendations = [
        {
          id: 1,
          type: 'progressive_overload',
          title: 'Increase Bench Press Weight',
          description: 'Your bench press has been consistent at 185 lbs for 3 sessions. Consider increasing to 190-195 lbs for your next workout.',
          priority: 'high',
          action: 'Add 5-10 lbs to your next bench press session',
          icon: TrendingUp,
          confidence: 92
        },
        {
          id: 2,
          type: 'exercise_variety',
          title: 'Add Pull Exercise Variety',
          description: 'You\'ve been focusing heavily on pushing movements. Adding more pulling exercises will improve muscle balance.',
          priority: 'medium',
          action: 'Include face pulls or lateral raises in your next session',
          icon: Target,
          confidence: 87
        },
        {
          id: 3,
          type: 'recovery',
          title: 'Optimize Rest Periods',
          description: 'Your performance drops after the second exercise. Consider extending rest periods to 2-3 minutes for compound movements.',
          priority: 'medium',
          action: 'Increase rest time between heavy sets',
          icon: Lightbulb,
          confidence: 78
        },
        {
          id: 4,
          type: 'consistency',
          title: 'Maintain Training Frequency',
          description: 'Your 3x/week schedule is optimal for strength gains. Keep this consistency for best results.',
          priority: 'low',
          action: 'Continue current training frequency',
          icon: Target,
          confidence: 95
        }
      ]

      const mockInsights = [
        {
          metric: 'Strength Gain',
          value: '+12%',
          trend: 'up',
          description: 'Above average progression rate'
        },
        {
          metric: 'Volume Load',
          value: '24,350 lbs',
          trend: 'up',
          description: 'Last 7 days total volume'
        },
        {
          metric: 'Consistency',
          value: '85%',
          trend: 'stable',
          description: 'Weekly training adherence'
        },
        {
          metric: 'Recovery',
          value: 'Good',
          trend: 'up',
          description: 'Based on performance patterns'
        }
      ]

      setRecommendations(mockRecommendations)
      setInsights(mockInsights)
      setIsLoading(false)
    }, 2000)
  }

  useEffect(() => {
    if (workouts.length > 0) {
      generateRecommendations()
    }
  }, [workouts])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'low': return 'text-green-400 bg-green-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text mb-2">AI Insights & Recommendations</h1>
        <p className="text-dark-muted">
          Personalized guidance powered by advanced analysis of your training data.
        </p>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="gradient-card">
            <div className="text-center">
              <p className="text-2xl font-bold text-dark-text mb-1">{insight.value}</p>
              <p className="text-dark-muted text-sm font-medium mb-2">{insight.metric}</p>
              <p className="text-xs text-dark-muted">{insight.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Generate New Recommendations */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-text">AI Analysis</h3>
              <p className="text-dark-muted">
                {isLoading ? 'Analyzing your training patterns...' : 'Ready to generate new insights'}
              </p>
            </div>
          </div>
          <Button 
            onClick={generateRecommendations} 
            disabled={isLoading}
            variant="primary"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Analyzing...' : 'Refresh Insights'}
          </Button>
        </div>
      </Card>

      {/* Recommendations */}
      {isLoading ? (
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
              <p className="text-dark-text font-medium">Analyzing your workout data...</p>
              <p className="text-dark-muted text-sm">This may take a few seconds</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const IconComponent = rec.icon
            return (
              <Card key={rec.id}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-dark-text">{rec.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                      <span className="text-dark-muted text-sm">
                        {rec.confidence}% confidence
                      </span>
                    </div>
                    
                    <p className="text-dark-muted mb-3">{rec.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-accent" />
                        <span className="text-accent font-medium">Action:</span>
                        <span className="text-dark-text">{rec.action}</span>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* No Data State */}
      {workouts.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-dark-text mb-2">
              Start Training to Get Insights
            </h3>
            <p className="text-dark-muted mb-6">
              Complete a few workouts to receive personalized AI recommendations based on your performance.
            </p>
            <Button variant="primary">
              Log Your First Workout
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Recommendations