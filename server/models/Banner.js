const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  
  title: String,
  description: String,
  
  // Media files
  media: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    thumbnail: String, // For video thumbnails
    alt: String,
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Slider settings
  settings: {
    autoplay: {
      type: Boolean,
      default: true
    },
    autoplaySpeed: {
      type: Number,
      default: 3000
    },
    showArrows: {
      type: Boolean,
      default: true
    },
    showDots: {
      type: Boolean,
      default: true
    },
    effect: {
      type: String,
      enum: ['slide', 'fade', 'cube', 'coverflow'],
      default: 'slide'
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Banner', bannerSchema);