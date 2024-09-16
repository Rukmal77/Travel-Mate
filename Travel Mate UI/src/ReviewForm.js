import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ReviewForm.scss';
import { FaArrowLeft } from 'react-icons/fa'; // Import the arrow icon from react-icons
import Cookies from 'js-cookie';


const checkAuthToken = async () => {
  console.log('All cookies:', document.cookie);
  const token = Cookies.get('token');
  console.log('Token from cookies:', token);
  if (!token) {
    console.log('No token found in cookies.');
    return false;
  }

  try {
    const response = await axios.post(
      'http://localhost:3001/controllers/authRouter',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log('Server response:', response.data);
    return response.data.isValid;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState(null);
  const history = useHistory();


  useEffect(() => {
    const verifyToken = async () => {
        const isAuthenticated = await checkAuthToken();
        if (!isAuthenticated) {
            console.log('User not authenticated, redirecting to dashboard.');
            history.push('/dashboard');
        }
    };

    verifyToken();
}, [history]);

  useEffect(() => {
    // Get the token from cookies
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

    if (token) {
      // Decode the token to get the user ID
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user.id); // Adjusted to match your token structure
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const review = { rating, comment, userId };

    try {
      await axios.post('http://localhost:3001/controllers/Review', review, {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1]}`
        },
        withCredentials: true,
      });
      alert('Review submitted successfully');
    } catch (error) {
      console.error('Error submitting review', error);
      alert('Error submitting review');
    }
  };


  const handleStarClick = (newRating) => {
    setRating(newRating);
  };

  const handleNavigateBack = () => {
    history.push('/dashboard');
  };

  return (
    <div className="review-form-container">
       <FaArrowLeft className="back-to-login-btn" onClick={handleNavigateBack} />
      <form className="review-form" onSubmit={handleSubmit}>
        <label>
          Rating:
          <div className="stars">
            {[...Array(10)].map((_, index) => {
              const starValue = (index + 1) * 0.5;
              return (
                <span
                  key={index}
                  className={`star ${rating >= starValue ? 'selected' : ''}`}
                  onClick={() => handleStarClick(starValue)}
                >
                  ★
                </span>
              );
            })}
          </div>
          <div className="rating-value">{rating.toFixed(1)}</div>
        </label>
        <label>
          Comment:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave your comment here..."
          />
        </label>
        <button type="submit" className='review-btn'>Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;
