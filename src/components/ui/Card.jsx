import React from 'react'
import { useTheme } from '../../App'
import { getThemeClasses } from '../../utils/theme'

const Card = ({
  children,
  className = '',
  hover = true,
  padding = 'md',
  onClick,
  as = 'div',
  ...props
}) => {
  const { theme } = useTheme()
  
  const baseClasses = getThemeClasses(theme, 'card')
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  
  const hoverClasses = hover ? (theme === 'party' ? 'hover:-translate-y-1 hover:scale-[1.02]' : 'hover:-translate-y-0.5') : ''
  const clickableClasses = onClick ? 'cursor-pointer' : ''
  
  const combinedClasses = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  const Component = as
  
  return (
    <Component
      className={combinedClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(e)
        }
      } : undefined}
      {...props}
    >
      {children}
    </Component>
  )
}

// Event Card Component
export const EventCard = ({ event, onClick, className = '' }) => {
  const { theme, config } = useTheme()
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }
  
  const formatPrice = (price) => {
    if (price.type === 'free') return 'Free'
    return `$${price.amount}`
  }
  
  return (
    <Card 
      className={`overflow-hidden ${className}`} 
      onClick={onClick}
      padding="none"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            theme === 'party' 
              ? 'bg-party-primary text-white' 
              : 'bg-conference-primary text-white'
          }`}>
            {event.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.price.type === 'free'
              ? 'bg-green-500 text-white'
              : theme === 'party'
                ? 'bg-party-secondary text-white'
                : 'bg-conference-secondary text-white'
          }`}>
            {formatPrice(event.price)}
          </span>
        </div>
      </div>
      
      {/* Event Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-current line-clamp-2 flex-1">
            {event.title}
          </h3>
        </div>
        
        <p className={`text-sm mb-4 line-clamp-2 ${
          theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
        }`}>
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
              {formatDate(event.date)}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
              {event.venue.name}, {event.venue.city}
            </span>
          </div>
        </div>
        
        {/* Attendees and Organizer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={event.organizer.avatar} 
              alt={event.organizer.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className={`text-xs ${
              theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
            }`}>
              {event.organizer.name}
            </span>
            {event.organizer.verified && (
              <svg className={`w-3 h-3 ml-1 ${
                theme === 'party' ? 'text-party-primary' : 'text-conference-primary'
              }`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          <div className="flex items-center text-xs">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
              {event.attendees}/{event.capacity}
            </span>
          </div>
        </div>
        
        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className={`px-2 py-1 text-xs rounded-md ${
                  theme === 'party'
                    ? 'bg-party-primary bg-opacity-10 text-party-primary'
                    : 'bg-conference-primary bg-opacity-10 text-conference-primary'
                }`}
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className={`px-2 py-1 text-xs rounded-md ${
                theme === 'party'
                  ? 'bg-gray-100 text-party-text-secondary'
                  : 'bg-gray-100 text-conference-text-secondary'
              }`}>
                +{event.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export { Card }
export default Card