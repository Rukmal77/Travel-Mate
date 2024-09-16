const express = require('express');
const router = express.Router();

// Logout Route
router.post('/', (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('token');

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
});

module.exports = router;
