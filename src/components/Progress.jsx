import React, { useState } from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { TrendingUp, Calendar, Target, Award } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import Card from './ui/Card'
import Tabs from './ui/Tabs'

const Progress = () => {
  const { workouts } = useWorkout()
  const [activeTab, setActiveTab] = useState('overview')

  // Prepare data for charts
  const strengthProgress = workouts
    .flatMap(workout => workout.exercises)
    .filter(exercise => exercise.weight > 0)
    .reduce((acc, exercise) => {
      const existing = acc.find(item => item.name === exercise.exerciseName)
      if (existing) {
        if (exercise.weight > existing.maxWeight) {
          existing.maxWeight = exercise.weight
        }
        existing.sessions.push({
          date: new Date().toISOString().split('T')[0],
          weight: exercise.weight
        })
      } else {
        acc.push({
          name: exercise.exerciseName,
          maxWeight: exercise.weight,
          sessions: [{
            date: new Date().toISOString().split('T')[0],
            weight: exercise.weight
          }]
        })
      }
      return acc
    }, [])

  const volumeData = workouts.slice(0, 10).reverse().map((workout, index) => ({
    workout: `W${index + 1}`,
    volume: workout.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0),
    duration: workout.duration,
    date: new Date(workout.startTime).toLocaleDateString()
  }))

  const muscleGroupData = workouts
    .flatMap(w => w.exercises)
    .reduce((acc, exercise) => {
      // Simple muscle group mapping
      const muscleGroups = {
        'Bench Press': 'Chest',
        'Squats': 'Legs',
        'Deadlifts': 'Back',
        'Pull-ups': 'Back',
        'Overhead Press': 'Shoulders',
        'Rows': 'Back',
        'Incline Press': 'Chest',
        'Dips': 'Chest'
      }
      
      const group = muscleGroups[exercise.exerciseName] || 'Other'
      acc[group] = (acc[group] || 0) + 1
      return acc
    }, {})

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'strength', label: 'Strength' },
    { id: 'volume', label: 'Volume' }
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text mb-2">Progress Tracking</h1>
        <p className="text-dark-muted">
          Visualize your fitness journey and celebrate your achievements.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm font-medium">Personal Best</p>
              <p className="text-2xl font-bold text-dark-text">315 lbs</p>
              <p className="text-accent text-xs">Deadlift PR</p>
            </div>
            <Award className="w-8 h-8 text-accent" />
          </div>
        </Card>

        <Card className="gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm font-medium">Consistency</p>
              <p className="text-2xl font-bold text-dark-text">3.2</p>
              <p className="text-accent text-xs">workouts/week</p>
            </div>
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm font-medium">Growth Rate</p>
              <p className="text-2xl font-bold text-dark-text">+12%</p>
              <p className="text-accent text-xs">strength gain</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
        </Card>

        <Card className="gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm font-medium">Target</p>
              <p className="text-2xl font-bold text-dark-text">85%</p>
              <p className="text-accent text-xs">goal progress</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-dark-text mb-4">Training Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="workout" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-dark-text mb-4">Muscle Group Focus</h3>
            <div className="space-y-4">
              {Object.entries(muscleGroupData).map(([group, count]) => {
                const percentage = (count / Object.values(muscleGroupData).reduce((a, b) => a + b, 0)) * 100
                return (
                  <div key={group}>
                    <div className="flex justify-between mb-2">
                      <span className="text-dark-text font-medium">{group}</span>
                      <span className="text-dark-muted">{count} exercises</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'strength' && (
        <Card>
          <h3 className="text-lg font-semibold text-dark-text mb-4">Strength Progression</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {strengthProgress.slice(0, 6).map((exercise) => (
              <div key={exercise.name} className="p-4 bg-dark-card rounded-lg">
                <h4 className="font-medium text-dark-text mb-2">{exercise.name}</h4>
                <p className="text-2xl font-bold text-accent">{exercise.maxWeight} lbs</p>
                <p className="text-dark-muted text-sm">Personal Best</p>
              </div>
            ))}
          </div>
          
          {strengthProgress.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={strengthProgress[0]?.sessions || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      )}

      {activeTab === 'volume' && (
        <Card>
          <h3 className="text-lg font-semibold text-dark-text mb-4">Training Volume Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="workout" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Area 
                type="monotone" 
                dataKey="volume" 
                stroke="#8B5CF6" 
                fill="#8B5CF6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}

export default Progress