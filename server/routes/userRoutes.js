const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get members with pagination, filter, search
router.get('/members', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
 

    const query = { role: 'member' };

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by creator
    if (req.query.createdBy) {
      query.createdBy = req.query.createdBy;
    }

    const total = await User.countDocuments(query);
    const members = await User.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      members,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create member (admin only - no auth middleware)
router.post('/member', async (req, res) => {
  try { 
    const { name, email, password, phone, address, createdBy } = req.body;
console.log(req.body)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }



    const member = new User({
      name,
      email,
      password,
      phone,
      address,
      role: 'member',
      createdBy
    });

    await member.save();
    
    const populatedMember = await User.findById(member._id).populate('createdBy', 'name email');
    res.status(201).json(populatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get member by ID
router.get('/member/:id', async (req, res) => {
  try {
    const member = await User.findById(req.params.id).populate('createdBy', 'name email phone address');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;