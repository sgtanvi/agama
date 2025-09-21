import React from 'react'
import { useTheme } from '../../App'
import { getThemeClasses, getCopy } from '../../utils/theme'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}) => {
  const { theme } = useTheme()

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  const variantClasses = {
    primary: getThemeClasses(theme, 'button').primary,
    secondary: getThemeClasses(theme, 'button').secondary,
    outline: getThemeClasses(theme, 'button').outline,
    ghost: `hover:bg-opacity-10 ${theme === 'party' ? 'hover:bg-party-primary text-party-primary' : 'hover:bg-conference-primary text-conference-primary'}`,
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95'
  }

  const focusClasses = theme === 'party' 
    ? 'focus:ring-party-primary' 
    : 'focus:ring-conference-primary'

  const widthClasses = fullWidth ? 'w-full' : ''

  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${focusClasses}
    ${widthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  const renderIcon = () => {
    if (loading) {
      return (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )
    }
    
    if (icon) {
      return (
        <span className={iconPosition === 'right' ? 'ml-2' : 'mr-2'}>
          {icon}
        </span>
      )
    }
    
    return null
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={combinedClasses}
      aria-disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {loading ? (
        theme === 'party' ? 'Getting the party started...' : 'Processing...'
      ) : (
        children
      )}
      {iconPosition === 'right' && renderIcon()}
    </button>
  )
}

// Preset button components for common use cases
export const PrimaryButton = (props) => <Button variant="primary" {...props} />
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />
export const OutlineButton = (props) => <Button variant="outline" {...props} />
export const GhostButton = (props) => <Button variant="ghost" {...props} />
export const DangerButton = (props) => <Button variant="danger" {...props} />
export const SuccessButton = (props) => <Button variant="success" {...props} />

// Theme-aware CTA button
export const CTAButton = ({ children, ...props }) => {
  const { theme, config } = useTheme()
  
  return (
    <PrimaryButton {...props}>
      {children || config.copy.cta}
    </PrimaryButton>
  )
}

export default Button