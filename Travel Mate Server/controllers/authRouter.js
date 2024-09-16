const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Middleware for authenticating token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    console.log('Token received:', token);

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Auth endpoint
router.post('/', authenticateToken, (req, res) => {
    res.json({ isValid: true });
});

module.exports = router;
