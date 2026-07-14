const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [80, 'Name cannot exceed 80 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        lowercase: true, // normalize so lookups don't need case-insensitive regex
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // never return password hash unless explicitly requested
    },
    profileImage: {
        type: String,
        default: 'https://i.pravatar.cc/150'
    },
    points: {
        type: Number,
        default: 100
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true // adds createdAt / updatedAt as real Date fields
});

// Encrypt password using bcrypt before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // BUGFIX: previously fell through and re-hashed the
        // already-hashed password on every save (e.g. any profile update),
        // corrupting it and locking users out.
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
