import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../App'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SearchInput } from '../components/ui/Input'
import { 
  Calendar, Clock, MapPin, Users, DollarSign, 
  Image, Tag, FileText, Settings, ChevronLeft,
  ChevronRight, Upload, X, Plus, Minus
} from 'lucide-react'
import { format, addDays } from 'date-fns'

const CreateEvent = () => {
  const { theme, config } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    category: '',
    tags: [],
    
    // Date & Time
    date: '',
    time: '',
    duration: 2,
    timezone: 'PST',
    
    // Location
    venue: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      capacity: 100
    },
    isVirtual: false,
    virtualLink: '',
    
    // Pricing
    isFree: true,
    price: {
      amount: 0,
      currency: 'USD'
    },
    
    // Media
    image: '',
    gallery: [],
    
    // Settings
    isPublic: true,
    requiresApproval: false,
    allowGuestList: true,
    maxAttendees: 100,
    
    // Additional
    requirements: '',
    agenda: []
  })
  
  const [newTag, setNewTag] = useState('')
  const [newAgendaItem, setNewAgendaItem] = useState({ time: '', title: '', description: '' })
  
  const categories = [
    'Music', 'Food & Drink', 'Art & Culture', 'Sports & Fitness',
    'Technology', 'Business', 'Education', 'Health & Wellness',
    'Community', 'Entertainment', 'Networking', 'Other'
  ]
  
  const steps = [
    { id: 1, title: 'Basic Info', icon: FileText },
    { id: 2, title: 'Date & Time', icon: Calendar },
    { id: 3, title: 'Location', icon: MapPin },
    { id: 4, title: 'Pricing', icon: DollarSign },
    { id: 5, title: 'Media', icon: Image },
    { id: 6, title: 'Settings', icon: Settings }
  ]
  
  useEffect(() => {
    if (editId) {
      // Load existing event data for editing
      // This would typically fetch from an API
      console.log('Loading event for editing:', editId)
    }
  }, [editId])
  
  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }
  
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }
  
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }
  
  const addAgendaItem = () => {
    if (newAgendaItem.time && newAgendaItem.title) {
      setFormData(prev => ({
        ...prev,
        agenda: [...prev.agenda, { ...newAgendaItem, id: Date.now() }]
      }))
      setNewAgendaItem({ time: '', title: '', description: '' })
    }
  }
  
  const removeAgendaItem = (id) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.filter(item => item.id !== id)
    }))
  }
  
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSubmit = () => {
    // Validate and submit form
    console.log('Submitting event:', formData)
    // This would typically send to an API
    navigate('/organizer')
  }
  
  const InputField = ({ label, type = 'text', field, placeholder, required = false, ...props }) => (
    <div>
      <label className={`block text-sm font-medium mb-2 ${
        theme === 'party' ? 'text-party-text' : 'text-conference-text'
      }`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={field.includes('.') ? formData[field.split('.')[0]][field.split('.')[1]] : formData[field]}
        onChange={(e) => updateFormData(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
          theme === 'party'
            ? 'bg-party-surface focus:ring-party-primary'
            : 'bg-conference-surface focus:ring-conference-primary'
        }`}
        {...props}
      />
    </div>
  )
  
  const TextAreaField = ({ label, field, placeholder, rows = 4, required = false }) => (
    <div>
      <label className={`block text-sm font-medium mb-2 ${
        theme === 'party' ? 'text-party-text' : 'text-conference-text'
      }`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={formData[field]}
        onChange={(e) => updateFormData(field, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${
          theme === 'party'
            ? 'bg-party-surface focus:ring-party-primary'
            : 'bg-conference-surface focus:ring-conference-primary'
        }`}
      />
    </div>
  )
  
  const SelectField = ({ label, field, options, required = false }) => (
    <div>
      <label className={`block text-sm font-medium mb-2 ${
        theme === 'party' ? 'text-party-text' : 'text-conference-text'
      }`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={formData[field]}
        onChange={(e) => updateFormData(field, e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
          theme === 'party'
            ? 'bg-party-surface focus:ring-party-primary'
            : 'bg-conference-surface focus:ring-conference-primary'
        }`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
  
  const CheckboxField = ({ label, field, description }) => (
    <div className="flex items-start space-x-3">
      <input
        type="checkbox"
        checked={formData[field]}
        onChange={(e) => updateFormData(field, e.target.checked)}
        className={`mt-1 w-4 h-4 rounded border-gray-300 focus:ring-2 ${
          theme === 'party' ? 'text-party-primary focus:ring-party-primary' : 'text-conference-primary focus:ring-conference-primary'
        }`}
      />
      <div>
        <label className={`font-medium ${
          theme === 'party' ? 'text-party-text' : 'text-conference-text'
        }`}>
          {label}
        </label>
        {description && (
          <p className={`text-sm ${
            theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'
          }`}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
  
  const StepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <InputField
              label="Event Title"
              field="title"
              placeholder={theme === 'party' ? "What's the party called?" : "Enter event title"}
              required
            />
            
            <TextAreaField
              label="Description"
              field="description"
              placeholder={theme === 'party' 
                ? "Tell everyone what makes this event special and fun!"
                : "Provide a detailed description of your event"
              }
              required
            />
            
            <SelectField
              label="Category"
              field="category"
              options={categories}
              required
            />
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Tags
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add a tag"
                  className={`flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    theme === 'party'
                      ? 'bg-party-surface focus:ring-party-primary'
                      : 'bg-conference-surface focus:ring-conference-primary'
                  }`}
                />
                <Button onClick={addTag} variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
                      theme === 'party'
                        ? 'bg-party-primary bg-opacity-10 text-party-primary'
                        : 'bg-conference-primary bg-opacity-10 text-conference-primary'
                    }`}
                  >
                    <span>{tag}</span>
                    <button onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Date"
                type="date"
                field="date"
                required
                min={format(new Date(), 'yyyy-MM-dd')}
              />
              <InputField
                label="Start Time"
                type="time"
                field="time"
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'party' ? 'text-party-text' : 'text-conference-text'
                }`}>
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={formData.duration}
                  onChange={(e) => updateFormData('duration', parseFloat(e.target.value))}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    theme === 'party'
                      ? 'bg-party-surface focus:ring-party-primary'
                      : 'bg-conference-surface focus:ring-conference-primary'
                  }`}
                />
              </div>
              <SelectField
                label="Timezone"
                field="timezone"
                options={['PST', 'MST', 'CST', 'EST', 'UTC']}
              />
            </div>
            
            {/* Agenda Builder */}
            <div>
              <label className={`block text-sm font-medium mb-4 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Event Agenda (Optional)
              </label>
              
              <div className="space-y-4">
                {formData.agenda.map(item => (
                  <div key={item.id} className={`p-4 rounded-xl border ${
                    theme === 'party' ? 'border-party-primary border-opacity-20' : 'border-conference-primary border-opacity-20'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className={`font-medium ${
                          theme === 'party' ? 'text-party-text' : 'text-conference-text'
                        }`}>
                          {item.time} - {item.title}
                        </div>
                        {item.description && (
                          <div className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                            {item.description}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAgendaItem(item.id)}
                        icon={<X className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                ))}
                
                <div className={`p-4 rounded-xl border-2 border-dashed ${
                  theme === 'party' ? 'border-party-primary border-opacity-30' : 'border-conference-primary border-opacity-30'
                }`}>
                  <div className="grid md:grid-cols-3 gap-3 mb-3">
                    <input
                      type="time"
                      value={newAgendaItem.time}
                      onChange={(e) => setNewAgendaItem({...newAgendaItem, time: e.target.value})}
                      placeholder="Time"
                      className={`px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        theme === 'party'
                          ? 'bg-party-surface focus:ring-party-primary'
                          : 'bg-conference-surface focus:ring-conference-primary'
                      }`}
                    />
                    <input
                      type="text"
                      value={newAgendaItem.title}
                      onChange={(e) => setNewAgendaItem({...newAgendaItem, title: e.target.value})}
                      placeholder="Activity title"
                      className={`px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        theme === 'party'
                          ? 'bg-party-surface focus:ring-party-primary'
                          : 'bg-conference-surface focus:ring-conference-primary'
                      }`}
                    />
                    <input
                      type="text"
                      value={newAgendaItem.description}
                      onChange={(e) => setNewAgendaItem({...newAgendaItem, description: e.target.value})}
                      placeholder="Description (optional)"
                      className={`px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        theme === 'party'
                          ? 'bg-party-surface focus:ring-party-primary'
                          : 'bg-conference-surface focus:ring-conference-primary'
                      }`}
                    />
                  </div>
                  <Button onClick={addAgendaItem} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Agenda
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
        
      case 3:
        return (
          <div className="space-y-6">
            <CheckboxField
              label="Virtual Event"
              field="isVirtual"
              description="This event will be held online"
            />
            
            {formData.isVirtual ? (
              <InputField
                label="Virtual Meeting Link"
                field="virtualLink"
                placeholder="https://zoom.us/j/..."
                required
              />
            ) : (
              <div className="space-y-6">
                <InputField
                  label="Venue Name"
                  field="venue.name"
                  placeholder="Enter venue name"
                  required
                />
                
                <InputField
                  label="Address"
                  field="venue.address"
                  placeholder="Street address"
                  required
                />
                
                <div className="grid md:grid-cols-3 gap-4">
                  <InputField
                    label="City"
                    field="venue.city"
                    placeholder="City"
                    required
                  />
                  <InputField
                    label="State"
                    field="venue.state"
                    placeholder="State"
                    required
                  />
                  <InputField
                    label="ZIP Code"
                    field="venue.zipCode"
                    placeholder="ZIP"
                    required
                  />
                </div>
                
                <InputField
                  label="Venue Capacity"
                  type="number"
                  field="venue.capacity"
                  placeholder="Maximum attendees"
                  min="1"
                  required
                />
              </div>
            )}
          </div>
        )
        
      case 4:
        return (
          <div className="space-y-6">
            <CheckboxField
              label="Free Event"
              field="isFree"
              description="This event is free to attend"
            />
            
            {!formData.isFree && (
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Ticket Price"
                  type="number"
                  field="price.amount"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
                <SelectField
                  label="Currency"
                  field="price.currency"
                  options={['USD', 'EUR', 'GBP', 'CAD']}
                />
              </div>
            )}
            
            <InputField
              label="Maximum Attendees"
              type="number"
              field="maxAttendees"
              placeholder="Enter maximum number of attendees"
              min="1"
              required
            />
          </div>
        )
        
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Event Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => updateFormData('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  theme === 'party'
                    ? 'bg-party-surface focus:ring-party-primary'
                    : 'bg-conference-surface focus:ring-conference-primary'
                }`}
              />
              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Event preview"
                    className="w-full h-48 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className={`border-2 border-dashed rounded-xl p-8 text-center ${
              theme === 'party' ? 'border-party-primary border-opacity-30' : 'border-conference-primary border-opacity-30'
            }`}>
              <Upload className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'party' ? 'text-party-primary' : 'text-conference-primary'
              }`} />
              <p className={`mb-2 ${
                theme === 'party' ? 'text-party-text' : 'text-conference-text'
              }`}>
                Upload Event Images
              </p>
              <p className={theme === 'party' ? 'text-party-text-secondary' : 'text-conference-text-secondary'}>
                Drag and drop images here, or click to browse
              </p>
              <Button variant="outline" className="mt-4">
                Choose Files
              </Button>
            </div>
          </div>
        )
        
      case 6:
        return (
          <div className="space-y-6">
            <CheckboxField
              label="Public Event"
              field="isPublic"
              description="Anyone can find and view this event"
            />
            
            <CheckboxField
              label="Require Approval"
              field="requiresApproval"
              description="Manually approve each registration"
            />
            
            <CheckboxField
              label="Allow Guest List"
              field="allowGuestList"
              description="Attendees can bring guests"
            />
            
            <TextAreaField
              label="Special Requirements"
              field="requirements"
              placeholder={theme === 'party'
                ? "Any special requirements or things attendees should know?"
                : "List any requirements, dress code, or important information"
              }
              rows={3}
            />
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            icon={<ChevronLeft className="w-4 h-4" />}
            className="mb-4"
          >
            Back
          </Button>
          
          <h1 className={`text-3xl md:text-4xl font-bold font-display mb-4 ${
            theme === 'party' ? 'text-party-text' : 'text-conference-text'
          }`}>
            {editId ? 'Edit Event' : config.copy.create}
          </h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    isActive
                      ? theme === 'party'
                        ? 'bg-party-primary border-party-primary text-white'
                        : 'bg-conference-primary border-conference-primary text-white'
                      : isCompleted
                        ? theme === 'party'
                          ? 'bg-party-primary bg-opacity-10 border-party-primary text-party-primary'
                          : 'bg-conference-primary bg-opacity-10 border-conference-primary text-conference-primary'
                        : 'border-gray-300 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className={`ml-3 hidden md:block ${
                    isActive
                      ? theme === 'party' ? 'text-party-text' : 'text-conference-text'
                      : 'text-gray-500'
                  }`}>
                    <div className="text-sm font-medium">{step.title}</div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      isCompleted
                        ? theme === 'party' ? 'bg-party-primary' : 'bg-conference-primary'
                        : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Form Content */}
        <Card className="p-8 mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${
            theme === 'party' ? 'text-party-text' : 'text-conference-text'
          }`}>
            {steps.find(step => step.id === currentStep)?.title}
          </h2>
          
          <StepContent />
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
          
          {currentStep === steps.length ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              {editId ? 'Update Event' : 'Create Event'}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={nextStep}
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateEvent