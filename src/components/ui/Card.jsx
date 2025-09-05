import React from 'react'

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-dark-surface border border-gray-800 rounded-lg p-6 shadow-dark-card ${className}`}>
      {children}
    </div>
  )
}

export default Card