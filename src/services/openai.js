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
      try {
        const recommendations = JSON.parse(response)
        return {
          success: true,
          data: recommendations,
          usage: completion.usage,
        }
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', parseError)
        // Fallback to text response if JSON parsing fails
        return {
          success: true,
          data: [{
            type: 'general',
            title: 'AI Recommendation',
            description: response,
            priority: 'medium',
            action: 'Review the provided guidance',
            expectedOutcome: 'Improved workout effectiveness'
          }],
          usage: completion.usage,
        }
      }
    } catch (error) {
      console.error('OpenAI recommendation error:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }
  },

  // Analyze progress trends
  analyzeProgress: async (progressData, timeframe = '30 days') => {
    try {
      const prompt = promptTemplates.progressAnalysis(progressData, timeframe)
      
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a fitness data analyst providing insights on workout progress. Respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: 0.3, // Lower temperature for more consistent analysis
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      const analysis = JSON.parse(response)
      return {
        success: true,
        data: analysis,
        usage: completion.usage,
      }
    } catch (error) {
      console.error('OpenAI progress analysis error:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }
  },

  // Generate custom workout plan
  generateWorkoutPlan: async (userGoals, availableTime, equipment, experience) => {
    try {
      const prompt = promptTemplates.workoutPlan(userGoals, availableTime, equipment, experience)
      
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a certified personal trainer creating custom workout plans. Respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500, // Longer response for detailed plans
        temperature: 0.5,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      const workoutPlan = JSON.parse(response)
      return {
        success: true,
        data: workoutPlan,
        usage: completion.usage,
      }
    } catch (error) {
      console.error('OpenAI workout plan error:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }
  },

  // Analyze exercise form (future feature)
  analyzeForm: async (exerciseName, videoData) => {
    try {
      // This would integrate with OpenAI's vision capabilities
      // For now, return a placeholder
      return {
        success: true,
        data: {
          score: 85,
          feedback: 'Good form overall. Focus on keeping your back straight during the movement.',
          improvements: ['Maintain neutral spine', 'Control the eccentric phase']
        }
      }
    } catch (error) {
      console.error('OpenAI form analysis error:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }
  },
}

// Utility functions
export const aiUtils = {
  // Check if AI features are available
  isAvailable: () => {
    return config.features.aiRecommendations && config.openai.apiKey
  },

  // Get usage statistics
  calculateUsageCost: (usage) => {
    if (!usage) return 0
    
    // GPT-3.5-turbo pricing (as of 2024)
    const inputCostPer1K = 0.0015
    const outputCostPer1K = 0.002
    
    const inputCost = (usage.prompt_tokens / 1000) * inputCostPer1K
    const outputCost = (usage.completion_tokens / 1000) * outputCostPer1K
    
    return inputCost + outputCost
  },

  // Rate limiting helper
  checkRateLimit: (userTier, currentUsage) => {
    const limits = config.subscriptionTiers[userTier]?.limits
    if (!limits) return { allowed: false, reason: 'Invalid subscription tier' }

    if (limits.aiRecommendationsPerMonth === -1) {
      return { allowed: true }
    }

    if (currentUsage >= limits.aiRecommendationsPerMonth) {
      return { 
        allowed: false, 
        reason: `Monthly limit of ${limits.aiRecommendationsPerMonth} recommendations reached` 
      }
    }

    return { allowed: true, remaining: limits.aiRecommendationsPerMonth - currentUsage }
  },
}

// Fallback recommendations for when AI is unavailable
export const fallbackRecommendations = [
  {
    type: 'strength',
    title: 'Progressive Overload',
    description: 'Gradually increase weight, reps, or sets each week to continue making progress.',
    priority: 'high',
    action: 'Increase weight by 2.5-5lbs or add 1-2 reps to your main lifts',
    expectedOutcome: 'Continued strength gains and muscle growth'
  },
  {
    type: 'frequency',
    title: 'Training Consistency',
    description: 'Maintain a consistent workout schedule for optimal results.',
    priority: 'medium',
    action: 'Aim for 3-4 workouts per week with rest days in between',
    expectedOutcome: 'Better recovery and sustained progress'
  },
  {
    type: 'recovery',
    title: 'Rest and Recovery',
    description: 'Adequate rest is crucial for muscle growth and performance.',
    priority: 'medium',
    action: 'Ensure 7-9 hours of sleep and take rest days between intense sessions',
    expectedOutcome: 'Improved performance and reduced injury risk'
  },
]

export default openaiService
