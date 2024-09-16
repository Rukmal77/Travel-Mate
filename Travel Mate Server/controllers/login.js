const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { check, validationResult } = require('express-validator');
const { User } = require('../Model/models.js');

// Login Route
router.post('/', async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Access database pool from server.js
        //const pool = require('../server').pool;
        //const { pool } = require('../server'); 
       

        // Retrieve user from database based on email
       // Retrieve user from database based on email
       const user = await User.findOne({ where: { email } });
       if (!user) {
           return res.status(400).json({ errors: [{ msg: 'Invalid email' }] });
       }

       // Compare hashed password
       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) {
           return res.status(400).json({ errors: [{ msg: 'Invalid password' }] });
       }

       // Generate JWT token
       const payload = {
           user: {
               id: user.id,
               username: user.username,
               email: user.email
           }
       };

        //console.log('JWT_SECRET:', process.env.JWT_SECRET);

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

        if (!token) {
            return res.status(500).json({ errors: [{ msg: 'Failed to generate token' }] });
        }

        // Update the user's token in the database
        //await pool.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

        // Set HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production', // Secure flag for HTTPS in production
            maxAge: 2 * 60 * 60 * 1000 // 2 hours
        });

        res.json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router; // Export the login route
