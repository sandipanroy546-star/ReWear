const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, 'Notification message cannot exceed 500 characters']
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // adds createdAt / updatedAt as real Date fields
});

// Speeds up "get my notifications, newest first" which is the only query pattern used.
notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
