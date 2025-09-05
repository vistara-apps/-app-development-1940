import React, { createContext, useContext, useState, useEffect } from 'react'

const WorkoutContext = createContext()

export const useWorkout = () => {
  const context = useContext(WorkoutContext)
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider')
  }
  return context
}

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([])
  const [exercises, setExercises] = useState([])
  const [currentWorkout, setCurrentWorkout] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Sample data for demo
  useEffect(() => {
    const sampleWorkouts = [
      {
        workoutId: '1',
        startTime: new Date('2024-01-15T10:00:00'),
        endTime: new Date('2024-01-15T11:30:00'),
        duration: 90,
        exercises: [
          { exerciseId: '1', exerciseName: 'Bench Press', sets: 4, reps: 10, weight: 185, restTime: 120 },
          { exerciseId: '2', exerciseName: 'Squats', sets: 4, reps: 12, weight: 225, restTime: 180 },
          { exerciseId: '3', exerciseName: 'Deadlifts', sets: 3, reps: 8, weight: 315, restTime: 240 }
        ]
      },
      {
        workoutId: '2',
        startTime: new Date('2024-01-17T14:00:00'),
        endTime: new Date('2024-01-17T15:15:00'),
        duration: 75,
        exercises: [
          { exerciseId: '4', exerciseName: 'Pull-ups', sets: 4, reps: 8, weight: 0, restTime: 90 },
          { exerciseId: '5', exerciseName: 'Overhead Press', sets: 3, reps: 10, weight: 135, restTime: 120 },
          { exerciseId: '6', exerciseName: 'Rows', sets: 4, reps: 12, weight: 155, restTime: 90 }
        ]
      },
      {
        workoutId: '3',
        startTime: new Date('2024-01-19T09:00:00'),
        endTime: new Date('2024-01-19T10:45:00'),
        duration: 105,
        exercises: [
          { exerciseId: '7', exerciseName: 'Bench Press', sets: 4, reps: 8, weight: 195, restTime: 120 },
          { exerciseId: '8', exerciseName: 'Incline Press', sets: 3, reps: 10, weight: 155, restTime: 120 },
          { exerciseId: '9', exerciseName: 'Dips', sets: 3, reps: 15, weight: 0, restTime: 90 }
        ]
      }
    ]
    setWorkouts(sampleWorkouts)
  }, [])

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      workoutId: Date.now().toString(),
      createdAt: new Date()
    }
    setWorkouts(prev => [newWorkout, ...prev])
  }

  const addExercise = (exercise) => {
    const newExercise = {
      ...exercise,
      exerciseId: Date.now().toString(),
      createdAt: new Date()
    }
    setExercises(prev => [...prev, newExercise])
  }

  const startWorkout = () => {
    setCurrentWorkout({
      startTime: new Date(),
      exercises: []
    })
  }

  const endWorkout = () => {
    if (currentWorkout) {
      const completedWorkout = {
        ...currentWorkout,
        endTime: new Date(),
        duration: Math.round((new Date() - currentWorkout.startTime) / 60000)
      }
      addWorkout(completedWorkout)
      setCurrentWorkout(null)
    }
  }

  const addExerciseToCurrentWorkout = (exercise) => {
    if (currentWorkout) {
      setCurrentWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, exercise]
      }))
    }
  }

  const value = {
    workouts,
    exercises,
    currentWorkout,
    isLoading,
    addWorkout,
    addExercise,
    startWorkout,
    endWorkout,
    addExerciseToCurrentWorkout,
    setIsLoading
  }

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  )
}