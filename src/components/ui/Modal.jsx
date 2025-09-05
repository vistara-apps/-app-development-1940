import React from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-dark-surface border border-gray-800 rounded-lg shadow-modal w-full max-w-md mx-4 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-dark-text">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-card rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-dark-muted" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal