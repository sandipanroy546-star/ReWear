const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
    // The listing being requested — i.e. the item the receiver owns and the
    // sender wants. Kept as `listingId` (not renamed to `requestedListingId`)
    // so the existing frontend contract keeps working unchanged. A virtual
    // `requestedListingId` alias is exposed below for the new naming.
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
        index: true
    },
    // The listing the sender is offering in return. Optional so a plain
    // "I'd like this item" request (no counter-item) keeps working exactly
    // as it did before this field existed.
    offeredListingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        default: null,
        index: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    message: {
        type: String,
        default: 'No message',
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending',
        index: true
    },
    // Human-formatted timestamp the existing frontend renders directly.
    // Kept alongside the real `createdAt` Date (from timestamps below) so
    // no frontend display code needs to change.
    dateTime: {
        type: String,
        required: true
    }
}, {
    timestamps: true // adds createdAt / updatedAt as real Date fields
});

swapRequestSchema.virtual('requestedListingId').get(function () {
    return this.listingId;
});
swapRequestSchema.set('toJSON', { virtuals: true });
swapRequestSchema.set('toObject', { virtuals: true });

// Speeds up "does this sender already have a pending request on this
// listing" duplicate checks, and incoming/outgoing inbox queries.
swapRequestSchema.index({ senderId: 1, listingId: 1, status: 1 });
swapRequestSchema.index({ receiverId: 1, status: 1 });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
