/**
 * Stripe Service
 * Handles payment processing and subscription management
 */

import { loadStripe } from '@stripe/stripe-js'
import { config } from '../config'

// Initialize Stripe
let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(config.stripe.publishableKey)
  }
  return stripePromise
}

// Stripe service functions
export const stripeService = {
  // Initialize Stripe instance
  getStripeInstance: async () => {
    try {
      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Failed to initialize Stripe')
      }
      return stripe
    } catch (error) {
      console.error('Stripe initialization error:', error)
      throw error
    }
  },

  // Create subscription checkout session
  createSubscriptionCheckout: async (priceId, userId, successUrl, cancelUrl) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl: successUrl || `${config.app.url}/subscription/success`,
          cancelUrl: cancelUrl || `${config.app.url}/subscription/cancel`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      
      const stripe = await getStripe()
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Checkout session error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },

  // Create customer portal session
  createCustomerPortal: async (customerId, returnUrl) => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: returnUrl || `${config.app.url}/profile`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url

      return { success: true }
    } catch (error) {
      console.error('Customer portal error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },

  // Get subscription details
  getSubscription: async (subscriptionId) => {
    try {
      const response = await fetch(`/api/subscription/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch subscription')
      }

      const subscription = await response.json()
      return {
        success: true,
        data: subscription,
      }
    } catch (error) {
      console.error('Get subscription error:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await fetch(`/api/subscription/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      const result = await response.json()
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error('Cancel subscription error:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }
  },

  // Update subscription
  updateSubscription: async (subscriptionId, newPriceId) => {
    try {
      const response = await fetch(`/api/subscription/${subscriptionId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPriceId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update subscription')
      }

      const result = await response.json()
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error('Update subscription error:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }
  },

  // Get customer details
  getCustomer: async (customerId) => {
    try {
      const response = await fetch(`/api/customer/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch customer')
      }

      const customer = await response.json()
      return {
        success: true,
        data: customer,
      }
    } catch (error) {
      console.error('Get customer error:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }
  },

  // Create payment intent for one-time payments
  createPaymentIntent: async (amount, currency = 'usd', metadata = {}) => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await response.json()
      return {
        success: true,
        clientSecret,
      }
    } catch (error) {
      console.error('Payment intent error:', error)
      return {
        success: false,
        error: error.message,
        clientSecret: null,
      }
    }
  },

  // Confirm payment
  confirmPayment: async (clientSecret, paymentMethod) => {
    try {
      const stripe = await getStripe()
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
      })

      if (error) {
        throw error
      }

      return {
        success: true,
        paymentIntent,
      }
    } catch (error) {
      console.error('Payment confirmation error:', error)
      return {
        success: false,
        error: error.message,
        paymentIntent: null,
      }
    }
  },
}

// Subscription utilities
export const subscriptionUtils = {
  // Get subscription tier from price ID
  getTierFromPriceId: (priceId) => {
    const tiers = config.subscriptionTiers
    for (const [tierName, tierData] of Object.entries(tiers)) {
      if (tierData.priceId === priceId) {
        return tierName
      }
    }
    return 'free'
  },

  // Check if user has access to feature
  hasFeatureAccess: (userTier, feature) => {
    const tierData = config.subscriptionTiers[userTier]
    if (!tierData) return false

    // Define feature access by tier
    const featureAccess = {
      free: ['basic_logging', 'limited_analytics'],
      pro: ['basic_logging', 'limited_analytics', 'advanced_analytics', 'ai_recommendations', 'export_data'],
      elite: ['basic_logging', 'limited_analytics', 'advanced_analytics', 'ai_recommendations', 'export_data', 'real_time_tracking', 'custom_plans', 'priority_support'],
    }

    return featureAccess[userTier]?.includes(feature) || false
  },

  // Check usage limits
  checkUsageLimit: (userTier, usageType, currentUsage) => {
    const tierData = config.subscriptionTiers[userTier]
    if (!tierData) return { allowed: false, reason: 'Invalid tier' }

    const limit = tierData.limits[usageType]
    if (limit === -1) return { allowed: true } // Unlimited

    if (currentUsage >= limit) {
      return {
        allowed: false,
        reason: `${usageType} limit reached (${limit})`,
        limit,
        current: currentUsage,
      }
    }

    return {
      allowed: true,
      limit,
      current: currentUsage,
      remaining: limit - currentUsage,
    }
  },

  // Format subscription status
  formatSubscriptionStatus: (subscription) => {
    if (!subscription) return 'No subscription'

    const statusMap = {
      active: 'Active',
      past_due: 'Past Due',
      canceled: 'Canceled',
      unpaid: 'Unpaid',
      incomplete: 'Incomplete',
      incomplete_expired: 'Incomplete (Expired)',
      trialing: 'Trial',
    }

    return statusMap[subscription.status] || subscription.status
  },

  // Calculate next billing date
  getNextBillingDate: (subscription) => {
    if (!subscription || !subscription.current_period_end) return null
    return new Date(subscription.current_period_end * 1000)
  },

  // Check if subscription is active
  isSubscriptionActive: (subscription) => {
    return subscription && ['active', 'trialing'].includes(subscription.status)
  },

  // Get subscription tier display name
  getTierDisplayName: (tier) => {
    return config.subscriptionTiers[tier]?.name || tier
  },

  // Get tier features
  getTierFeatures: (tier) => {
    return config.subscriptionTiers[tier]?.features || []
  },

  // Get tier price
  getTierPrice: (tier) => {
    return config.subscriptionTiers[tier]?.price || 0
  },
}

// Error handling
export const handleStripeError = (error) => {
  if (!error) return null

  const errorMap = {
    'card_declined': 'Your card was declined. Please try a different payment method.',
    'expired_card': 'Your card has expired. Please use a different card.',
    'insufficient_funds': 'Insufficient funds. Please check your account balance.',
    'incorrect_cvc': 'Your card\'s security code is incorrect.',
    'processing_error': 'An error occurred while processing your card. Please try again.',
    'rate_limit': 'Too many requests. Please wait a moment and try again.',
  }

  return errorMap[error.code] || error.message || 'An unexpected payment error occurred'
}

export default stripeService
