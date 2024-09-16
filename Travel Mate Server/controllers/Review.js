const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
//const { pool } = require('./server'); // Ensure to import your pool correctly
const { Review, User } = require('../Model/models.js');

// Create a new review
router.post('/', async (req, res) => {
  const { rating, comment } = req.body;
  //const token = req.headers.authorization.split(' ')[1];
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ errors: [{ msg: 'No token provided' }] });
  }

  try {
    // Verify the token and get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    const user_id = decoded.user.id; // Adjusted to match your token structure
    console.log('User ID:', user_id);

    // Input validation
    if (!rating || !comment || !user_id) {
      return res.status(400).json({ errors: [{ msg: 'Rating, comment, and user ID are required' }] });
    }

    //const pool = require('../../server/server').pool;
    //const { pool } = require('../server'); 

    // Insert the new review into the database
    //const [result] = await pool.query('INSERT INTO reviews (rating, comment, user_id) VALUES (?, ?, ?)', [rating, comment, userId]);
    const review = await Review.create({ rating, comment, user_id });

    res.status(201).json({ message: 'Review created successfully', reviewId: review.id });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Error creating review' });
  }
});

router.get('/latest', async (req, res) => {

  //const pool = require('../../server/server').pool;
  //const { pool } = require('../server'); 

  try {
    const reviews = await Review.findAll({
      include: {
        model: User,
        attributes: ['username'],
      },
      order: [['id', 'DESC']],
      limit: 5,
    });

    const formattedReviews = reviews.map(review => ({
      rating: review.rating,
      comment: review.comment,
      username: review.User.username,
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error('Error fetching latest reviews:', error);
    res.status(500).json({ error: 'Error fetching latest reviews' });
  }
});

module.exports = router;
