const express = require('express');
const router = express.Router();
const {
    createSwapRequest,
    getIncomingSwaps,
    getOutgoingSwaps,
    acceptSwapRequest,
    rejectSwapRequest,
    deleteSwapRequest
} = require('../controllers/swapController');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.post('/', protect, createSwapRequest);
router.get('/incoming', protect, getIncomingSwaps);
router.get('/outgoing', protect, getOutgoingSwaps);
router.patch('/:id/accept', protect, validateObjectId('id'), acceptSwapRequest);
router.patch('/:id/reject', protect, validateObjectId('id'), rejectSwapRequest);
router.delete('/:id', protect, validateObjectId('id'), deleteSwapRequest);

module.exports = router;
