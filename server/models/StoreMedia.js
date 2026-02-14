const mongoose = require('mongoose');

const storeMediaSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  
  type: {
    type: String,
    enum: ['gallery', 'portfolio', 'video', 'document']
  },
  
  title: String,
  description: String,
  
  files: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    type: {
      type: String,
      enum: ['image', 'video', 'pdf', 'doc']
    },
    thumbnail: String,
    size: Number,
    alt: String,
    order: Number,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
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

storeMediaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('StoreMedia', storeMediaSchema);