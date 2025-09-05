import React, { useState } from 'react'
import { useWorkouts } from '../context/WorkoutContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Calendar, Target, Activity } from 'lucide-react'

const Analytics = () => {
  const { workouts, getWorkoutStats, getProgressData } = useWorkouts()
  const [selectedTimeframe, setSelectedTimeframe] = useState('all')
  
  const stats = getWorkoutStats()
  const progressData = getProgressData()

  // Prepare data for charts
  const workoutTrend = workouts.map(workout => ({
    date: workout.date,
    duration: workout.duration,
    exercises: workout.exercises.length
  })).reverse()

  const exerciseDistribution = Object.entries(stats.exerciseFrequency).map(([name, count]) => ({
    name,
    count,
    fill: `hsl(${Math.random() * 360}, 70%, 60%)`
  }))

  const strengthData = Object.entries(progressData).slice(0, 3).map(([exercise, data]) => {
    const latest = data[data.length - 1]
    const previous = data.length > 1 ? data[data.length - 2] : latest
    return {
      exercise,
      current: latest?.weight || 0,
      previous: previous?.weight || 0,
      improvement: ((latest?.weight || 0) - (previous?.weight || 0))
    }
  })

  const volumeData = workouts.map(workout => {
    const totalVolume = workout.exercises.reduce((sum, ex) => 
      sum + (ex.sets * ex.reps * ex.weight), 0
    )
    return {
      date: workout.date,
      volume: totalVolume
    }
  }).reverse()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-white/70">Detailed insights into your fitness progress</p>
        </div>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all" className="text-gray-900">All Time</option>
          <option value="month" className="text-gray-900">This Month</option>
          <option value="week" className="text-gray-900">This Week</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium">Total Volume</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {workouts.reduce((sum, w) => sum + w.exercises.reduce((es, e) => 
              es + (e.sets * e.reps * e.weight), 0), 0).toLocaleString()} lbs
          </p>
          <p className="text-sm text-green-400 mt-1">Lifetime total</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium">Consistency</h3>
          </div>
          <p className="text-3xl font-bold text-white">85%</p>
          <p className="text-sm text-green-400 mt-1">This month</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium">PR's Set</h3>
          </div>
          <p className="text-3xl font-bold text-white">12</p>
          <p className="text-sm text-green-400 mt-1">This month</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium">Workout Days</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalWorkouts}</p>
          <p className="text-sm text-green-400 mt-1">Total logged</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Duration Trend */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Workout Duration Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={workoutTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="duration" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Progress */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Volume Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise Distribution */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Exercise Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={exerciseDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {exerciseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Strength Progress */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Strength Progress</h3>
          <div className="space-y-4">
            {strengthData.map((exercise, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{exercise.exercise}</h4>
                  <span className={`text-sm px-2 py-1 rounded ${
                    exercise.improvement > 0 ? 'bg-green-500/20 text-green-400' : 
                    exercise.improvement < 0 ? 'bg-red-500/20 text-red-400' : 
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {exercise.improvement > 0 ? '+' : ''}{exercise.improvement} lbs
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-white/70 text-xs">Current</p>
                    <p className="text-white font-semibold">{exercise.current} lbs</p>
                  </div>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((exercise.current / 300) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics