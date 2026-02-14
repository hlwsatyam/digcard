const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  
  // Business Hours
  businessHours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    openTime: String,
    closeTime: String,
    breakStart: String,
    breakEnd: String
  }],
  
  // Booking Settings
  settings: {
    slotDuration: {
      type: Number, // in minutes
      default: 30
    },
    advanceBooking: {
      type: Number, // days in advance
      default: 30
    },
    maxAdvanceBooking: {
      type: Number, // days
      default: 60
    },
    minNotice: {
      type: Number, // hours before booking
      default: 2
    },
    maxBookingsPerSlot: {
      type: Number,
      default: 1
    },
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'flexible'
    },
    cancellationPeriod: {
      type: Number, // hours before booking
      default: 24
    }
  },
  
  // Services
  services: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    duration: {
      type: Number, // in minutes
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    category: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Staff/Team
  staff: [{
    name: String,
    email: String,
    phone: String,
    role: String,
    isActive: {
      type: Boolean,
      default: true
    },
    services: [String] // Service IDs or names
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);