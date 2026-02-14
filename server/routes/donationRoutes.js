const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Protected routes (members)
router.post('/create', protect, donationController.createDonation);
router.get('/my-donations', protect, donationController.getUserDonations);
router.get('/:donationId', protect, donationController.getDonationById);
router.put('/:donationId/submit', protect, upload.single('screenshot'), donationController.submitPayment);
router.delete('/delete', donationController.deleteEnq );
// Admin routes
router.put('/:donationId/verify', protect, adminOnly, donationController.verifyDonation);

module.exports = router;