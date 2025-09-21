// Theme configuration and utilities

export const THEMES = {
  PARTY: 'party',
  CONFERENCE: 'conference'
}

export const themeConfig = {
  [THEMES.PARTY]: {
    name: 'Party Mode',
    icon: '🎉',
    colors: {
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      accent: '#F59E0B',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280'
    },
    tone: 'playful',
    copy: {
      cta: '🎉 Get on the list',
      ctaSecondary: '✨ Join the fun',
      discover: 'Find your vibe',
      create: 'Throw an epic event',
      rsvp: 'Count me in!',
      tickets: 'Grab your spot',
      welcome: 'Ready to party?',
      search: 'What\'s your mood?',
      noEvents: 'No parties yet... be the first! 🎊',
      loading: 'Getting the party started...',
      success: 'You\'re in! 🎉',
      error: 'Oops! Party foul 😅'
    },
    animations: {
      hover: 'hover:-translate-y-1 hover:scale-105',
      click: 'active:scale-95',
      entrance: 'animate-bounce-gentle',
      background: 'confetti-bg'
    }
  },
  [THEMES.CONFERENCE]: {
    name: 'Conference Mode',
    icon: '📊',
    colors: {
      primary: '#0D9488',
      secondary: '#3B82F6',
      accent: '#059669',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#0F172A',
      textSecondary: '#475569'
    },
    tone: 'professional',
    copy: {
      cta: 'Register',
      ctaSecondary: 'Learn more',
      discover: 'Explore events',
      create: 'Create professional event',
      rsvp: 'Register now',
      tickets: 'Secure your seat',
      welcome: 'Welcome to professional networking',
      search: 'Find relevant events',
      noEvents: 'No events scheduled. Create one to get started.',
      loading: 'Loading events...',
      success: 'Registration confirmed',
      error: 'Registration failed. Please try again.'
    },
    animations: {
      hover: 'hover:-translate-y-0.5',
      click: 'active:scale-98',
      entrance: 'animate-slide-up',
      background: 'grid-bg'
    }
  }
}

// Helper functions
export const getThemeConfig = (theme) => {
  return themeConfig[theme] || themeConfig[THEMES.PARTY]
}

export const getThemeClasses = (theme, element = 'default') => {
  const config = getThemeConfig(theme)
  
  const classMap = {
    default: `theme-${theme}`,
    button: {
      primary: `btn btn-primary ${config.animations.hover} ${config.animations.click}`,
      secondary: `btn btn-secondary ${config.animations.hover} ${config.animations.click}`,
      outline: `btn btn-outline border-current ${config.animations.hover} ${config.animations.click}`
    },
    card: `card ${config.animations.hover}`,
    input: 'input focus:ring-current',
    background: config.animations.background,
    text: {
      primary: theme === THEMES.PARTY ? 'text-party-text' : 'text-conference-text',
      secondary: theme === THEMES.PARTY ? 'text-party-text-secondary' : 'text-conference-text-secondary',
      accent: theme === THEMES.PARTY ? 'text-party-primary' : 'text-conference-primary'
    }
  }
  
  return classMap[element] || classMap.default
}

export const getCopy = (theme, key, fallback = '') => {
  const config = getThemeConfig(theme)
  return config.copy[key] || fallback
}

export const getThemeColor = (theme, colorKey) => {
  const config = getThemeConfig(theme)
  return config.colors[colorKey]
}

// Theme detection based on event type
export const detectThemeFromEvent = (event) => {
  const partyKeywords = ['party', 'celebration', 'birthday', 'wedding', 'festival', 'concert', 'nightlife', 'social']
  const conferenceKeywords = ['conference', 'seminar', 'workshop', 'meeting', 'business', 'professional', 'networking', 'corporate']
  
  const eventText = `${event.title} ${event.description} ${event.category}`.toLowerCase()
  
  const hasPartyKeywords = partyKeywords.some(keyword => eventText.includes(keyword))
  const hasConferenceKeywords = conferenceKeywords.some(keyword => eventText.includes(keyword))
  
  if (hasPartyKeywords && !hasConferenceKeywords) return THEMES.PARTY
  if (hasConferenceKeywords && !hasPartyKeywords) return THEMES.CONFERENCE
  
  // Default based on time of day or other factors
  const eventHour = new Date(event.date).getHours()
  return eventHour >= 18 || eventHour <= 2 ? THEMES.PARTY : THEMES.CONFERENCE
}