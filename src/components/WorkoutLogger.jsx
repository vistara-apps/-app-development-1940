import React, { useState } from 'react'
import { useWorkouts } from '../context/WorkoutContext'
import { Plus, Trash2, Save, Timer } from 'lucide-react'

const WorkoutLogger = () => {
  const { addWorkout } = useWorkouts()
  const [exercises, setExercises] = useState([
    { name: '', sets: 1, reps: 1, weight: 0 }
  ])
  const [duration, setDuration] = useState(60)
  const [isLogging, setIsLogging] = useState(false)
  const [startTime, setStartTime] = useState(null)

  const exerciseOptions = [
    'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
    'Incline Dumbbell Press', 'Leg Press', 'Pull-ups', 'Dips', 'Bicep Curls',
    'Tricep Extensions', 'Leg Curls', 'Calf Raises', 'Lateral Raises', 'Push-ups'
  ]

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 1, reps: 1, weight: 0 }])
  }

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index, field, value) => {
    const updated = exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    )
    setExercises(updated)
  }

  const startWorkout = () => {
    setIsLogging(true)
    setStartTime(Date.now())
  }

  const saveWorkout = () => {
    const validExercises = exercises.filter(ex => ex.name && ex.sets && ex.reps)
    
    if (validExercises.length === 0) {
      alert('Please add at least one exercise with valid data')
      return
    }

    const actualDuration = startTime ? Math.round((Date.now() - startTime) / 1000 / 60) : duration

    const workout = {
      exercises: validExercises,
      duration: actualDuration
    }

    addWorkout(workout)
    setExercises([{ name: '', sets: 1, reps: 1, weight: 0 }])
    setDuration(60)
    setIsLogging(false)
    setStartTime(null)
    
    alert('Workout saved successfully!')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Log Workout</h1>
          <p className="text-white/70">Track your exercises and performance</p>
        </div>
        {!isLogging ? (
          <button
            onClick={startWorkout}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Timer className="w-5 h-5" />
            Start Workout
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Workout in progress
            </div>
            <button
              onClick={saveWorkout}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Workout
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">Exercises</h3>
        
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Exercise
                  </label>
                  <select
                    value={exercise.name}
                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select exercise</option>
                    {exerciseOptions.map(option => (
                      <option key={option} value={option} className="text-gray-900">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Sets
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 1)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Reps
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 1)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={exercise.weight}
                      onChange={(e) => updateExercise(index, 'weight', parseInt(e.target.value) || 0)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  {exercises.length > 1 && (
                    <button
                      onClick={() => removeExercise(index)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-colors mt-6"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addExercise}
          className="mt-4 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Exercise
        </button>
      </div>

      {!isLogging && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Workout Duration</h3>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 w-24"
            />
            <span className="text-white/70">minutes</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutLogger