const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  slug: String,
  
  description: String,
  
  price: {
    type: Number,
    required: true,
    min: 0
  },
  
  compareAtPrice: {
    type: Number,
    min: 0
  },
  
  category: String,
  
  images: [{
    url: String,
    publicId: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: Number
  }],
  
  video: {
    url: String,
    publicId: String,
    thumbnail: String
  },
  
  inventory: {
    quantity: {
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    },
    trackInventory: {
      type: Boolean,
      default: true
    }
  },
  
  variants: [{
    name: String,
    options: [{
      value: String,
      price: Number,
      quantity: Number,
      sku: String
    }]
  }],
  
  tags: [String],
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
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

productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);