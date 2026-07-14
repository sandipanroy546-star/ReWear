const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, validateObjectId('id'), markAsRead);

module.exports = router;
