const express = require('express');
const router = express.Router();
const { getUserProfile, getUserListings } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getUserProfile);
router.get('/listings', protect, getUserListings);

module.exports = router;
