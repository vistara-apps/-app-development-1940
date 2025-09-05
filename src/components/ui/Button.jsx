import React from 'react'

const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'default',
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg'
  
  const variants = {
    default: 'bg-dark-card text-dark-text hover:bg-gray-700 focus:ring-gray-500',
    primary: 'bg-primary text-white hover:bg-blue-600 focus:ring-primary',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-600 text-dark-text hover:bg-dark-card focus:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button