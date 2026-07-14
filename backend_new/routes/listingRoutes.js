const express = require('express');
const router = express.Router();
const {
    getListings,
    getListingsByCategory,
    getListingById,
    createListing,
    updateListing,
    deleteListing
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const upload = require('../utils/uploader');

router.get('/', protect, getListings);
router.get('/category/:categoryName', protect, getListingsByCategory);
router.get('/:id', protect, validateObjectId('id'), getListingById);
router.post('/', protect, upload.single('image'), createListing);
router.put('/:id', protect, validateObjectId('id'), upload.single('image'), updateListing);
router.delete('/:id', protect, validateObjectId('id'), deleteListing);

module.exports = router;
