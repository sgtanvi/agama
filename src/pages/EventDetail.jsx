import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { sampleEvents } from '../data/sampleEvents'
import { 
  Calendar, Clock, MapPin, Users, Share2, Heart, 
  Star, ChevronLeft, ExternalLink, Download,
  MessageCircle, Camera, Music, Utensils, Car
} from 'lucide-react'
import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme, config } = useTheme()
  const [event, setEvent] = useState(null)
  const [isRSVPed, setIsRSVPed] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showRSVPModal, setShowRSVPModal] = useState(false)
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    email: '',
    guests: 1,
    dietaryRestrictions: '',
    specialRequests: ''
  })
  
  useEffect(() => {
    const foundEvent = sampleEvents.find(e => e.id === parseInt(id))
    if (foundEvent) {
      setEvent(foundEvent)
      // Simulate checking if user has already RSVP'd
      setIsRSVPed(Math.random() > 0.7)
      setIsFavorited(Math.random() > 0.8)
    }
  }, [id])
  
  if (!event) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'party' ? 'bg-party-background' : 'bg-conference-background'
      }`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className={`text-2xl font-bold mb-4 ${
            theme === 'party' ? 'text-party-text' : 'text-conference-text'
          }`}>
            Event Not Found
          </h2>
          <Button onClick={() => navigate('/discover')}>Back to Discover</Button>
        </div>
      </div>
    )
  }
  
  const eventDate = new Date(event.date)
  const isEventPast = isPast(eventDate)
  const isEventFuture = isFuture(eventDate)
  
  const handleRSVP = () => {
    if (isRSVPed) {
      setIsRSVPed(false)
    } else {
      setShowRSVPModal(true)
    }
  }
  
  const submitRSVP = () => {
    setIsRSVPed(true)
    setShowRSVPModal(false)
    // Reset form
    setRsvpForm({
      name: '',
      email: '',
      guests: 1,
      dietaryRestrictions: '',
      specialRequests: ''
    })
  }
  
  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }
  
  const addToCalendar = () => {
    const startDate = new Date(event.date)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.venue.name + ', ' + event.venue.address)}`
    
    window.open(googleCalendarUrl, '_blank')
  }
  
  const getEventIcon = (category) => {
    const iconMap = {
      'Music': Music,
      'Food': Utensils,
      'Art': Camera,
      'Tech': ExternalLink,
      'Business': Users,
      'Sports': Star
    }
    const IconComponent = iconMap[category] || Calendar
    return <IconComponent className="w-5 h-5" />
  }
  
  const RSVPModal = () => {
    if (!showRSVPModal) return null
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`max-w-md w-full rounded-2xl p-6 ${
          theme === 'party' ? 'bg-party-surface' : 'bg-conference-surface'
        }`}>
          <h3 className={`text-xl font-bold mb-4 ${
            theme === 'party' ? 'text-party-text' : 'text-conference-text'
          }`}>
            {config.copy.rsvp} for {event.title}
          </h3>
          
          <form onSubmit={(e) => { e.preventDefault(); submitRSVP(); }} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={rsvpForm.name}
                onChange={(e) => setRsvpForm({...rsvpForm, name: e.target.value})}
                className={`w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  theme === 'party'
                    ? 'bg-party-surface focus:ring-party-primary'
                    : 'bg-conference-surface focus:ring-conference-primary'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Email *
              </label>
              <input
                type="email"
                required
                value={rsvpForm.email}
                onChange={(e) => setRsvpForm({...rsvpForm, email: e.target.value})}
                className={`w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  theme === 'party'
                    ? 'bg-party-surface focus:ring-party-primary'
                    : 'bg-conference-surface focus:ring-conference-primary'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Number of Guests
              </label>
              <select
                value={rsvpForm.guests}
                onChange={(e) => setRsvpForm({...rsvpForm, guests: parseInt(e.target.value)})}
                className={`w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  theme === 'party'
                    ? 'bg-party-surface focus:ring-party-primary'
                    : 'bg-conference-surface focus:ring-conference-primary'
                }`}
              >
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Dietary Restrictions
              </label>
              <input
                type="text"
                value={rsvpForm.dietaryRestrictions}
                onChange={(e) => setRsvpForm({...rsvpForm, dietaryRestrictions: e.target.value})}
                placeholder="e.g., Vegetarian, Gluten-free"
                className={`w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  theme === 'party'
                    ? 'bg-party-surface focus:ring-party-primary'
                    : 'bg-conference-surface focus:ring-conference-primary'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Special Requests
              </label>
              <textarea
                value={rsvpForm.specialRequests}
                onChange={(e) => setRsvpForm({...rsvpForm, specialRequests: e.target.value})}
                placeholder="Any special accommodations needed?"
                rows={3}
                className={`w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${
                  theme === 'party'
                    ? 'bg-party-surface focus:ring-party-primary'
                    : 'bg-conference-surface focus:ring-conference-primary'
                }`}
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRSVPModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
              >
                {config.copy.confirm}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`min-h-screen ${
      theme === 'party' ? 'bg-party-background' : 'bg-conference-background'
    }`}>
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Back
        </Button>
        
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className={`bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 ${
              isFavorited ? 'text-red-400' : ''
            }`}
            icon={<Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={shareEvent}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            icon={<Share2 className="w-4 h-4" />}
          />
        </div>
        
        {/* Event Title */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center space-x-2 mb-2">
            {event.tags.map(tag => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  theme === 'party'
                    ? 'bg-party-primary text-white'
                    : 'bg-conference-primary text-white'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {event.title}
          </h1>
          <p className="text-white/90 text-lg">
            {event.description}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <Card className="p-6">
              <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Event Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Calendar className={`w-5 h-5 mt-1 ${
                    theme === 'party' ? 'text-party-primary' : 'text-conference-primary'
                  }`} />
                  <div>
                    <div className={`font-medium ${
                      theme === 'party' ? 'text-party-text' : 'text-conference-text'
                    }`}>
                      {format(eventDate, 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                      {formatDistanceToNow(eventDate, { addSuffix: true })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className={`w-5 h-5 mt-1 ${
                    theme === 'party' ? 'text-party-primary' : 'text-conference-primary'
                  }`} />
                  <div>
                    <div className={`font-medium ${
                      theme === 'party' ? 'text-party-text' : 'text-conference-text'
                    }`}>
                      {format(eventDate, 'h:mm a')}
                    </div>
                    <div className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                      Duration: 2-3 hours
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className={`w-5 h-5 mt-1 ${
                    theme === 'party' ? 'text-party-primary' : 'text-conference-primary'
                  }`} />
                  <div>
                    <div className={`font-medium ${
                      theme === 'party' ? 'text-party-text' : 'text-conference-text'
                    }`}>
                      {event.venue.name}
                    </div>
                    <div className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                      {event.venue.address}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className={`w-5 h-5 mt-1 ${
                    theme === 'party' ? 'text-party-primary' : 'text-conference-primary'
                  }`} />
                  <div>
                    <div className={`font-medium ${
                      theme === 'party' ? 'text-party-text' : 'text-conference-text'
                    }`}>
                      {event.attendees} attending
                    </div>
                    <div className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                      {event.capacity - event.attendees} spots left
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Organizer Info */}
            <Card className="p-6">
              <h3 className={`text-xl font-bold mb-4 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Organizer
              </h3>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  theme === 'party' ? 'bg-party-primary' : 'bg-conference-primary'
                }`}>
                  {event.organizer.charAt(0)}
                </div>
                <div>
                  <div className={`font-medium ${
                    theme === 'party' ? 'text-party-text' : 'text-conference-text'
                  }`}>
                    {event.organizer}
                  </div>
                  <div className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                    Event Organizer
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </Card>
            
            {/* Description */}
            <Card className="p-6">
              <h3 className={`text-xl font-bold mb-4 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                About This Event
              </h3>
              <div className={`prose max-w-none ${
                theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
              }`}>
                <p>{event.description}</p>
                <p>
                  {theme === 'party'
                    ? 'Get ready for an unforgettable experience filled with amazing people, great vibes, and memories that will last a lifetime. Come as you are and leave with new friends!'
                    : 'Join industry professionals and thought leaders for an enriching experience designed to expand your knowledge, build meaningful connections, and advance your career.'
                  }
                </p>
              </div>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className={`text-3xl font-bold mb-2 ${
                  theme === 'party' ? 'text-party-primary' : 'text-conference-primary'
                }`}>
                  {event.price.amount === 0 ? 'FREE' : `$${event.price.amount}`}
                </div>
                {event.price.amount > 0 && (
                  <div className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                    per person
                  </div>
                )}
              </div>
              
              {isEventPast ? (
                <Button variant="outline" disabled className="w-full mb-4">
                  Event Ended
                </Button>
              ) : (
                <Button
                  variant={isRSVPed ? "outline" : "primary"}
                  onClick={handleRSVP}
                  className="w-full mb-4"
                >
                  {isRSVPed ? 'Cancel RSVP' : config.copy.rsvp}
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={addToCalendar}
                className="w-full"
                icon={<Download className="w-4 h-4" />}
              >
                Add to Calendar
              </Button>
            </Card>
            
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" icon={<MapPin className="w-4 h-4" />}>
                  Get Directions
                </Button>
                <Button variant="outline" className="w-full justify-start" icon={<Car className="w-4 h-4" />}>
                  Find Parking
                </Button>
                <Button variant="outline" className="w-full justify-start" icon={<Share2 className="w-4 h-4" />}>
                  Share Event
                </Button>
              </div>
            </Card>
            
            {/* Event Stats */}
            <Card className="p-6">
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Event Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                    Attending
                  </span>
                  <span className={`font-medium ${
                    theme === 'party' ? 'text-party-text' : 'text-conference-text'
                  }`}>
                    {event.attendees}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                    Capacity
                  </span>
                  <span className={`font-medium ${
                    theme === 'party' ? 'text-party-text' : 'text-conference-text'
                  }`}>
                    {event.capacity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                    Category
                  </span>
                  <span className={`font-medium flex items-center ${
                    theme === 'party' ? 'text-party-text' : 'text-conference-text'
                  }`}>
                    {getEventIcon(event.category)}
                    <span className="ml-2">{event.category}</span>
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <RSVPModal />
    </div>
  )
}

export default EventDetail