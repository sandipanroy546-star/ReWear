const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    switchPersona
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/switch-persona', switchPersona);
router.get('/me', protect, getMe);

module.exports = router;
