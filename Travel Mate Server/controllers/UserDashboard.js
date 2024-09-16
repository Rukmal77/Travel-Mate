const express = require('express');
const router = express.Router();
//const auth = require('../tempProject/controllers/auth'); // Import the auth middleware
var auth = require('./auth');  // Correct the path here
//const pool = require('./server'); // Assuming you have a database connection pool
const server = require('../server');


// Define the route for the UserDashboard
router.get('/', auth, async (req, res) => {
    console.log('User making request:', req.user); // Log user information from middleware

    try {
        // Extract user information from the request object (provided by the auth middleware)
        const { id, username, email } = req.user;

        // Construct the response object with user data
        const userData = { id, username, email }; // Example, modify as needed

        // Respond with user data
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router
module.exports = router;
