import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SearchInput } from '../components/ui/Input'
import { sampleEvents } from '../data/sampleEvents'
import { 
  Plus, Calendar, Users, TrendingUp, Settings, 
  Edit3, Trash2, Eye, MoreHorizontal, Filter,
  BarChart3, PieChart, Download, Share2,
  Clock, MapPin, DollarSign, Star
} from 'lucide-react'
import { format, isAfter, isBefore, addDays } from 'date-fns'

const OrganizerDashboard = () => {
  const { theme, config } = useTheme()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [events, setEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showEventMenu, setShowEventMenu] = useState(null)
  
  // Mock organizer data
  const organizerData = {
    name: 'Alex Chen',
    email: 'alex@example.com',
    totalEvents: 24,
    totalAttendees: 1250,
    upcomingEvents: 8,
    revenue: 15750
  }
  
  useEffect(() => {
    // Filter events for this organizer (mock)
    const organizerEvents = sampleEvents.filter(event => 
      event.organizer === 'Alex Chen' || Math.random() > 0.7
    ).map(event => ({
      ...event,
      status: getEventStatus(new Date(event.date)),
      revenue: event.price.amount * event.attendees,
      rsvpRate: Math.round((event.attendees / event.capacity) * 100)
    }))
    setEvents(organizerEvents)
  }, [])
  
  const getEventStatus = (eventDate) => {
    const now = new Date()
    const weekFromNow = addDays(now, 7)
    
    if (isBefore(eventDate, now)) return 'past'
    if (isBefore(eventDate, weekFromNow)) return 'upcoming'
    return 'future'
  }
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus
    return matchesSearch && matchesFilter
  })
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'past':
        return 'bg-gray-100 text-gray-700'
      case 'upcoming':
        return theme === 'party' ? 'bg-party-primary bg-opacity-10 text-party-primary' : 'bg-conference-primary bg-opacity-10 text-conference-primary'
      case 'future':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }
  
  const StatCard = ({ icon: Icon, title, value, subtitle, trend }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${
          theme === 'party' ? 'bg-party-primary bg-opacity-10' : 'bg-conference-primary bg-opacity-10'
        }`}>
          <Icon className={`w-6 h-6 ${
            theme === 'party' ? 'text-party-primary' : 'text-conference-primary'
          }`} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
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
  
  const EventRow = ({ event }) => (
    <div className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
      theme === 'party' ? 'bg-party-surface border-party-primary border-opacity-20' : 'bg-conference-surface border-conference-primary border-opacity-20'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <img
            src={event.image}
            alt={event.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-semibold ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                {event.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            <div className={`flex items-center space-x-4 text-sm ${
              theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
            }`}>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {format(new Date(event.date), 'MMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {event.venue.name}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {event.attendees}/{event.capacity}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                ${event.revenue}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`text-right mr-4 ${
            theme === 'party' ? 'text-party-text' : 'text-conference-text'
          }`}>
            <div className="font-semibold">{event.rsvpRate}%</div>
            <div className={`text-xs ${
              theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
            }`}>
              RSVP Rate
            </div>
          </div>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEventMenu(showEventMenu === event.id ? null : event.id)}
              icon={<MoreHorizontal className="w-4 h-4" />}
            />
            
            {showEventMenu === event.id && (
              <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg border z-10 ${
                theme === 'party' ? 'bg-party-surface border-party-primary border-opacity-20' : 'bg-conference-surface border-conference-primary border-opacity-20'
              }`}>
                <div className="py-2">
                  <button
                    onClick={() => navigate(`/event/${event.id}`)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 transition-colors flex items-center ${
                      theme === 'party' ? 'text-party-text hover:bg-party-primary' : 'text-conference-text hover:bg-conference-primary'
                    }`}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Event
                  </button>
                  <button
                    onClick={() => navigate(`/create?edit=${event.id}`)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 transition-colors flex items-center ${
                      theme === 'party' ? 'text-party-text hover:bg-party-primary' : 'text-conference-text hover:bg-conference-primary'
                    }`}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Event
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Event
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  
  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          title="Total Events"
          value={organizerData.totalEvents}
          trend={12}
        />
        <StatCard
          icon={Users}
          title="Total Attendees"
          value={organizerData.totalAttendees.toLocaleString()}
          trend={8}
        />
        <StatCard
          icon={Clock}
          title="Upcoming Events"
          value={organizerData.upcomingEvents}
          subtitle="Next 30 days"
        />
        <StatCard
          icon={DollarSign}
          title="Revenue"
          value={`$${organizerData.revenue.toLocaleString()}`}
          trend={15}
        />
      </div>
      
      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className={`text-xl font-bold mb-4 ${
          theme === 'party' ? 'text-party-text' : 'text-conference-text'
        }`}>
          Quick Actions
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            variant="primary"
            onClick={() => navigate('/create')}
            icon={<Plus className="w-4 h-4" />}
            className="justify-start"
          >
            {config.copy.create}
          </Button>
          <Button
            variant="outline"
            icon={<BarChart3 className="w-4 h-4" />}
            className="justify-start"
          >
            View Analytics
          </Button>
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            className="justify-start"
          >
            Export Data
          </Button>
        </div>
      </Card>
      
      {/* Recent Events */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            theme === 'party' ? 'text-party-text' : 'text-conference-text'
          }`}>
            Recent Events
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('events')}
          >
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {events.slice(0, 3).map(event => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      </Card>
    </div>
  )
  
  const EventsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                theme === 'party'
                  ? 'bg-party-surface focus:ring-party-primary'
                  : 'bg-conference-surface focus:ring-conference-primary'
              }`}
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="future">Future</option>
              <option value="past">Past</option>
            </select>
            <Button
              variant="primary"
              onClick={() => navigate('/create')}
              icon={<Plus className="w-4 h-4" />}
            >
              New Event
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">
              {theme === 'party' ? '🎪' : '📊'}
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'party' ? 'text-party-text' : 'text-conference-text'
            }`}>
              No events found
            </h3>
            <p className={`mb-6 ${
              theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
            }`}>
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first event to get started'
              }
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/create')}
            >
              {config.copy.create}
            </Button>
          </Card>
        ) : (
          filteredEvents.map(event => (
            <EventRow key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  )
  
  const AnalyticsTab = () => (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={TrendingUp}
          title="Avg. RSVP Rate"
          value="78%"
          trend={5}
        />
        <StatCard
          icon={Star}
          title="Avg. Rating"
          value="4.6"
          subtitle="Based on feedback"
        />
        <StatCard
          icon={PieChart}
          title="Completion Rate"
          value="92%"
          trend={3}
        />
      </div>
      
      {/* Charts Placeholder */}
      <Card className="p-6">
        <h3 className={`text-xl font-bold mb-6 ${
          theme === 'party' ? 'text-party-text' : 'text-conference-text'
        }`}>
          Event Performance
        </h3>
        <div className={`h-64 rounded-xl flex items-center justify-center ${
          theme === 'party' ? 'bg-party-primary bg-opacity-5' : 'bg-conference-primary bg-opacity-5'
        }`}>
          <div className="text-center">
            <BarChart3 className={`w-12 h-12 mx-auto mb-4 ${
              theme === 'party' ? 'text-party-primary' : 'text-conference-primary'
            }`} />
            <p className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
              Analytics charts will be displayed here
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
  
  const tabs = [
    { id: 'overview', label: 'Overview', component: OverviewTab },
    { id: 'events', label: 'Events', component: EventsTab },
    { id: 'analytics', label: 'Analytics', component: AnalyticsTab }
  ]
  
  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || OverviewTab
  
  return (
    <div className={`min-h-screen pt-8 pb-16 ${
      theme === 'party' ? 'bg-party-background' : 'bg-conference-background'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold font-display ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                {theme === 'party' ? '🎉 ' : ''}Organizer Dashboard
              </h1>
              <p className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                Welcome back, {organizerData.name}!
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate('/create')}
              icon={<Plus className="w-4 h-4" />}
            >
              {config.copy.create}
            </Button>
          </div>
          
          {/* Tab Navigation */}
          <div className={`flex space-x-1 rounded-xl p-1 ${
            theme === 'party' ? 'bg-party-surface' : 'bg-conference-surface'
          }`}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? theme === 'party'
                      ? 'bg-party-primary text-white shadow-sm'
                      : 'bg-conference-primary text-white shadow-sm'
                    : theme === 'party'
                      ? 'text-party-text hover:bg-party-primary hover:bg-opacity-10'
                      : 'text-conference-text hover:bg-conference-primary hover:bg-opacity-10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        <ActiveComponent />
      </div>
    </div>
  )
}

export default OrganizerDashboard