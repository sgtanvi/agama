import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../App'
import Button from './ui/Button'
import { Menu, X, Search, Calendar, Plus, User, Settings } from 'lucide-react'

const Navigation = () => {
  const { theme, toggleTheme, config, user } = useTheme()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isActive = (path) => location.pathname === path
  
  const navLinks = [
    { path: '/', label: 'Home', icon: null },
    { path: '/discover', label: config.copy.discover, icon: Search },
    { path: '/create', label: config.copy.create, icon: Plus },
  ]
  
  const userLinks = user ? [
    { path: '/dashboard', label: 'Dashboard', icon: User },
    { path: '/organizer', label: 'My Events', icon: Calendar },
  ] : []
  
  const NavLink = ({ to, children, icon: Icon, mobile = false }) => {
    const active = isActive(to)
    const baseClasses = mobile 
      ? 'flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200'
      : 'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200'
    
    const activeClasses = active
      ? theme === 'party'
        ? 'bg-party-primary text-white shadow-md'
        : 'bg-conference-primary text-white shadow-md'
      : theme === 'party'
        ? 'text-party-text hover:bg-party-primary hover:bg-opacity-10 hover:text-party-primary'
        : 'text-conference-text hover:bg-conference-primary hover:bg-opacity-10 hover:text-conference-primary'
    
    return (
      <Link
        to={to}
        className={`${baseClasses} ${activeClasses}`}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
      >
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {children}
      </Link>
    )
  }
  
  const ThemeToggle = ({ mobile = false }) => {
    const buttonClasses = mobile ? 'w-full justify-start' : ''
    
    return (
      <Button
        variant="ghost"
        size={mobile ? 'md' : 'sm'}
        onClick={toggleTheme}
        className={buttonClasses}
        icon={
          <span className="text-lg">
            {theme === 'party' ? '📊' : '🎉'}
          </span>
        }
      >
        {mobile && (
          <span className="ml-2">
            Switch to {theme === 'party' ? 'Conference' : 'Party'} Mode
          </span>
        )}
      </Button>
    )
  }
  
  const AuthButtons = ({ mobile = false }) => {
    if (user) {
      return (
        <div className={`flex ${mobile ? 'flex-col space-y-2' : 'items-center space-x-2'}`}>
          <div className={`flex items-center ${mobile ? 'px-4 py-2' : 'px-3 py-1'} rounded-lg ${
            theme === 'party' ? 'bg-party-surface' : 'bg-conference-surface'
          }`}>
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'} 
              alt={user.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className={`text-sm font-medium ${
              theme === 'party' ? 'text-party-text' : 'text-conference-text'
            }`}>
              {user.name}
            </span>
          </div>
          <Button
            variant="outline"
            size={mobile ? 'md' : 'sm'}
            onClick={() => {/* Handle logout */}}
            className={mobile ? 'w-full' : ''}
          >
            Sign Out
          </Button>
        </div>
      )
    }
    
    return (
      <div className={`flex ${mobile ? 'flex-col space-y-2' : 'items-center space-x-2'}`}>
        <Button
          variant="ghost"
          size={mobile ? 'md' : 'sm'}
          onClick={() => {/* Handle login */}}
          className={mobile ? 'w-full justify-start' : ''}
        >
          Sign In
        </Button>
        <Button
          variant="primary"
          size={mobile ? 'md' : 'sm'}
          onClick={() => {/* Handle signup */}}
          className={mobile ? 'w-full' : ''}
        >
          {config.copy.cta}
        </Button>
      </div>
    )
  }
  
  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
      theme === 'party'
        ? 'bg-party-background bg-opacity-90 border-party-primary border-opacity-20'
        : 'bg-conference-background bg-opacity-90 border-conference-primary border-opacity-20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
              theme === 'party'
                ? 'bg-gradient-to-br from-party-primary to-party-secondary'
                : 'bg-gradient-to-br from-conference-primary to-conference-secondary'
            }`}>
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className={`text-xl font-bold font-display ${
              theme === 'party' ? 'text-party-text' : 'text-conference-text'
            }`}>
              Orbit
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-opacity-20 font-medium">
              {config.icon}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} icon={link.icon}>
                {link.label}
              </NavLink>
            ))}
            {userLinks.map((link) => (
              <NavLink key={link.path} to={link.path} icon={link.icon}>
                {link.label}
              </NavLink>
            ))}
          </div>
          
          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <AuthButtons />
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              icon={isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t transition-all duration-300 ${
          theme === 'party'
            ? 'bg-party-background border-party-primary border-opacity-20'
            : 'bg-conference-background border-conference-primary border-opacity-20'
        }`}>
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} icon={link.icon} mobile>
                {link.label}
              </NavLink>
            ))}
            {userLinks.map((link) => (
              <NavLink key={link.path} to={link.path} icon={link.icon} mobile>
                {link.label}
              </NavLink>
            ))}
            
            {/* Mobile Theme Toggle */}
            <div className="pt-2 border-t border-opacity-20">
              <ThemeToggle mobile />
            </div>
            
            {/* Mobile Auth */}
            <div className="pt-2">
              <AuthButtons mobile />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation