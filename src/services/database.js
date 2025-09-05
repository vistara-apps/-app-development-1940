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
}

// Analytics operations
export const analyticsService = {
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
}

export default {
  userService,
  workoutService,
  exerciseService,
  analyticsService,
}
