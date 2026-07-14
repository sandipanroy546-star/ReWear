const Listing = require('../models/Listing');
const User = require('../models/User');
const escapeRegex = require('../utils/escapeRegex');

// Helper to map category slugs to db categories
const mapCategorySlug = (slug) => {
    const s = slug.toLowerCase().trim();
    if (s === 'mens' || s === 'men') return "Men's Wear";
    if (s === 'womens' || s === 'women') return "Women's Wear";
    if (s === 'kids' || s === 'kid') return "Kids' Wear";
    if (s === 'shoes' || s === 'footwear') return 'Footwear';
    if (s === 'accessories' || s === 'accessory') return 'Accessories';
    if (s === 'jacket' || s === 'jackets' || s === 'winter') return 'Winter Wear';
    return null;
};

// @desc    Get all active available listings
// @route   GET /api/listings
// @access  Private (as per logic.md, view listings requires auth)
const getListings = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = { status: 'available' };

        if (category && typeof category === 'string') {
            query.category = category;
        }

        if (search && typeof search === 'string') {
            // escapeRegex prevents regex-injection / ReDoS from user-supplied search terms
            query.title = { $regex: escapeRegex(search), $options: 'i' };
        }

        const listings = await Listing.find(query).populate('ownerId', 'name email profileImage');
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving listings' });
    }
};

// @desc    Get all listings by category slug
// @route   GET /api/listings/category/:categoryName
// @access  Private
const getListingsByCategory = async (req, res) => {
    try {
        const slug = req.params.categoryName;
        const dbCategory = mapCategorySlug(slug);

        let query = { status: 'available' };
        if (dbCategory) {
            query.category = dbCategory;
        } else {
            // If category slug is not recognized, search case-insensitive directly
            query.category = { $regex: new RegExp(`^${escapeRegex(slug)}$`, 'i') };
        }

        const listings = await Listing.find(query).populate('ownerId', 'name email profileImage');
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving category listings' });
    }
};

// @desc    Get specific listing details
// @route   GET /api/listings/:id
// @access  Private
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('ownerId', 'name email profileImage');
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving listing details' });
    }
};

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
    const { title, description, category, size, condition, price, location } = req.body;
    let image = req.body.image; // fallback to body image string

    try {
        // If file uploaded through Multer
        if (req.file) {
            image = `uploads/${req.file.filename}`;
        }

        if (!title || !category || !size || !condition || !image) {
            return res.status(400).json({ message: 'Title, category, size, condition and image are required' });
        }

        const listing = await Listing.create({
            title,
            description: description || '',
            category,
            size,
            condition,
            image,
            price: price || 'Value Not Set',
            ownerId: req.user.id,
            location: location || 'Mumbai',
            status: 'available'
        });

        res.status(201).json(listing);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: Object.values(error.errors).map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Server error creating listing' });
    }
};

// @desc    Update listing details
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Ownership validation
        if (listing.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized. You do not own this listing.' });
        }

        const { title, description, category, size, condition, price, location, status } = req.body;
        let image = listing.image;

        if (req.file) {
            image = `uploads/${req.file.filename}`;
        }

        listing.title = title || listing.title;
        listing.description = description !== undefined ? description : listing.description;
        listing.category = category || listing.category;
        listing.size = size || listing.size;
        listing.condition = condition || listing.condition;
        listing.price = price || listing.price;
        listing.location = location || listing.location;
        listing.status = status || listing.status;
        listing.image = image;

        await listing.save();
        res.json(listing);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: Object.values(error.errors).map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Server error updating listing' });
    }
};

// @desc    Delete a listing (soft delete by status = removed)
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Ownership validation
        if (listing.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized. You do not own this listing' });
        }

        // Soft delete
        listing.status = 'removed';
        await listing.save();

        res.json({ message: 'Listing soft-deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting listing' });
    }
};

module.exports = {
    getListings,
    getListingsByCategory,
    getListingById,
    createListing,
    updateListing,
    deleteListing
};
