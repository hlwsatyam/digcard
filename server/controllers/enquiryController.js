const Enquiry = require('../models/Enquiry');
const User = require('../models/User');
const crypto = require('crypto');

// Create enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const { name, email,address, mobile, message } = req.body;
    console.log(req.body)
    const enquiryData = {
      name,
      email,
      mobile,
      message,address,
      status: 'new' 
    };

    if (req.file) {
      enquiryData.profilePic = req.file.filename;
    }

    const enquiry = await Enquiry.create(enquiryData);

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Our team will contact you soon.',
      enquiry
    });

  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting enquiry'
    });
  }
};

// Get all enquiries (admin)
exports.getAllEnquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Enquiry.countDocuments(query);

    res.json({
      success: true,
      enquiries,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
exports.deleteEnq = async (req, res) => {
  try {
    const { _id } = req.query;
    
 
     await Enquiry.findByIdAndDelete(_id)
   
 

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
// Convert enquiry to member
exports.convertToMember = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const { generatePassword } = req.body;

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // Check if already converted
    if (enquiry.convertedTo) {
      return res.status(400).json({
        success: false,
        message: 'Enquiry already converted to member'
      });
    }

    // Generate random password
    const password = generatePassword ? crypto.randomBytes(6).toString('hex') : 'password123';
    const random12Digit = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    // Create new user
    const user = await User.create({
      name: enquiry.name,
      email: enquiry.email,
      address: enquiry.address,
      mobile: enquiry.mobile,
      username:random12Digit,
      password: password,
      profilePic: enquiry.profilePic,
      status: 'active'
    });

    // Update enquiry
    enquiry.status = 'converted';
    enquiry.convertedTo = user._id;
    await enquiry.save();

    res.json({
      success: true,
      message: 'Enquiry converted to member successfully',
      user: {
        username: user.username,
        password: password,
        membershipNumber: user.membershipNumber
      },
      enquiry
    });

  } catch (error) {
    console.error('Convert enquiry error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// Add note to enquiry
exports.addNote = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const { note } = req.body;

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    enquiry.notes.push({
      note,
      createdBy: req.user._id
    });

    await enquiry.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      enquiry
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};