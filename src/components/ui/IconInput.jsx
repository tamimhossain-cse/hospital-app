import React from 'react';

/**
 * Input component with icon support
 * Provides a reusable input field with an icon on the left or right side
 */
const IconInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  disabled = false,
  className = '',
  helperText = '',
  icon = null,
  iconPosition = 'left',
  ...props
}) => {
  const inputClasses = `
    w-full
    py-2.5
    pr-4
    border
    rounded-lg
    focus:outline-none
    focus:ring-2
    focus:ring-primary-500
    focus:border-transparent
    transition-colors
    duration-200
    ${error ? 'border-danger-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${icon && iconPosition === 'left' ? 'pl-11' : 'pl-4'}
    ${icon && iconPosition === 'right' ? 'pr-11' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const iconColor = error ? 'text-danger-500' : 'text-gray-400';

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className={`w-5 h-5 ${iconColor}`}>{icon}</span>
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <span className={`w-5 h-5 ${iconColor}`}>{icon}</span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default IconInput;
