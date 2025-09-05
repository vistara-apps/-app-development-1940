import React from 'react'

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  className = '' 
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-dark-text mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 bg-dark-card border border-gray-700 rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
      />
    </div>
  )
}

export default Input