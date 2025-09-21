import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import Button, { CTAButton } from '../components/ui/Button'
import { SearchInput } from '../components/ui/Input'
import { EventCard } from '../components/ui/Card'
import { sampleEvents, getUpcomingEvents, searchEvents } from '../data/sampleEvents'
import { Search, Calendar, Users, Sparkles, TrendingUp, MapPin } from 'lucide-react'

const Landing = () => {
  const { theme, config } = useTheme()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  
  useEffect(() => {
    // Get featured events (mix of both themes)
    const upcoming = getUpcomingEvents()
    const featured = upcoming.slice(0, 6)
    setFeaturedEvents(featured)
  }, [])
  
  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/discover?search=${encodeURIComponent(query.trim())}`)
    } else {
      navigate('/discover')
    }
  }
  
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery)
    }
  }
  
  const stats = [
    { icon: Calendar, label: 'Events Created', value: '10,000+' },
    { icon: Users, label: 'Happy Attendees', value: '500K+' },
    { icon: MapPin, label: 'Cities', value: '50+' },
    { icon: TrendingUp, label: 'Success Rate', value: '98%' }
  ]
  
  const features = [
    {
      icon: Calendar,
      title: theme === 'party' ? 'Throw Epic Events' : 'Professional Event Management',
      description: theme === 'party' 
        ? 'Create unforgettable parties and social gatherings with our intuitive tools'
        : 'Streamline your professional events with comprehensive management features'
    },
    {
      icon: Search,
      title: theme === 'party' ? 'Find Your Vibe' : 'Discover Relevant Events',
      description: theme === 'party'
        ? 'Discover parties, concerts, and social events that match your energy'
        : 'Find conferences, workshops, and networking events in your field'
    },
    {
      icon: Users,
      title: theme === 'party' ? 'Connect & Celebrate' : 'Network & Learn',
      description: theme === 'party'
        ? 'Meet like-minded people and create lasting memories together'
        : 'Build professional relationships and expand your knowledge base'
    }
  ]
  
  return (
    <div className={`min-h-screen ${theme === 'party' ? 'theme-party' : 'theme-conference'}`}>
      {/* Hero Section */}
      <section className={`relative overflow-hidden ${config.animations.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Hero Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 animate-bounce-gentle" style={{
              backgroundColor: theme === 'party' ? '#8B5CF6' : '#0D9488',
              color: 'white'
            }}>
              <Sparkles className="w-4 h-4 mr-2" />
              {theme === 'party' ? '🎉 The ultimate party platform' : '📊 Professional event management'}
            </div>
            
            {/* Hero Title */}
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6 text-balance ${
              theme === 'party' ? 'text-party-text' : 'text-conference-text'
            }`}>
              {theme === 'party' ? (
                <>
                  Create <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Epic</span> Events
                </>
              ) : (
                <>
                  Professional <span className="bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent">Event</span> Platform
                </>
              )}
            </h1>
            
            {/* Hero Subtitle */}
            <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-balance ${
              theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
            }`}>
              {theme === 'party'
                ? 'From rooftop parties to music festivals - discover, create, and join the most amazing events in your city'
                : 'Streamline your professional events with powerful tools for conferences, workshops, and networking gatherings'
              }
            </p>
            
            {/* Hero Search */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <SearchInput
                  placeholder={config.copy.search}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleKeyDown}
                  size="lg"
                  className="pr-32"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <CTAButton
                    size="md"
                    onClick={() => handleSearch(searchQuery)}
                    icon={<Search className="w-4 h-4" />}
                  >
                    Search
                  </CTAButton>
                </div>
              </div>
            </div>
            
            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <CTAButton
                size="lg"
                onClick={() => navigate('/discover')}
                className="min-w-48"
              >
                {config.copy.discover}
              </CTAButton>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/create')}
                className="min-w-48"
                icon={<Calendar className="w-5 h-5" />}
              >
                {config.copy.create}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        {theme === 'party' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500 rounded-full opacity-20 animate-float" />
            <div className="absolute top-40 right-20 w-16 h-16 bg-cyan-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-yellow-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }} />
          </div>
        )}
      </section>
      
      {/* Stats Section */}
      <section className={`py-16 border-t ${
        theme === 'party' 
          ? 'bg-party-surface border-party-primary border-opacity-10' 
          : 'bg-conference-surface border-conference-primary border-opacity-10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                  theme === 'party'
                    ? 'bg-party-primary bg-opacity-10 text-party-primary'
                    : 'bg-conference-primary bg-opacity-10 text-conference-primary'
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`text-2xl md:text-3xl font-bold mb-2 ${
                  theme === 'party' ? 'text-party-text' : 'text-conference-text'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${
                  theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold font-display mb-4 ${
              theme === 'party' ? 'text-party-text' : 'text-conference-text'
            }`}>
              {theme === 'party' ? 'Everything you need to party' : 'Professional event management made simple'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
            }`}>
              {theme === 'party'
                ? 'From planning to partying, we\'ve got you covered'
                : 'Comprehensive tools for successful professional events'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`text-center p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                theme === 'party'
                  ? 'bg-party-surface shadow-soft hover:shadow-lift'
                  : 'bg-conference-surface shadow-sm hover:shadow-md'
              }`}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                  theme === 'party'
                    ? 'bg-gradient-to-br from-party-primary to-party-secondary text-white'
                    : 'bg-gradient-to-br from-conference-primary to-conference-secondary text-white'
                }`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  theme === 'party' ? 'text-party-text' : 'text-conference-text'
                }`}>
                  {feature.title}
                </h3>
                <p className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section className={`py-20 ${
        theme === 'party'
          ? 'bg-party-background'
          : 'bg-conference-background'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold font-display mb-4 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                {theme === 'party' ? 'Trending Events 🔥' : 'Featured Events'}
              </h2>
              <p className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                {theme === 'party' ? 'The hottest events everyone\'s talking about' : 'Discover upcoming professional events'}
              </p>
            </div>
            <Link to="/discover">
              <Button variant="outline">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/event/${event.id}`)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={`py-20 relative overflow-hidden ${
        theme === 'party' ? 'gradient-bg' : 'gradient-bg'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
            {theme === 'party' ? 'Ready to get this party started? 🎉' : 'Ready to elevate your events?'}
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-8">
            {theme === 'party'
              ? 'Join thousands of party-goers and event creators making memories'
              : 'Join thousands of professionals creating successful events'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/create')}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              {config.copy.create}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/discover')}
              className="border-white text-white hover:bg-white hover:text-gray-900"
            >
              {config.copy.discover}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing