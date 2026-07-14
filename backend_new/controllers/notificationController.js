const Notification = require('../models/Notification');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving notifications' });
    }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (notification.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        notification.isRead = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error marking notification' });
    }
};

module.exports = { getNotifications, markAsRead };
