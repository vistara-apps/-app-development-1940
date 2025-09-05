/**
 * OpenAI Service
 * Handles AI-powered recommendations and analysis
 */

import OpenAI from 'openai'
import { config } from '../config'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  organization: config.openai.organizationId,
  dangerouslyAllowBrowser: true, // Note: In production, API calls should go through your backend
})

// Prompt templates for different recommendation types
export const promptTemplates = {
  workoutRecommendations: (userData, workoutHistory, goals) => `
    You are a professional fitness coach and AI assistant for FitFlow AI. Analyze the following user data and provide personalized workout recommendations.

    User Profile:
    - Subscription Tier: ${userData.subscriptionTier}
    - Fitness Goals: ${goals || 'General fitness improvement'}
    - Experience Level: ${userData.experienceLevel || 'Intermediate'}

    Recent Workout History (last 30 days):
    ${workoutHistory.map(workout => `
    Date: ${workout.date}
    Duration: ${workout.duration} minutes
    Exercises: ${workout.exercises.map(ex => `${ex.name} - ${ex.sets}x${ex.reps} @ ${ex.weight}lbs`).join(', ')}
    `).join('\n')}

    Please provide 3-5 specific, actionable recommendations focusing on:
    1. Progressive overload opportunities
    2. Muscle group balance
    3. Training frequency optimization
    4. Recovery and technique improvements

    Format your response as a JSON array with objects containing:
    - type: (strength|frequency|balance|recovery|technique|progression)
    - title: Brief recommendation title
    - description: Detailed explanation
    - priority: (low|medium|high|critical)
    - action: Specific action to take
    - expectedOutcome: What the user can expect

    Keep recommendations practical and achievable.
  `,

  progressAnalysis: (progressData, timeframe) => `
    Analyze the following fitness progress data and provide insights:

    Progress Data (${timeframe}):
    ${JSON.stringify(progressData, null, 2)}

    Provide analysis on:
    1. Strength gains and trends
    2. Volume progression
    3. Consistency patterns
    4. Areas of improvement
    5. Potential plateaus

    Format as JSON with insights array containing title, description, and trend (positive|negative|neutral).
  `,

  workoutPlan: (userGoals, availableTime, equipment, experience) => `
    Create a personalized workout plan based on:
    - Goals: ${userGoals}
    - Available time per session: ${availableTime} minutes
    - Equipment: ${equipment}
    - Experience level: ${experience}

    Provide a structured weekly plan with exercises, sets, reps, and progression guidelines.
    Format as JSON with days array containing exercises with proper form cues.
  `,
}

// OpenAI service functions
export const openaiService = {
  // Generate workout recommendations
  generateRecommendations: async (userData, workoutHistory, goals = null) => {
    try {
      if (!config.features.aiRecommendations) {
        throw new Error('AI recommendations are disabled')
      }

      const prompt = promptTemplates.workoutRecommendations(userData, workoutHistory, goals)
      
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness coach providing personalized workout recommendations. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      // Parse JSON response
      const recommendations = JSON.parse(response)
      return { data: recommendations, error: null }
    } catch (error) {
      console.error('Generate recommendations error:', error)
      return { 
        data: null, 
        error: { 
          message: error.message || 'Failed to generate recommendations',
          code: 'AI_ERROR'
        }
      }
    }
  },

  // Analyze progress data
  analyzeProgress: async (progressData, timeframe = 'month') => {
    try {
      if (!config.features.aiRecommendations) {
        throw new Error('AI recommendations are disabled')
      }

      const prompt = promptTemplates.progressAnalysis(progressData, timeframe)
      
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a fitness data analyst providing insights on workout progress. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      const analysis = JSON.parse(response)
      return { data: analysis, error: null }
    } catch (error) {
      console.error('Analyze progress error:', error)
      return { 
        data: null, 
        error: { 
          message: error.message || 'Failed to analyze progress',
          code: 'AI_ERROR'
        }
      }
    }
  },

  // Generate workout plan
  generateWorkoutPlan: async (userGoals, availableTime, equipment, experience) => {
    try {
      if (!config.features.aiRecommendations) {
        throw new Error('AI recommendations are disabled')
      }

      const prompt = promptTemplates.workoutPlan(userGoals, availableTime, equipment, experience)
      
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness trainer creating personalized workout plans. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      const workoutPlan = JSON.parse(response)
      return { data: workoutPlan, error: null }
    } catch (error) {
      console.error('Generate workout plan error:', error)
      return { 
        data: null, 
        error: { 
          message: error.message || 'Failed to generate workout plan',
          code: 'AI_ERROR'
        }
      }
    }
  },

  // Check if AI features are available
  isAvailable: () => {
    return config.features.aiRecommendations && config.openai.apiKey
  },
}

export default openaiService
