// forgot_password.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
//const pool = require('./server').pool;
//const server = require('../server');
const { User } = require('../Model/models.js');

const router = express.Router(); // Initialize router

// Middleware
router.use(bodyParser.json());


// Nodemailer configuration (You need to configure this with your email service)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for email credentials
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate random token
const generateToken = () => {
  return crypto.randomBytes(20).toString('hex');
};


// API endpoint for sending password reset email
router.post('/', async (req, res) => {
  const { email } = req.body;

  //const { pool } = require('../server'); 

  try {
    // Query user by email from your database using Sequelize
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate and store reset token
    const token = generateToken();
    // Store the reset token in your database using Sequelize
    user.forgotPassword = token;
    user.created_at = new Date().toISOString();
    await user.save();

    // Send password reset email
    const resetLink = `http://localhost:3000/Reset_Password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n`
        + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
        + `${resetLink}\n\n`
        + `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});


// API endpoint for resetting password
router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  //const pool = require('./server').pool;
 // const { pool } = require('../server'); 

 try {
  // Query reset token from your database using Sequelize
  const user = await User.findOne({ where: { forgotPassword: token } });

  if (!user) {
    return res.status(404).json({ error: 'Invalid or expired token' });
  }
  
    // Check if token has expired
    const expirationTime = 60 * 60 * 1000; // 1 hour
    if (Date.now() - new Date(user.created_at).getTime() > expirationTime) {
      user.forgotPassword = null;
      user.created_at = null;
      await user.save();
      return res.status(400).json({ error: 'Token expired' });
    }

     // Hash the password before storing it
     const hashedPassword = await bcrypt.hash(password, 10);
 
     // Update user password in your database
     await User.update(
       { password: hashedPassword },
       { where: { email: user.email } }
     );
 
     // Clear the reset token and timestamp
     user.forgotPassword = null;
     user.created_at = null;
     await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router; // Export the router
