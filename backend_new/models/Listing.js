const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a listing title'],
        trim: true,
        maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
        type: String,
        default: '',
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        trim: true
    },
    size: {
        type: String,
        required: [true, 'Please specify the size'],
        trim: true
    },
    condition: {
        type: String,
        required: [true, 'Please specify item condition'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Please provide an image url or upload path']
    },
    price: {
        type: String,
        default: 'Value Not Set',
        trim: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    location: {
        type: String,
        default: 'Mumbai',
        trim: true
    },
    status: {
        type: String,
        enum: ['available', 'pending_swap', 'swapped', 'removed'],
        default: 'available'
    }
}, {
    timestamps: true // adds createdAt / updatedAt as real Date fields
});

// Speeds up the two hottest queries: browsing available listings by category,
// and a user's "my listings" view.
listingSchema.index({ status: 1, category: 1 });
listingSchema.index({ ownerId: 1, status: 1 });

module.exports = mongoose.model('Listing', listingSchema);
