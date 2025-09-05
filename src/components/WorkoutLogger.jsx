import React, { useState } from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { Plus, Clock, Save, Play, Square } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import Modal from './ui/Modal'

const WorkoutLogger = () => {
  const { 
    currentWorkout, 
    startWorkout, 
    endWorkout, 
    addExerciseToCurrentWorkout 
  } = useWorkout()
  
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [exerciseForm, setExerciseForm] = useState({
    exerciseName: '',
    sets: '',
    reps: '',
    weight: '',
    restTime: ''
  })

  const handleStartWorkout = () => {
    startWorkout()
  }

  const handleEndWorkout = () => {
    endWorkout()
  }

  const handleAddExercise = () => {
    setShowExerciseModal(true)
  }

  const handleSaveExercise = () => {
    if (exerciseForm.exerciseName && exerciseForm.sets && exerciseForm.reps) {
      addExerciseToCurrentWorkout({
        ...exerciseForm,
        sets: parseInt(exerciseForm.sets),
        reps: parseInt(exerciseForm.reps),
        weight: parseFloat(exerciseForm.weight) || 0,
        restTime: parseInt(exerciseForm.restTime) || 60,
        exerciseId: Date.now().toString()
      })
      
      setExerciseForm({
        exerciseName: '',
        sets: '',
        reps: '',
        weight: '',
        restTime: ''
      })
      setShowExerciseModal(false)
    }
  }

  const formatDuration = (startTime) => {
    if (!startTime) return '00:00'
    const now = new Date()
    const diff = Math.floor((now - new Date(startTime)) / 1000)
    const minutes = Math.floor(diff / 60)
    const seconds = diff % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text mb-2">Workout Logger</h1>
        <p className="text-dark-muted">
          Track your exercises in real-time with automated logging.
        </p>
      </div>

      {/* Workout Status */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              currentWorkout ? 'bg-accent/20' : 'bg-gray-500/20'
            }`}>
              <Clock className={`w-6 h-6 ${
                currentWorkout ? 'text-accent' : 'text-gray-500'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-text">
                {currentWorkout ? 'Workout in Progress' : 'Ready to Start'}
              </h3>
              <p className="text-dark-muted">
                {currentWorkout 
                  ? `Started at ${new Date(currentWorkout.startTime).toLocaleTimeString()}`
                  : 'Begin your training session'
                }
              </p>
            </div>
          </div>
          
          {currentWorkout ? (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-accent">
                  {formatDuration(currentWorkout.startTime)}
                </p>
                <p className="text-dark-muted text-sm">Duration</p>
              </div>
              <Button onClick={handleEndWorkout} variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                End Workout
              </Button>
            </div>
          ) : (
            <Button onClick={handleStartWorkout} variant="primary">
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          )}
        </div>
      </Card>

      {/* Current Workout Exercises */}
      {currentWorkout && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-dark-text">Current Session</h3>
              <p className="text-dark-muted">
                {currentWorkout.exercises.length} exercises logged
              </p>
            </div>
            <Button onClick={handleAddExercise}>
              <Plus className="w-4 h-4 mr-2" />
              Add Exercise
            </Button>
          </div>

          {currentWorkout.exercises.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-dark-muted">No exercises added yet</p>
              <p className="text-dark-muted text-sm">Click "Add Exercise" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentWorkout.exercises.map((exercise, index) => (
                <div key={exercise.exerciseId} className="p-4 bg-dark-card rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-dark-text">
                      {exercise.exerciseName}
                    </h4>
                    <span className="text-dark-muted text-sm">#{index + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-dark-muted">Sets:</span>
                      <span className="ml-2 font-medium text-dark-text">{exercise.sets}</span>
                    </div>
                    <div>
                      <span className="text-dark-muted">Reps:</span>
                      <span className="ml-2 font-medium text-dark-text">{exercise.reps}</span>
                    </div>
                    <div>
                      <span className="text-dark-muted">Weight:</span>
                      <span className="ml-2 font-medium text-dark-text">
                        {exercise.weight ? `${exercise.weight} lbs` : 'Bodyweight'}
                      </span>
                    </div>
                    <div>
                      <span className="text-dark-muted">Rest:</span>
                      <span className="ml-2 font-medium text-dark-text">{exercise.restTime}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Exercise Quick Add (when not in workout) */}
      {!currentWorkout && (
        <Card>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-dark-text mb-2">
              Start a Workout Session
            </h3>
            <p className="text-dark-muted mb-6">
              Begin tracking your exercises and let AI analyze your performance in real-time.
            </p>
            <Button onClick={handleStartWorkout} variant="primary" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Begin Training
            </Button>
          </div>
        </Card>
      )}

      {/* Add Exercise Modal */}
      <Modal 
        isOpen={showExerciseModal} 
        onClose={() => setShowExerciseModal(false)}
        title="Add Exercise"
      >
        <div className="space-y-4">
          <Input
            label="Exercise Name"
            type="text"
            value={exerciseForm.exerciseName}
            onChange={(e) => setExerciseForm(prev => ({ ...prev, exerciseName: e.target.value }))}
            placeholder="e.g., Bench Press"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sets"
              type="number"
              value={exerciseForm.sets}
              onChange={(e) => setExerciseForm(prev => ({ ...prev, sets: e.target.value }))}
              placeholder="4"
              required
            />
            <Input
              label="Reps"
              type="number"
              value={exerciseForm.reps}
              onChange={(e) => setExerciseForm(prev => ({ ...prev, reps: e.target.value }))}
              placeholder="10"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Weight (lbs)"
              type="number"
              value={exerciseForm.weight}
              onChange={(e) => setExerciseForm(prev => ({ ...prev, weight: e.target.value }))}
              placeholder="185"
            />
            <Input
              label="Rest Time (seconds)"
              type="number"
              value={exerciseForm.restTime}
              onChange={(e) => setExerciseForm(prev => ({ ...prev, restTime: e.target.value }))}
              placeholder="60"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={() => setShowExerciseModal(false)} 
              variant="outline" 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveExercise} 
              variant="primary" 
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Add Exercise
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default WorkoutLogger