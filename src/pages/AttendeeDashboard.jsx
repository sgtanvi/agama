import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import Button from '../components/ui/Button'
import { Card, EventCard } from '../components/ui/Card'
import { SearchInput } from '../components/ui/Input'
import { sampleEvents, searchEvents, getEventCategories } from '../data/sampleEvents'
import { 
  Calendar, Clock, MapPin, Users, Star, Heart,
  Download, Share2, QrCode, Ticket, TrendingUp,
  Filter, Bell, Settings, Gift, Award, Zap
} from 'lucide-react'
import { format, isAfter, isBefore, addDays, isPast } from 'date-fns'

const AttendeeDashboard = () => {
  const { theme, config } = useTheme()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  
  // Mock user data
  const userData = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    memberSince: '2023-01-15',
    totalEvents: 18,
    upcomingEvents: 5,
    favoriteCategories: ['Music', 'Art & Culture', 'Food & Drink'],
    points: 1250,
    level: 'Gold Member'
  }
  
  // Mock user's events
  const [userEvents, setUserEvents] = useState({
    upcoming: [],
    past: [],
    favorites: [],
    tickets: []
  })
  
  const [recommendations, setRecommendations] = useState([])
  
  useEffect(() => {
    // Simulate user's registered events
    const mockUpcoming = sampleEvents
      .filter(event => isAfter(new Date(event.date), new Date()))
      .slice(0, 5)
      .map(event => ({
        ...event,
        registrationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        ticketId: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${event.id}`,
        status: 'confirmed'
      }))
    
    const mockPast = sampleEvents
      .filter(event => isBefore(new Date(event.date), new Date()))
      .slice(0, 8)
      .map(event => ({
        ...event,
        attended: Math.random() > 0.2,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        feedback: Math.random() > 0.5 ? 'Great event!' : null
      }))
    
    const mockFavorites = sampleEvents.slice(0, 6)
    
    setUserEvents({
      upcoming: mockUpcoming,
      past: mockPast,
      favorites: mockFavorites,
      tickets: mockUpcoming
    })
    
    // Generate recommendations based on user preferences
    const mockRecommendations = sampleEvents
      .filter(event => 
        userData.favoriteCategories.includes(event.category) &&
        isAfter(new Date(event.date), new Date())
      )
      .slice(0, 6)
      .map(event => ({
        ...event,
        reason: `Because you love ${event.category} events`,
        matchScore: Math.floor(Math.random() * 30) + 70 // 70-100% match
      }))
    
    setRecommendations(mockRecommendations)
  }, [])
  
  const categories = ['all', ...getEventCategories()]
  
  const filteredRecommendations = recommendations.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${
          color === 'primary'
            ? theme === 'party' ? 'bg-party-primary bg-opacity-10' : 'bg-conference-primary bg-opacity-10'
            : color === 'secondary'
              ? theme === 'party' ? 'bg-party-secondary bg-opacity-10' : 'bg-conference-secondary bg-opacity-10'
              : 'bg-yellow-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            color === 'primary'
              ? theme === 'party' ? 'text-party-primary' : 'text-conference-primary'
              : color === 'secondary'
                ? theme === 'party' ? 'text-party-secondary' : 'text-conference-secondary'
                : 'text-yellow-600'
          }`} />
        </div>
      </div>
      <div className={`text-2xl font-bold mb-1 ${
        theme === 'party' ? 'text-party-text' : 'text-conference-text'
      }`}>
        {value}
      </div>
      <div className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
        {title}
      </div>
      {subtitle && (
        <div className={`text-sm mt-1 ${
          theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
        }`}>
          {subtitle}
        </div>
      )}
    </Card>
  )
  
  const TicketCard = ({ event }) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={event.image}
            alt={event.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h3 className={`font-semibold mb-1 ${
              theme === 'party' ? 'text-party-text' : 'text-conference-text'
            }`}>
              {event.title}
            </h3>
            <div className={`flex items-center text-sm ${
              theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
            }`}>
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(event.date), 'MMM d, yyyy')}
            </div>
            <div className={`flex items-center text-sm ${
              theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
            }`}>
              <MapPin className="w-4 h-4 mr-1" />
              {event.venue.name}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-xs font-medium mb-1 ${
            theme === 'party' ? 'text-party-primary' : 'text-conference-primary'
          }`}>
            {event.status.toUpperCase()}
          </div>
          <div className={`text-xs ${
            theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
          }`}>
            {event.ticketId}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<QrCode className="w-4 h-4" />}
          >
            QR Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
          >
            Download
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/event/${event.id}`)}
        >
          View Event
        </Button>
      </div>
    </Card>
  )
  
  const PastEventCard = ({ event }) => (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <img
          src={event.image}
          alt={event.title}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-semibold ${
              theme === 'party' ? 'text-party-text' : 'text-conference-text'
            }`}>
              {event.title}
            </h3>
            {event.attended && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                theme === 'party'
                  ? 'bg-party-primary bg-opacity-10 text-party-primary'
                  : 'bg-conference-primary bg-opacity-10 text-conference-primary'
              }`}>
                Attended
              </span>
            )}
          </div>
          
          <div className={`flex items-center text-sm mb-2 ${
            theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
          }`}>
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(event.date), 'MMM d, yyyy')}
          </div>
          
          {event.attended && event.rating && (
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < event.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-sm ${
                theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
              }`}>
                Your rating
              </span>
            </div>
          )}
          
          {event.feedback && (
            <p className={`text-sm italic ${
              theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
            }`}>
              "{event.feedback}"
            </p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/event/${event.id}`)}
        >
          View Details
        </Button>
        
        {event.attended && !event.feedback && (
          <Button
            variant="outline"
            size="sm"
          >
            Leave Feedback
          </Button>
        )}
      </div>
    </Card>
  )
  
  const RecommendationCard = ({ event }) => (
    <div className="relative">
      <EventCard
        event={event}
        onClick={() => navigate(`/event/${event.id}`)}
      />
      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
        theme === 'party'
          ? 'bg-party-secondary text-white'
          : 'bg-conference-secondary text-white'
      }`}>
        {event.matchScore}% match
      </div>
      <div className={`mt-2 text-xs ${
        theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
      }`}>
        {event.reason}
      </div>
    </div>
  )
  
  const tabs = [
    { id: 'upcoming', label: 'Upcoming Events', count: userEvents.upcoming.length },
    { id: 'tickets', label: 'My Tickets', count: userEvents.tickets.length },
    { id: 'past', label: 'Past Events', count: userEvents.past.length },
    { id: 'favorites', label: 'Favorites', count: userEvents.favorites.length },
    { id: 'recommendations', label: 'For You', count: recommendations.length }
  ]
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'upcoming':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userEvents.upcoming.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/event/${event.id}`)}
              />
            ))}
          </div>
        )
        
      case 'tickets':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {userEvents.tickets.map(event => (
              <TicketCard key={event.id} event={event} />
            ))}
          </div>
        )
        
      case 'past':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {userEvents.past.map(event => (
              <PastEventCard key={event.id} event={event} />
            ))}
          </div>
        )
        
      case 'favorites':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userEvents.favorites.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/event/${event.id}`)}
              />
            ))}
          </div>
        )
        
      case 'recommendations':
        return (
          <div>
            {/* Search and Filters */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Search recommendations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
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
              </div>
            </Card>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendations.map(event => (
                <RecommendationCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )
        
      default:
        return null
    }
  }
  
  return (
    <div className={`min-h-screen pt-8 pb-16 ${
      theme === 'party' ? 'bg-party-background' : 'bg-conference-background'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold font-display ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                {theme === 'party' ? '🎊 ' : ''}Welcome back, {userData.name.split(' ')[0]}!
              </h1>
              <p className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                {theme === 'party'
                  ? 'Ready for your next adventure?'
                  : 'Manage your events and discover new opportunities'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`text-right mr-4 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                <div className="font-semibold">{userData.level}</div>
                <div className={`text-sm flex items-center ${
                  theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
                }`}>
                  <Zap className="w-4 h-4 mr-1" />
                  {userData.points} points
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                icon={<Bell className="w-4 h-4" />}
              />
              <Button
                variant="ghost"
                size="sm"
                icon={<Settings className="w-4 h-4" />}
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Calendar}
              title="Total Events"
              value={userData.totalEvents}
              subtitle="All time"
            />
            <StatCard
              icon={Clock}
              title="Upcoming"
              value={userData.upcomingEvents}
              subtitle="Next 30 days"
              color="secondary"
            />
            <StatCard
              icon={Award}
              title="Points Earned"
              value={userData.points}
              subtitle="This year"
              color="gold"
            />
            <StatCard
              icon={TrendingUp}
              title="Member Since"
              value={format(new Date(userData.memberSince), 'MMM yyyy')}
              subtitle={userData.level}
            />
          </div>
          
          {/* Tab Navigation */}
          <div className={`flex space-x-1 rounded-xl p-1 overflow-x-auto ${
            theme === 'party' ? 'bg-party-surface' : 'bg-conference-surface'
          }`}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? theme === 'party'
                      ? 'bg-party-primary text-white shadow-sm'
                      : 'bg-conference-primary text-white shadow-sm'
                    : theme === 'party'
                      ? 'text-party-text hover:bg-party-primary hover:bg-opacity-10'
                      : 'text-conference-text hover:bg-conference-primary hover:bg-opacity-10'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-white bg-opacity-20'
                      : theme === 'party'
                        ? 'bg-party-primary bg-opacity-10 text-party-primary'
                        : 'bg-conference-primary bg-opacity-10 text-conference-primary'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        {renderTabContent()}
        
        {/* Empty State */}
        {((activeTab === 'upcoming' && userEvents.upcoming.length === 0) ||
          (activeTab === 'tickets' && userEvents.tickets.length === 0) ||
          (activeTab === 'past' && userEvents.past.length === 0) ||
          (activeTab === 'favorites' && userEvents.favorites.length === 0)) && (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">
              {activeTab === 'upcoming' && (theme === 'party' ? '🎪' : '📅')}
              {activeTab === 'tickets' && '🎫'}
              {activeTab === 'past' && '📚'}
              {activeTab === 'favorites' && '❤️'}
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'party' ? 'text-party-text' : 'text-conference-text'
            }`}>
              {activeTab === 'upcoming' && 'No upcoming events'}
              {activeTab === 'tickets' && 'No tickets yet'}
              {activeTab === 'past' && 'No past events'}
              {activeTab === 'favorites' && 'No favorites yet'}
            </h3>
            <p className={`mb-6 ${
              theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
            }`}>
              {activeTab === 'upcoming' && (theme === 'party' 
                ? 'Time to find your next adventure!'
                : 'Discover events that match your interests'
              )}
              {activeTab === 'tickets' && 'Register for events to see your tickets here'}
              {activeTab === 'past' && 'Attend some events to build your history'}
              {activeTab === 'favorites' && 'Save events you love to find them easily later'}
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/discover')}
            >
              {config.copy.discover}
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AttendeeDashboard