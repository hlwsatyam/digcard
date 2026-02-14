const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  // ============ BASIC INFO ============
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // ============ LOGO ============
  logo: {
    url: String,
    alt: String
  },

  // ============ BANNER/SLIDER ============
  banner: {
    media: [{
      url: String,
      type: {
        type: String,
        enum: ['image', 'video']
      },
      alt: String,
      order: Number
    }],
    settings: {
      autoplay: { type: Boolean, default: true },
      autoplaySpeed: { type: Number, default: 3000 },
      effect: { type: String, default: 'slide' }
    }
  },

  // ============ CONTACT INFO ============
  contact: {
    email: String,
    phone: String,
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },

  // ============ SOCIAL MEDIA ============
  socialMedia: [{
    platform: String,
    url: String
  }],

  // ============ THEME & CUSTOMIZATION ============
  theme: {
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#10B981' },
    backgroundColor: { type: String, default: '#FFFFFF' },
    textColor: { type: String, default: '#111827' },
    headerColor: { type: String, default: '#1F2937' },
    fontFamily: { type: String, default: 'Inter' }
  },

  // ============ PRODUCTS ============
  products: [{
    name: { type: String, required: true },
    description: String,
    price: Number,
    category: String,
    images: [{
      url: String,
      isPrimary: Boolean
    }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  }],

  // ============ SERVICES ============
  services: [{
    name: { type: String, required: true },
    description: String,
    duration: Number,
    price: Number,
    isActive: { type: Boolean, default: true }
  }],

  // ============ BUSINESS HOURS ============
  businessHours: {
    monday: { isOpen: { type: Boolean, default: true }, openTime: String, closeTime: String },
    tuesday: { isOpen: { type: Boolean, default: true }, openTime: String, closeTime: String },
    wednesday: { isOpen: { type: Boolean, default: true }, openTime: String, closeTime: String },
    thursday: { isOpen: { type: Boolean, default: true }, openTime: String, closeTime: String },
    friday: { isOpen: { type: Boolean, default: true }, openTime: String, closeTime: String },
    saturday: { isOpen: { type: Boolean, default: false }, openTime: String, closeTime: String },
    sunday: { isOpen: { type: Boolean, default: false }, openTime: String, closeTime: String }
  },

  // ============ BOOKING SETTINGS ============
  bookingSettings: {
    slotDuration: { type: Number, default: 30 },
    advanceBooking: { type: Number, default: 30 },
    minNotice: { type: Number, default: 2 }
  },

  // ============ GALLERY ============
  gallery: [{
    url: String,
    type: { type: String, enum: ['image', 'video'] },
    title: String,
    order: Number
  }],

  // ============ SEO ============
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  },

  // ============ TIMESTAMPS ============
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create slug before save
storeSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Store', storeSchema);