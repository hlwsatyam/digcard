const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.post('/create', upload.single('profilePic'), enquiryController.createEnquiry);

// Admin routes
router.get('/all', protect, adminOnly, enquiryController.getAllEnquiries);
router.delete('/delete', enquiryController.deleteEnq);
router.put('/convert/:enquiryId', protect, adminOnly, enquiryController.convertToMember);
router.post('/:enquiryId/notes', protect, adminOnly, enquiryController.addNote);

module.exports = router;