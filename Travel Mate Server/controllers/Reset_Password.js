const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { User } = require('../Model/models.js');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
  const { token, password } = req.body;

  try {
    // Query user by reset token from your database using Sequelize
    const user = await User.findOne({ where: { forgotPassword: token } });

    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    // Check if token has expired
    const expirationTime = 60 * 60 * 1000; // 1 hour
    if (Date.now() - new Date(user.created_at).getTime() > expirationTime) {
      // Token expired, clear reset token and return error
      user.forgotPassword = null;
      await user.save();
      return res.status(400).json({ error: 'Token expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password in your database using Sequelize
    user.password = hashedPassword;
    user.forgotPassword = null; // Clear reset token
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
