import React from 'react'
import { useWorkouts } from '../context/WorkoutContext'
import { 
  Activity, 
  Clock, 
  Zap, 
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const Dashboard = () => {
  const { workouts, getWorkoutStats } = useWorkouts()
  const stats = getWorkoutStats()

  const recentWorkouts = workouts.slice(0, 3)
  
  const weeklyData = [
    { day: 'Mon', workouts: 1, duration: 75 },
    { day: 'Tue', workouts: 0, duration: 0 },
    { day: 'Wed', workouts: 1, duration: 60 },
    { day: 'Thu', workouts: 0, duration: 0 },
    { day: 'Fri', workouts: 1, duration: 80 },
    { day: 'Sat', workouts: 0, duration: 0 },
    { day: 'Sun', workouts: 0, duration: 0 },
  ]

  const strengthProgress = [
    { exercise: 'Bench Press', weight: 185, change: '+15' },
    { exercise: 'Deadlift', weight: 225, change: '+25' },
    { exercise: 'Squat', weight: 205, change: '+20' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-white/70">Track your fitness journey with AI-powered insights</p>
        </div>
        <div className="text-right">
          <p className="text-white/70 text-sm">Today</p>
          <p className="text-white font-semibold">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium">Total Workouts</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalWorkouts}</p>
          <p className="text-sm text-green-400 mt-1">+2 this week</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium">Avg Duration</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats.avgDuration}m</p>
          <p className="text-sm text-green-400 mt-1">+5m improvement</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium">Total Hours</h3>
          </div>
          <p className="text-3xl font-bold text-white">{Math.round(stats.totalDuration / 60)}h</p>
          <p className="text-sm text-green-400 mt-1">This month</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium">Streak</h3>
          </div>
          <p className="text-3xl font-bold text-white">7 days</p>
          <p className="text-sm text-green-400 mt-1">Personal best!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Bar dataKey="duration" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Strength Progress */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Strength Progress
          </h3>
          <div className="space-y-4">
            {strengthProgress.map((exercise, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{exercise.exercise}</p>
                  <p className="text-white/70 text-sm">Current max</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{exercise.weight} lbs</p>
                  <p className="text-green-400 text-sm">{exercise.change} lbs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Workouts</h3>
        <div className="space-y-4">
          {recentWorkouts.map((workout) => (
            <div key={workout.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-medium">{workout.date}</p>
                <p className="text-white/70 text-sm">{workout.duration} minutes</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {workout.exercises.map((exercise, index) => (
                  <span key={index} className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">
                    {exercise.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard