const User = require('../models/User');
const Donation = require('../models/Donation');
const Enquiry = require('../models/Enquiry');

// Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all donations (admin)
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('user', 'username name email membershipNumber')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, donations });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get admin stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalEnquiries = await Enquiry.countDocuments();
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const pendingDonations = await Donation.countDocuments({ status: 'pending' });
    const newEnquiries = await Enquiry.countDocuments({ status: 'new' });

    res.json({
      success: true,
      
        totalMembers,
        totalAdmins,
        totalEnquiries,
        totalDonations: totalDonations[0]?.total || 0,
        pendingDonations,
        newEnquiries
    
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};