const mongoose = require('mongoose');
const SwapRequest = require('../models/SwapRequest');
const Listing = require('../models/Listing');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Helper to get formatted timestamps matching frontend
const getFormattedDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${year}-${month}-${date} ${hours}:${minutes} ${ampm}`;
};

// @desc    Create a new swap request
// @route   POST /api/swaps
// @access  Private
// Body: { listingId, offeredListingId?, message? }
//   listingId       — the listing being requested (required, same as before)
//   offeredListingId — the sender's own listing offered in exchange (optional,
//                      new — request-only swaps with no counter-item still work)
const createSwapRequest = async (req, res) => {
    const { listingId, offeredListingId, message } = req.body;

    try {
        if (!listingId) {
            return res.status(400).json({ message: 'Listing ID is required' });
        }
        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400).json({ message: 'Invalid listing ID' });
        }
        if (offeredListingId && !mongoose.Types.ObjectId.isValid(offeredListingId)) {
            return res.status(400).json({ message: 'Invalid offered listing ID' });
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Prevent requesting an unavailable or (soft-)deleted listing
        if (listing.status !== 'available') {
            return res.status(400).json({ message: 'This listing is no longer available for swap' });
        }

        // Check if requester is listing owner
        if (listing.ownerId.toString() === req.user.id) {
            return res.status(400).json({ message: 'You cannot request a swap for your own item' });
        }

        let offeredListing = null;
        if (offeredListingId) {
            if (offeredListingId === listingId) {
                return res.status(400).json({ message: 'You cannot offer the same item you are requesting' });
            }

            offeredListing = await Listing.findById(offeredListingId);
            if (!offeredListing) {
                return res.status(404).json({ message: 'Offered listing not found' });
            }
            if (offeredListing.status !== 'available') {
                return res.status(400).json({ message: 'The listing you are offering is no longer available' });
            }
            // Must actually own what you're offering
            if (offeredListing.ownerId.toString() !== req.user.id) {
                return res.status(403).json({ message: 'You can only offer a listing you own' });
            }
        }

        // Prevent duplicate pending requests (same sender + same requested listing)
        const duplicate = await SwapRequest.findOne({
            listingId,
            senderId: req.user.id,
            status: 'pending'
        });

        if (duplicate) {
            return res.status(409).json({ message: 'You have already sent a pending swap request for this item' });
        }

        // Create swap request
        const swapRequest = await SwapRequest.create({
            listingId,
            offeredListingId: offeredListing ? offeredListing._id : null,
            senderId: req.user.id,
            receiverId: listing.ownerId,
            message: message || 'No message',
            status: 'pending',
            dateTime: getFormattedDateTime()
        });

        // Fetch sender detail to build notification
        const sender = await User.findById(req.user.id);

        // Create notification for receiver
        await Notification.create({
            userId: listing.ownerId,
            message: `📬 New swap request from ${sender.name} for your item "${listing.title}"`
        });

        res.status(201).json(swapRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating swap request' });
    }
};

// @desc    Get user incoming swap requests
// @route   GET /api/swaps/incoming
// @access  Private
const getIncomingSwaps = async (req, res) => {
    try {
        const swaps = await SwapRequest.find({ receiverId: req.user.id })
            .populate('listingId')
            .populate('offeredListingId')
            .populate('senderId', 'name email profileImage')
            .populate('receiverId', 'name email profileImage');
        res.json(swaps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving incoming swap requests' });
    }
};

// @desc    Get user outgoing swap requests
// @route   GET /api/swaps/outgoing
// @access  Private
const getOutgoingSwaps = async (req, res) => {
    try {
        const swaps = await SwapRequest.find({ senderId: req.user.id })
            .populate('listingId')
            .populate('offeredListingId')
            .populate('senderId', 'name email profileImage')
            .populate('receiverId', 'name email profileImage');
        res.json(swaps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving outgoing swap requests' });
    }
};

// @desc    Accept a swap request
// @route   PATCH /api/swaps/:id/accept
// @access  Private
const acceptSwapRequest = async (req, res) => {
    try {
        const swap = await SwapRequest.findById(req.params.id);

        if (!swap) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        // Ownership validation
        if (swap.receiverId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized. You do not own the requested listing.' });
        }

        if (swap.status !== 'pending') {
            return res.status(400).json({ message: `Swap request is already ${swap.status}` });
        }

        // Update status of swap request
        swap.status = 'accepted';
        await swap.save();

        // Mark both sides of the trade unavailable
        const listing = await Listing.findById(swap.listingId);
        if (listing) {
            listing.status = 'swapped';
            await listing.save();
        }

        let offeredListing = null;
        if (swap.offeredListingId) {
            offeredListing = await Listing.findById(swap.offeredListingId);
            if (offeredListing) {
                offeredListing.status = 'swapped';
                await offeredListing.save();
            }
        }

        // Fetch receiver detail to build notification
        const receiver = await User.findById(req.user.id);

        // Notify sender
        await Notification.create({
            userId: swap.senderId,
            message: `✔️ Your swap request for "${listing ? listing.title : 'Item'}" was accepted by ${receiver.name}!`
        });

        // Any other pending requests referencing either listing (from either
        // side) are no longer fulfillable now that the items are swapped —
        // auto-reject them and notify their senders, so nobody is left
        // waiting on an item that's already gone.
        const affectedListingIds = [swap.listingId, swap.offeredListingId].filter(Boolean);
        const otherPending = await SwapRequest.find({
            _id: { $ne: swap._id },
            status: 'pending',
            $or: [
                { listingId: { $in: affectedListingIds } },
                { offeredListingId: { $in: affectedListingIds } }
            ]
        });

        for (const other of otherPending) {
            other.status = 'rejected';
            await other.save();
            const otherListing = await Listing.findById(other.listingId);
            await Notification.create({
                userId: other.senderId,
                message: `❌ Your swap request for "${otherListing ? otherListing.title : 'Item'}" was automatically declined because the item is no longer available.`
            });
        }

        res.json({ message: 'Swap request accepted successfully', swap });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error accepting swap request' });
    }
};

// @desc    Reject a swap request
// @route   PATCH /api/swaps/:id/reject
// @access  Private
const rejectSwapRequest = async (req, res) => {
    try {
        const swap = await SwapRequest.findById(req.params.id);

        if (!swap) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        // Ownership validation
        if (swap.receiverId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized. You do not own the requested listing.' });
        }

        if (swap.status !== 'pending') {
            return res.status(400).json({ message: `Swap request is already ${swap.status}` });
        }

        // Update status of swap request
        swap.status = 'rejected';
        await swap.save();

        // Fetch receiver detail to build notification
        const receiver = await User.findById(req.user.id);
        const listing = await Listing.findById(swap.listingId);

        // Notify sender
        await Notification.create({
            userId: swap.senderId,
            message: `❌ Your swap request for "${listing ? listing.title : 'Item'}" was rejected by ${receiver.name}.`
        });

        res.json({ message: 'Swap request rejected successfully', swap });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error rejecting swap request' });
    }
};

// @desc    Delete a swap request from history
// @route   DELETE /api/swaps/:id
// @access  Private
const deleteSwapRequest = async (req, res) => {
    try {
        const swap = await SwapRequest.findById(req.params.id);

        if (!swap) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        // Only participants can delete from history
        if (swap.senderId.toString() !== req.user.id && swap.receiverId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized. You are not a participant in this swap request.' });
        }

        await SwapRequest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Swap request deleted from history' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting swap request' });
    }
};

module.exports = {
    createSwapRequest,
    getIncomingSwaps,
    getOutgoingSwaps,
    acceptSwapRequest,
    rejectSwapRequest,
    deleteSwapRequest
};
