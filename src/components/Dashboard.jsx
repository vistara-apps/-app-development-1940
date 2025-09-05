import React from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  Flame,
  Award
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Card from './ui/Card'
import Button from './ui/Button'

const Dashboard = ({ user }) => {
  const { workouts } = useWorkout()

  // Calculate statistics
  const totalWorkouts = workouts.length
  const totalMinutes = workouts.reduce((sum, workout) => sum + workout.duration, 0)
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0
  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.startTime)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return workoutDate >= weekAgo
  }).length

  // Prepare chart data
  const progressData = workouts.slice(0, 7).reverse().map((workout, index) => ({
    day: `Day ${index + 1}`,
    duration: workout.duration,
    volume: workout.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0)
  }))

  const exerciseData = workouts.flatMap(w => w.exercises)
    .reduce((acc, exercise) => {
      const existing = acc.find(item => item.name === exercise.exerciseName)
      if (existing) {
        existing.count += 1
        existing.totalVolume += exercise.sets * exercise.reps * exercise.weight
      } else {
        acc.push({
          name: exercise.exerciseName,
          count: 1,
          totalVolume: exercise.sets * exercise.reps * exercise.weight
        })
      }
      return acc
    }, [])
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text mb-2">
          Welcome back, {user.name.split(' ')[0]}! 💪
        </h1>
        <p className="text-dark-muted">
          Track your progress and achieve your fitness goals with AI-powered insights.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm font-medium">Total Workouts</p>
              <p className="text-2xl font-bold text-dark-text">{totalWorkouts}</p>
              <p className="text-accent text-xs">+{thisWeekWorkouts} this week</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm font-medium">Total Time</p>
              <p className="text-2xl font-bold text-dark-text">{Math.round(totalMinutes / 60)}h</p>
              <p className="text-accent text-xs">{totalMinutes} minutes</p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm font-medium">Avg Duration</p>
              <p className="text-2xl font-bold text-dark-text">{avgDuration}m</p>
              <p className="text-accent text-xs">per workout</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm font-medium">Consistency</p>
              <p className="text-2xl font-bold text-dark-text">85%</p>
              <p className="text-accent text-xs">weekly goal</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-dark-text">Progress Trend</h3>
            <p className="text-dark-muted text-sm">Workout duration over time</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
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
                dataKey="duration" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-dark-text">Top Exercises</h3>
            <p className="text-dark-muted text-sm">Most frequently performed</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={exerciseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-dark-text">Recent Workouts</h3>
            <p className="text-dark-muted text-sm">Your latest training sessions</p>
          </div>
          <Button 
            onClick={() => {}} 
            variant="outline"
            size="sm"
          >
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {workouts.slice(0, 3).map((workout) => (
            <div key={workout.workoutId} className="flex items-center justify-between p-4 bg-dark-card rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-dark-text">
                    {new Date(workout.startTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-dark-muted text-sm">
                    {workout.exercises.length} exercises • {workout.duration} min
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-dark-muted text-sm">Total Volume</p>
                <p className="font-semibold text-dark-text">
                  {workout.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0).toLocaleString()} lbs
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard