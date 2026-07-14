const User = require('../models/User');
const Listing = require('../models/Listing');

// @desc    Get logged-in user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

// @desc    Get listings owned by logged-in user
// @route   GET /api/user/listings
// @access  Private
const getUserListings = async (req, res) => {
    try {
        const listings = await Listing.find({
            ownerId: req.user.id,
            status: { $ne: 'removed' }
        }).sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user listings' });
    }
};

module.exports = { getUserProfile, getUserListings };
