const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin routes
router.get('/users', protect, adminOnly, adminController.getAllUsers);
router.get('/donations', protect, adminOnly, adminController.getAllDonations);
router.get('/stats', protect, adminOnly, adminController.getAdminStats);

module.exports = router;