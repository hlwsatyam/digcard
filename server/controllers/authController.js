const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { mobile }] 
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or mobile'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password,
      status: 'active'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profilePic: user.profilePic,
        membershipNumber: user.membershipNumber
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [
        { email: email || '' },
        { mobile: mobile || '' }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active. Please contact admin.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profilePic: user.profilePic,
        membershipNumber: user.membershipNumber,
        totalDonations: user.totalDonations,
        donationCount: user.donationCount
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    if (req.file) {
      updates.profilePic = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};