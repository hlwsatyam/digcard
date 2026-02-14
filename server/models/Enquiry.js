const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  profilePic: {
    type: String
  },
  address: {
    type: String
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'rejected'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  convertedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  followUpDate: {
    type: Date
  },
  notes: [{
    note: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Enquiry', enquirySchema);