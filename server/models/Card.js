const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardNumber: {
    type: String,
    unique: true,
    required: true
  },
  cardHolderName: String,
  expiryDate: Date,
  qrCode: String,
  logo: String,
  isActive: {
    type: Boolean,
    default: true
  },
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Card', cardSchema);