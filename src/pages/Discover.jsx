import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../App'
import Button from '../components/ui/Button'
import { SearchInput } from '../components/ui/Input'
import { EventCard } from '../components/ui/Card'
import { sampleEvents, searchEvents, getEventCategories, filterEventsByCategory } from '../data/sampleEvents'
import { Search, Filter, Grid, Calendar, MapPin, Clock, Users, SlidersHorizontal } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns'

const Discover = () => {
  const { theme, config } = useTheme()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [view, setView] = useState('grid') // 'grid' or 'calendar'
  const [events, setEvents] = useState(sampleEvents)
  const [filteredEvents, setFilteredEvents] = useState(sampleEvents)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('date') // 'date', 'popularity', 'price'
  
  const categories = ['all', ...getEventCategories()]
  
  useEffect(() => {
    let filtered = [...sampleEvents]
    
    // Apply search filter
    if (searchQuery) {
      filtered = searchEvents(searchQuery, filtered)
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filterEventsByCategory(selectedCategory, filtered)
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date)
        case 'popularity':
          return b.attendees - a.attendees
        case 'price':
          return a.price.amount - b.price.amount
        default:
          return 0
      }
    })
    
    setFilteredEvents(filtered)
  }, [searchQuery, selectedCategory, sortBy])
  
  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query) {
      setSearchParams({ search: query })
    } else {
      setSearchParams({})
    }
  }
  
  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => 
      isSameDay(new Date(event.date), date)
    )
  }
  
  const CalendarView = () => {
    const monthStart = startOfMonth(selectedDate)
    const monthEnd = endOfMonth(selectedDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    return (
      <div className={`rounded-2xl p-6 ${
        theme === 'party' ? 'bg-party-surface shadow-soft' : 'bg-conference-surface shadow-sm'
      }`}>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${
            theme === 'party' ? 'text-party-text' : 'text-conference-text'
          }`}>
            {format(selectedDate, 'MMMM yyyy')}
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
            >
              ←
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
            >
              →
            </Button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={`p-2 text-center text-sm font-medium ${
              theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
            }`}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => {
            const dayEvents = getEventsForDate(day)
            const isCurrentMonth = isSameMonth(day, selectedDate)
            const isToday = isSameDay(day, new Date())
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isCurrentMonth
                    ? theme === 'party'
                      ? 'border-party-primary border-opacity-20 hover:bg-party-primary hover:bg-opacity-5'
                      : 'border-conference-primary border-opacity-20 hover:bg-conference-primary hover:bg-opacity-5'
                    : 'border-gray-200 opacity-50'
                } ${
                  isToday
                    ? theme === 'party'
                      ? 'bg-party-primary bg-opacity-10 border-party-primary'
                      : 'bg-conference-primary bg-opacity-10 border-conference-primary'
                    : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth
                    ? theme === 'party' ? 'text-party-text' : 'text-conference-text'
                    : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>
                
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/event/${event.id}`)}
                    className={`text-xs p-1 rounded mb-1 cursor-pointer truncate ${
                      theme === 'party'
                        ? 'bg-party-primary text-white hover:bg-party-secondary'
                        : 'bg-conference-primary text-white hover:bg-conference-secondary'
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
                
                {dayEvents.length > 2 && (
                  <div className={`text-xs ${
                    theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
                  }`}>
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  
  const GridView = () => {
    if (filteredEvents.length === 0) {
      return (
        <div className={`text-center py-16 rounded-2xl ${
          theme === 'party' ? 'bg-party-surface' : 'bg-conference-surface'
        }`}>
          <div className={`text-6xl mb-4`}>
            {theme === 'party' ? '🎭' : '📅'}
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'party' ? 'text-party-text' : 'text-conference-text'
          }`}>
            {config.copy.noEvents}
          </h3>
          <p className={`mb-6 ${
            theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
          }`}>
            {theme === 'party' 
              ? 'Try adjusting your search or browse different categories'
              : 'Try different search terms or explore other categories'
            }
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/create')}
          >
            {config.copy.create}
          </Button>
        </div>
      )
    }
    
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => navigate(`/event/${event.id}`)}
          />
        ))}
      </div>
    )
  }
  
  return (
    <div className={`min-h-screen pt-8 pb-16 ${
      theme === 'party' ? 'bg-party-background' : 'bg-conference-background'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold font-display mb-4 ${
            theme === 'party' ? 'text-party-text' : 'text-conference-text'
          }`}>
            {config.copy.discover}
          </h1>
          <p className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
            {theme === 'party'
              ? 'Find the perfect events to match your vibe and energy'
              : 'Discover professional events that advance your career and knowledge'
            }
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className={`rounded-2xl p-6 mb-8 ${
          theme === 'party' ? 'bg-party-surface shadow-soft' : 'bg-conference-surface shadow-sm'
        }`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <SearchInput
                placeholder={config.copy.search}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex rounded-xl border border-gray-200 p-1">
              <Button
                variant={view === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
                icon={<Grid className="w-4 h-4" />}
              >
                Grid
              </Button>
              <Button
                variant={view === 'calendar' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('calendar')}
                icon={<Calendar className="w-4 h-4" />}
              >
                Calendar
              </Button>
            </div>
            
            {/* Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters
            </Button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'party' ? 'text-party-text' : 'text-conference-text'
                  }`}>
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      theme === 'party'
                        ? 'bg-party-surface focus:ring-party-primary'
                        : 'bg-conference-surface focus:ring-conference-primary'
                    }`}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Sort Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'party' ? 'text-party-text' : 'text-conference-text'
                  }`}>
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      theme === 'party'
                        ? 'bg-party-surface focus:ring-party-primary'
                        : 'bg-conference-surface focus:ring-conference-primary'
                    }`}
                  >
                    <option value="date">Date</option>
                    <option value="popularity">Popularity</option>
                    <option value="price">Price</option>
                  </select>
                </div>
                
                {/* Results Count */}
                <div className="flex items-end">
                  <div className={`text-sm ${
                    theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
                  }`}>
                    {filteredEvents.length} events found
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Events Display */}
        {view === 'grid' ? <GridView /> : <CalendarView />}
      </div>
    </div>
  )
}

export default Discover