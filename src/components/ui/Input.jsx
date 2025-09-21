import React, { forwardRef } from 'react'
import { useTheme } from '../../App'
import { getThemeClasses } from '../../utils/theme'

const Input = forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  error,
  label,
  helperText,
  required = false,
  className = '',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = true,
  ...props
}, ref) => {
  const { theme } = useTheme()
  
  const baseClasses = getThemeClasses(theme, 'input')
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  }
  
  const focusClasses = theme === 'party'
    ? 'focus:ring-party-primary focus:border-party-primary'
    : 'focus:ring-conference-primary focus:border-conference-primary'
  
  const errorClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300'
  
  const disabledClasses = disabled
    ? 'bg-gray-50 cursor-not-allowed opacity-50'
    : theme === 'party'
      ? 'bg-party-surface'
      : 'bg-conference-surface'
  
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const inputClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${focusClasses}
    ${errorClasses}
    ${disabledClasses}
    ${widthClasses}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  const labelClasses = `block text-sm font-medium mb-2 ${
    theme === 'party' ? 'text-party-text' : 'text-conference-text'
  }`
  
  const helperTextClasses = `mt-2 text-sm ${
    error
      ? 'text-red-600'
      : theme === 'party'
        ? 'text-party-text-secondary'
        : 'text-conference-text-secondary'
  }`
  
  const iconClasses = `absolute ${iconPosition === 'left' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 ${
    theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
  }`
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText || error ? `${props.id || 'input'}-helper` : undefined}
          {...props}
        />
      </div>
      
      {(helperText || error) && (
        <p id={`${props.id || 'input'}-helper`} className={helperTextClasses}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Search Input Component
export const SearchInput = forwardRef(({
  placeholder,
  onSearch,
  ...props
}, ref) => {
  const { theme, config } = useTheme()
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.target.value)
    }
  }
  
  return (
    <Input
      ref={ref}
      type="search"
      placeholder={placeholder || config.copy.search}
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
})

SearchInput.displayName = 'SearchInput'

// Email Input Component
export const EmailInput = forwardRef((props, ref) => {
  return (
    <Input
      ref={ref}
      type="email"
      placeholder="Enter your email"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
      }
      {...props}
    />
  )
})

EmailInput.displayName = 'EmailInput'

// Password Input Component
export const PasswordInput = forwardRef(({
  showPassword = false,
  onTogglePassword,
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      placeholder="Enter your password"
      icon={
        <button
          type="button"
          onClick={onTogglePassword}
          className="focus:outline-none"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      }
      iconPosition="right"
      {...props}
    />
  )
})

PasswordInput.displayName = 'PasswordInput'

export default Input