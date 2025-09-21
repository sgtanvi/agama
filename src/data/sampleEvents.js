import { addDays, addHours, subDays } from 'date-fns'

// Sample events data with both party and conference themes
export const sampleEvents = [
  // Party Mode Events
  {
    id: '1',
    title: 'Summer Rooftop Party 🌅',
    description: 'Join us for an unforgettable summer evening with amazing city views, craft cocktails, and live DJ sets. Dance under the stars!',
    category: 'Party',
    type: 'social',
    date: addDays(new Date(), 7),
    endDate: addHours(addDays(new Date(), 7), 5),
    venue: {
      name: 'Sky Lounge',
      address: '123 High Street, Downtown',
      city: 'San Francisco',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    organizer: {
      name: 'Party Collective',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop',
    price: { amount: 25, currency: 'USD', type: 'paid' },
    capacity: 150,
    attendees: 89,
    tags: ['rooftop', 'cocktails', 'dj', 'dancing', 'sunset'],
    theme: 'party',
    status: 'upcoming',
    rsvpRequired: true,
    ageRestriction: '21+'
  },
  {
    id: '2',
    title: 'Neon Glow Paint Party 🎨',
    description: 'Get messy and creative! Glow-in-the-dark paint, UV lights, and non-stop beats. Wear white clothes and prepare to shine!',
    category: 'Party',
    type: 'creative',
    date: addDays(new Date(), 12),
    endDate: addHours(addDays(new Date(), 12), 4),
    venue: {
      name: 'Warehouse 51',
      address: '789 Industrial Blvd',
      city: 'Oakland',
      coordinates: { lat: 37.8044, lng: -122.2712 }
    },
    organizer: {
      name: 'Glow Events',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    price: { amount: 35, currency: 'USD', type: 'paid' },
    capacity: 200,
    attendees: 156,
    tags: ['paint', 'glow', 'creative', 'warehouse', 'unique'],
    theme: 'party',
    status: 'upcoming',
    rsvpRequired: true,
    ageRestriction: '18+'
  },
  {
    id: '3',
    title: 'Vintage Vinyl Night 🎵',
    description: 'Bring your favorite vinyl records and discover new music. Classic cocktails, retro vibes, and good company guaranteed.',
    category: 'Music',
    type: 'social',
    date: addDays(new Date(), 5),
    endDate: addHours(addDays(new Date(), 5), 6),
    venue: {
      name: 'The Record Room',
      address: '456 Music Lane',
      city: 'Berkeley',
      coordinates: { lat: 37.8715, lng: -122.2730 }
    },
    organizer: {
      name: 'Vinyl Collective',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: false
    },
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
    price: { amount: 0, currency: 'USD', type: 'free' },
    capacity: 80,
    attendees: 34,
    tags: ['vinyl', 'music', 'retro', 'cocktails', 'community'],
    theme: 'party',
    status: 'upcoming',
    rsvpRequired: true,
    ageRestriction: '21+'
  },
  {
    id: '4',
    title: 'Beach Bonfire Bash 🔥',
    description: 'End the week right with a beach bonfire, s\'mores, acoustic music, and ocean views. Bring a blanket and your best stories!',
    category: 'Outdoor',
    type: 'social',
    date: addDays(new Date(), 3),
    endDate: addHours(addDays(new Date(), 3), 4),
    venue: {
      name: 'Ocean Beach',
      address: 'Great Highway & Balboa',
      city: 'San Francisco',
      coordinates: { lat: 37.7594, lng: -122.5107 }
    },
    organizer: {
      name: 'Beach Vibes Co',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=400&fit=crop',
    price: { amount: 15, currency: 'USD', type: 'paid' },
    capacity: 50,
    attendees: 42,
    tags: ['beach', 'bonfire', 'acoustic', 'outdoor', 'sunset'],
    theme: 'party',
    status: 'upcoming',
    rsvpRequired: true,
    ageRestriction: 'All ages'
  },
  {
    id: '5',
    title: 'Masquerade Ball 🎭',
    description: 'An elegant evening of mystery and glamour. Formal attire and masks required. Live orchestra, gourmet dining, and dancing.',
    category: 'Formal',
    type: 'celebration',
    date: addDays(new Date(), 21),
    endDate: addHours(addDays(new Date(), 21), 6),
    venue: {
      name: 'Grand Ballroom',
      address: '100 Luxury Ave',
      city: 'San Francisco',
      coordinates: { lat: 37.7849, lng: -122.4094 }
    },
    organizer: {
      name: 'Elegant Events',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    price: { amount: 125, currency: 'USD', type: 'paid' },
    capacity: 300,
    attendees: 187,
    tags: ['masquerade', 'formal', 'elegant', 'dancing', 'gourmet'],
    theme: 'party',
    status: 'upcoming',
    rsvpRequired: true,
    ageRestriction: '21+'
  },

  // Conference Mode Events
  {
    id: '6',
    title: 'Tech Innovation Summit 2024',
    description: 'Join industry leaders for insights on AI, blockchain, and emerging technologies. Keynotes, panels, and networking opportunities.',
    category: 'Technology',
    type: 'conference',
    date: addDays(new Date(), 14),
    endDate: addHours(addDays(new Date(), 14), 8),
    venue: {
      name: 'Convention Center',
      address: '747 Howard Street',
      city: 'San Francisco',
      coordinates: { lat: 37.7849, lng: -122.4094 }
    },
    organizer: {
      name: 'TechForward Inc',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    price: { amount: 299, currency: 'USD', type: 'paid' },
    capacity: 500,
    attendees: 423,
    tags: ['technology', 'AI', 'blockchain', 'networking', 'innovation'],
    theme: 'conference',
    status: 'upcoming',
    rsvpRequired: true,
    ageRestriction: 'Professional'
  },
  {
    id: '7',
    title: 'Sustainable Business Workshop',
    description: 'Learn practical strategies for building sustainable business practices. Expert speakers, case studies, and actionable frameworks.',
    category: 'Business',
    type: 'workshop',
    date: addDays(new Date(), 9),
    endDate: addHours(addDays(new Date(), 9), 6),
    venue: {
      name: 'Green Building',
      address: '321 Eco Street',
      city: 'Palo Alto',
      coordinates: { lat: 37.4419, lng: -122.1430 }
    },
    organizer: {
      name: 'Sustainability Institute',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop',
    price: { amount: 149, currency: 'USD', type: 'paid' },
    capacity: 100,
    attendees: 78,
    tags: ['sustainability', 'business', 'workshop', 'environment', 'strategy'],
    theme: 'conference',
    status: 'upcoming',
    rsvpRequired: true,
    ageRestriction: 'Professional'
  },
  {
    id: '8',
    title: 'Digital Marketing Masterclass',
    description: 'Master the latest digital marketing strategies. SEO, social media, content marketing, and analytics. Hands-on sessions included.',
    category: 'Marketing',
    type: 'seminar',
    date: addDays(new Date(), 6),
    endDate: addHours(addDays(new Date(), 6), 7),
    venue: {
      name: 'Innovation Hub',
      address: '555 Market Street',
      city: 'San Francisco',
      coordinates: { lat: 37.7898, lng: -122.3972 }
    },
    organizer: {
      name: 'Digital Growth Academy',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    price: { amount: 199, currency: 'USD', type: 'paid' },
    capacity: 150,
    attendees: 134,
    tags: ['marketing', 'digital', 'SEO', 'social media', 'analytics'],
    theme: 'conference',
    status: 'upcoming',
    rsvpRequired: true,
    ageRestriction: 'Professional'
  },
  {
    id: '9',
    title: 'Healthcare Innovation Forum',
    description: 'Exploring the future of healthcare technology. Telemedicine, AI diagnostics, and patient care innovations. CME credits available.',
    category: 'Healthcare',
    type: 'conference',
    date: addDays(new Date(), 18),
    endDate: addHours(addDays(new Date(), 18), 8),
    venue: {
      name: 'Medical Center Auditorium',
      address: '1001 Health Plaza',
      city: 'San Francisco',
      coordinates: { lat: 37.7849, lng: -122.4094 }
    },
    organizer: {
      name: 'HealthTech Alliance',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
    price: { amount: 349, currency: 'USD', type: 'paid' },
    capacity: 300,
    attendees: 267,
    tags: ['healthcare', 'innovation', 'telemedicine', 'AI', 'CME'],
    theme: 'conference',
    status: 'upcoming',
    rsvpRequired: true,
    ageRestriction: 'Healthcare professionals'
  },
  {
    id: '10',
    title: 'Startup Pitch Competition',
    description: 'Watch emerging startups pitch to top investors. Networking, mentorship opportunities, and cash prizes for winners.',
    category: 'Entrepreneurship',
    type: 'competition',
    date: addDays(new Date(), 11),
    endDate: addHours(addDays(new Date(), 11), 5),
    venue: {
      name: 'Startup Incubator',
      address: '200 Innovation Drive',
      city: 'Mountain View',
      coordinates: { lat: 37.3861, lng: -122.0839 }
    },
    organizer: {
      name: 'Venture Catalyst',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    price: { amount: 0, currency: 'USD', type: 'free' },
    capacity: 200,
    attendees: 156,
    tags: ['startup', 'pitch', 'investors', 'networking', 'entrepreneurship'],
    theme: 'conference',
    status: 'upcoming',
    rsvpRequired: true,
    ageRestriction: 'Open to all'
  },

  // Past events for dashboard history
  {
    id: '11',
    title: 'Wine Tasting Evening',
    description: 'An intimate wine tasting featuring local vineyards.',
    category: 'Food & Drink',
    type: 'social',
    date: subDays(new Date(), 5),
    endDate: addHours(subDays(new Date(), 5), 3),
    venue: {
      name: 'Wine Cellar',
      address: '123 Grape Street',
      city: 'Napa',
      coordinates: { lat: 38.2975, lng: -122.2869 }
    },
    organizer: {
      name: 'Napa Events',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=400&fit=crop',
    price: { amount: 75, currency: 'USD', type: 'paid' },
    capacity: 40,
    attendees: 38,
    tags: ['wine', 'tasting', 'local', 'intimate'],
    theme: 'party',
    status: 'completed',
    rsvpRequired: true,
    ageRestriction: '21+'
  },
  {
    id: '12',
    title: 'Data Science Bootcamp',
    description: 'Intensive 3-day bootcamp covering machine learning fundamentals.',
    category: 'Education',
    type: 'workshop',
    date: subDays(new Date(), 10),
    endDate: addHours(subDays(new Date(), 10), 24),
    venue: {
      name: 'Tech Campus',
      address: '789 Learning Ave',
      city: 'San Jose',
      coordinates: { lat: 37.3382, lng: -121.8863 }
    },
    organizer: {
      name: 'Data Academy',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    price: { amount: 599, currency: 'USD', type: 'paid' },
    capacity: 50,
    attendees: 47,
    tags: ['data science', 'machine learning', 'bootcamp', 'intensive'],
    theme: 'conference',
    status: 'completed',
    rsvpRequired: true,
    ageRestriction: 'Professional'
  }
]

// Helper functions
export const getEventsByTheme = (theme) => {
  return sampleEvents.filter(event => event.theme === theme)
}

export const getUpcomingEvents = () => {
  return sampleEvents.filter(event => event.status === 'upcoming')
}

export const getPastEvents = () => {
  return sampleEvents.filter(event => event.status === 'completed')
}

export const getEventById = (id) => {
  return sampleEvents.find(event => event.id === id)
}

export const searchEvents = (query, events = sampleEvents) => {
  const searchTerm = query.toLowerCase()
  return events.filter(event => 
    event.title.toLowerCase().includes(searchTerm) ||
    event.description.toLowerCase().includes(searchTerm) ||
    event.category.toLowerCase().includes(searchTerm) ||
    event.venue.city.toLowerCase().includes(searchTerm) ||
    event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

export const filterEventsByCategory = (category, events = sampleEvents) => {
  return events.filter(event => event.category === category)
}

export const getEventCategories = () => {
  const categories = [...new Set(sampleEvents.map(event => event.category))]
  return categories.sort()
}