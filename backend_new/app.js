require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const swapRoutes = require('./routes/swapRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ── Security headers ──
// crossOriginResourcePolicy relaxed so images under /uploads can still be
// loaded cross-origin by the frontend (helmet defaults to same-origin only).
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// ── CORS — allow the frontend (served as a local file or same-origin) ──
// `origin: true` reflects the request's Origin header instead of using a
// literal '*', which browsers reject outright when combined with
// `credentials: true` anyway. Set FRONTEND_URL in .env to lock this down to
// a specific origin in production.
app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true
}));

// ── Body Parsers ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rate limit auth endpoints to slow down brute-force / credential stuffing ──
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts, please try again later.' }
});
app.use('/api/auth', authLimiter);

// ── Serve uploaded images statically ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Serve the frontend files from project root ──
app.use(express.static(path.join(__dirname, '..')));

// ── API Routes ──
// ── Health Check ──
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ReWear Backend is running'
    });
});
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user', userRoutes);

// ── Unknown API route → clean JSON 404 instead of falling through to the SPA fallback below ──
app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});

// ── Fallback: Serve index.html for any non-API route ──
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
    console.error(err.stack);

    let statusCode = err.status || err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}`;
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map((e) => e.message).join(', ');
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate value entered for a unique field';
    } else if (err.name === 'MulterError') {
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message
    });
});

module.exports = app;
