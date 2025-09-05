/**
 * Database Service
 * Abstraction layer for database operations using Supabase
 */

import { supabase, db, handleSupabaseError } from './supabase'
import { format } from 'date-fns'

// User operations
export const userService = {
  // Get user profile
  getProfile: async (userId) => {
    try {
      const { data, error } = await db.select('users')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get profile error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      const { data, error } = await db.update('users', updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Get user preferences
  getPreferences: async (userId) => {
    try {
      const { data, error } = await db.select('user_preferences')
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get preferences error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Update user preferences
  updatePreferences: async (userId, preferences) => {
    try {
      const { data, error } = await db.upsert('user_preferences', {
        user_id: userId,
        ...preferences
      })
      .select()
      .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update preferences error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Track subscription usage
  trackUsage: async (userId, usageType, increment = 1) => {
    try {
      const { error } = await supabase.rpc('track_subscription_usage', {
        p_user_id: userId,
        p_usage_type: usageType,
        p_increment: increment
      })
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Track usage error:', error)
      return { error: handleSupabaseError(error) }
    }
  },

  // Get subscription usage
  getUsage: async (userId, monthYear = null) => {
    try {
      const currentMonth = monthYear || format(new Date(), 'yyyy-MM')
      const { data, error } = await db.select('subscription_usage')
        .eq('user_id', userId)
        .eq('month_year', currentMonth)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
      return { data: data || { workouts_logged: 0, ai_recommendations_used: 0, analytics_queries: 0 }, error: null }
    } catch (error) {
      console.error('Get usage error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },
}

// Workout operations
export const workoutService = {
  // Get user workouts
  getWorkouts: async (userId, limit = 50, offset = 0) => {
    try {
      const { data, error } = await db.select('workouts', `
        *,
        exercises (
          id,
          exercise_name,
          sets,
          reps,
          weight,
          rest_time,
          notes,
          order_index,
          completed_at
        )
      `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get workouts error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Get single workout
  getWorkout: async (workoutId) => {
    try {
      const { data, error } = await db.select('workouts', `
        *,
        exercises (
          id,
          exercise_name,
          sets,
          reps,
          weight,
          rest_time,
          notes,
          order_index,
          completed_at,
          exercise_library_id,
          exercise_library (
            name,
            category,
            muscle_groups,
            instructions,
            tips
          )
        )
      `)
        .eq('id', workoutId)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get workout error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Create workout
  createWorkout: async (userId, workoutData) => {
    try {
      const { data, error } = await db.insert('workouts', {
        user_id: userId,
        ...workoutData
      })
      .select()
      .single()
      
      if (error) throw error
      
      // Track usage
      await userService.trackUsage(userId, 'workouts')
      
      return { data, error: null }
    } catch (error) {
      console.error('Create workout error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Update workout
  updateWorkout: async (workoutId, updates) => {
    try {
      const { data, error } = await db.update('workouts', updates)
        .eq('id', workoutId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update workout error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Delete workout
  deleteWorkout: async (workoutId) => {
    try {
      const { error } = await db.delete('workouts')
        .eq('id', workoutId)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Delete workout error:', error)
      return { error: handleSupabaseError(error) }
    }
  },

  // Start workout
  startWorkout: async (workoutId) => {
    try {
      const { data, error } = await db.update('workouts', {
        status: 'in_progress',
        start_time: new Date().toISOString()
      })
        .eq('id', workoutId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Start workout error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Complete workout
  completeWorkout: async (workoutId, duration, totalVolume) => {
    try {
      const { data, error } = await db.update('workouts', {
        status: 'completed',
        end_time: new Date().toISOString(),
        duration,
        total_volume: totalVolume
      })
        .eq('id', workoutId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Complete workout error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },
}

// Exercise operations
export const exerciseService = {
  // Get exercise library
  getExerciseLibrary: async (category = null, search = null) => {
    try {
      let query = db.select('exercise_library')
      
      if (category) {
        query = query.eq('category', category)
      }
      
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }
      
      const { data, error } = await query.order('name')
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get exercise library error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Get exercise by ID
  getExercise: async (exerciseId) => {
    try {
      const { data, error } = await db.select('exercise_library')
        .eq('id', exerciseId)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get exercise error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Add exercise to workout
  addExerciseToWorkout: async (workoutId, exerciseData) => {
    try {
      const { data, error } = await db.insert('exercises', {
        workout_id: workoutId,
        ...exerciseData
      })
      .select()
      .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Add exercise to workout error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Update exercise
  updateExercise: async (exerciseId, updates) => {
    try {
      const { data, error } = await db.update('exercises', updates)
        .eq('id', exerciseId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update exercise error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Delete exercise from workout
  deleteExercise: async (exerciseId) => {
    try {
      const { error } = await db.delete('exercises')
        .eq('id', exerciseId)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Delete exercise error:', error)
      return { error: handleSupabaseError(error) }
    }
  },

  // Create custom exercise
  createCustomExercise: async (userId, exerciseData) => {
    try {
      const { data, error } = await db.insert('exercise_library', {
        created_by: userId,
        is_custom: true,
        ...exerciseData
      })
      .select()
      .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Create custom exercise error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },
}

// Personal records operations
export const recordService = {
  // Get personal records
  getPersonalRecords: async (userId, exerciseId = null) => {
    try {
      let query = db.select('personal_records', `
        *,
        exercise_library (
          name,
          category
        )
      `)
        .eq('user_id', userId)
      
      if (exerciseId) {
        query = query.eq('exercise_library_id', exerciseId)
      }
      
      const { data, error } = await query.order('achieved_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get personal records error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Update personal record
  updatePersonalRecord: async (userId, exerciseLibraryId, exerciseName, recordType, value, workoutId = null) => {
    try {
      const { data, error } = await supabase.rpc('update_personal_record', {
        p_user_id: userId,
        p_exercise_library_id: exerciseLibraryId,
        p_exercise_name: exerciseName,
        p_record_type: recordType,
        p_value: value,
        p_workout_id: workoutId
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update personal record error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },
}

// Recommendations operations
export const recommendationService = {
  // Get recommendations
  getRecommendations: async (userId, unreadOnly = false) => {
    try {
      let query = db.select('recommendations')
        .eq('user_id', userId)
      
      if (unreadOnly) {
        query = query.eq('is_read', false)
      }
      
      const { data, error } = await query
        .order('generated_at', { ascending: false })
        .limit(50)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get recommendations error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Create recommendation
  createRecommendation: async (userId, recommendationData) => {
    try {
      const { data, error } = await db.insert('recommendations', {
        user_id: userId,
        ...recommendationData
      })
      .select()
      .single()
      
      if (error) throw error
      
      // Track AI usage
      await userService.trackUsage(userId, 'ai_recommendations')
      
      return { data, error: null }
    } catch (error) {
      console.error('Create recommendation error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Mark recommendation as read
  markAsRead: async (recommendationId) => {
    try {
      const { data, error } = await db.update('recommendations', { is_read: true })
        .eq('id', recommendationId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Mark recommendation as read error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Mark recommendation as applied
  markAsApplied: async (recommendationId) => {
    try {
      const { data, error } = await db.update('recommendations', { is_applied: true })
        .eq('id', recommendationId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Mark recommendation as applied error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },
}

// Analytics operations
export const analyticsService = {
  // Get cached analytics
  getCachedAnalytics: async (userId, metricType, timePeriod) => {
    try {
      const { data, error } = await supabase.rpc('calculate_user_analytics', {
        p_user_id: userId,
        p_metric_type: metricType,
        p_time_period: timePeriod
      })
      
      if (error) throw error
      
      // Track analytics usage
      await userService.trackUsage(userId, 'analytics')
      
      return { data, error: null }
    } catch (error) {
      console.error('Get cached analytics error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Get workout statistics
  getWorkoutStats: async (userId, timePeriod = 'month') => {
    try {
      const startDate = new Date()
      switch (timePeriod) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1)
          break
        case 'quarter':
          startDate.setMonth(startDate.getMonth() - 3)
          break
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1)
          break
      }

      const { data, error } = await db.select('workouts', `
        id,
        duration,
        total_volume,
        created_at,
        status
      `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get workout stats error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Get exercise progress
  getExerciseProgress: async (userId, exerciseName, timePeriod = 'month') => {
    try {
      const startDate = new Date()
      switch (timePeriod) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1)
          break
        case 'quarter':
          startDate.setMonth(startDate.getMonth() - 3)
          break
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1)
          break
      }

      const { data, error } = await db.select('exercises', `
        sets,
        reps,
        weight,
        created_at,
        workouts!inner (
          user_id,
          status,
          created_at
        )
      `)
        .eq('exercise_name', exerciseName)
        .eq('workouts.user_id', userId)
        .eq('workouts.status', 'completed')
        .gte('workouts.created_at', startDate.toISOString())
        .order('workouts.created_at', { ascending: true })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get exercise progress error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },
}

// Workout templates operations
export const templateService = {
  // Get workout templates
  getTemplates: async (userId, includePublic = true) => {
    try {
      let query = db.select('workout_templates')
      
      if (includePublic) {
        query = query.or(`user_id.eq.${userId},is_public.eq.true`)
      } else {
        query = query.eq('user_id', userId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get templates error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Create workout template
  createTemplate: async (userId, templateData) => {
    try {
      const { data, error } = await db.insert('workout_templates', {
        user_id: userId,
        ...templateData
      })
      .select()
      .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Create template error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Update workout template
  updateTemplate: async (templateId, updates) => {
    try {
      const { data, error } = await db.update('workout_templates', updates)
        .eq('id', templateId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update template error:', error)
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  // Delete workout template
  deleteTemplate: async (templateId) => {
    try {
      const { error } = await db.delete('workout_templates')
        .eq('id', templateId)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Delete template error:', error)
      return { error: handleSupabaseError(error) }
    }
  },
}

export default {
  userService,
  workoutService,
  exerciseService,
  recordService,
  recommendationService,
  analyticsService,
  templateService,
}
