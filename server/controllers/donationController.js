const Donation = require('../models/Donation');
const User = require('../models/User');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Create donation request
exports.createDonation = async (req, res) => {
  try {
    const { amount, paymentMethod = 'qr' } = req.body;
    const userId = req?.user?._id;
  
    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Create donation record
    const donation = await Donation.create({
      user: userId,
      amount,
      transactionId,
      paymentMethod,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Donation request created. Please complete the payment.',
      donation: {
        _id: donation._id,
        amount: donation.amount,
        transactionId: donation.transactionId,
        status: donation.status,
        createdAt: donation.createdAt
      }
    });

  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating donation'
    });
  }
};
exports.deleteEnq = async (req, res) => {
  try {
    const { _id } = req.query;
    
 
     await Donation.findByIdAndDelete(_id)
   
 

    res.json({
      success: true,
      message:"deleted",
    
    });

  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
// Submit payment proof
exports.submitPayment = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { transactionId, upiId, remarks } = req.body;
 
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (donation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const updates = {
      transactionId: transactionId || donation.transactionId,
      upiId,
      remarks
    };

    if (req.file) {
      updates.screenshot = req.file.filename;
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      updates,
      { new: true }
    ).populate('user', 'username name');

    res.json({
      success: true,
      message: 'Payment submitted for verification',
      donation: updatedDonation
    });

  } catch (error) {
    console.error('Submit payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user donations
exports.getUserDonations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: userId };
    if (status) query.status = status;

    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('verifiedBy', 'name');

    const total = await Donation.countDocuments(query);

    // Get user stats
    const user = await User.findById(userId).select('totalDonations donationCount');

    res.json({
      success: true,
      donations,
      totalDonations: user.totalDonations,
      donationCount: user.donationCount,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const { donationId } = req.params;

    const donation = await Donation.findById(donationId)
      .populate('user', 'username name email mobile membershipNumber')
      .populate('verifiedBy', 'name');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      donation
    });

  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin: Verify donation
exports.verifyDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { status, remarks } = req.body;

    if (!['completed', 'failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    donation.status = status;
    donation.verifiedBy = req.user._id;
    donation.verifiedAt = new Date();
    donation.remarks = remarks;

    await donation.save();

    res.json({
      success: true,
      message: `Donation ${status} successfully`,
      donation
    });

  } catch (error) {
    console.error('Verify donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};