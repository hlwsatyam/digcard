const mongoose = require('mongoose');

const storeCustomizationSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    unique: true
  },
  
  // Layout settings
  layout: {
    headerLayout: {
      type: String,
      enum: ['standard', 'centered', 'minimal', 'sticky'],
      default: 'standard'
    },
    footerLayout: {
      type: String,
      enum: ['standard', 'minimal', 'expanded'],
      default: 'standard'
    },
    productGrid: {
      columns: {
        type: Number,
        default: 4,
        min: 2,
        max: 6
      },
      viewMode: {
        type: String,
        enum: ['grid', 'list'],
        default: 'grid'
      }
    },
    sidebar: {
      position: {
        type: String,
        enum: ['left', 'right', 'none'],
        default: 'left'
      },
      isSticky: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Typography
  typography: {
    headingFont: {
      type: String,
      default: 'Poppins'
    },
    bodyFont: {
      type: String,
      default: 'Inter'
    },
    baseSize: {
      type: String,
      default: '16px'
    },
    headingWeight: {
      type: String,
      default: '600'
    }
  },
  
  // Animation
  animation: {
    enableAnimations: {
      type: Boolean,
      default: true
    },
    hoverEffect: {
      type: String,
      enum: ['none', 'scale', 'shadow', 'glow'],
      default: 'scale'
    },
    pageTransition: {
      type: String,
      enum: ['fade', 'slide', 'none'],
      default: 'fade'
    }
  },
  
  // Custom CSS
  customCSS: {
    type: String,
    default: ''
  },
  
  // Custom JavaScript
  customJS: {
    type: String,
    default: ''
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

storeCustomizationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('StoreCustomization', storeCustomizationSchema);