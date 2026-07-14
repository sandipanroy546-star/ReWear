const mongoose = require('mongoose');

// Returns middleware that 400s early if req.params[paramName] isn't a
// well-formed Mongo ObjectId, instead of letting a malformed id reach
// Model.findById() and blow up as an unhandled 500 CastError.
const validateObjectId = (paramName = 'id') => (req, res, next) => {
    const value = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return res.status(400).json({ message: `Invalid ${paramName}` });
    }
    next();
};

module.exports = validateObjectId;
