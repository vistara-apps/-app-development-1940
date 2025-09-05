import React, { createContext, useContext, useState, useEffect } from 'react'
import { format } from 'date-fns'

const WorkoutContext = createContext()

export const useWorkouts = () => {
  const context = useContext(WorkoutContext)
  if (!context) {
    throw new Error('useWorkouts must be used within a WorkoutProvider')
  }
  return context
}

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([])
  const [exercises, setExercises] = useState([])

  // Initialize with sample data
  useEffect(() => {
    const sampleWorkouts = [
      {
        id: 1,
        date: '2024-01-20',
        duration: 75,
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 8, weight: 185 },
          { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 70 },
          { name: 'Push-ups', sets: 3, reps: 15, weight: 0 }
        ]
      },
      {
        id: 2,
        date: '2024-01-18',
        duration: 60,
        exercises: [
          { name: 'Deadlift', sets: 5, reps: 5, weight: 225 },
          { name: 'Bent-over Row', sets: 4, reps: 8, weight: 135 },
          { name: 'Pull-ups', sets: 3, reps: 8, weight: 0 }
        ]
      },
      {
        id: 3,
        date: '2024-01-16',
        duration: 80,
        exercises: [
          { name: 'Squat', sets: 5, reps: 5, weight: 205 },
          { name: 'Leg Press', sets: 4, reps: 12, weight: 315 },
          { name: 'Leg Curls', sets: 3, reps: 12, weight: 100 }
        ]
      }
    ]
    setWorkouts(sampleWorkouts)
  }, [])

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      date: format(new Date(), 'yyyy-MM-dd')
    }
    setWorkouts(prev => [newWorkout, ...prev])
  }

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id))
  }

  const getWorkoutStats = () => {
    const totalWorkouts = workouts.length
    const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0)
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0
    
    const exerciseFrequency = {}
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exerciseFrequency[exercise.name] = (exerciseFrequency[exercise.name] || 0) + 1
      })
    })

    return {
      totalWorkouts,
      totalDuration,
      avgDuration,
      exerciseFrequency
    }
  }

  const getProgressData = () => {
    const progressData = []
    const exerciseProgress = {}

    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (!exerciseProgress[exercise.name]) {
          exerciseProgress[exercise.name] = []
        }
        exerciseProgress[exercise.name].push({
          date: workout.date,
          weight: exercise.weight,
          volume: exercise.sets * exercise.reps * exercise.weight
        })
      })
    })

    return exerciseProgress
  }

  return (
    <WorkoutContext.Provider value={{
      workouts,
      exercises,
      addWorkout,
      deleteWorkout,
      getWorkoutStats,
      getProgressData
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}