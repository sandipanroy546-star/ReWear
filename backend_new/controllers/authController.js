const User = require('../models/User');
const jwt = require('jsonwebtoken');
const escapeRegex = require('../utils/escapeRegex');

const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        // Fail loudly in production rather than silently signing tokens with
        // a hardcoded fallback secret that ships in the source code.
        throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Email validation
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Password length check
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user exists (email is stored lowercase, see models/User.js)
        const userExists = await User.findOne({ email: email.toLowerCase().trim() });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                points: user.points,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Direct lookup on the normalized (lowercase) email — no regex
        // needed, which also removes a regex-injection vector that existed
        // here previously (raw `email` was interpolated into `new RegExp`).
        // Password is `select: false` on the schema, so it must be requested explicitly.
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                points: user.points,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                points: user.points,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user details' });
    }
};

// @desc    Logout user (simply a status return, client deletes token)
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

// @desc    Switch user session context dynamically (persona switching for mockup/demo compatibility)
// @route   POST /api/auth/switch-persona
// @access  Public — but DEV-ONLY (see security note below)
//
// SECURITY NOTE: this endpoint mints a valid login token for *any* named
// user without checking a password, and will silently create the account if
// it doesn't exist yet. That is a full authentication bypass. It has been
// preserved (per "don't remove working functionality") because the frontend
// appears to use it for local persona-switching demos, but it is now hard
// disabled whenever NODE_ENV=production so it can never ship live. If this
// is meant to be a real feature, it needs to be replaced with something
// that doesn't let anyone log in as anyone.
const switchPersona = async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ message: 'This endpoint is disabled in production' });
    }

    let { name } = req.body;

    try {
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: 'Please specify persona name to switch to' });
        }

        // Standardize persona matching
        // e.g. "Sarah J. (Owner)" -> "Sarah J.", "You (Requester)" -> "You" or fallback
        let searchName = name.replace(/\(Owner\)/i, '').replace(/\(Requester\)/i, '').trim();

        if (!searchName) {
            return res.status(400).json({ message: 'Please specify persona name to switch to' });
        }

        let user = await User.findOne({ name: { $regex: new RegExp(`^${escapeRegex(searchName)}$`, 'i') } });

        // If user (persona) does not exist, auto-create it with standard fake email
        if (!user) {
            let email = `${searchName.toLowerCase().replace(/[^a-z0-9]/g, '')}@rewear.com`;
            if (searchName.toLowerCase() === 'you') {
                email = 'you@rewear.com';
            }
            user = await User.create({
                name: searchName,
                email: email,
                password: 'password123'
            });
            console.log(`Persona ${searchName} auto-created with email ${email}`);
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            points: user.points,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during persona switch' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    switchPersona
};
