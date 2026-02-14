const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    unique: true
  },
  paymentMethod: {
    type: String,
    enum: ['qr', 'upi', 'card', 'netbanking'],
    default: 'qr'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  qrCode: {
    type: String
  },
  upiId: {
    type: String
  },
  screenshot: {
    type: String
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

// Update user's donation stats after successful donation
donationSchema.post('save', async function(doc) {
  if (doc.status === 'completed') {
    try {
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(doc.user, {
        $inc: { 
          totalDonations: doc.amount,
          donationCount: 1
        }
      });
    } catch (error) {
      console.error('Error updating user donation stats:', error);
    }
  }
});

module.exports = mongoose.model('Donation', donationSchema);