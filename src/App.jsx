import React, { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Landing from './pages/Landing'
import Discover from './pages/Discover'
import EventDetail from './pages/EventDetail'
import OrganizerDashboard from './pages/OrganizerDashboard'
import AttendeeDashboard from './pages/AttendeeDashboard'
import CreateEvent from './pages/CreateEvent'

// Theme Context
const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('party') // 'party' or 'conference'
  const [user, setUser] = useState(null) // Mock user state for now

  const toggleTheme = () => {
    setTheme(prev => prev === 'party' ? 'conference' : 'party')
  }

  const themeConfig = {
    party: {
      name: 'Party Mode',
      colors: {
        primary: '#8B5CF6',
        secondary: '#06B6D4',
        accent: '#F59E0B'
      },
      tone: 'playful',
      copy: {
        cta: '🎉 Get on the list',
        discover: 'Find your vibe',
        create: 'Throw an epic event'
      },
      animations: {
        background: 'bg-gradient-to-br from-party-primary via-party-secondary to-party-accent'
      }
    },
    conference: {
      name: 'Conference Mode',
      colors: {
        primary: '#0D9488',
        secondary: '#3B82F6',
        accent: '#059669'
      },
      tone: 'professional',
      copy: {
        cta: 'Register',
        discover: 'Explore events',
        create: 'Create professional event'
      },
      animations: {
        background: 'bg-gradient-to-br from-conference-primary via-conference-secondary to-conference-accent'
      }
    }
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    config: themeConfig[theme],
    user,
    setUser
  }

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`
  }, [theme])

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${theme} min-h-screen transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/create" element={<CreateEvent />} />
              <Route path="/organizer" element={<OrganizerDashboard />} />
              <Route path="/dashboard" element={<AttendeeDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App