const express = require('express');
const router = express.Router(); // Change from registerRouter to router
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { User } = require('../Model/models.js');

// Registration route
router.post('/', async (req, res) => { // Change from registerRouter to router
    try {
        // Define validation rules
        const usernameCheck = check('username', 'Username is required').notEmpty();
        const emailCheck = check('email', 'Please enter a valid email').isEmail();
        const passwordCheck = check('password', 'Password must be at least 6 characters').isLength({ min: 6 });
    
        // Run the validations
        await Promise.all([usernameCheck.run(req), emailCheck.run(req), passwordCheck.run(req)]);
    
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;

         // Check if the user already exists
         const existingUser = await User.findOne({ where: { email } });
         if (existingUser) {
             return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
         }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user using Sequelize
        await User.create({ username, email, password: hashedPassword });



        res.json({ message: 'Registration successful!' });
    
        // Rest of your registration logic...
      } catch (error) {
        // Handle errors
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed.' });
      }
});

module.exports = router; // Change from registerRouter to router
